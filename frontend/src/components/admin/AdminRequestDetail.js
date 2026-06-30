"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    BadgeIndianRupee,
    Building2,
    CalendarClock,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    ExternalLink,
    FileText,
    ImageIcon,
    Landmark,
    Mail,
    MapPin,
    Package,
    PackageCheck,
    Phone,
    RefreshCcw,
    Save,
    ShieldCheck,
    Truck,
    User,
    Video,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

const RETURN_STATUSES = [
    "Requested",
    "Approved",
    "Rejected",
    "Pickup Scheduled",
    "Picked Up",
    "Quality Checking",
    "Refund Approved",
    "Completed",
];

const EXCHANGE_STATUSES = [
    "Requested",
    "Approved",
    "Rejected",
    "Pickup Scheduled",
    "Picked Up",
    "Quality Checking",
    "Replacement Packed",
    "Replacement Shipped",
    "Out for Delivery",
    "Completed",
];

function resolveAsset(path) {
    if (!path) return "";
    if (String(path).startsWith("http")) return path;
    const apiRoot = String(API_BASE || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");
    const cleanPath = String(path).replace(/^\/+/, "");
    return encodeURI(`${apiRoot}/${cleanPath}`);
}

function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function money(value) {
    return `Rs. ${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function statusTone(status) {
    if (status === "Completed" || status === "Refund Approved") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    if (status === "Rejected" || status === "Cancelled") {
        return "border-red-200 bg-red-50 text-red-700";
    }
    if (status === "Requested") {
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
    return "border-blue-200 bg-blue-50 text-[#2454b5]";
}

function statusRank(status, steps) {
    const index = steps.findIndex((step) => step === status);
    return index < 0 ? 0 : index;
}

function getRequest(order, type) {
    return type === "RETURN" ? order?.returnRequest || {} : order?.exchange || {};
}

function getRequestItem(order, request, itemId) {
    return (
        order?.products?.find((item) => String(item._id) === String(itemId)) ||
        order?.products?.find((item) => String(item._id) === String(request?.itemId)) ||
        order?.products?.[0] ||
        {}
    );
}

export default function AdminRequestDetail({ type = "RETURN" }) {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params?.id;
    const itemId = searchParams.get("itemId");
    const isReturn = type === "RETURN";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        status: isReturn ? "Approved" : "Approved",
        adminRemark: "",
        customerMessage: "",
        replacementSku: "",
        replacementProductName: "",
        pickupCourier: "",
        pickupTrackingId: "",
        pickupTrackingUrl: "",
        replacementCourier: "",
        replacementTrackingId: "",
        replacementTrackingUrl: "",
        estimatedDelivery: "",
    });

    const loadDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const endpoint = isReturn
                ? `/api/orders/admin/returns/${id}`
                : `/api/orders/admin/exchanges/${id}`;
            const data = await adminRequest(endpoint);
            const loadedOrder = data.order || null;
            const request = getRequest(loadedOrder, type);

            setOrder(loadedOrder);
            setForm({
                status: request?.status && request.status !== "Not Requested" ? request.status : "Approved",
                adminRemark: request?.adminRemark || request?.adminReview?.reviewNote || "",
                customerMessage: request?.customerMessage || "",
                replacementSku: request?.replacementSku || "",
                replacementProductName: request?.replacementProductName || "",
                pickupCourier: request?.pickupShipment?.courier || "",
                pickupTrackingId: request?.pickupShipment?.trackingId || "",
                pickupTrackingUrl: request?.pickupShipment?.trackingUrl || "",
                replacementCourier: request?.replacementShipment?.courier || "",
                replacementTrackingId: request?.replacementShipment?.trackingId || "",
                replacementTrackingUrl: request?.replacementShipment?.trackingUrl || "",
                estimatedDelivery: request?.replacementShipment?.estimatedDelivery
                    ? String(request.replacementShipment.estimatedDelivery).slice(0, 10)
                    : "",
            });
        } catch (error) {
            toast.error(error.message || "Request details load failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDetails();
    }, [id, type]);

    const request = useMemo(() => getRequest(order, type), [order, type]);
    const product = useMemo(() => getRequestItem(order, request, itemId), [order, request, itemId]);
    const photos = request?.evidence?.photos || request?.photos || [];
    console.log("REQUEST =", request);
console.log("PHOTOS =", photos);
    const videos = request?.evidence?.videos || request?.videos || [];
    const statuses = isReturn ? RETURN_STATUSES : EXCHANGE_STATUSES;
    const pageTone = isReturn ? "orange" : "blue";

    const saveStatus = async () => {
        if (!id) return;

        try {
            setSaving(true);
            const endpoint = isReturn
                ? `/api/orders/admin/returns/status/${id}`
                : `/api/orders/admin/exchange/${id}`;

            const body = isReturn
                ? {
                    status: form.status,
                    adminRemark: form.adminRemark,
                    customerMessage: form.customerMessage,
                }
                : {
                    status: form.status,
                    adminNote: form.adminRemark,
                    replacementSku: form.replacementSku,
                    replacementProductName: form.replacementProductName,
                    pickupShipment: {
                        courier: form.pickupCourier,
                        trackingId: form.pickupTrackingId,
                        trackingUrl: form.pickupTrackingUrl,
                    },
                    replacementShipment: {
                        courier: form.replacementCourier,
                        trackingId: form.replacementTrackingId,
                        trackingUrl: form.replacementTrackingUrl,
                        estimatedDelivery: form.estimatedDelivery || null,
                    },
                };

            const data = await adminRequest(endpoint, {
                method: "PUT",
                body: JSON.stringify(body),
            });

            toast.success(data.message || "Status updated successfully");
            setOrder(data.order || order);
            await loadDetails();
        } catch (error) {
            toast.error(error.message || "Status update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="rounded-[18px] bg-white p-6 font-bold text-slate-600">Loading details...</div>;
    }

    if (!order) {
        return <div className="rounded-[18px] bg-white p-6 font-bold text-red-600">Request not found</div>;
    }

    return (
        <div className="space-y-5 pb-8">
            <div className="flex flex-col gap-4 rounded-[20px] border border-[#dbe7f3] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() => router.push(isReturn ? "/admin/returns" : "/admin/exchanges")}
                        className="mb-3 inline-flex items-center gap-2 text-sm font-black text-[#2454b5]"
                    >
                        <ArrowLeft size={17} />
                        Back to {isReturn ? "Returns" : "Exchanges"}
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-black text-[#102033]">
                            {isReturn ? "Return Details" : "Exchange Details"}
                        </h1>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusTone(request?.status)}`}>
                            {request?.status || "Not Requested"}
                        </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#607287]">
                        {order.orderNumber} | Requested on {formatDate(request?.requestedAt)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadDetails}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#2454b5] bg-white px-5 text-sm font-black text-[#2454b5]"
                >
                    <RefreshCcw size={17} />
                    Refresh
                </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
                <main className="space-y-5">
                    <Section title="Order Summary" icon={FileText}>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <Info label="Order ID" value={order._id} />
                            <Info label="Order Number" value={order.orderNumber} />
                            <Info label={`${isReturn ? "Return" : "Exchange"} Reason`} value={request?.reasonTitle} />
                            <Info label="Selected Issue" value={request?.subReason} />
                            <Info label="Order Status" value={order.orderStatus || order.status} />
                            <Info label="Payment Status" value={order.payment?.status} />
                            <Info label="Payment Method" value={order.payment?.method} />
                            <Info label="Total Amount" value={money(order.pricing?.totalAmount)} />
                        </div>
                    </Section>

                    <Section title="Product Information" icon={Package}>
                        <div className="flex flex-col gap-5 lg:flex-row">
                            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#dbe7f3] bg-[#f8fbff] p-3">
                                {product?.img ? (
                                    <img src={resolveAsset(product.img)} alt={product.name} className="h-full w-full object-contain" />
                                ) : (
                                    <Package className="text-slate-400" size={42} />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl font-black text-[#102033]">{product?.name || "Product"}</h2>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <Info label="Brand" value={product?.brand || "Generic"} />
                                    <Info label="SKU" value={product?.sku} />
                                    <Info label="MPN" value={product?.mpn} />
                                    <Info label="HSN" value={product?.hsnCode} />
                                    <Info label="Quantity" value={product?.quantity || 1} />
                                    <Info label="Unit Price" value={money(product?.price)} />
                                    <Info label="GST" value={money(product?.gstAmount)} />
                                    <Info label="Line Total" value={money(product?.lineTotal || product?.price)} />
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title={`${isReturn ? "Return" : "Exchange"} Reason Details`} icon={ShieldCheck}>
                        <div className="grid gap-4 lg:grid-cols-3">
                            <Info label="Main Reason" value={request?.reasonTitle} />
                            <Info label="Reason ID" value={request?.reasonId} />
                            <Info label="Selected Sub Reason" value={request?.subReason} />
                        </div>
                        <div className="mt-4 rounded-[14px] border border-[#e2e8f0] bg-[#f8fbff] p-4">
                            <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Customer Description</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-700">
                                {request?.description || request?.comment || "-"}
                            </p>
                        </div>
                    </Section>

                    <Section title="Uploaded Evidence" icon={ImageIcon}>
                        <div className="mb-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                                {photos.length} photos
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                                {videos.length} videos
                            </span>
                        </div>

                        {photos.length ? (
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                                {photos.map((photo, index) => (
                                    <a
                                        key={`${photo}-${index}`}
                                        href={resolveAsset(photo)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group overflow-hidden rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff]"
                                    >
                                        <img
                                            src={resolveAsset(photo)}
                                            alt={`Evidence ${index + 1}`}
                                            className="h-36 w-full object-cover transition group-hover:scale-105"
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                                event.currentTarget.nextElementSibling?.classList.remove("hidden");
                                            }}
                                        />
                                        <div className="hidden h-36 w-full items-center justify-center bg-white p-4 text-center text-xs font-black text-red-600">
                                            Image not loading. Open photo to check upload URL.
                                        </div>
                                        <div className="border-t bg-white px-3 py-2 text-xs font-black text-[#2454b5]">View Photo {index + 1}</div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <Empty icon={ImageIcon} text="No photos uploaded" />
                        )}

                        {videos.length ? (
                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                {videos.map((video, index) => (
                                    <div key={`${video}-${index}`} className="rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-3">
                                        <video controls className="w-full rounded-[12px] border bg-black">
                                            <source src={resolveAsset(video)} />
                                        </video>
                                        <a href={resolveAsset(video)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#2454b5]">
                                            Open Video {index + 1} <ExternalLink size={13} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-3">
                                <Empty icon={Video} text="No videos uploaded" />
                            </div>
                        )}
                    </Section>

                    {isReturn ? <RefundPreference request={request} product={product} /> : <ExchangeInformation request={request} />}

                    <Section title="Customer Account Details" icon={User}>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <Info icon={User} label="Customer Name" value={order.userInfo?.name} />
                            <Info icon={Phone} label="Phone" value={order.userInfo?.phone} />
                            <Info icon={Mail} label="Email" value={order.userInfo?.email} />
                            <Info icon={Building2} label="Company" value={order.userInfo?.companyName} />
                            <Info label="GST Number" value={order.userInfo?.gstNumber} />
                            <Info icon={MapPin} label="Address" value={[
                                order.userInfo?.addressLine1,
                                order.userInfo?.addressLine2,
                                order.userInfo?.city,
                                order.userInfo?.state,
                                order.userInfo?.pincode,
                                order.userInfo?.country,
                            ].filter(Boolean).join(", ")} />
                        </div>
                    </Section>

                    <Section title="Payment, Refund And Wallet" icon={CreditCard}>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <Info icon={CreditCard} label="Payment Method" value={order.payment?.method} />
                            <Info label="Payment Status" value={order.payment?.status} />
                            <Info label="Payment ID" value={order.payment?.paymentId || order.payment?.razorpayPaymentId} />
                            <Info label="Paid At" value={formatDate(order.payment?.paidAt)} />
                            <Info icon={CircleDollarSign} label="Refund Status" value={order.refund?.status} />
                            <Info label="Refund Amount" value={money(order.refund?.amount || product?.lineTotal || order.pricing?.totalAmount)} />
                            <Info label="Refund Reference" value={order.refund?.admin?.refundReferenceId} />
                            <Info icon={Wallet} label="Royal Wallet" value={request?.refundPreference?.method === "WALLET" ? "Selected" : "Not selected"} />
                        </div>
                    </Section>

                    {order.cancellation?.cancelReason || product?.cancellation?.cancelReason ? (
                        <Section title="Cancellation Details" icon={RefreshCcw}>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Info label="Order Cancel Reason" value={order.cancellation?.cancelReason} />
                                <Info label="Order Cancel Comment" value={order.cancellation?.cancelComment} />
                                <Info label="Item Cancel Reason" value={product?.cancellation?.cancelReason} />
                                <Info label="Cancelled At" value={formatDate(order.cancellation?.cancelledAt || product?.cancellation?.cancelledAt)} />
                            </div>
                        </Section>
                    ) : null}

                    <Section title="Order History" icon={CalendarClock}>
                        <Timeline entries={order.timeline || []} dateKey="time" />
                    </Section>

                    <Section title={`${isReturn ? "Return" : "Exchange"} History`} icon={CheckCircle2}>
                        <Timeline entries={request?.history || []} dateKey="date" />
                    </Section>
                </main>

                <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
                    <Section title="Admin Status Update" icon={Save} compact>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, status }))}
                                        className={`rounded-[12px] border px-3 py-2 text-xs font-black transition ${form.status === status
                                                ? "border-[#2454b5] bg-[#2454b5] text-white"
                                                : "border-[#d8e3f0] bg-white text-[#102033] hover:border-[#2454b5]"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <Field label={`${isReturn ? "Return" : "Exchange"} Status`}>
                                <select
                                    value={form.status}
                                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                                    className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-black outline-none focus:border-[#2454b5]"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Admin Note">
                                <textarea
                                    rows={4}
                                    value={form.adminRemark}
                                    onChange={(event) => setForm((prev) => ({ ...prev, adminRemark: event.target.value }))}
                                    className="w-full resize-none rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                                    placeholder="Approval, rejection, pickup, quality check or shipment note"
                                />
                            </Field>

                            {isReturn ? (
                                <Field label="Message To Customer">
                                    <textarea
                                        rows={3}
                                        value={form.customerMessage}
                                        onChange={(event) => setForm((prev) => ({ ...prev, customerMessage: event.target.value }))}
                                        className="w-full resize-none rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                                        placeholder="Message visible to customer"
                                    />
                                </Field>
                            ) : (
                                <>
                                    <Field label="Replacement Product">
                                        <input
                                            value={form.replacementProductName}
                                            onChange={(event) => setForm((prev) => ({ ...prev, replacementProductName: event.target.value }))}
                                            className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
                                        />
                                    </Field>
                                    <Field label="Replacement SKU">
                                        <input
                                            value={form.replacementSku}
                                            onChange={(event) => setForm((prev) => ({ ...prev, replacementSku: event.target.value }))}
                                            className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
                                        />
                                    </Field>
                                    <ShipmentFields title="Pickup Shipment" form={form} setForm={setForm} prefix="pickup" />
                                    <ShipmentFields title="Replacement Shipment" form={form} setForm={setForm} prefix="replacement" />
                                    <Field label="Estimated Delivery">
                                        <input
                                            type="date"
                                            value={form.estimatedDelivery}
                                            onChange={(event) => setForm((prev) => ({ ...prev, estimatedDelivery: event.target.value }))}
                                            className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
                                        />
                                    </Field>
                                </>
                            )}

                        <div className="mt-6 w-full">
    <button
        type="button"
        onClick={saveStatus}
        disabled={saving}
        className="
            w-full
            h-[56px]
            flex
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-green-600
            hover:bg-green-700
            text-white
            text-lg
            font-bold
            shadow-xl
            border
            border-green-700
            disabled:opacity-50
            disabled:cursor-not-allowed
        "
    >
        <Save size={22} />
        {saving ? "Saving..." : "Save Changes"}
    </button>
</div>
                        </div>
                    </Section>

                    <Section title="Request Progress" icon={CheckCircle2} compact>
                        <ProgressSteps request={request} isReturn={isReturn} />
                    </Section>
                </aside>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children, compact = false }) {
    return (
        <section className="overflow-hidden rounded-[20px] border border-[#dbe7f3] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#e5edf6] bg-[#f8fbff] px-5 py-4">
                {Icon ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#2454b5] shadow-sm">
                        <Icon size={19} />
                    </span>
                ) : null}
                <h2 className="text-base font-black text-[#102033]">{title}</h2>
            </div>
            <div className={compact ? "p-4" : "p-5"}>{children}</div>
        </section>
    );
}

function Info({ label, value, icon: Icon }) {
    return (
        <div className="min-w-0 rounded-[14px] border border-[#e2e8f0] bg-[#f8fbff] p-4">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-slate-500">
                {Icon ? <Icon size={14} /> : null}
                {label}
            </p>
            <p className="mt-2 break-words text-sm font-black text-[#102033]">{value || "-"}</p>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#607287]">{label}</span>
            {children}
        </label>
    );
}

function Empty({ icon: Icon, text }) {
    return (
        <div className="flex items-center gap-2 rounded-[14px] border border-dashed border-[#cbd5e1] bg-[#f8fbff] p-4 text-sm font-bold text-slate-500">
            <Icon size={17} />
            {text}
        </div>
    );
}

function RefundPreference({ request, product }) {
    const refund = request?.refundPreference || {};
    const isWallet = refund.method === "WALLET";
    const isBank = refund.method === "BANK";

    return (
        <Section title="Refund Preference And Royal Wallet" icon={BadgeIndianRupee}>
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="grid gap-3 md:grid-cols-2">
                    <Info icon={BadgeIndianRupee} label="Refund Method" value={refund.method} />
                    <Info label="Estimated Refund" value={money(product?.lineTotal || product?.price)} />
                    <Info icon={Landmark} label="Account Holder" value={refund.accountHolder} />
                    <Info label="Bank Name" value={refund.bankName} />
                    <Info label="Account Number" value={refund.accountNumber} />
                    <Info label="IFSC" value={refund.ifsc} />
                    <Info label="UPI" value={refund.upi} />
                    <Info icon={Wallet} label="Wallet Status" value={refund.walletStatus || (isWallet ? "Selected" : "-")} />
                </div>
                <div className={`rounded-[18px] border p-5 ${isWallet ? "border-emerald-200 bg-emerald-50" : "border-blue-200 bg-blue-50"}`}>
                    <Wallet className={isWallet ? "text-emerald-700" : "text-[#2454b5]"} size={34} />
                    <h3 className="mt-4 text-xl font-black text-[#102033]">
                        {isWallet ? "Royal Trading Wallet Selected" : isBank ? "Bank Refund Selected" : "Refund Method Pending"}
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        {isWallet
                            ? `Wallet refund validity: ${refund.walletValidityMonths || 12} months. Admin can approve refund after quality check.`
                            : "Bank account details are visible above for finance verification."}
                    </p>
                </div>
            </div>
        </Section>
    );
}

function ExchangeInformation({ request }) {
    return (
        <Section title="Exchange Pickup And Replacement Details" icon={Truck}>
            <div className="grid gap-4 lg:grid-cols-2">
                <Info label="Replacement SKU" value={request?.replacementSku} />
                <Info label="Replacement Product" value={request?.replacementProductName} />
                <Info label="Pickup Address" value={[
                    request?.pickupAddress?.name,
                    request?.pickupAddress?.phone,
                    request?.pickupAddress?.addressLine1,
                    request?.pickupAddress?.addressLine2,
                    request?.pickupAddress?.city,
                    request?.pickupAddress?.state,
                    request?.pickupAddress?.pincode,
                ].filter(Boolean).join(", ")} />
                <ShipmentInfo title="Pickup Shipment" shipment={request?.pickupShipment} />
                <ShipmentInfo title="Replacement Shipment" shipment={request?.replacementShipment} />
            </div>
        </Section>
    );
}

function ShipmentInfo({ title, shipment }) {
    return (
        <div className="rounded-[14px] border border-[#e2e8f0] bg-[#f8fbff] p-4">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{title}</p>
            <div className="mt-2 space-y-1 text-sm font-bold text-[#102033]">
                <p>Courier: {shipment?.courier || "-"}</p>
                <p>Tracking ID: {shipment?.trackingId || "-"}</p>
                <p>Estimated Delivery: {formatDate(shipment?.estimatedDelivery)}</p>
                {shipment?.trackingUrl ? (
                    <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#2454b5]">
                        Open Tracking <ExternalLink size={14} />
                    </a>
                ) : null}
            </div>
        </div>
    );
}

function Timeline({ entries = [], dateKey }) {
    if (!entries.length) {
        return <Empty icon={CalendarClock} text="No history available" />;
    }

    return (
        <div className="relative space-y-3">
            {entries.map((entry, index) => (
                <div key={`${entry.status}-${index}`} className="relative rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-black text-[#102033]">{entry.status || "-"}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">{entry.by || "System"}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{entry.message || "-"}</p>
                    <p className="mt-2 text-xs font-black text-slate-400">{formatDate(entry[dateKey])}</p>
                </div>
            ))}
        </div>
    );
}

function ProgressSteps({ request, isReturn }) {
    const rawSteps = isReturn
        ? [
            ["Requested", request?.requestedAt],
            ["Approved", request?.approvedAt],
            ["Pickup Scheduled", request?.pickupScheduledAt],
            ["Picked Up", request?.pickedUpAt],
            ["Quality Checking", request?.qualityCheckedAt],
            ["Refund Approved", request?.refundApprovedAt],
            ["Completed", request?.completedAt],
        ]
        : [
            ["Requested", request?.requestedAt],
            ["Approved", request?.approvedAt],
            ["Pickup Scheduled", request?.pickupScheduledAt],
            ["Picked Up", request?.pickedUpAt],
            ["Quality Checking", request?.qualityCheckedAt],
            ["Replacement Packed", request?.replacementPackedAt],
            ["Replacement Shipped", request?.replacementShippedAt],
            ["Out for Delivery", request?.outForDeliveryAt],
            ["Completed", request?.completedAt],
        ];
    const currentRank = statusRank(request?.status, rawSteps.map(([label]) => label));

    return (
        <div className="space-y-3">
            {rawSteps.map(([label, date], index) => {
                const completed = Boolean(date) || index <= currentRank;

                return (
                    <div key={label} className="flex gap-3 rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            {completed ? <CheckCircle2 size={17} /> : <PackageCheck size={17} />}
                        </span>
                        <div>
                            <p className="text-sm font-black text-[#102033]">{label}</p>
                            <p className="text-xs font-bold text-[#607287]">{date ? formatDate(date) : completed ? "Status completed" : "-"}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ShipmentFields({ title, form, setForm, prefix }) {
    const cap = prefix === "pickup" ? "pickup" : "replacement";
    const courierKey = `${cap}Courier`;
    const trackingIdKey = `${cap}TrackingId`;
    const trackingUrlKey = `${cap}TrackingUrl`;

    return (
        <div className="space-y-3 rounded-[14px] border border-[#e2e8f0] bg-[#f8fbff] p-3">
            <p className="text-xs font-black uppercase tracking-wide text-[#607287]">{title}</p>
            <Field label="Courier">
                <input
                    value={form[courierKey]}
                    onChange={(event) => setForm((prev) => ({ ...prev, [courierKey]: event.target.value }))}
                    className="h-11 w-full rounded-[12px] border border-[#d8e3f0] bg-white px-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                />
            </Field>
            <Field label="Tracking ID">
                <input
                    value={form[trackingIdKey]}
                    onChange={(event) => setForm((prev) => ({ ...prev, [trackingIdKey]: event.target.value }))}
                    className="h-11 w-full rounded-[12px] border border-[#d8e3f0] bg-white px-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                />
            </Field>
            <Field label="Tracking URL">
                <input
                    value={form[trackingUrlKey]}
                    onChange={(event) => setForm((prev) => ({ ...prev, [trackingUrlKey]: event.target.value }))}
                    className="h-11 w-full rounded-[12px] border border-[#d8e3f0] bg-white px-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                />
            </Field>
        </div>
    );
}
