"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  RefreshCcw,
  Search,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";
import { useSearchParams } from "next/navigation";

const statuses = [
  {
    label: "ORDER STATUS",
    options: [
      "Order Placed",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
  },

  {
    label: "RETURN",
    options: [
      "Return Requested",
      "Return Approved",
      "Return Rejected",
      "Pickup Scheduled",
      "Picked Up",
      "Quality Checking",
      "Refund Approved",
      "Return Completed",
    ],
  },

  {
    label: "EXCHANGE",
    options: [
      "Exchange Requested",
      "Exchange Approved",
      "Exchange Rejected",
      "Replacement Packed",
      "Replacement Shipped",
      "Exchange Completed",
    ],
  },

  {
    label: "REFUND",
    options: [
      "Refund Requested",
      "Refund Approved",
      "Refund Processing",
      "Refunded",
    ],
  },
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

const getOrderId = (order) => order?._id || order?.id;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("");

  useEffect(() => {
    const urlStatus = searchParams.get("status") || "";
    setStatus(urlStatus);
  }, [searchParams]);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [changes, setChanges] = useState({});

  const displayOrders = orders.flatMap((order) =>
    (order.products || []).map((product) => ({
      ...order,
      product,
      itemId: product._id,
    })),
  );

  const loadOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", "15");

      if (search) {
        params.append("search", search);
      }

      if (status) {
        params.append("status", status);
      }

      const data = await adminRequest(`/api/orders/admin/all?${params}`);
      console.log(data.orders[0]); // ADD THIS

      setOrders(data.orders || []);
      setPages(data.pages || 1);
      setChanges({});
    } catch (error) {
      toast.error(error.message || "Orders load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== null) {
      loadOrders();
    }
  }, [page, search, status]);

  const updateChange = (orderId, key, value) => {
    setChanges((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [key]: value,
      },
    }));
  };

  const getValue = (order, key, fallback = "") => {
    const orderId = getOrderId(order);

    if (changes[orderId]?.[key] !== undefined) {
      return changes[orderId][key];
    }

    if (key === "status") return order.status || order.orderStatus || fallback;
    if (key === "trackingId") return order.shipment?.trackingId || fallback;
    if (key === "courier") return order.shipment?.courier || fallback;
    if (key === "trackingUrl") return order.shipment?.trackingUrl || fallback;
    if (key === "paymentStatus") return order.payment?.status || fallback;

    return fallback;
  };

  const saveOrder = async (order) => {
    const orderId = getOrderId(order);
    const payload = changes[orderId];

    if (!orderId) {
      toast.error("Order ID missing");
      return;
    }

    if (!payload || Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      setSavingId(orderId);

      const finalPayload = {
        orderId,

        itemId: order.itemId, // ADD THIS LINE

        status:
          payload.status ||
          order.product?.itemStatus ||
          order.status ||
          order.orderStatus ||
          "Order Placed",

        paymentStatus:
          payload.paymentStatus || order.payment?.status || "Pending",

        courier:
          payload.courier !== undefined
            ? payload.courier
            : order.shipment?.courier || "",

        trackingId:
          payload.trackingId !== undefined
            ? payload.trackingId
            : order.shipment?.trackingId || "",

        trackingUrl:
          payload.trackingUrl !== undefined
            ? payload.trackingUrl
            : order.shipment?.trackingUrl || "",
      };

      await adminRequest("/api/orders/admin/update-status", {
        method: "PUT",
        body: JSON.stringify(finalPayload),
      });

      toast.success("Order updated successfully");
      await loadOrders();
    } catch (error) {
      toast.error(error.message || "Order update failed");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Orders</h1>
          <p className="text-sm text-slate-500">
            Manage order status, shipment tracking and payment status.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-[#ffffff] px-4 py-3 text-sm font-bold hover:bg-slate-50"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border bg-[#ffffff] p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search order no, customer, phone, product, SKU..."
              className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
            />
          </div>

       <select
  value={status}
  onChange={(e) => {
    setPage(1);
    setStatus(e.target.value);
  }}
  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
>
  <option value="">All Status</option>

  {statuses.map((group) => (
    <optgroup
      key={group.label}
      label={group.label}
    >
      {group.options.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </optgroup>
  ))}
</select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-[#ffffff] shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No orders found.</div>
        ) : (
          <div className="space-y-5 p-6 bg-slate-50">
            {displayOrders.map((order) => {
              const orderId = getOrderId(order);

              const rowKey = `${orderId}-${order.itemId}`;

              const hasChanges = Boolean(changes[orderId]);

              return (
                <div
                  key={rowKey}
                  className={`rounded-[28px] border border-[#dbe5f0] bg-[#ffffff] p-6 shadow-[0_12px_40px_rgba(2,6,23,0.08)] transition-all hover:shadow-[0_10px_40px_rgba(15,23,42,0.08)] ${hasChanges
                    ? "border-blue-300 ring-2 ring-blue-100"
                    : "border-slate-200"
                    }`}
                >
                  {/* TOP */}
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    {/* LEFT */}
                    <div className="flex-1 space-y-4 min-w-0">
                      <div>
                        <h2 className="text-lg font-bold text-[#091524]">
                          {order.orderNumber || orderId}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("en-IN")
                            : ""}
                        </p>
                      </div>

                      <div className="space-y-5">
                        {/* PRODUCT */}

                        <div className="min-h-[180px] rounded-[22px] border border-slate-200 bg-white shadow-sm p-6 lg:col-span-2">
                          {" "}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Package size={18} className="text-purple-600" />
                            </div>

                            <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                              Product Details
                            </p>
                          </div>
                          <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-8">
                              <div className="relative h-40 w-40 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shrink-0 shadow-sm">
                                {" "}
                                <div className="absolute left-2 top-2 rounded-full bg-[#2454b5] px-2 py-1 text-[10px] font-bold text-white">
                                  #1
                                </div>
                                {order.product?.img ? (
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${order.product.img}`}
                                    alt={order.product?.name}
                                    className="h-full w-full object-contain scale-110"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px]">
                                    No Image
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-[20px] font-extrabold leading-tight text-[#102033] break-words">
                                  {order.product?.name || "Product"}
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    SKU: {order.product?.sku || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                                  Quantity
                                </p>

                                <p className="mt-2 text-2xl font-bold text-[#102033]">
                                  {order.product?.quantity || 1}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                                  Unit Price
                                </p>

                                <p className="mt-2 text-2xl font-bold text-[#102033]">
                                  ₹{order.product?.price || 0}
                                </p>
                              </div>

                              <div className="rounded-2xl bg-gradient-to-br from-[#2454b5] to-[#3b82f6] p-4 text-white">
                                <p className="text-[11px] uppercase tracking-wider text-blue-100">
                                  Total Amount
                                </p>

                                <p className="mt-2 text-2xl font-extrabold">
                                  ₹
                                  {Number(
                                    order.product?.lineTotal || 0,
                                  ).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="min-h-[180px] rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">
                          {" "}
                          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                              <User size={22} className="text-blue-600" />
                            </div>

                            <div>
                              <h3 className="font-bold text-[#102033]">
                                Customer Details
                              </h3>

                              <p className="text-xs text-slate-500">
                                Delivery Information
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3">
                              <User size={16} className="text-blue-600" />

                              <span className="font-semibold">
                                {order.userInfo?.name || "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <Phone size={16} className="text-green-600" />

                              <span>{order.userInfo?.phone || "N/A"}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <Mail size={16} className="text-red-500" />

                              <span>{order.userInfo?.email || "N/A"}</span>
                            </div>
                          </div>
                          <div className="border-t border-slate-100 pt-4">
                            {/* Address */}

                            <div className="rounded-2xl bg-slate-50 p-4">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                                  <MapPin
                                    size={18}
                                    className="text-orange-600"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="font-semibold text-[#102033]">
                                    Delivery Address
                                  </p>

                                  <p className="mt-1 text-sm text-slate-600 break-words">
                                    {order.userInfo?.addressLine1 || "N/A"}
                                  </p>

                                  {order.userInfo?.addressLine2 && (
                                    <p className="text-sm text-slate-500 break-words">
                                      {order.userInfo.addressLine2}
                                    </p>
                                  )}

                                  <p className="mt-2 text-sm text-slate-700">
                                    {order.userInfo?.city || "N/A"},{" "}
                                    {order.userInfo?.state || "N/A"} -{" "}
                                    {order.userInfo?.pincode || "N/A"}
                                  </p>

                                  <p className="text-sm text-slate-500">
                                    {order.userInfo?.country || "India"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Badges */}

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                {order.userInfo?.state || "N/A"}
                              </span>

                              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                                {order.userInfo?.pincode || "N/A"}
                              </span>

                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                {order.userInfo?.country || "India"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STATUS BOX */}
                    <div className="w-full xl:w-[320px] shrink-0">
                      <div className="rounded-[26px] border border-[#dbe5f0] bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#42526b]">
                          Order Status
                        </p>

                        <div className="mt-4 space-y-2">

                          {order.returnRequest?.status &&
                            order.returnRequest.status !== "Not Requested" && (
                              <div className="flex items-center justify-between rounded-xl bg-orange-50 border border-orange-200 px-3 py-2">
                                <span className="text-xs font-bold text-orange-700">
                                  Return Request
                                </span>

                                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                                  {order.returnRequest.status}
                                </span>
                              </div>
                            )}

                          {order.exchange?.status &&
                            order.exchange.status !== "Not Requested" && (
                              <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-200 px-3 py-2">
                                <span className="text-xs font-bold text-blue-700">
                                  Exchange Request
                                </span>

                                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                                  {order.exchange.status}
                                </span>
                              </div>
                            )}

                          {order.cancellation?.status && (
                            <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 px-3 py-2">
                              <span className="text-xs font-bold text-red-700">
                                Cancellation
                              </span>

                              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                                {order.cancellation.status}
                              </span>
                            </div>
                          )}

                          {order.refund?.status && (
                            <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                              <span className="text-xs font-bold text-emerald-700">
                                Refund
                              </span>

                              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                                {order.refund.status}
                              </span>
                            </div>
                          )}

                        </div>

                        <select
                          value={getValue(order, "status")}
                          onChange={(e) =>
                            updateChange(orderId, "status", e.target.value)
                          }
                          className="mt-3 w-full rounded-2xl border border-[#c9d5e2] bg-[#ffffff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                        >
                          {statuses.map((group) => (
                            <optgroup
                              key={group.label}
                              label={group.label}
                            >
                              {group.options.map((item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>

                        <div className="mt-4 grid gap-3">
                          <input
                            value={getValue(order, "courier")}
                            onChange={(e) =>
                              updateChange(orderId, "courier", e.target.value)
                            }
                            placeholder="Courier company"
                            className="rounded-2xl border border-[#c9d5e2] px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
                          />

                          <input
                            value={getValue(order, "trackingId")}
                            onChange={(e) =>
                              updateChange(
                                orderId,
                                "trackingId",
                                e.target.value,
                              )
                            }
                            placeholder="Tracking ID"
                            className="rounded-2xl border border-[#c9d5e2] px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
                          />

                          <input
                            value={getValue(order, "trackingUrl")}
                            onChange={(e) =>
                              updateChange(
                                orderId,
                                "trackingUrl",
                                e.target.value,
                              )
                            }
                            placeholder="Tracking URL"
                            className="rounded-2xl border border-[#c9d5e2] px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
                          />
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-5 flex gap-3">
                          <Link
                            href={`/admin/orders/${orderId}?itemId=${order.itemId}`}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c9d5e2] bg-[#ffffff] text-[#42526b] hover:bg-slate-100"
                          >
                            <Eye size={18} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => saveOrder(order)}
                            disabled={!hasChanges || savingId === orderId}
                            className="flex-1 rounded-2xl bg-[#2454b5] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] disabled:opacity-50"
                          >
                            {savingId === orderId
                              ? "Saving..."
                              : "Save Changes"}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 overflow-hidden rounded-[28px] border border-[#dbe7f3] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
                        <div className="border-b border-[#e5edf7] px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#16a34a] to-[#22c55e] text-white shadow-lg">
                              <IndianRupee size={20} />
                            </div>

                            <div>
                              <h2 className="text-[18px] font-extrabold text-[#102033]">
                                Payment Summary
                              </h2>

                              <p className="mt-1 text-[11px] text-slate-500">
                                order payment & verification
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="rounded-[18px] border border-[#dbe7f3] bg-white p-4">
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Quantity</span>
                                <span className="font-bold">
                                  {order.product?.quantity || 1}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Unit Price
                                </span>
                                <span className="font-bold">
                                  ₹{" "}
                                  {Number(
                                    order.product?.price || 0,
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>

                              <div className="rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-4">
                                <div className="mb-3 flex items-center justify-between">
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                      Payment Status
                                    </p>

                                    <h3 className="mt-1 text-[15px] font-extrabold text-[#102033]">
                                      {getValue(
                                        order,
                                        "paymentStatus",
                                        "Pending",
                                      )}
                                    </h3>
                                  </div>

                                  <div className="rounded-full bg-[#eff6ff] px-3 py-1 text-[10px] font-bold text-[#2563eb]">
                                    VERIFIED
                                  </div>
                                </div>

                                <select
                                  value={getValue(
                                    order,
                                    "paymentStatus",
                                    "Pending",
                                  )}
                                  onChange={(e) =>
                                    updateChange(
                                      orderId,
                                      "paymentStatus",
                                      e.target.value,
                                    )
                                  }
                                  className="h-12 w-full rounded-2xl border border-[#d8e3f0] bg-white px-4 text-[14px] font-semibold text-[#102033] outline-none focus:border-[#2454b5] focus:ring-4 focus:ring-[#2454b520]"
                                >
                                  {paymentStatuses.map((item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="border-t border-[#dbe7f3] pt-4 flex justify-between">
                                <span className="text-[16px] font-bold text-[#102033]">
                                  Total
                                </span>

                                <span className="text-[20px] font-extrabold text-[#2454b5]">
                                  ₹{" "}
                                  {Number(
                                    order.product?.lineTotal || 0,
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between border-t px-4 py-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>

          <p className="text-sm text-[#42526b]">
            Page <b>{page}</b> of <b>{pages}</b>
          </p>

          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <style jsx>{`
        .input {
          border-radius: 10px;
          border: 1px solid #d8e1ec;
          padding: 10px 12px;
          font-size: 13px;
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
