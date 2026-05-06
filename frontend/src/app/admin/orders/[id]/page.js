"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Package,
  Save,
  RefreshCcw,
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
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
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

  const products = useMemo(() => order?.products || [], [order]);

  const saveOrder = async () => {
    try {
      setSaving(true);

      await adminRequest("/api/admin/orders/status", {
        method: "PUT",
        body: JSON.stringify({
          orderId: id,
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
          : "Payment marked as Failed"
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
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => router.push("/admin/orders")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#2454b5]"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <h1 className="text-2xl font-bold text-[#102033]">
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
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-[#102033]">
            Order Items
          </h2>

          <div className="space-y-4">
            {products.map((item, index) => (
              <div
                key={item._id || index}
                className="rounded-2xl border bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-white">
                    {item.img ? (
                      <img
                        src={resolveImage(item.img)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No Img
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#102033]">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Brand: {item.brand || "Generic"} | SKU: {item.sku || "N/A"} | MPN:{" "}
                      {item.mpn || "N/A"}
                    </p>

                    <div className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
                      <Info label="Qty" value={item.quantity} />
                      <Info label="Price" value={money(item.price)} />
                      <Info label="GST" value={money(item.gstAmount)} />
                      <Info label="Line Total" value={money(item.lineTotal)} />
                    </div>

                    <div className="mt-3 rounded-xl bg-white p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Item Status
                      </p>
                      <p className="mt-1 font-bold text-[#2454b5]">
                        {item.itemStatus || order.status}
                      </p>
                    </div>
                  </div>
                </div>

                {item.itemStatusHistory?.length ? (
                  <div className="mt-4 border-t pt-4">
                    <p className="mb-2 text-xs font-bold uppercase text-slate-500">
                      Item Timeline
                    </p>

                    <div className="space-y-2">
                      {[...item.itemStatusHistory].reverse().map((event, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-4 rounded-xl bg-white px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-bold">{event.status}</p>
                            <p className="text-xs text-slate-500">
                              {event.message || "-"}
                            </p>
                          </div>
                          <p className="whitespace-nowrap text-xs text-slate-500">
                            {event.date
                              ? new Date(event.date).toLocaleString("en-IN")
                              : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
              <Package size={20} />
              Fulfillment
            </h2>

            <div className="space-y-4">
              <Field label="Order Status">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value }))
                  }
                  className="input"
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Payment Status">
                <select
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, paymentStatus: e.target.value }))
                  }
                  className="input"
                >
                  {paymentStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Courier">
                <input
                  value={form.courier}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, courier: e.target.value }))
                  }
                  className="input"
                  placeholder="Delhivery / DTDC / Blue Dart"
                />
              </Field>

              <Field label="Tracking ID">
                <input
                  value={form.trackingId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, trackingId: e.target.value }))
                  }
                  className="input"
                  placeholder="AWB / Tracking ID"
                />
              </Field>

              <Field label="Tracking URL">
                <input
                  value={form.trackingUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, trackingUrl: e.target.value }))
                  }
                  className="input"
                  placeholder="https://..."
                />
              </Field>

              {form.trackingUrl ? (
                <a
                  href={form.trackingUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#2454b5]"
                >
                  Open Tracking
                  <ExternalLink size={15} />
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-[#bae6fd] bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
              Payment Verification
            </h2>

            <div className="space-y-3">
              <Info label="Payment Method" value={order?.payment?.method || "-"} />
              <Info label="Payment Status" value={order?.payment?.status || "-"} />
              <Info
                label="UTR / Transaction ID"
                value={
                  order?.payment?.proof?.utr ||
                  order?.payment?.transactionId ||
                  "-"
                }
              />
              <Info
                label="Customer Note"
                value={order?.payment?.proof?.note || "-"}
              />
            </div>

            {order?.payment?.proof?.image ? (
              <a
                href={resolveImage(order.payment.proof.image)}
                target="_blank"
                className="mt-4 block rounded-2xl border bg-[#f8fbff] p-3"
              >
                <img
                  src={resolveImage(order.payment.proof.image)}
                  alt="Payment proof"
                  className="h-44 w-full rounded-xl object-contain"
                />
                <p className="mt-2 text-center text-xs font-bold text-[#2454b5]">
                  Open Payment Proof
                </p>
              </a>
            ) : (
              <div className="mt-4 rounded-xl bg-[#f8fafc] p-4 text-sm text-slate-500">
                Customer ne abhi payment proof upload nahi kiya hai.
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => updatePaymentVerification("Paid")}
                disabled={saving}
                className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                Mark as Paid
              </button>

              <button
                type="button"
                onClick={() => updatePaymentVerification("Failed")}
                disabled={saving}
                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                Reject Payment
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#102033]">
              Customer
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>Name:</b> {order.userInfo?.name || "N/A"}
              </p>
              <p>
                <b>Phone:</b> {order.userInfo?.phone || "N/A"}
              </p>
              <p>
                <b>Email:</b> {order.userInfo?.email || "N/A"}
              </p>
              <p>
                <b>Company:</b> {order.userInfo?.companyName || "N/A"}
              </p>
              <p>
                <b>GST:</b> {order.userInfo?.gstNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#102033]">
              Shipping Address
            </h2>

            <p className="text-sm leading-6 text-slate-600">
              {order.userInfo?.addressLine1}
              {order.userInfo?.addressLine2 ? `, ${order.userInfo.addressLine2}` : ""}
              <br />
              {order.userInfo?.city}, {order.userInfo?.state} -{" "}
              {order.userInfo?.pincode}
              <br />
              {order.userInfo?.country || "India"}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#102033]">
              Payment Summary
            </h2>

            <div className="space-y-2 text-sm">
              <Summary label="Subtotal" value={money(order.pricing?.subtotal)} />
              <Summary label="Tax / GST" value={money(order.pricing?.tax)} />
              <Summary
                label="Shipping"
                value={money(order.pricing?.shippingCharge)}
              />
              <Summary
                label="Total"
                value={money(order.pricing?.totalAmount)}
                strong
              />
            </div>
          </div>
        </div>
      </div>



      <div className="rounded-2xl border border-[#bae6fd] bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
          <RefreshCcw size={20} className="text-[#0284c7]" />
          Refund Control
        </h2>

        {order?.refund?.status && order.refund.status !== "Not Requested" ? (
          <div className="space-y-4">
            <Info label="Current Refund Status" value={order.refund.status} />
            <Info label="Refund Method" value={order.refund.method || "-"} />
            <Info label="Refund Reason" value={order.refund.reason || "-"} />
            <Info label="Customer Comment" value={order.refund.comment || "-"} />

            {order.refund.method === "UPI" ? (
              <>
                <Info label="UPI ID" value={order.refund.upi?.upiId || "-"} />
                <Info label="UPI Phone" value={order.refund.upi?.phone || "-"} />
              </>
            ) : null}

            {order.refund.method === "BANK_ACCOUNT" ? (
              <>
                <Info
                  label="Account Holder"
                  value={order.refund.bank?.accountHolderName || "-"}
                />
                <Info
                  label="Account Number"
                  value={order.refund.bank?.accountNumber || "-"}
                />
                <Info label="IFSC" value={order.refund.bank?.ifsc || "-"} />
                <Info label="Bank Name" value={order.refund.bank?.bankName || "-"} />
              </>
            ) : null}

            {order.refund.method === "CARD" ? (
              <>
                <Info label="Card Last 4" value={order.refund.card?.last4 || "-"} />
                <Info
                  label="Transaction ID"
                  value={order.refund.card?.transactionId || "-"}
                />
              </>
            ) : null}

            <Field label="Admin Refund Status">
              <select
                value={refundForm.status}
                onChange={(e) =>
                  setRefundForm((p) => ({ ...p, status: e.target.value }))
                }
                className="input"
              >
                {refundStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Refund Amount">
              <input
                type="number"
                value={refundForm.amount}
                onChange={(e) =>
                  setRefundForm((p) => ({
                    ...p,
                    amount: Number(e.target.value),
                  }))
                }
                className="input"
              />
            </Field>

            <Field label="Refund Reference ID">
              <input
                value={refundForm.refundReferenceId}
                onChange={(e) =>
                  setRefundForm((p) => ({
                    ...p,
                    refundReferenceId: e.target.value,
                  }))
                }
                placeholder="Bank / UPI / gateway reference"
                className="input"
              />
            </Field>

            <Field label="Admin Note">
              <textarea
                rows={3}
                value={refundForm.adminNote}
                onChange={(e) =>
                  setRefundForm((p) => ({
                    ...p,
                    adminNote: e.target.value,
                  }))
                }
                className="input"
                placeholder="Write refund processing note..."
              />
            </Field>

            <button
              type="button"
              onClick={saveRefund}
              disabled={refundSaving}
              className="w-full rounded-xl bg-[#0284c7] px-5 py-3 text-sm font-bold text-white hover:bg-[#0369a1] disabled:opacity-60"
            >
              {refundSaving ? "Saving Refund..." : "Save Refund Status"}
            </button>
          </div>
        ) : (
          <div className="rounded-xl bg-[#f0f9ff] p-4 text-sm leading-6 text-[#075985]">
            Customer ne abhi refund request raise nahi ki hai.
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #d8e1ec;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
          background: white;
        }
        .input:focus {
          border-color: #2454b5;
          box-shadow: 0 0 0 3px rgba(36, 84, 181, 0.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-[#102033]">{value}</p>
    </div>
  );
}

function Summary({ label, value, strong }) {
  return (
    <div
      className={`flex justify-between border-b py-2 ${strong ? "text-base font-bold text-[#102033]" : "text-slate-600"
        }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}