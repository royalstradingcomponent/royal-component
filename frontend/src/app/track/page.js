"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Truck } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from "@/context/OrderContext";
import { getOrderStatusColor } from "@/lib/orderStatus";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const { trackOrder, loading } = useOrders();

  const handleTrack = async (e) => {
    e.preventDefault();
    const data = await trackOrder(orderId.trim());
    setOrder(data);
  };

  return (
    <div className="min-h-screen bg-[#f3f7fb]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-[16px] border border-[#dbe5f0] bg-white p-8 shadow-sm">
          <Truck size={56} className="mb-5 text-[#2454b5]" />

          <h1 className="text-[36px] font-bold text-[#102033]">
            Track Your Order
          </h1>

          <p className="mt-2 text-[#607287]">
            Enter your order ID to check current status.
          </p>

          <form onSubmit={handleTrack} className="mt-7 flex gap-3">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID"
              className="h-[52px] flex-1 rounded-[8px] border border-[#cfd8e3] px-4 outline-none focus:border-[#2454b5]"
            />

            <button
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#2454b5] px-6 font-semibold text-white disabled:opacity-60"
            >
              <Search size={18} />
              Track
            </button>
          </form>

          {order ? (
            <div className="mt-8 rounded-[14px] border border-[#dbe5f0] bg-[#f8fcff] p-5">
              <p className="text-sm text-[#607287]">Order Number</p>
              <h2 className="mt-1 text-xl font-bold text-[#102033]">
                {order.orderNumber}
              </h2>

              <span
                className={`mt-4 inline-flex rounded-full border px-4 py-2 text-sm font-bold ${getOrderStatusColor(
                  order.status || order.orderStatus
                )}`}
              >
                {order.status || order.orderStatus}
              </span>

              <div className="mt-5">
                <Link
                  href={`/orders/${order._id}`}
                  className="font-semibold text-[#2454b5] hover:underline"
                >
                  View full order details
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}