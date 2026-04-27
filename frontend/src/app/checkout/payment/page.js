"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useAddress } from "@/context/AddressContext";
import { useOrders } from "@/context/OrderContext";
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

export default function CheckoutPaymentPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const { cartItems, cartSummary, cartLoading, fetchCart } = useCart();
  const { selectedAddress } = useAddress();
  const { placeOrder, actionLoading } = useOrders();

  const [form, setForm] = useState({
    paymentMethod: "bank-transfer",
    note: "",
  });

  useEffect(() => {
    if (!authLoading && !user?.token) router.replace("/");
  }, [authLoading, user?.token, router]);

  useEffect(() => {
    if (!selectedAddress && !authLoading) {
      router.replace("/checkout/address");
    }
  }, [selectedAddress, authLoading, router]);

  const totalQty = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select delivery address");
      router.push("/checkout/address");
      return;
    }

    const data = await placeOrder({
      buyer: {
        fullName: selectedAddress.fullName,
        companyName: "",
        phone: selectedAddress.phone,
        email: user?.email || "",
        gstNumber: "",
      },
      shippingAddress: {
        address: selectedAddress.addressLine,
        addressLine2: selectedAddress.landmark || "",
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: "India",
      },
      paymentMethod: form.paymentMethod,
      note: form.note,
    });

    await fetchCart();

    const orderId = data?.orderId || data?.order?._id;

    if (orderId) {
      router.push(`/checkout/success/${orderId}`);
    } else {
      router.push("/orders");
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-[#f3f7fb]">
        <Navbar />
        <div className="py-20 text-center text-[#607287]">Loading payment...</div>
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
        <Link href="/checkout/address" className="mb-6 inline-flex items-center gap-2 font-semibold text-[#2454b5]">
          <ArrowLeft size={18} /> Back to address
        </Link>

        <h1 className="text-[42px] font-bold text-[#102033]">Checkout</h1>

        <div className="mt-5 mb-7 grid overflow-hidden rounded-xl border border-[#dbe5f0] bg-white text-center text-sm font-bold md:grid-cols-3">
          <div className="px-4 py-3 text-[#2454b5]">1. Address</div>
          <div className="bg-[#2454b5] px-4 py-3 text-white">2. Payment</div>
          <div className="px-4 py-3 text-[#607287]">3. Success</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
          <div className="space-y-6">
            <section className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-bold text-[#102033]">Delivering to</h2>
              <p className="mt-2 text-sm leading-6 text-[#607287]">
                <b className="text-[#102033]">{selectedAddress?.fullName}</b>, {selectedAddress?.phone}
                <br />
                {selectedAddress?.addressLine}
                {selectedAddress?.landmark ? `, ${selectedAddress.landmark}` : ""},{" "}
                {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
              </p>
              <Link href="/checkout/address" className="mt-4 inline-block text-sm font-bold text-[#2454b5]">
                Change Address
              </Link>
            </section>

            <PaymentMethodSelector
              value={form.paymentMethod}
              onChange={(method) =>
                setForm((prev) => ({ ...prev, paymentMethod: method }))
              }
              totalAmount={cartSummary?.grandTotal}
            />

            <textarea
              name="note"
              value={form.note}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, note: e.target.value }))
              }
              rows={3}
              className="w-full rounded-lg border border-[#cfd8e3] bg-white px-4 py-3 outline-none focus:border-[#2454b5]"
              placeholder="Any special requirement, alternate part, bulk pricing request..."
            />

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={actionLoading}
              className="h-[54px] w-full rounded-lg bg-[#2454b5] text-lg font-bold text-white hover:bg-[#1e4695] disabled:opacity-60"
            >
              {actionLoading ? "Placing Order..." : "Place Order Request"}
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

            <div className="rounded-[14px] border border-[#dbe5f0] bg-[#f8fcff] p-5">
              <div className="space-y-4 text-[15px] text-[#334155]">
                <p className="flex gap-2"><ShieldCheck className="text-[#2454b5]" size={20} /> GST-ready pricing for business purchase.</p>
                <p className="flex gap-2"><PackageCheck className="text-[#2454b5]" size={20} /> Bulk procurement and MOQ support.</p>
                <p className="flex gap-2"><Truck className="text-[#2454b5]" size={20} /> Delivery timeline depends on stock and quantity.</p>
                <p className="flex gap-2"><Building2 className="text-[#2454b5]" size={20} /> Suitable for industrial, electrical and electronics buyers.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}