"use client";

import FAQSidebar from "./FAQSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, ShieldCheck, Truck, FileText } from "lucide-react";

export default function FAQLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f8fd]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-sky-600">
                Help Center
              </p>

              <h1 className="text-[34px] font-black leading-tight text-slate-950 sm:text-[48px] lg:text-[58px]">
                Royal Trading FAQ & Customer Support
              </h1>

              <p className="mt-5 max-w-3xl text-[16px] leading-8 text-slate-600 sm:text-[18px]">
                Orders, bulk quantity, MOQ, payment proof, GST invoice,
                datasheet, sourcing aur industrial delivery se related saare
                important answers ek jagah.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
                >
                  <Search size={17} />
                  Browse Products
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 transition hover:bg-sky-50"
                >
                  Request Support
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm">
                <ShieldCheck className="mb-3 text-sky-600" size={26} />
                <h3 className="font-black text-slate-950">Genuine Sourcing</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Part number based industrial procurement support.
                </p>
              </div>

              <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm">
                <Truck className="mb-3 text-sky-600" size={26} />
                <h3 className="font-black text-slate-950">Order Tracking</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Dispatch, courier and delivery status updates.
                </p>
              </div>

              <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm">
                <FileText className="mb-3 text-sky-600" size={26} />
                <h3 className="font-black text-slate-950">GST & Invoice</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Business billing and GST invoice support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:gap-10">
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-[30px] border border-sky-100 bg-white p-4 shadow-sm">
                <p className="mb-3 px-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Browse FAQ
                </p>
                <FAQSidebar />
              </div>
            </aside>

            <div className="rounded-[30px] border border-sky-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
              {children}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}