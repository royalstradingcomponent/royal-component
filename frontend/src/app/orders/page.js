"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PackageCheck } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from "@/context/OrderContext";
import { getOrderStatusColor, getOrderStatusLabel } from "@/lib/orderStatus";

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const { orders, loading, fetchMyOrders } = useOrders();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div className="min-h-screen bg-[#f3f7fb]">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="mb-8">
          <h1 className="text-[38px] font-bold text-[#102033]">My Orders</h1>
          <p className="mt-2 text-[#607287]">
            Track and manage your industrial component orders.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[14px] bg-white p-8 text-center text-[#607287]">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[14px] bg-white p-12 text-center">
            <PackageCheck size={70} className="mx-auto mb-5 text-[#2454b5]" />
            <h2 className="text-2xl font-bold text-[#102033]">
              No orders found
            </h2>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-[8px] bg-[#2454b5] px-6 py-3 font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status = order.status || order.orderStatus || "Order Placed";
              const firstItem = order.products?.[0];

              return (
                <div
                  key={order._id}
                  className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 border-b border-[#e5e7eb] pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-[#607287]">Order Number</p>
                      <h2 className="text-xl font-bold text-[#102033]">
                        {order.orderNumber}
                      </h2>
                      <p className="mt-1 text-sm text-[#607287]">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-bold ${getOrderStatusColor(
                        status
                      )}`}
                    >
                      {getOrderStatusLabel(status)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px_160px] md:items-center">
                    <div>
                      <h3 className="line-clamp-1 font-bold text-[#102033]">
                        {firstItem?.name || "Industrial Components"}
                      </h3>
                      <p className="mt-1 text-sm text-[#607287]">
                        {order.products?.length || 0} line item(s),{" "}
                        {order.pricing?.itemCount || 0} total units
                      </p>
                    </div>

                    <div className="font-bold text-[#102033]">
                      {formatCurrency(order.pricing?.totalAmount)}
                    </div>

                    <Link
                      href={`/orders/${order._id}`}
                      className="rounded-[8px] bg-[#2454b5] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#1e4695]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}