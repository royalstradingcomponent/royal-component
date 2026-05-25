"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCcw, Search, Save } from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";
import { useSearchParams } from "next/navigation";

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

      const data = await adminRequest(
        `/api/orders/admin/all?${params}`
      );

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
        status: payload.status || order.status || order.orderStatus || "Order Placed",
        paymentStatus: payload.paymentStatus || order.payment?.status || "Pending",
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

      await adminRequest(
        "/api/orders/admin/update-status",
        {
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
            <option value="Unfulfilled">Unfulfilled</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
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


          <div className="space-y-5 p-5 bg-[#eef4fb]">
            {orders.map((order) => {
              const orderId = getOrderId(order);
              const hasChanges = Boolean(changes[orderId]);

              return (
                <div
                  key={orderId}
                  className={`rounded-[28px] border border-[#dbe5f0] bg-[#ffffff] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_10px_40px_rgba(15,23,42,0.08)] ${hasChanges
                    ? "border-blue-300 ring-2 ring-blue-100"
                    : "border-slate-200"
                    }`}
                >
                  {/* TOP */}
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                    {/* LEFT */}
                    <div className="space-y-4">
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

                      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">

                        {/* CUSTOMER */}
                        <div className="rounded-[22px] border border-[#cfd9e5] bg-[#ffffff] p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Customer
                          </p>

                          <p className="mt-2 text-sm font-bold text-[#102033]">
                            {order.userInfo?.name || "Customer"}
                          </p>

                          <p className="mt-1 text-xs text-[#42526b]">
                            {order.userInfo?.phone || "N/A"}
                          </p>
                        </div>

                        {/* AMOUNT */}
                        <div className="rounded-[22px] border border-[#cfd9e5] bg-[#ffffff] p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#42526b]">
                            Total Amount
                          </p>

                          <p className="mt-2 text-lg font-bold text-[#2454b5]">
                            ₹{" "}
                            {Number(
                              order.finalAmount || order.total || 0
                            ).toLocaleString("en-IN")}
                          </p>

                          <p className="mt-1 text-xs text-[#42526b]">
                            Items:{" "}
                            {order.pricing?.itemCount ||
                              order.products?.length ||
                              0}
                          </p>
                        </div>

                        {/* PAYMENT */}
                        <div className="rounded-[22px] border border-[#cfd9e5] bg-[#ffffff] p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#42526b]">
                            Payment
                          </p>

                          <select
                            value={getValue(order, "paymentStatus", "Pending")}
                            onChange={(e) =>
                              updateChange(
                                orderId,
                                "paymentStatus",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-xl border border-[#c9d5e2] bg-[#ffffff] px-3 py-2 text-sm font-medium outline-none focus:border-[#2454b5]"
                          >
                            {paymentStatuses.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* STATUS BOX */}
                    <div className="w-full xl:w-[320px] shrink-0">
                      <div className="rounded-[26px] border border-[#dbe5f0] bg-[#f7faff] p-5">

                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#42526b]">
                          Order Status
                        </p>

                        <select
                          value={getValue(order, "status")}
                          onChange={(e) =>
                            updateChange(orderId, "status", e.target.value)
                          }
                          className="mt-3 w-full rounded-2xl border border-[#c9d5e2] bg-[#ffffff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
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
                              updateChange(orderId, "trackingId", e.target.value)
                            }
                            placeholder="Tracking ID"
                            className="rounded-2xl border border-[#c9d5e2] px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
                          />

                          <input
                            value={getValue(order, "trackingUrl")}
                            onChange={(e) =>
                              updateChange(orderId, "trackingUrl", e.target.value)
                            }
                            placeholder="Tracking URL"
                            className="rounded-2xl border border-[#c9d5e2] px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
                          />
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-5 flex gap-3">
                          <Link
                            href={`/admin/orders/${orderId}`}
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
                            {savingId === orderId ? "Saving..." : "Save Changes"}
                          </button>
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