"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Package,
  Save,
  RefreshCcw,
  FileText,
} from "lucide-react";

import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

const statuses = [
  "Order Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const paymentStatuses = [
  "Pending",
  "Awaiting Verification",
  "Paid",
  "Failed",
  "Refund Pending",
  "Refund Processing",
  "Refunded",
];

const refundStatuses = ["Approved", "Rejected", "Processing", "Refunded"];

function resolveImage(src) {
  if (!src) return "";

  if (src.startsWith("http")) {
    return src;
  }

  return `${API_BASE}/${String(src).replace(/^\/+/, "")}`;
}

function money(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [refundSaving, setRefundSaving] = useState(false);

  const [refundForm, setRefundForm] = useState({
    status: "Approved",
    amount: 0,
    adminNote: "",
    refundReferenceId: "",
  });

  const [form, setForm] = useState({
    status: "Order Placed",
    paymentStatus: "Pending",
    courier: "",
    trackingId: "",
    trackingUrl: "",
  });

  const loadOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const data = await adminRequest("/api/admin/orders/details", {
        method: "POST",
        body: JSON.stringify({ ids: [id] }),
      });

      const found = data.orders?.[0] || null;
      setOrder(found);

      if (found) {
        setForm({
          status: found.status || found.orderStatus || "Order Placed",
          paymentStatus: found.payment?.status || "Pending",
          courier: found.shipment?.courier || "",
          trackingId: found.shipment?.trackingId || "",
          trackingUrl: found.shipment?.trackingUrl || "",
        });

        setRefundForm({
          status:
            found.refund?.status && found.refund.status !== "Not Requested"
              ? found.refund.status
              : "Approved",
          amount: found.refund?.amount || found.pricing?.totalAmount || 0,
          adminNote: found.refund?.admin?.note || "",
          refundReferenceId: found.refund?.admin?.refundReferenceId || "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Order load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const products = useMemo(() => {
    if (!order) return [];

    const itemId =
      new URLSearchParams(window.location.search).get("itemId");

    if (!itemId) {
      return order.products || [];
    }

    const selectedItem = (order.products || []).find(
      (item) => String(item._id) === String(itemId)
    );

    return selectedItem ? [selectedItem] : [];
  }, [order]);

  const selectedItem = products?.[0];

  const selectedSubtotal =
    Number(selectedItem?.price || 0) *
    Number(selectedItem?.quantity || 0);

  const selectedTax =
    Number(selectedItem?.gstAmount || 0);

  const selectedShipping = 0;

  const selectedTotal =
    Number(selectedItem?.lineTotal || 0);

  const saveOrder = async () => {
    try {
      setSaving(true);

      await adminRequest("/api/admin/orders/status", {
        method: "PUT",
        body: JSON.stringify({
          orderId: id,

          itemId:
            new URLSearchParams(window.location.search).get("itemId"),

          status: form.status,
          paymentStatus: form.paymentStatus,
          courier: form.courier,
          trackingId: form.trackingId,
          trackingUrl: form.trackingUrl,
        }),
      });

      toast.success("Order updated successfully");
      await loadOrder();
    } catch (error) {
      toast.error(error.message || "Order update failed");
    } finally {
      setSaving(false);
    }
  };

  const updatePaymentVerification = async (paymentStatus) => {
    try {
      setSaving(true);

      await adminRequest("/api/admin/orders/status", {
        method: "PUT",
        body: JSON.stringify({
          orderId: id,

          itemId:
            new URLSearchParams(window.location.search).get("itemId"),

          status: form.status,
          paymentStatus,
          courier: form.courier,
          trackingId: form.trackingId,
          trackingUrl: form.trackingUrl,
        }),
      });

      toast.success(
        paymentStatus === "Paid"
          ? "Payment marked as Paid"
          : "Payment marked as Failed",
      );

      await loadOrder();
    } catch (error) {
      toast.error(error.message || "Payment update failed");
    } finally {
      setSaving(false);
    }
  };

  const saveRefund = async () => {
    try {
      setRefundSaving(true);

      await adminRequest(`/api/orders/admin/refund/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: refundForm.status,
          amount: Number(refundForm.amount || 0),
          adminNote: refundForm.adminNote,
          refundReferenceId: refundForm.refundReferenceId,
        }),
      });

      toast.success("Refund updated successfully");
      await loadOrder();
    } catch (error) {
      toast.error(error.message || "Refund update failed");
    } finally {
      setRefundSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6">Loading order...</div>;
  }

  if (!order) {
    return <div className="rounded-2xl bg-white p-6">Order not found</div>;
  }

  return (
    <div className="space-y-5 pb-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => router.push("/admin/orders")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#2454b5]"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <h1 className="text-[16px] font-bold text-[#102033]">
            {order.orderNumber || order.id}
          </h1>
          <p className="text-sm text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        <button
          onClick={saveOrder}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={() => {
            const itemId =
              new URLSearchParams(window.location.search).get("itemId");

            window.open(
              `${API_BASE}/api/orders/admin/download-pdf/${id}?itemId=${itemId}`,
              "_blank"
            );
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2454b5] bg-white px-5 py-3 text-sm font-bold text-[#2454b5]"
        >
          <FileText size={18} />
          Download PDF
        </button>

        <button
          onClick={() => {
            window.open(
              `${API_BASE}/api/orders/admin/download-tax-invoice/${id}`,
              "_blank"
            );
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
        >
          <FileText size={18} />
          Download GST Invoice
        </button>

        {selectedItem && (
          <>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/admin/returns/${id}?itemId=${selectedItem._id}`
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
            >
              Return Details
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/admin/exchanges/${id}?itemId=${selectedItem._id}`
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Exchange Details
            </button>
          </>
        )}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">

        {/* LEFT SIDE */}
        <div className="space-y-5">

          {/* ORDER ITEMS */}
          <div className="overflow-hidden rounded-[24px] border border-[#dbe7f3] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] shadow-[0_18px_60px_rgba(15,23,42,0.08)]">

            {/* HEADER */}
            <div className="border-b border-[#e4edf7] px-3 py-2.5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2454b5] to-[#3b82f6] text-white shadow-lg">
                    <Package size={20} />
                  </div>

                  <div>
                    <h2 className="text-[16px] font-extrabold tracking-tight text-[#102033]">
                      Order Items
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-500">
                      purchased products & pricing details
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-[#eff6ff] px-3 py-1 text-[11px] font-bold text-[#2563eb]">
                  {products.length} Items
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="space-y-6 p-6">

              {products.map((item, index) => (
                <div
                  key={item._id || index}
                  className="overflow-hidden rounded-[18px] border border-[#dce7f5] bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
                >

                  {/* TOP */}
                  <div className="flex flex-col gap-6 p-3 lg:flex-row">

                    {/* IMAGE */}
                    <div className="relative">

                      <div className="absolute left-3 top-3 z-10 rounded-full bg-[#2454b5] px-3 py-1 text-xstext-[10px] font-bold text-white shadow-lg">
                        #{index + 1}
                      </div>

                      <div className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-[28px] border border-[#dbe7f3] bg-gradient-to-br from-[#f8fbff] to-white p-3">

                        {item.img ? (
                          <img
                            src={resolveImage(item.img)}
                            alt={item.name}
                            className="h-full w-full object-contain transition duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#f1f5f9] text-sm font-semibold text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">

                      {/* PRODUCT TITLE */}
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                        <div>
                          <h3 className="text-[16px] font-extrabold leading-tight tracking-tight text-[#102033]">
                            {item.name}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-3">

                            <div className="rounded-full bg-[#eff6ff] px-3 py-1.5 text-[10px] font-bold text-[#2563eb]">
                              Brand: {item.brand || "Generic"}
                            </div>

                            <div className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-[10px] font-bold text-slate-600">
                              SKU: {item.sku || "N/A"}
                            </div>

                            <div className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-[10px] font-bold text-slate-600">
                              MPN: {item.mpn || "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* STATUS */}
                        <div className="rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#22c55e] px-3 py-2.5 text-center text-white shadow-lg">

                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                            Item Status
                          </p>

                          <h3 className="mt-2 text-[16px] font-extrabold">
                            {item.itemStatus || order.status}
                          </h3>
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">

                        {/* QUANTITY */}
                        <div className="rounded-[16px] border border-[#e2e8f0] bg-white px-3 py-2.5">

                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Quantity
                          </p>

                          <div className="mt-2 flex items-end gap-1">

                            <span className="text-[20px] font-bold leading-none text-[#0f172a]">
                              {item.quantity}
                            </span>

                            <span className="mb-1 text-[11px] font-medium text-slate-400">
                              Units
                            </span>
                          </div>
                        </div>

                        {/* UNIT PRICE */}
                        <div className="rounded-[16px] border border-[#e2e8f0] bg-white px-3 py-2.5">

                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Unit Price
                          </p>

                          <div className="mt-2 flex items-end gap-1">

                            <span className="text-[14px] font-bold leading-none text-[#2563eb]">
                              ₹
                            </span>

                            <span className="text-[20px] font-bold leading-none text-[#0f172a]">
                              {Number(item.price || 0).toFixed(2)}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Per Unit
                          </p>
                        </div>

                        {/* GST */}
                        <div className="rounded-[16px] border border-[#e2e8f0] bg-white px-3 py-2.5">

                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            GST Amount
                          </p>

                          <div className="mt-2 flex items-end gap-1">

                            <span className="text-[14px] font-bold leading-none text-[#ea580c]">
                              ₹
                            </span>

                            <span className="text-[16px] font-bold leading-none text-[#0f172a]">
                              {Number(item.gstAmount || 0).toFixed(2)}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-slate-400">
                            18% GST
                          </p>
                        </div>

                        {/* TOTAL */}
                        <div className="rounded-[16px] bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-3 py-2.5 text-white">

                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
                            Total Amount
                          </p>

                          <div className="mt-2 flex items-end gap-1">

                            <span className="text-[16px] font-bold leading-none text-white">
                              ₹
                            </span>

                            <span className="text-[20px] font-bold leading-none text-white">
                              {Number(item.lineTotal || 0).toFixed(2)}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-white/80">
                            For {item.quantity} Units
                          </p>
                        </div>
                      </div>

                      {/* PRODUCT META */}
                      <div className="mt-6 grid gap-3 lg:grid-cols-3">

                        <div className="rounded-[14px] bg-[#f8fbff] p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Product Type
                          </p>

                          <h4 className="mt-2 text-[15px] font-bold text-[#102033]">
                            Electronic Component
                          </h4>
                        </div>

                        <div className="rounded-[14px] bg-[#f8fbff] p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Availability
                          </p>

                          <h4 className="mt-2 text-[15px] font-bold text-[#16a34a]">
                            In Stock
                          </h4>
                        </div>

                        <div className="rounded-[14px] bg-[#f8fbff] p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Shipping Type
                          </p>

                          <h4 className="mt-2 text-[15px] font-bold text-[#102033]">
                            Standard Delivery
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMER + SHIPPING */}
          <div className="grid gap-5 lg:grid-cols-2">

            {/* CUSTOMER DETAILS */}
            <div className="overflow-hidden rounded-[24px] border border-[#dbe7f3] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] shadow-[0_12px_40px_rgba(15,23,42,0.06)]">

              {/* HEADER */}
              <div className="border-b border-[#e5edf7] px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#2454b5] to-[#3b82f6] text-white shadow-lg">
                    👤
                  </div>

                  <div>
                    <h2 className="text-[18px] font-extrabold text-[#102033]">
                      Customer Details
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-500">
                      customer contact & billing information
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div className="space-y-3 p-5">

                <div className="rounded-[16px] border border-[#e6edf7] bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Customer Name
                  </p>

                  <h3 className="mt-2 text-[18px] font-extrabold text-[#102033]">
                    {order.userInfo?.name || "N/A"}
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div className="rounded-[16px] border border-[#e6edf7] bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Phone Number
                    </p>

                    <h3 className="mt-2 text-[15px] font-bold text-[#102033]">
                      {order.userInfo?.phone || "N/A"}
                    </h3>
                  </div>

                  <div className="rounded-[16px] border border-[#e6edf7] bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Email Address
                    </p>

                    <h3 className="mt-2 break-all text-[15px] font-bold text-[#102033]">
                      {order.userInfo?.email || "N/A"}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div className="rounded-[16px] border border-[#e6edf7] bg-[#f8fbff] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Company Name
                    </p>

                    <h3 className="mt-2 text-[15px] font-bold text-[#102033]">
                      {order.userInfo?.companyName || "N/A"}
                    </h3>
                  </div>

                  <div className="rounded-[16px] border border-[#e6edf7] bg-[#f8fbff] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      GST Number
                    </p>

                    <h3 className="mt-2 text-[15px] font-bold text-[#102033]">
                      {order.userInfo?.gstNumber || "N/A"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="overflow-hidden rounded-[24px] border border-[#dbe7f3] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] shadow-[0_12px_40px_rgba(15,23,42,0.06)]">

              {/* HEADER */}
              <div className="border-b border-[#e5edf7] px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#16a34a] to-[#22c55e] text-white shadow-lg">
                    📦
                  </div>

                  <div>
                    <h2 className="text-[18px] font-extrabold text-[#102033]">
                      Shipping Address
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-500">
                      delivery destination & location details
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div className="p-5">

                <div className="rounded-[18px] border border-[#dbe7f3] bg-white p-5 shadow-sm">

                  <div className="mb-4 flex items-center justify-between">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Delivery Address
                      </p>

                      <h3 className="mt-1 text-[15px] font-bold text-[#102033]">
                        Shipping Destination
                      </h3>
                    </div>

                    <div className="rounded-full bg-[#eff6ff] px-3 py-1 text-[10px] font-bold text-[#2563eb]">
                      VERIFIED
                    </div>
                  </div>

                  <div className="space-y-3 rounded-[16px] bg-[#f8fbff] p-4">

                    <p className="text-[15px] leading-7 text-slate-700">
                      {order.userInfo?.addressLine1}
                    </p>

                    {order.userInfo?.addressLine2 && (
                      <p className="text-[15px] leading-7 text-slate-700">
                        {order.userInfo.addressLine2}
                      </p>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">

                      <div className="rounded-[14px] bg-white p-3">
                        <p className="text-[10px] font-bold uppercase text-slate-500">
                          City / State
                        </p>

                        <h4 className="mt-1 text-[14px] font-bold text-[#102033]">
                          {order.userInfo?.city}, {order.userInfo?.state}
                        </h4>
                      </div>

                      <div className="rounded-[14px] bg-white p-3">
                        <p className="text-[10px] font-bold uppercase text-slate-500">
                          Country / Pincode
                        </p>

                        <h4 className="mt-1 text-[14px] font-bold text-[#102033]">
                          {order.userInfo?.country || "India"} -{" "}
                          {order.userInfo?.pincode}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="overflow-hidden rounded-[30px] border border-[#dbe7f3] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">

            {/* HEADER */}
            <div className="border-b border-[#e5edf7] px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#2563eb] to-[#3b82f6] text-white shadow-lg">
                  💳
                </div>

                <div>
                  <h2 className="text-[22px] font-extrabold tracking-tight text-[#102033]">
                    Payment Summary
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    order payment breakdown & total amount
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-6">

              <div className="rounded-[24px] border border-[#dbe7f3] bg-white p-5 shadow-sm">

                <div className="space-y-4">

                  {/* SUBTOTAL */}
                  <div className="flex items-center justify-between rounded-[18px] border border-[#edf2f7] bg-[#f8fbff] px-5 py-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#eff6ff] text-2xl">
                        📄
                      </div>

                      <div>
                        <p className="text-[18px] font-bold text-[#102033]">
                          Subtotal
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          products total before tax
                        </p>
                      </div>
                    </div>

                    <div className="text-right">

                      <p className="text-[28px] font-extrabold text-[#102033]">
                        {money(selectedSubtotal)}
                      </p>
                    </div>
                  </div>

                  {/* GST */}
                  <div className="flex items-center justify-between rounded-[18px] border border-[#edf2f7] bg-white px-5 py-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#fff7ed] text-2xl">
                        %
                      </div>

                      <div>
                        <p className="text-[18px] font-bold text-[#102033]">
                          GST / Tax
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          18% government tax included
                        </p>
                      </div>
                    </div>

                    <div className="text-right">

                      <p className="text-[28px] font-extrabold text-[#ea580c]">
                        {money(selectedTax)}
                      </p>
                    </div>
                  </div>

                  {/* SHIPPING */}
                  <div className="flex items-center justify-between rounded-[18px] border border-[#edf2f7] bg-white px-5 py-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#ecfdf5] text-2xl">
                        🚚
                      </div>

                      <div>
                        <p className="text-[18px] font-bold text-[#102033]">
                          Shipping
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          delivery & logistics charges
                        </p>
                      </div>
                    </div>

                    <div className="text-right">

                      <p className="text-[28px] font-extrabold text-[#16a34a]">
                        {money(selectedShipping)}
                      </p>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="mt-6 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#16a34a] to-[#22c55e] shadow-[0_15px_40px_rgba(34,197,94,0.35)]">

                    <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white/20 text-3xl text-white backdrop-blur-sm">
                          💰
                        </div>

                        <div>
                          <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-white/80">
                            Total Amount
                          </p>

                          <h3 className="mt-2 text-[32px] font-extrabold text-white">
                            {money(selectedTotal)}
                          </h3>

                          <p className="mt-2 text-sm text-white/80">
                            inclusive of all taxes & charges
                          </p>
                        </div>
                      </div>

                      <div className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm">
                        FINAL PAYABLE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5">

          {/* FULFILLMENT */}
          <div className="overflow-hidden rounded-[32px] border border-[#d8e6f5] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] shadow-[0_15px_50px_rgba(15,23,42,0.08)]">

            {/* HEADER */}
            <div className="border-b border-[#e2ecf5] px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2454b5] to-[#3b82f6] text-white shadow-lg">
                  <Package size={28} />
                </div>

                <div>
                  <h2 className="text-[20px] font-extrabold tracking-tight text-[#102033]">
                    Fulfillment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    manage shipping, tracking & order flow
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="space-y-5 p-6">

              {/* ORDER STATUS */}
              <div className="rounded-[14px] border border-[#dbe7f3] bg-white p-5 shadow-sm">

                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Order Status
                    </p>

                    <h3 className="mt-1 text-[15px] font-extrabold text-[#102033]">
                      {form.status}
                    </h3>
                  </div>

                  <div className="rounded-full bg-[#ecfdf3] px-3 py-1.5 text-[10px] font-bold text-[#15803d]">
                    ACTIVE
                  </div>
                </div>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      status: e.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-[#d8e3f0] bg-[#f8fbff] px-4 text-[15px] font-semibold text-[#102033] outline-none transition focus:border-[#2454b5] focus:ring-4 focus:ring-[#2454b520]"
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* PAYMENT STATUS */}
              <div className="rounded-[14px] border border-[#dbe7f3] bg-white p-5 shadow-sm">

                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Payment Status
                    </p>

                    <h3 className="mt-1 text-[15px] font-extrabold text-[#102033]">
                      {form.paymentStatus}
                    </h3>
                  </div>

                  <div className="rounded-full bg-[#eff6ff] px-3 py-1.5 text-[10px] font-bold text-[#1d4ed8]">
                    VERIFIED
                  </div>
                </div>

                <select
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      paymentStatus: e.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-[#d8e3f0] bg-[#f8fbff] px-4 text-[15px] font-semibold text-[#102033] outline-none transition focus:border-[#2454b5] focus:ring-4 focus:ring-[#2454b520]"
                >
                  {paymentStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* SHIPPING DETAILS */}
              <div className="rounded-[14px] border border-[#dbe7f3] bg-white p-5 shadow-sm">

                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Shipping Information
                  </p>

                  <h3 className="mt-1 text-[15px] font-extrabold text-[#102033]">
                    Courier & Tracking
                  </h3>
                </div>

                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Courier Partner
                    </label>

                    <input
                      value={form.courier}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          courier: e.target.value,
                        }))
                      }
                      className="h-14 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-[15px] font-semibold text-[#102033] outline-none transition focus:border-[#2454b5] focus:ring-4 focus:ring-[#2454b520]"
                      placeholder="Delhivery / DTDC / BlueDart"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Tracking ID
                    </label>

                    <input
                      value={form.trackingId}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          trackingId: e.target.value,
                        }))
                      }
                      className="h-14 w-full rounded-2xl border border-[#d8e3f0] bg-[#f8fbff] px-4 text-[15px] font-semibold text-[#102033] outline-none transition focus:border-[#2454b5] focus:ring-4 focus:ring-[#2454b520]"
                      placeholder="Enter AWB / Tracking Number"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Tracking URL
                    </label>

                    <input
                      value={form.trackingUrl}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          trackingUrl: e.target.value,
                        }))
                      }
                      className="h-14 w-full rounded-2xl border border-[#d8e3f0] bg-[#f8fbff] px-4 text-[15px] font-semibold text-[#102033] outline-none transition focus:border-[#2454b5] focus:ring-4 focus:ring-[#2454b520]"
                      placeholder="https://tracking-link.com"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={saveOrder}
                disabled={saving}
                className="flex h-16 w-full items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-[#2454b5] to-[#3b82f6] text-[16px] font-extrabold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:scale-[1.01] disabled:opacity-60"
              >
                <Save size={20} />

                {saving ? "Saving Changes..." : "Save Fulfillment Changes"}
              </button>
            </div>
          </div>

          {/* RETURN / EXCHANGE DETAILS */}

          {(order?.returnRequest?.status !== "Not Requested" ||
            order?.exchange?.status !== "Not Requested") && (
              <div className="overflow-hidden rounded-[24px] border border-[#dbe7f3] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                <div className="border-b border-[#e5edf7] bg-gradient-to-r from-[#fff7ed] via-white to-[#eef6ff] px-5 py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                        Customer Request Evidence
                      </p>
                      <h2 className="mt-1 text-[20px] font-black text-[#102033]">
                        Return / Exchange Complete Details
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Reason, selected issue, description, refund details, uploaded proof and status history.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order?.returnRequest?.status !== "Not Requested" ? (
                        <StatusPill tone="orange" label={`Return: ${order.returnRequest.status}`} />
                      ) : null}

                      {order?.exchange?.status !== "Not Requested" ? (
                        <StatusPill tone="blue" label={`Exchange: ${order.exchange.status}`} />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  {order?.returnRequest?.status !== "Not Requested" ? (
                    <RequestPanel
                      title="Return Request"
                      tone="orange"
                      request={order.returnRequest}
                      product={
                        (order.products || []).find(
                          (item) => String(item._id) === String(order.returnRequest?.itemId)
                        ) || selectedItem
                      }
                      type="RETURN"
                    />
                  ) : null}

                  {order?.exchange?.status !== "Not Requested" ? (
                    <RequestPanel
                      title="Exchange Request"
                      tone="blue"
                      request={order.exchange}
                      product={
                        (order.products || []).find(
                          (item) => String(item._id) === String(order.exchange?.itemId)
                        ) || selectedItem
                      }
                      type="EXCHANGE"
                    />
                  ) : null}
                </div>
              </div>
            )}

          {/* PAYMENT VERIFICATION */}
          <div className="sticky top-5 overflow-hidden rounded-[32px] border border-[#d9e6f5] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] shadow-[0_15px_50px_rgba(15,23,42,0.08)]">

            {/* HEADER */}
            <div className="border-b border-[#e4edf7] px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#16a34a] to-[#22c55e] text-white shadow-lg">
                  💳
                </div>

                <div>
                  <h2 className="text-[20px] font-extrabold tracking-tight text-[#102033]">
                    Payment Verification
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    verify payment & transaction proof
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="space-y-5 p-6">

              {/* PAYMENT STATUS CARD */}
              <div className="rounded-[14px] border border-[#dcfce7] bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#15803d]">
                      Current Payment Status
                    </p>

                    <div className="mt-4 rounded-xl border bg-white p-4">
                      <p className="text-xs font-bold text-slate-500">
                        Razorpay Order ID
                      </p>

                      <p className="mt-1 break-all font-bold text-[#102033]">
                        {order?.payment?.razorpayOrderId || "-"}
                      </p>
                    </div>

                    <div className="mt-3 rounded-xl border bg-white p-4">
                      <p className="text-xs font-bold text-slate-500">
                        Razorpay Payment ID
                      </p>

                      <p className="mt-1 break-all font-bold text-[#102033]">
                        {order?.payment?.razorpayPaymentId || "-"}
                      </p>
                    </div>

                    <h3 className="mt-2 text-[20px] font-extrabold text-[#166534]">
                      {order?.payment?.status || "Pending"}
                    </h3>

                    <p className="mt-2 text-sm text-[#15803d]">
                      payment successfully verified by admin
                    </p>
                  </div>

                  <div className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#16a34a] shadow-sm">
                    VERIFIED
                  </div>
                </div>
              </div>

              {/* INFO GRID */}
              <div className="grid gap-3">

                <div className="rounded-[14px] border border-[#dbe7f3] bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Payment Method
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-[#102033]">
                      {order?.payment?.method || "-"}
                    </h3>

                    <div className="rounded-full bg-[#eff6ff] px-3 py-1 text-[10px] font-bold text-[#2563eb]">
                      ONLINE
                    </div>
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#dbe7f3] bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Transaction ID
                  </p>

                  <h3 className="mt-3 break-all text-[15px] font-extrabold text-[#102033]">
                    {order?.payment?.proof?.utr ||
                      order?.payment?.transactionId ||
                      "-"}
                  </h3>
                </div>

                <div className="rounded-[14px] border border-[#dbe7f3] bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Customer Note
                  </p>

                  <p className="mt-3 text-[15px] leading-7 text-slate-700">
                    {order?.payment?.proof?.note || "No customer note provided"}
                  </p>
                </div>
              </div>

              {/* PAYMENT PROOF */}
              <div className="overflow-hidden rounded-[30px] border border-[#dbe7f3] bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-[#edf2f7] px-3 py-2.5">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Payment Screenshot
                    </p>

                    <h3 className="mt-1 text-[15px] font-extrabold text-[#102033]">
                      Uploaded Proof
                    </h3>
                  </div>

                  <div className="rounded-full bg-[#eff6ff] px-3 py-1 text-[10px] font-bold text-[#2563eb]">
                    ATTACHED
                  </div>
                </div>

                {order?.payment?.proof?.image ? (
                  <a
                    href={resolveImage(order.payment.proof.image)}
                    target="_blank"
                    className="block p-5"
                  >
                    <div className="overflow-hidden rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff]">

                      <img
                        src={resolveImage(order.payment.proof.image)}
                        alt="Payment proof"
                        className="h-[320px] w-full object-contain"
                      />

                      <div className="border-t border-[#e5edf5] bg-white px-3 py-2.5">

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-[10px] font-bold text-[#102033]">
                              View Original Screenshot
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                              click to open full image
                            </p>
                          </div>

                          <div className="rounded-[14px] bg-[#2454b5] px-5 py-3 text-[10px] font-bold text-white shadow-lg">
                            Open Proof
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f5f9] text-4xl">
                      📄
                    </div>

                    <h3 className="mt-4 text-[15px] font-extrabold text-[#102033]">
                      No Payment Proof Uploaded
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      customer has not uploaded any screenshot
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => updatePaymentVerification("Paid")}
                  disabled={saving}
                  className="flex h-16 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-[15px] font-extrabold text-white shadow-[0_10px_25px_rgba(34,197,94,0.35)] transition hover:scale-[1.01] disabled:opacity-60"
                >
                  ✓ Verify Payment
                </button>

                <button
                  type="button"
                  onClick={() => updatePaymentVerification("Failed")}
                  disabled={saving}
                  className="flex h-16 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-[15px] font-extrabold text-white shadow-[0_10px_25px_rgba(239,68,68,0.35)] transition hover:scale-[1.01] disabled:opacity-60"
                >
                  ✕ Reject Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-[14px] border border-[#edf2f7] bg-white p-3">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-[#102033]">{value}</p>
    </div>
  );
}

function Summary({ label, value, strong }) {
  return (
    <div
      className={`flex justify-between border-b py-2 ${strong
        ? "text-base font-bold text-[#102033]"
        : "text-slate-600"
        }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StatusPill({ label, tone = "slate" }) {
  const toneClass = {
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-green-200 bg-green-50 text-green-700",
    red: "border-red-200 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black ${toneClass[tone] || toneClass.slate}`}
    >
      {label || "-"}
    </span>
  );
}

function DetailBox({ label, value, children }) {
  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-[#f8fbff] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      {children || (
        <p className="mt-2 break-words text-sm font-black text-[#102033]">
          {value || "-"}
        </p>
      )}
    </div>
  );
}

function RequestPanel({ title, tone, request, product, type }) {
  const isReturn = type === "RETURN";
  const photos = request?.evidence?.photos || request?.photos || [];
  console.log("REQUEST =", request);
console.log("PHOTOS =", photos);
  const videos = request?.evidence?.videos || request?.videos || [];
  const refund = request?.refundPreference || {};
  const history = request?.history || [];
  const toneText = tone === "orange" ? "text-orange-600" : "text-blue-600";
  const toneBorder = tone === "orange" ? "border-orange-200" : "border-blue-200";
  const toneBg = tone === "orange" ? "bg-orange-50" : "bg-blue-50";

  return (
    <section className={`overflow-hidden rounded-[20px] border ${toneBorder} bg-white`}>
      <div className={`border-b ${toneBorder} ${toneBg} px-5 py-4`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className={`text-lg font-black ${toneText}`}>{title}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Submitted data visible for admin review.
            </p>
          </div>

          <StatusPill
            tone={tone}
            label={request?.status || "Not Requested"}
          />
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Product
            </p>

            <div className="mt-3 flex gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-2">
                {product?.img ? (
                  <img
                    src={resolveImage(product.img)}
                    alt={product?.name || "Product"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Package size={28} className="text-slate-400" />
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-black text-[#102033]">
                  {product?.name || "Product not found"}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusPill label={`SKU: ${product?.sku || "-"}`} />
                  <StatusPill label={`Qty: ${product?.quantity || 1}`} />
                  <StatusPill label={`Amount: ${money(product?.lineTotal || product?.price || 0)}`} tone="green" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailBox label="Requested At" value={formatRequestDate(request?.requestedAt)} />
            <DetailBox label="Last Updated" value={formatRequestDate(request?.updatedAt)} />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <DetailBox label="Main Reason" value={request?.reasonTitle} />
          <DetailBox label="Selected Issue / Sub Reason" value={request?.subReason} />
          <DetailBox label="Admin Review Note" value={request?.adminReview?.reviewNote || request?.adminRemark} />
        </div>

        <DetailBox label="Customer Description">
          <p className="mt-2 whitespace-pre-wrap rounded-[12px] bg-white p-3 text-sm font-semibold leading-6 text-slate-700">
            {request?.description || request?.comment || "-"}
          </p>
        </DetailBox>

        {request?.customerMessage ? (
          <DetailBox label="Message Sent To Customer">
            <p className="mt-2 whitespace-pre-wrap rounded-[12px] border border-green-200 bg-green-50 p-3 text-sm font-bold leading-6 text-green-800">
              {request.customerMessage}
            </p>
          </DetailBox>
        ) : null}

        {request?.invalidFields?.length ? (
          <DetailBox label="Fields Marked Wrong By Admin">
            <div className="mt-2 flex flex-wrap gap-2">
              {request.invalidFields.map((field) => (
                <StatusPill key={field} tone="red" label={field} />
              ))}
            </div>
          </DetailBox>
        ) : null}

        {isReturn ? (
          <RefundPreferenceBlock refund={refund} />
        ) : (
          <ExchangeLogisticsBlock request={request} />
        )}

        <EvidenceBlock photos={photos} videos={videos} title={`${title} Uploaded Evidence`} />

        <HistoryBlock history={history} />
      </div>
    </section>
  );
}

function RefundPreferenceBlock({ refund }) {
  return (
    <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
            Refund Preference
          </p>
          <h4 className="mt-1 text-lg font-black text-emerald-800">
            {refund?.method || "-"}
          </h4>
        </div>
        {refund?.method === "WALLET" ? (
          <StatusPill tone="green" label={`Wallet Validity: ${refund.walletValidityMonths || 12} months`} />
        ) : null}
      </div>

      {refund?.method === "BANK" ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <DetailBox label="Account Holder" value={refund.accountHolder} />
          <DetailBox label="Bank Name" value={refund.bankName} />
          <DetailBox label="Account Number" value={refund.accountNumber} />
          <DetailBox label="IFSC" value={refund.ifsc} />
          <DetailBox label="UPI Optional" value={refund.upi} />
        </div>
      ) : null}

      {refund?.method === "WALLET" ? (
        <p className="mt-3 rounded-[12px] border border-emerald-200 bg-white p-3 text-sm font-bold text-emerald-800">
          Customer selected Royal Trading Wallet. Refund will be credited to wallet after approval.
        </p>
      ) : null}
    </div>
  );
}

function ExchangeLogisticsBlock({ request }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DetailBox label="Replacement SKU" value={request?.replacementSku} />
      <DetailBox label="Replacement Product" value={request?.replacementProductName} />

      <DetailBox label="Pickup Address">
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
          {[
            request?.pickupAddress?.name,
            request?.pickupAddress?.phone,
            request?.pickupAddress?.addressLine1,
            request?.pickupAddress?.addressLine2,
            request?.pickupAddress?.city,
            request?.pickupAddress?.state,
            request?.pickupAddress?.pincode,
          ]
            .filter(Boolean)
            .join(", ") || "-"}
        </p>
      </DetailBox>

      <DetailBox label="Pickup Shipment">
        <ShipmentText shipment={request?.pickupShipment} />
      </DetailBox>

      <DetailBox label="Replacement Shipment">
        <ShipmentText shipment={request?.replacementShipment} />
      </DetailBox>
    </div>
  );
}

function ShipmentText({ shipment }) {
  return (
    <div className="mt-2 space-y-1 text-sm font-semibold text-slate-700">
      <p>Courier: {shipment?.courier || "-"}</p>
      <p>Tracking ID: {shipment?.trackingId || "-"}</p>
      {shipment?.trackingUrl ? (
        <a
          href={shipment.trackingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-black text-[#2454b5]"
        >
          Open Tracking <ExternalLink size={14} />
        </a>
      ) : (
        <p>Tracking URL: -</p>
      )}
    </div>
  );
}

function EvidenceBlock({ photos = [], videos = [], title }) {
  return (
    <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            {title}
          </p>
          <h4 className="mt-1 text-base font-black text-[#102033]">
            {photos.length} Photos | {videos.length} Videos
          </h4>
        </div>
      </div>

      {photos.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo, index) => (
            <a
              key={`${photo}-${index}`}
              href={resolveImage(photo)}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff]"
            >
              <img
                src={resolveImage(photo)}
                alt={`Evidence ${index + 1}`}
                className="h-36 w-full object-cover transition group-hover:scale-105"
              />
              <div className="border-t bg-white px-3 py-2 text-xs font-black text-[#2454b5]">
                View Photo {index + 1}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-[12px] bg-slate-50 p-3 text-sm font-bold text-slate-500">
          No photos uploaded.
        </p>
      )}

      {videos.length ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {videos.map((video, index) => (
            <div key={`${video}-${index}`} className="rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-3">
              <video controls className="w-full rounded-[12px] border bg-black">
                <source src={resolveImage(video)} />
              </video>
              <a
                href={resolveImage(video)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#2454b5]"
              >
                Open Video {index + 1} <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HistoryBlock({ history = [] }) {
  return (
    <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
        Status History
      </p>

      {history.length ? (
        <div className="mt-4 space-y-3">
          {history.map((entry, index) => (
            <div
              key={`${entry.status}-${index}`}
              className="rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-black text-[#102033]">{entry.status || "-"}</p>
                <StatusPill label={entry.by || "System"} />
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                {entry.message || "-"}
              </p>
              <p className="mt-2 text-xs font-black text-slate-400">
                {formatRequestDate(entry.date)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-[12px] bg-slate-50 p-3 text-sm font-bold text-slate-500">
          No history available.
        </p>
      )}
    </div>
  );
}

function formatRequestDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
