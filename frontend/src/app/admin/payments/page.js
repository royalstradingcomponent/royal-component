"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCcw, Eye, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

const paymentStatuses = [
  "",
  "Pending",
  "Awaiting Verification",
  "Paid",
  "Failed",
  "Refund Pending",
  "Refund Processing",
  "Refunded",
];

function money(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: "1",
        limit: "100",
        search,
        status: "",
      });

      const data = await adminRequest(`/api/admin/orders?${params}`);

      setOrders(data.orders || []);
    } catch (error) {
      toast.error(error.message || "Payments load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        order.orderNumber?.toLowerCase().includes(q) ||
        order.userInfo?.name?.toLowerCase().includes(q) ||
        order.userInfo?.phone?.toLowerCase().includes(q) ||
        order.payment?.proof?.utr?.toLowerCase().includes(q) ||
        order.payment?.transactionId?.toLowerCase().includes(q);

      const matchesStatus =
        !paymentStatus || order.payment?.status === paymentStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, paymentStatus]);

  const updatePayment = async (order, status) => {
    try {
      setSavingId(order._id || order.id);

      await adminRequest("/api/admin/orders/status", {
        method: "PUT",
        body: JSON.stringify({
          orderId: order._id || order.id,
          status: order.orderStatus || order.status || "Order Placed",
          paymentStatus: status,
          courier: order.shipment?.courier || "",
          trackingId: order.shipment?.trackingId || "",
          trackingUrl: order.shipment?.trackingUrl || "",
        }),
      });

      toast.success(`Payment marked as ${status}`);
      await loadPayments();
    } catch (error) {
      toast.error(error.message || "Payment update failed");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-[#cdefff] bg-gradient-to-br from-[#e0f5ff] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">
              Royal Component Admin
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#102033]">
              Payment Verification
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              Customer payment proof, UTR, payment method, screenshot and admin
              verification status yahan se manage hoga.
            </p>
          </div>

          <button
            onClick={loadPayments}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-black text-[#102033] hover:bg-[#f8fbff]"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order no, customer, phone, UTR..."
              className="w-full rounded-xl border px-11 py-3 text-sm outline-none focus:border-[#0284c7]"
            />
          </div>

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#0284c7]"
          >
            <option value="">All Payment Status</option>
            {paymentStatuses
              .filter(Boolean)
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-sm text-slate-500">Loading payments...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-sm text-slate-500">No payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1450px] w-full text-left text-sm">
              <thead className="bg-[#f0f9ff] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Payment Method</th>
                  <th className="px-4 py-4">Payment Status</th>
                  <th className="px-4 py-4">UTR / Ref</th>
                  <th className="px-4 py-4">Proof</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredOrders.map((order) => {
                  const orderId = order._id || order.id;
                  const proofImage = order.payment?.proof?.image;
                  const isSaving = savingId === orderId;

                  return (
                    <tr key={orderId} className="hover:bg-[#f8fbff]">
                      <td className="px-4 py-5 align-top">
                        <p className="font-black text-[#102033]">
                          {order.orderNumber || orderId}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("en-IN")
                            : ""}
                        </p>
                      </td>

                      <td className="px-4 py-5 align-top">
                        <p className="font-bold text-[#102033]">
                          {order.userInfo?.name || order.customer || "Customer"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.userInfo?.phone || order.phone || "N/A"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.userInfo?.email || ""}
                        </p>
                      </td>

                      <td className="px-4 py-5 align-top">
                        <p className="font-black text-[#102033]">
                          {money(order.pricing?.totalAmount || order.finalAmount)}
                        </p>
                      </td>

                      <td className="px-4 py-5 align-top">
                        <span className="rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-black text-[#0369a1]">
                          {order.payment?.method || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-5 align-top">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            order.payment?.status === "Paid"
                              ? "bg-green-50 text-green-700"
                              : order.payment?.status === "Failed"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {order.payment?.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-4 py-5 align-top">
                        <p className="font-bold text-[#102033]">
                          {order.payment?.proof?.utr ||
                            order.payment?.transactionId ||
                            "-"}
                        </p>
                        {order.payment?.proof?.note ? (
                          <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-500">
                            {order.payment.proof.note}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-4 py-5 align-top">
                        {proofImage ? (
                          <a
                            href={getImageUrl(proofImage)}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-xl border border-[#bae6fd] bg-[#f0f9ff] px-3 py-2 text-xs font-black text-[#0284c7]"
                          >
                            <Eye size={15} />
                            View Proof
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No proof uploaded
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-5 align-top">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updatePayment(order, "Paid")}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            <CheckCircle2 size={14} />
                            Paid
                          </button>

                          <button
                            onClick={() => updatePayment(order, "Failed")}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            <XCircle size={14} />
                            Reject
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
      </section>
    </div>
  );
}