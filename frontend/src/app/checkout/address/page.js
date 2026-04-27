"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Building2,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddressSelector from "@/components/address/AddressSelector";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useAddress } from "@/context/AddressContext";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getImageUrl(url) {
  if (!url) return "https://via.placeholder.com/200x200?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, cartSummary, cartLoading } = useCart();
  const { selectedAddress } = useAddress();

  useEffect(() => {
    if (!authLoading && !user?.token) router.replace("/");
  }, [authLoading, user?.token, router]);

  const totalQty = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error("Please select or add delivery address");
      return;
    }
    router.push("/checkout/payment");
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-[#f3f7fb]">
        <Navbar />
        <div className="py-20 text-center text-[#607287]">Loading checkout...</div>
        <Footer />
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="min-h-screen bg-[#f3f7fb]">
        <Navbar />
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
          <ShoppingCart size={70} className="mb-5 text-[#2454b5]" />
          <h1 className="text-3xl font-bold text-[#102033]">Your basket is empty</h1>
          <Link href="/products" className="mt-7 rounded-lg bg-[#2454b5] px-7 py-3 font-semibold text-white">
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7fb] text-[#1f2937]">
      <Navbar />

      <main className="mx-auto max-w-[1360px] px-4 py-8 lg:px-6">
        <Link href="/checkout/cart" className="mb-6 inline-flex items-center gap-2 font-semibold text-[#2454b5]">
          <ArrowLeft size={18} /> Back to basket
        </Link>

        <h1 className="text-[42px] font-bold text-[#102033]">Checkout</h1>

        <div className="mt-5 mb-7 grid overflow-hidden rounded-xl border border-[#dbe5f0] bg-white text-center text-sm font-bold md:grid-cols-3">
          <div className="bg-[#2454b5] px-4 py-3 text-white">1. Address</div>
          <div className="px-4 py-3 text-[#607287]">2. Payment</div>
          <div className="px-4 py-3 text-[#607287]">3. Success</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
          <div className="space-y-6">
            <section className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-sm md:p-6">
              <div className="flex gap-3">
                <div className="rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                  <PackageCheck size={22} />
                </div>
                <div>
                  <h2 className="text-[24px] font-bold text-[#102033]">
                    Industrial Procurement Checkout
                  </h2>
                  <p className="mt-1 text-sm text-[#607287]">
                    Review bulk quantity, GST and delivery address before payment.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-[#dbe5f0] bg-[#f8fbff] p-4">
                  <p className="text-xs font-bold uppercase text-[#607287]">Bulk Quantity</p>
                  <p className="mt-1 text-lg font-extrabold text-[#102033]">{totalQty} Units</p>
                </div>
                <div className="rounded-xl border border-[#dbe5f0] bg-[#f8fbff] p-4">
                  <p className="text-xs font-bold uppercase text-[#607287]">GST Ready</p>
                  <p className="mt-1 text-lg font-extrabold text-[#102033]">18% GST</p>
                </div>
                <div className="rounded-xl border border-[#dbe5f0] bg-[#f8fbff] p-4">
                  <p className="text-xs font-bold uppercase text-[#607287]">Order Type</p>
                  <p className="mt-1 text-lg font-extrabold text-[#102033]">B2B / Wholesale</p>
                </div>
              </div>
            </section>

            <AddressSelector />

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedAddress}
              className="h-[54px] w-full rounded-lg bg-[#2454b5] text-lg font-bold text-white hover:bg-[#1e4695] disabled:opacity-60"
            >
              Continue to Payment
            </button>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-[#102033]">Order Summary</h2>
              <div className="space-y-4 text-[17px]">
                <div className="flex justify-between"><span>{totalQty} items</span><b>{formatCurrency(cartSummary?.subtotalExGst)}</b></div>
                <div className="flex justify-between"><span>GST</span><b>{formatCurrency(cartSummary?.gstTotal)}</b></div>
                <div className="flex justify-between"><span>Delivery</span><b>{formatCurrency(cartSummary?.shipping)}</b></div>
                <div className="flex justify-between border-t pt-4 text-xl font-bold"><span>Total</span><span>{formatCurrency(cartSummary?.grandTotal)}</span></div>
              </div>
            </div>

            <div className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-[#102033]">Items in Order</h3>
              <div className="max-h-[420px] space-y-4 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 border-b pb-4 last:border-b-0">
                    <img src={getImageUrl(item.image)} alt={item.name} className="h-[70px] w-[70px] rounded bg-[#f8fafc] object-contain" />
                    <div>
                      <h4 className="font-bold text-[#102033]">{item.name}</h4>
                      <p className="text-sm text-[#607287]">Qty: {item.quantity}</p>
                      <p className="font-bold text-[#102033]">{formatCurrency(item.lineSubtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}