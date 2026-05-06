"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Package, Save } from "lucide-react";
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

  const [form, setForm] = useState({
    status: "Order Placed",
    paymentStatus: "Pending",
    courier: "",
    trackingId: "",
    trackingUrl: "",

    name: "",
    phone: "",
    alternatePhone: "",
    email: "",
    companyName: "",
    gstNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
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

          name: found.userInfo?.name || "",
          phone: found.userInfo?.phone || "",
          alternatePhone: found.userInfo?.alternatePhone || "",
          email: found.userInfo?.email || "",
          companyName: found.userInfo?.companyName || "",
          gstNumber: found.userInfo?.gstNumber || "",
          addressLine1: found.userInfo?.addressLine1 || "",
          addressLine2: found.userInfo?.addressLine2 || "",
          city: found.userInfo?.city || "",
          state: found.userInfo?.state || "",
          pincode: found.userInfo?.pincode || "",
          country: found.userInfo?.country || "India",
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

  const canEditAddress = ![
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ].includes(order?.status || order?.orderStatus);

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

  const saveAddress = async () => {
    try {
      setSaving(true);

      await adminRequest("/api/admin/orders/address", {
        method: "PUT",
        body: JSON.stringify({
          orderId: id,
          name: form.name,
          phone: form.phone,
          alternatePhone: form.alternatePhone,
          email: form.email,
          companyName: form.companyName,
          gstNumber: form.gstNumber,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
        }),
      });

      toast.success("Delivery address updated");
      await loadOrder();
    } catch (error) {
      toast.error(error.message || "Address update failed");
    } finally {
      setSaving(false);
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
          {saving ? "Saving..." : "Save Fulfillment"}
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
                      Brand: {item.brand || "Generic"} | SKU:{" "}
                      {item.sku || "N/A"} | MPN: {item.mpn || "N/A"}
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
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
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

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#102033]">
                  Delivery Address
                </h2>
                <p className="text-xs text-slate-500">
                  User panel se address change hoga to updated address yahin
                  dikhega.
                </p>
              </div>

              <button
                type="button"
                onClick={saveAddress}
                disabled={saving || !canEditAddress}
                className="rounded-xl bg-[#2454b5] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                Save Address
              </button>
            </div>

            {!canEditAddress && (
              <div className="mb-4 rounded-xl bg-yellow-50 p-3 text-xs font-semibold text-yellow-800">
                Address cannot be changed after order is{" "}
                {order.status || order.orderStatus}.
              </div>
            )}

            <div className="space-y-3">
              <Field label="Customer Name">
                <input
                  className="input"
                  disabled={!canEditAddress}
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </Field>

              <Field label="Phone">
                <input
                  className="input"
                  disabled={!canEditAddress}
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </Field>

              <Field label="Alternate Phone">
                <input
                  className="input"
                  disabled={!canEditAddress}
                  value={form.alternatePhone}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      alternatePhone: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Email">
                <input
                  className="input"
                  disabled={!canEditAddress}
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </Field>

              <Field label="Company Name">
                <input
                  className="input"
                  disabled={!canEditAddress}
                  value={form.companyName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, companyName: e.target.value }))
                  }
                />
              </Field>

              <Field label="GST Number">
                <input
                  className="input"
                  disabled={!canEditAddress}
                  value={form.gstNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, gstNumber: e.target.value }))
                  }
                />
              </Field>

              <Field label="Address Line 1">
                <textarea
                  className="input min-h-[80px]"
                  disabled={!canEditAddress}
                  value={form.addressLine1}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, addressLine1: e.target.value }))
                  }
                />
              </Field>

              <Field label="Address Line 2">
                <input
                  className="input"
                  disabled={!canEditAddress}
                  value={form.addressLine2}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, addressLine2: e.target.value }))
                  }
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="City">
                  <input
                    className="input"
                    disabled={!canEditAddress}
                    value={form.city}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, city: e.target.value }))
                    }
                  />
                </Field>

                <Field label="State">
                  <input
                    className="input"
                    disabled={!canEditAddress}
                    value={form.state}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, state: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Pincode">
                  <input
                    className="input"
                    disabled={!canEditAddress}
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, pincode: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Country">
                  <input
                    className="input"
                    disabled={!canEditAddress}
                    value={form.country}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, country: e.target.value }))
                    }
                  />
                </Field>
              </div>
            </div>
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
        .input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          color: #64748b;
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
      className={`flex justify-between border-b py-2 ${
        strong ? "text-base font-bold text-[#102033]" : "text-slate-600"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}