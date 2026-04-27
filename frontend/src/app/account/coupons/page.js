"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Info,
  PackageCheck,
  TicketPercent,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";

function getToken() {
  if (typeof window === "undefined") return null;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.token || null;
  } catch {
    return null;
  }
}

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "No expiry";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDiscount(coupon) {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}% OFF`;
  }

  return `${formatCurrency(coupon.discountValue)} OFF`;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const res = await fetch(`${API_BASE}/api/coupons/my`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (data?.success) {
        setCoupons(data.coupons || []);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("Coupons fetch error:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`${code} copied`);

      setTimeout(() => {
        setCopiedCode("");
      }, 1600);
    } catch {
      toast.error("Coupon copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7fb]">
      <Navbar />

      <main className="mx-auto max-w-[1180px] px-4 py-8">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe5f0] bg-white px-4 py-2 text-sm font-bold text-[#2454b5] shadow-sm"
        >
          <ArrowLeft size={17} />
          Back to account
        </Link>

        <section className="overflow-hidden rounded-[28px] border border-[#dbe5f0] bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#102033_0%,#2454b5_100%)] p-7 text-white">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-bold">
              <PackageCheck size={16} />
              Wholesale & Bulk Order Benefits
            </p>

            <h1 className="flex items-center gap-3 text-3xl font-black md:text-4xl">
              <TicketPercent size={34} />
              My Coupons
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">
              Ye coupons mainly wholesale, bulk procurement aur high-value
              industrial component orders ke liye hain. Minimum order amount
              complete hone par coupon apply hoga.
            </p>
          </div>

          <div className="border-b border-[#e5edf6] bg-[#f8fbff] p-5">
            <div className="flex gap-3 rounded-[18px] border border-[#cfe0f1] bg-white p-4">
              <Info size={22} className="mt-0.5 shrink-0 text-[#2454b5]" />
              <div>
                <h2 className="font-black text-[#102033]">
                  Important coupon rules
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#607287]">
                  Coupon code copy karke checkout/cart page par apply karein.
                  Har coupon selected categories, brands aur minimum order
                  amount ke according valid hoga.
                </p>
              </div>
            </div>
          </div>

          <div className="p-7">
            {loading ? (
              <p className="font-bold text-[#607287]">Loading coupons...</p>
            ) : coupons.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-[#cfe0f1] bg-[#f8fafc] p-10 text-center">
                <TicketPercent
                  size={52}
                  className="mx-auto mb-4 text-[#2454b5]"
                />
                <h2 className="text-2xl font-black text-[#102033]">
                  No coupons available
                </h2>
                <p className="mt-2 text-[#607287]">
                  Available wholesale offers yahan show honge.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {coupons.map((coupon) => {
                  const isCopied = copiedCode === coupon.code;
                  const categories = coupon.applicableCategories || [];
                  const brands = coupon.applicableBrands || [];

                  return (
                    <div
                      key={coupon._id}
                      className="overflow-hidden rounded-[26px] border border-dashed border-[#2454b5] bg-[#f8fbff] shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-[#dbe5f0] bg-white p-5">
                        <div>
                          <span className="inline-flex rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-black text-[#2454b5]">
                            {coupon.code}
                          </span>

                          <h2 className="mt-4 text-xl font-black text-[#102033]">
                            {coupon.title}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(coupon.code)}
                          className={`inline-flex shrink-0 items-center gap-2 rounded-[12px] px-4 py-2 text-sm font-black transition ${
                            isCopied
                              ? "bg-green-50 text-green-700"
                              : "bg-[#2454b5] text-white hover:bg-[#1e4695]"
                          }`}
                        >
                          {isCopied ? <Check size={17} /> : <Copy size={17} />}
                          {isCopied ? "Copied" : "Copy"}
                        </button>
                      </div>

                      <div className="p-5">
                        <p className="text-sm leading-6 text-[#607287]">
                          {coupon.description || "Special wholesale offer."}
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[16px] bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#607287]">
                              Discount
                            </p>
                            <p className="mt-1 text-xl font-black text-[#102033]">
                              {formatDiscount(coupon)}
                            </p>
                          </div>

                          <div className="rounded-[16px] bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#607287]">
                              Min Order
                            </p>
                            <p className="mt-1 text-xl font-black text-[#102033]">
                              {formatCurrency(coupon.minOrderAmount || 0)}
                            </p>
                          </div>

                          <div className="rounded-[16px] bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#607287]">
                              Max Discount
                            </p>
                            <p className="mt-1 text-xl font-black text-[#102033]">
                              {coupon.maxDiscount
                                ? formatCurrency(coupon.maxDiscount)
                                : "No limit"}
                            </p>
                          </div>

                          <div className="rounded-[16px] bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#607287]">
                              Expiry
                            </p>
                            <p className="mt-1 text-xl font-black text-[#102033]">
                              {formatDate(coupon.expiresAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-[16px] border border-[#dbe5f0] bg-white p-4">
                          <p className="text-sm font-black text-[#102033]">
                            Valid for wholesale/high-value orders
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[#607287]">
                            Is coupon ka use mainly B2B, procurement,
                            maintenance, industrial replacement aur bulk
                            purchase orders me karein.
                          </p>
                        </div>

                        {categories.length > 0 ? (
                          <div className="mt-4">
                            <p className="mb-2 text-sm font-black text-[#102033]">
                              Applicable Categories
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {categories.map((category) => (
                                <span
                                  key={category}
                                  className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold capitalize text-[#2454b5]"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {brands.length > 0 ? (
                          <div className="mt-4">
                            <p className="mb-2 text-sm font-black text-[#102033]">
                              Applicable Brands
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {brands.map((brand) => (
                                <span
                                  key={brand}
                                  className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#475569]"
                                >
                                  {brand}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <Link
                            href="/products"
                            className="inline-flex flex-1 justify-center rounded-[12px] border border-[#dbe5f0] bg-white px-4 py-3 text-sm font-black text-[#102033] hover:bg-[#f8fafc]"
                          >
                            Shop Products
                          </Link>

                          <Link
                            href="/checkout/cart"
                            className="inline-flex flex-1 justify-center rounded-[12px] bg-[#2454b5] px-4 py-3 text-sm font-black text-white hover:bg-[#1e4695]"
                          >
                            Apply at Checkout
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}