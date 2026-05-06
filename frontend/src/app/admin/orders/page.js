"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCcw, Search, Save } from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

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
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [changes, setChanges] = useState({});

  const loadOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        search,
        status,
      });

      const data = await adminRequest(`/api/admin/orders?${params}`);

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
    loadOrders();
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

      await adminRequest("/api/admin/orders/status", {
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
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold hover:bg-slate-50"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
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

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1350px] w-full text-left text-sm">
              <thead className="bg-[#f3f7fb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Payment</th>
                  <th className="px-4 py-4">Courier</th>
                  <th className="px-4 py-4">Tracking ID</th>
                  <th className="px-4 py-4">Tracking URL</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((order) => {
                  const orderId = getOrderId(order);
                  const hasChanges = Boolean(changes[orderId]);

                  return (
                    <tr
                      key={orderId}
                      className={hasChanges ? "bg-blue-50/40" : "hover:bg-slate-50"}
                    >
                      <td className="px-4 py-4">
                        <p className="font-bold text-[#102033]">
                          {order.orderNumber || orderId}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("en-IN")
                            : ""}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold">
                          {order.userInfo?.name || order.customer || "Customer"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.userInfo?.phone || order.phone || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold">
                          ₹{" "}
                          {Number(order.finalAmount || order.total || 0).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                        <p className="text-xs text-slate-500">
                          Items:{" "}
                          {order.pricing?.itemCount || order.products?.length || 0}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={getValue(order, "status")}
                          onChange={(e) =>
                            updateChange(orderId, "status", e.target.value)
                          }
                          className="input w-[160px]"
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={getValue(order, "paymentStatus", "Pending")}
                          onChange={(e) =>
                            updateChange(orderId, "paymentStatus", e.target.value)
                          }
                          className="input w-[120px]"
                        >
                          {paymentStatuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <input
                          value={getValue(order, "courier")}
                          onChange={(e) =>
                            updateChange(orderId, "courier", e.target.value)
                          }
                          className="input w-[140px]"
                          placeholder="Delhivery"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          value={getValue(order, "trackingId")}
                          onChange={(e) =>
                            updateChange(orderId, "trackingId", e.target.value)
                          }
                          className="input w-[150px]"
                          placeholder="AWB / Tracking"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          value={getValue(order, "trackingUrl")}
                          onChange={(e) =>
                            updateChange(orderId, "trackingUrl", e.target.value)
                          }
                          className="input w-[220px]"
                          placeholder="https://..."
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/orders/${orderId}`}
                            className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => saveOrder(order)}
                            disabled={!hasChanges || savingId === orderId}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#2454b5] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            <Save size={14} />
                            {savingId === orderId ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

          <p className="text-sm text-slate-500">
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