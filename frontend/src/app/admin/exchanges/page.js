"use client";

import { useEffect, useMemo, useState } from "react";
import {
    RefreshCcw,
    Search,
    Truck,
    ShieldCheck,
    PackageCheck,
    ExternalLink,
    Save,
    X,
    ImageIcon,
    Video,
} from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";


const statuses = [
    "ALL",
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

const adminStatuses = statuses.filter((status) => status !== "ALL");

function resolveAsset(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}/${String(path).replace(/^\/+/, "")}`;
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

function statusClass(status) {
    if (status === "Completed") return "bg-green-100 text-green-700 border-green-200";
    if (status === "Rejected") return "bg-red-100 text-red-700 border-red-200";
    if (status === "Requested") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-blue-100 text-[#2454b5] border-blue-200";
}

export default function AdminExchangesPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        status: "Approved",
        adminNote: "",
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

    const loadRequests = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (search.trim()) query.set("search", search.trim());
            if (status !== "ALL") query.set("status", status);

            const data = await adminRequest(`/api/orders/admin/exchanges?${query.toString()}`);
            setRequests(data.requests || []);
        } catch (error) {
            toast.error(error.message || "Exchange requests load failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [status]);

    const openRequest = (order) => {
  const itemId =
    order?.exchange?.itemId ||
    order?.products?.[0]?._id;

 window.location.href = `/admin/exchanges/${order._id}?itemId=${itemId}`;
};

    const saveExchange = async () => {
        if (!selected?._id) return;

        try {
            setSaving(true);
            const data = await adminRequest(`/api/orders/admin/exchange/${selected._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    status: form.status,
                    adminNote: form.adminNote,
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
                }),
            });

            toast.success(data.message || "Exchange updated");
            setSelected(data.order || selected);
            await loadRequests();
        } catch (error) {
            toast.error(error.message || "Exchange update failed");
        } finally {
            setSaving(false);
        }
    };

    const filteredRequests = useMemo(() => requests, [requests]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#102033]">Exchange Requests</h1>
                    <p className="mt-2 text-sm font-semibold text-[#607287]">
                        Customer exchange reasons, evidence, pickup and replacement shipment control.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadRequests}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#2454b5] px-5 text-sm font-black text-white shadow-lg"
                >
                    <RefreshCcw size={18} />
                    Refresh
                </button>
            </div>

            <div className="rounded-[22px] border border-[#dbe7f3] bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_260px_120px]">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607287]" size={18} />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") loadRequests();
                            }}
                            placeholder="Search order, customer, phone, product or reason"
                            className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-12 rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-black text-[#102033] outline-none focus:border-[#2454b5]"
                    >
                        {statuses.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={loadRequests}
                        className="h-12 rounded-[14px] border border-[#2454b5] bg-white text-sm font-black text-[#2454b5]"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
                <section className="space-y-4">
                    {loading ? (
                        <div className="rounded-[22px] border border-[#dbe7f3] bg-white p-8 text-center font-bold text-[#607287]">
                            Loading exchange requests...
                        </div>
                    ) : null}

                    {!loading && !filteredRequests.length ? (
                        <div className="rounded-[22px] border border-dashed border-[#b8cce4] bg-white p-10 text-center">
                            <RefreshCcw className="mx-auto text-[#2454b5]" size={40} />
                            <h2 className="mt-4 text-xl font-black text-[#102033]">No exchange requests</h2>
                            <p className="mt-2 text-sm font-semibold text-[#607287]">
                                New exchange requests will appear here.
                            </p>
                        </div>
                    ) : null}

                    {filteredRequests.map((order) => {
                        const item =
                            order.products?.find((product) => String(product._id) === String(order.exchange?.itemId)) ||
                            order.products?.[0];

                        return (
                            <button
                                type="button"
                                key={order._id}
                                onClick={() => openRequest(order)}
                                className={`block w-full overflow-hidden rounded-[22px] border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${selected?._id === order._id ? "border-[#2454b5]" : "border-[#dbe7f3]"
                                    }`}
                            >
                                <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#dbe7f3] bg-[#f8fbff] p-2">
                                        {item?.img ? (
                                            <img src={resolveAsset(item.img)} alt={item.name} className="h-full w-full object-contain" />
                                        ) : (
                                            <RefreshCcw className="text-[#94a3b8]" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-black text-[#102033]">{order.orderNumber}</p>
                                            <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusClass(order.exchange?.status)}`}>
                                                {order.exchange?.status}
                                            </span>
                                        </div>
                                        <h3 className="mt-2 line-clamp-1 text-lg font-black text-[#102033]">
                                            {item?.name || "Industrial Component"}
                                        </h3>
                                        <p className="mt-1 text-sm font-semibold text-[#607287]">
                                            {order.userInfo?.name} • {order.userInfo?.phone}
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-[#2454b5]">
                                            Reason: {order.exchange?.reasonTitle || "-"}
                                        </p>
                                    </div>

                                    <div className="text-sm font-semibold text-[#607287] lg:text-right">
                                        <p>Requested</p>
                                        <p className="mt-1 font-black text-[#102033]">
                                            {formatDate(order.exchange?.requestedAt)}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </section>

                <aside className="xl:sticky xl:top-20 xl:self-start">
                    {!selected ? (
                        <div className="rounded-[24px] border border-[#dbe7f3] bg-white p-8 text-center shadow-sm">
                            <ShieldCheck className="mx-auto text-[#2454b5]" size={42} />
                            <h2 className="mt-4 text-xl font-black text-[#102033]">Select a request</h2>
                            <p className="mt-2 text-sm font-semibold text-[#607287]">
                                Reason, evidence and admin controls will open here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-[24px] border border-[#dbe7f3] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                            <div className="flex items-start justify-between gap-3 border-b border-[#e2ebf6] bg-gradient-to-r from-[#f8fbff] to-white p-5">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wide text-[#607287]">
                                        Exchange Control
                                    </p>
                                    <h2 className="mt-1 text-xl font-black text-[#102033]">
                                        {selected.orderNumber}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelected(null)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fa]"
                                    aria-label="Close details"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="max-h-[calc(100vh-170px)] space-y-5 overflow-y-auto p-5">
                                <InfoBlock title="Customer">
                                    <p className="font-black text-[#102033]">{selected.userInfo?.name}</p>
                                    <p className="mt-1 text-sm font-semibold text-[#607287]">
                                        {selected.userInfo?.phone} • {selected.userInfo?.email || "-"}
                                    </p>
                                </InfoBlock>

                                <InfoBlock title="Exchange Reason">
                                    <p className="font-black text-[#102033]">{selected.exchange?.reasonTitle || "-"}</p>
                                    {selected.exchange?.subReason ? (
                                        <p className="mt-1 text-sm font-bold text-[#2454b5]">
                                            {selected.exchange.subReason}
                                        </p>
                                    ) : null}
                                    <p className="mt-2 text-sm leading-6 text-[#607287]">
                                        {selected.exchange?.description || selected.exchange?.comment || "No description"}
                                    </p>
                                </InfoBlock>

                                <InfoBlock title="Pickup Address">
                                    <p className="text-sm font-semibold leading-6 text-[#102033]">
                                        {[
                                            selected.exchange?.pickupAddress?.name,
                                            selected.exchange?.pickupAddress?.phone,
                                            selected.exchange?.pickupAddress?.addressLine1,
                                            selected.exchange?.pickupAddress?.addressLine2,
                                            selected.exchange?.pickupAddress?.city,
                                            selected.exchange?.pickupAddress?.state,
                                            selected.exchange?.pickupAddress?.pincode,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                </InfoBlock>

                                <InfoBlock title="Uploaded Evidence">
                                    <div className="grid grid-cols-2 gap-3">
                                        {(selected.exchange?.evidence?.photos || []).map((photo, index) => (
                                            <a
                                                key={photo}
                                                href={resolveAsset(photo)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group overflow-hidden rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff]"
                                            >
                                                <img
                                                    src={resolveAsset(photo)}
                                                    alt={`Exchange evidence ${index + 1}`}
                                                    className="h-28 w-full object-cover transition group-hover:scale-105"
                                                />
                                            </a>
                                        ))}
                                    </div>

                                    {(selected.exchange?.evidence?.photos || []).length === 0 ? (
                                        <p className="flex items-center gap-2 text-sm font-semibold text-[#607287]">
                                            <ImageIcon size={17} />
                                            No photos uploaded
                                        </p>
                                    ) : null}

                                    <div className="mt-3 space-y-3">
                                        {(selected.exchange?.evidence?.videos || []).map((video) => (
                                            <video key={video} controls className="w-full rounded-[14px] border border-[#dbe7f3]">
                                                <source src={resolveAsset(video)} />
                                            </video>
                                        ))}
                                    </div>

                                    {(selected.exchange?.evidence?.videos || []).length === 0 ? (
                                        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#607287]">
                                            <Video size={17} />
                                            No video uploaded
                                        </p>
                                    ) : null}
                                </InfoBlock>

                                <InfoBlock title="Admin Update">
                                    <div className="space-y-3">
                                        <Field label="Exchange Status">
                                            <select
                                                value={form.status}
                                                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                                                className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-black outline-none focus:border-[#2454b5]"
                                            >
                                                {adminStatuses.map((item) => (
                                                    <option key={item} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>

                                        <Field label="Admin Note">
                                            <textarea
                                                rows={3}
                                                value={form.adminNote}
                                                onChange={(event) => setForm((prev) => ({ ...prev, adminNote: event.target.value }))}
                                                placeholder="Reason for approval/rejection or next action"
                                                className="w-full resize-none rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                                            />
                                        </Field>

                                        <div className="grid gap-3 md:grid-cols-2">
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
                                        </div>
                                    </div>
                                </InfoBlock>

                                <InfoBlock title="Pickup Tracking">
                                    <ShipmentFields
                                        icon={Truck}
                                        courier={form.pickupCourier}
                                        trackingId={form.pickupTrackingId}
                                        trackingUrl={form.pickupTrackingUrl}
                                        onCourier={(value) => setForm((prev) => ({ ...prev, pickupCourier: value }))}
                                        onTrackingId={(value) => setForm((prev) => ({ ...prev, pickupTrackingId: value }))}
                                        onTrackingUrl={(value) => setForm((prev) => ({ ...prev, pickupTrackingUrl: value }))}
                                    />
                                </InfoBlock>

                                <InfoBlock title="Replacement Tracking">
                                    <ShipmentFields
                                        icon={PackageCheck}
                                        courier={form.replacementCourier}
                                        trackingId={form.replacementTrackingId}
                                        trackingUrl={form.replacementTrackingUrl}
                                        onCourier={(value) => setForm((prev) => ({ ...prev, replacementCourier: value }))}
                                        onTrackingId={(value) => setForm((prev) => ({ ...prev, replacementTrackingId: value }))}
                                        onTrackingUrl={(value) => setForm((prev) => ({ ...prev, replacementTrackingUrl: value }))}
                                    />

                                    <Field label="Estimated Delivery">
                                        <input
                                            type="date"
                                            value={form.estimatedDelivery}
                                            onChange={(event) => setForm((prev) => ({ ...prev, estimatedDelivery: event.target.value }))}
                                            className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
                                        />
                                    </Field>
                                </InfoBlock>

                                <InfoBlock title="Status History">
                                    <div className="space-y-3">
                                        {(selected.exchange?.history || []).map((entry, index) => (
                                            <div key={`${entry.status}-${index}`} className="rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="font-black text-[#102033]">{entry.status}</p>
                                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#607287]">
                                                        {entry.by}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm font-semibold text-[#607287]">
                                                    {entry.message}
                                                </p>
                                                <p className="mt-2 text-xs font-bold text-[#94a3b8]">
                                                    {formatDate(entry.date)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </InfoBlock>

                                <button
                                    type="button"
                                    onClick={saveExchange}
                                    disabled={saving}
                                    className="flex h-14 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#2454b5] to-[#2bb7e8] text-sm font-black text-white shadow-[0_12px_28px_rgba(36,84,181,0.28)] disabled:opacity-60"
                                >
                                    <Save size={18} />
                                    {saving ? "Saving..." : "Save Exchange Update"}
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

function InfoBlock({ title, children }) {
    return (
        <section className="rounded-[18px] border border-[#dbe7f3] bg-white p-4">
            <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-[#607287]">
                {title}
            </h3>
            {children}
        </section>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#607287]">
                {label}
            </span>
            {children}
        </label>
    );
}

function ShipmentFields({
    icon: Icon,
    courier,
    trackingId,
    trackingUrl,
    onCourier,
    onTrackingId,
    onTrackingUrl,
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-black text-[#2454b5]">
                <Icon size={18} />
                Courier Details
            </div>
            <Field label="Courier">
                <input
                    value={courier}
                    onChange={(event) => onCourier(event.target.value)}
                    placeholder="Delhivery / BlueDart / DTDC"
                    className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
                />
            </Field>
            <Field label="Tracking ID">
                <input
                    value={trackingId}
                    onChange={(event) => onTrackingId(event.target.value)}
                    placeholder="AWB or tracking number"
                    className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
                />
            </Field>
            <Field label="Tracking URL">
                <div className="relative">
                    <input
                        value={trackingUrl}
                        onChange={(event) => onTrackingUrl(event.target.value)}
                        placeholder="https://tracking-link.com"
                        className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 pr-11 text-sm font-semibold outline-none focus:border-[#2454b5]"
                    />
                    {trackingUrl ? (
                        <a
                            href={trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2454b5]"
                            aria-label="Open tracking URL"
                        >
                            <ExternalLink size={17} />
                        </a>
                    ) : null}
                </div>
            </Field>
        </div>
    );
}
