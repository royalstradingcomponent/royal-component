"use client";

import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";

export default function ChatHeader({ order }) {
  return (
    <div className="border-b border-[#dbe5f0] bg-white px-4 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <Link href="/checkout/order" className="rounded-full bg-[#eef4fa] p-2 hover:bg-[#e2edf7] transition">
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-lg font-black text-[#102033]">
              Royal Component Support
            </h1>
            <p className="text-sm text-[#607287]">
              Order: {order?.orderNumber || order?.orderId || order?._id || "Support"}
            </p>
          </div>
        </div>

        {/* CALL BUTTON */}
        <a
          href="tel:+919871147666"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2454b5] to-[#2f6df6] px-5 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition"
        >
          <Phone size={18} className="text-white stroke-[2.5]" />
          <span className="text-white">Call</span>
        </a>

      </div>
    </div>
  );
}