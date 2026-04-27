"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, RotateCcw, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from "@/context/OrderContext";

export default function BuyAgainPage() {
  const { orders, fetchMyOrders, loading } = useOrders();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const products = (orders || []).flatMap((order) =>
    (order.products || []).map((item) => ({
      ...item,
      orderId: order._id,
      orderNumber: order.orderNumber,
    }))
  );

  return (
    <div className="min-h-screen bg-[#f3f7fb]">
      <Navbar />

      <main className="mx-auto max-w-[1100px] px-4 py-8">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe5f0] bg-white px-4 py-2 text-sm font-bold text-[#2454b5]"
        >
          <ArrowLeft size={17} />
          Back to account
        </Link>

        <div className="rounded-[26px] border border-[#dbe5f0] bg-white p-7 shadow-sm">
          <h1 className="flex items-center gap-3 text-3xl font-black text-[#102033]">
            <RotateCcw size={32} />
            Buy Again
          </h1>

          {loading ? (
            <p className="mt-6 text-[#607287]">Loading...</p>
          ) : products.length === 0 ? (
            <div className="mt-8 rounded-[20px] border border-dashed border-[#cfe0f1] bg-[#f8fafc] p-10 text-center">
              <Package size={50} className="mx-auto mb-4 text-[#2454b5]" />
              <h2 className="text-2xl font-black text-[#102033]">
                No previous products
              </h2>
              <p className="mt-2 text-[#607287]">
                Aapke previous orders ke products yahan show honge.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-flex rounded-[12px] bg-[#2454b5] px-5 py-3 text-sm font-black text-white"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {products.map((item, index) => (
                <Link
                  key={`${item.orderId}-${item._id || index}`}
                  href={`/orders/${item.orderId}`}
                  className="flex flex-col gap-3 rounded-[18px] border border-[#e5edf6] p-4 hover:bg-[#f8fafc] md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h2 className="font-black text-[#102033]">{item.name}</h2>
                    <p className="mt-1 text-sm text-[#607287]">
                      From Order: {item.orderNumber}
                    </p>
                  </div>

                  <span className="text-sm font-black text-[#2454b5]">
                    View Order →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}