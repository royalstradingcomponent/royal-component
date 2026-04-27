"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  Printer,
  Share2,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Truck,
  Building2,
  CreditCard,
  BadgeCheck,
  CircleHelp,
  Clock3,
  Wallet,
  MapPinned,
  CircleDollarSign,
  Boxes,
  CheckCircle2,
  PackageCheck,
  Layers3,
  NotebookTabs,
  Heart,
  AlertCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/app/authPage/LoginModel";
import { useWishlist } from "@/context/WishlistContext";

const formatCurrency = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function getImageUrl(url) {
  if (!url) return "https://via.placeholder.com/200x200?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function cleanQuantity(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 1) return 1;
  return Math.floor(number);
}

function QuantityInput({ item, updateQty, disabled }) {
  const [qty, setQty] = useState(String(item.quantity || 1));

  useEffect(() => {
    setQty(String(item.quantity || 1));
  }, [item.quantity]);

  const commitQty = async (value) => {
    const finalQty = cleanQuantity(value);
    setQty(String(finalQty));

    if (finalQty !== Number(item.quantity)) {
      await updateQty(item.id, finalQty);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-[#607287]">
          Enter any wholesale quantity
        </p>
        <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-bold text-[#2454b5]">
          Bulk allowed
        </span>
      </div>

      <div className="flex h-[48px] w-full overflow-hidden rounded-[8px] border border-[#cfd4dc] bg-white">
        <button
          type="button"
          onClick={() => commitQty(Math.max(1, cleanQuantity(qty) - 1))}
          disabled={disabled || cleanQuantity(qty) <= 1}
          className="w-[48px] border-r border-[#cfd4dc] text-[22px] font-bold text-[#2454b5] hover:bg-[#f3f8ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>

        <input
          type="number"
          min="1"
          inputMode="numeric"
          value={qty}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "") {
              setQty("");
              return;
            }

            const onlyNumbers = value.replace(/[^\d]/g, "");
            setQty(onlyNumbers);
          }}
          onBlur={() => commitQty(qty)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          disabled={disabled}
          className="w-full text-center text-[17px] font-bold text-[#111827] outline-none disabled:bg-[#f8fafc] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={() => commitQty(cleanQuantity(qty) + 1)}
          disabled={disabled}
          className="w-[48px] border-l border-[#cfd4dc] text-[22px] font-bold text-[#2454b5] hover:bg-[#f3f8ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-2">
        {[10, 50, 100, 500].map((quickQty) => (
          <button
            key={quickQty}
            type="button"
            onClick={() => commitQty(quickQty)}
            disabled={disabled}
            className="rounded-[8px] border border-[#dbe5f0] bg-[#f8fafc] px-2 py-2 text-xs font-bold text-[#2454b5] hover:bg-[#eef4ff] disabled:opacity-50"
          >
            {quickQty}
          </button>
        ))}
      </div>
    </div>
  );
}

const serviceHighlights = [
  {
    icon: PackageCheck,
    title: "Bulk MOQ support",
    desc: "Order in planned quantities for wholesale and repeat procurement.",
  },
  {
    icon: CreditCard,
    title: "Commercial payment support",
    desc: "Online payment, quote flow and bank transfer friendly process.",
  },
  {
    icon: NotebookTabs,
    title: "Parts list workflow",
    desc: "Save product lists for repeat buying and internal approval flow.",
  },
  {
    icon: BadgeCheck,
    title: "Business confidence",
    desc: "Clear pricing, GST display and sourcing-focused cart information.",
  },
];

const faqItems = [
  {
    question: "Can I type any quantity?",
    answer:
      "Yes. Hardware and wholesale orders can use custom quantities like 25, 100, 500, 1000 or more.",
  },
  {
    question: "Can I request custom pricing for higher quantities?",
    answer:
      "Yes. For larger purchase volumes, OEM supply, reseller requirements or institutional buying, custom quotation support can be provided.",
  },
  {
    question: "Will my guest basket be saved?",
    answer:
      "Yes. Your guest basket stays saved on this device. After login, the basket can continue with your account flow.",
  },
  {
    question: "Can I buy by stock number or upload a product list?",
    answer:
      "Yes. The basket experience is designed for quick reordering, stock-number based buying and bulk product additions.",
  },
];

export default function CartPage() {
  const {
    cartItems,
    cartSummary,
    cartLoading,
    cartActionLoading,
    updateQty,
    removeItem,
    clearCart,
    isGuestCart,
  } = useCart();

  const { user } = useAuth();
  const { toggleWishlist } = useWishlist();

  const [promoCode, setPromoCode] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleMoveToWishlist = async (item) => {
    if (!user?.token) {
      setIsLoginOpen(true);
      return;
    }

    await toggleWishlist({
      _id: item.productId,
      name: item.name,
      brand: item.brand,
      thumbnail: item.image,
      price: item.price,
      mrp: item.mrp,
      slug: item.slug,
    });

    await removeItem(item.id);
  };

  const itemCountLabel = useMemo(() => {
    const count = cartSummary?.itemCount || 0;
    return `${count} unit${count !== 1 ? "s" : ""}`;
  }, [cartSummary]);

  const uniqueBrands = useMemo(() => {
    const brands = cartItems
      .map((item) => item.brand)
      .filter(Boolean)
      .map((brand) => String(brand).trim());

    return [...new Set(brands)];
  }, [cartItems]);

  const uniqueSkus = useMemo(() => {
    const skus = cartItems
      .map((item) => item.sku || item.mpn || item.productId)
      .filter(Boolean);

    return [...new Set(skus)];
  }, [cartItems]);

  const inStockCount = useMemo(() => {
    return cartItems.filter((item) =>
      String(item.stockLabel || "").toLowerCase().includes("in stock")
    ).length;
  }, [cartItems]);

  const averageItemValue = useMemo(() => {
    const totalQty = cartSummary?.itemCount || 0;
    if (!totalQty) return 0;
    return Number(cartSummary?.subtotalExGst || 0) / totalQty;
  }, [cartSummary]);

  const cartInsights = useMemo(() => {
    return [
      {
        icon: Boxes,
        label: "Line items",
        value: cartItems.length,
        desc: "Products currently added to your basket",
      },
      {
        icon: Building2,
        label: "Brands covered",
        value: uniqueBrands.length,
        desc: "Distinct brands available in this basket",
      },
      {
        icon: PackageCheck,
        label: "Units planned",
        value: cartSummary?.itemCount || 0,
        desc: "Total quantity currently selected",
      },
      {
        icon: ShieldCheck,
        label: "In-stock items",
        value: inStockCount,
        desc: "Products showing immediate stock availability",
      },
    ];
  }, [cartItems.length, uniqueBrands.length, cartSummary, inStockCount]);

  const dynamicCommercialPoints = useMemo(() => {
    return [
      `Basket subtotal (Ex. GST): ${formatCurrency(cartSummary?.subtotalExGst || 0)}`,
      `Estimated GST on current basket: ${formatCurrency(cartSummary?.gstTotal || 0)}`,
      `Current total basket value: ${formatCurrency(cartSummary?.grandTotal || 0)}`,
      `Average unit value based on selected quantity: ${formatCurrency(averageItemValue)}`,
    ];
  }, [cartSummary, averageItemValue]);

  const dynamicBuyerHelp = useMemo(() => {
    return [
      {
        icon: Wallet,
        title: "Commercial snapshot",
        points: dynamicCommercialPoints,
      },
      {
        icon: MapPinned,
        title: "Basket coverage",
        points: [
          `${uniqueSkus.length} unique part / stock references currently selected`,
          `${uniqueBrands.length} brands represented in this basket`,
          `${cartSummary?.itemCount || 0} total units planned for purchase`,
          isGuestCart
            ? "Guest basket is saved on this device until login"
            : "Your logged-in basket is ready for checkout flow",
        ],
      },
      {
        icon: NotebookTabs,
        title: "Order readiness",
        points: [
          user?.token
            ? "You can proceed directly toward checkout"
            : "Login is required before placing the final order",
          "Pricing and GST are already visible for review",
          "You can type any wholesale quantity before checkout",
          "Bulk quote support can be requested for higher volume buying",
        ],
      },
    ];
  }, [
    dynamicCommercialPoints,
    uniqueSkus.length,
    uniqueBrands.length,
    cartSummary,
    isGuestCart,
    user?.token,
  ]);

  const nextSteps = useMemo(() => {
    return [
      {
        step: "01",
        title: "Type wholesale quantity",
        desc: `${cartSummary?.itemCount || 0} unit(s) currently selected across ${cartItems.length} line item(s).`,
      },
      {
        step: "02",
        title: "Validate pricing and GST",
        desc: `Commercial total is ${formatCurrency(
          cartSummary?.grandTotal || 0
        )} including GST visibility.`,
      },
      {
        step: "03",
        title: user?.token ? "Proceed to checkout" : "Login to continue",
        desc: user?.token
          ? "Your basket is attached to your account and ready for checkout."
          : "Your basket is saved, but login is required before final order placement.",
      },
      {
        step: "04",
        title: "Request quote if needed",
        desc:
          "For larger buying volumes, OEM sourcing or reseller needs, move to quotation support.",
      },
    ];
  }, [cartSummary, cartItems.length, user?.token]);

  const handleCheckout = () => {
    if (!user?.token) {
      setIsLoginOpen(true);
      return;
    }

    window.location.href = "/checkout/address";
  };

  return (
    <div className="min-h-screen bg-[#f3f7fb] text-[#1f2937]">
      <Navbar />

      <div className="mx-auto max-w-[1360px] px-4 py-6 lg:px-6">
        <div className="mb-5">
          <h1 className="text-[44px] font-semibold leading-none text-[#202124] md:text-[48px]">
            Basket{" "}
            <span className="text-[24px] font-normal text-[#6b7280] md:text-[28px]">
              ({itemCountLabel})
            </span>
          </h1>
          <p className="mt-3 text-[16px] text-[#607287]">
            Add any quantity you need for wholesale, hardware supply, project
            procurement or repeat industrial buying.
          </p>
        </div>

        {isGuestCart ? (
          <div className="mb-5 rounded-[10px] border border-[#bcd8ff] bg-[#edf4ff] px-5 py-4 text-[16px] text-[#1f2937]">
            You are shopping as a guest. Your basket is saved on this device.
            Please log in before placing your wholesale order.
          </div>
        ) : null}

        <div className="mb-5 rounded-[12px] border border-[#dbe5f0] bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <AlertCircle size={22} className="mt-1 shrink-0 text-[#2454b5]" />
            <div>
              <p className="font-bold text-[#102033]">
                Wholesale quantity is open
              </p>
              <p className="mt-1 text-sm leading-6 text-[#607287]">
                Aap 1, 10, 100, 500, 1000 ya custom quantity type karke cart
                update kar sakte ho. Final availability aur dispatch time order
                confirmation par verify hoga.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <button className="border border-[#2454b5] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#f3f8ff]">
            <span className="inline-flex items-center gap-2">
              <Share2 size={16} />
              Share basket
            </span>
          </button>

          <button
            onClick={clearCart}
            disabled={cartActionLoading || cartItems.length === 0}
            className="border border-[#2454b5] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#f3f8ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove all items
          </button>

          <button className="border border-[#2454b5] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#f3f8ff]">
            <span className="inline-flex items-center gap-2">
              <Printer size={16} />
              Print as a quote
            </span>
          </button>

          <button className="border border-[#2454b5] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#f3f8ff]">
            <span className="inline-flex items-center gap-2">
              <Download size={16} />
              Download basket
              <ChevronDown size={16} />
            </span>
          </button>

          <button className="border border-[#2454b5] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#f3f8ff]">
            Save as list
          </button>

          <button className="border border-[#2454b5] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#f3f8ff]">
            Add by stock number
          </button>

          <button className="border border-[#2454b5] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#f3f8ff]">
            Add products in bulk
          </button>
        </div>

        <div className="mb-5 rounded-[8px] bg-[#cfeff4] px-5 py-4 text-[18px] text-[#1f2937]">
          Note: All delivery dates are estimates and may vary by 1-2 days.
          Higher quantity orders may need stock confirmation.
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
          <div>
            {cartLoading ? (
              <div className="rounded-[10px] border border-[#e5e7eb] bg-white p-8 text-[18px] text-[#6b7280]">
                Loading basket...
              </div>
            ) : cartItems.length === 0 ? (
              <div className="rounded-[10px] border border-[#e5e7eb] bg-white px-8 py-16 text-center">
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-[#9ca3af]" />
                <h2 className="text-[28px] font-semibold text-[#202124]">
                  Your basket is empty
                </h2>
                <p className="mt-2 text-[16px] text-[#6b7280]">
                  Add products from Royal Component to see them here.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex rounded-[6px] bg-[#2454b5] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1e4695]"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[10px] border border-[#dbe5f0] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full bg-[#ede3ff] px-4 py-2 text-[14px] font-semibold text-[#6b33c7]">
                        {item.stockLabel || "Stock check required"}
                      </span>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          disabled={cartActionLoading}
                          className="inline-flex items-center gap-2 text-[#2454b5] transition hover:text-[#ef4444] disabled:opacity-60"
                        >
                          <Heart size={20} />
                          <span className="hidden sm:inline">
                            Move to wishlist
                          </span>
                        </button>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={cartActionLoading}
                          className="text-[#2454b5] transition hover:text-[#ef4444] disabled:opacity-60"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4 border-b border-[#e5e7eb] pb-4 text-[18px] text-[#374151]">
                      • Estimated delivery for {item.quantity} unit(s):{" "}
                      <span className="font-semibold text-[#5b2ca5]">
                        {item.estimatedDelivery || "To be confirmed"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-[140px_minmax(0,1fr)_260px]">
                      <div>
                        <Link href={`/product/${item.slug}`}>
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="h-[120px] w-[120px] object-contain"
                          />
                        </Link>
                      </div>

                      <div>
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="text-[18px] font-semibold leading-8 text-[#111827]">
                            {item.name}
                          </h3>
                        </Link>

                        <div className="mt-3 space-y-2 text-[16px] text-[#374151]">
                          {item.sku ? <p>RS Stock No.: {item.sku}</p> : null}
                          {item.brand ? <p>Brand: {item.brand}</p> : null}
                          {item.mpn ? (
                            <p>Manufacturers Part No.: {item.mpn}</p>
                          ) : null}
                          {item.hsnCode ? <p>HSN Code: {item.hsnCode}</p> : null}
                          <p>GST Tax Type: {item.gstPercent || 18}% GST</p>
                        </div>

                        <div className="mt-4 rounded-[10px] bg-[#f8fafc] p-3 text-sm text-[#607287]">
                          Large quantity? Type required quantity directly.
                          Procurement team can confirm stock before dispatch.
                        </div>
                      </div>

                      <div>
                        <div className="text-right">
                          <p className="text-[22px] font-semibold text-[#111827]">
                            {formatCurrency(item.lineSubtotal)}
                          </p>
                          <p className="mt-1 text-[15px] text-[#374151]">
                            {formatCurrency(item.price)} Each
                          </p>
                          <p className="mt-1 text-[15px] text-[#374151]">
                            GST Amount: {formatCurrency(item.gstAmount)}
                          </p>
                        </div>

                        <div className="mt-4">
                          <QuantityInput
                            item={item}
                            updateQty={updateQty}
                            disabled={cartActionLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-5 lg:self-start">
            <div className="rounded-[10px] border border-[#dbe5f0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <h2 className="mb-4 text-[22px] font-semibold text-[#202124]">
                Delivery
              </h2>
              <div className="flex items-center justify-between rounded-[6px] border-2 border-[#2454b5] bg-[#edf3ff] px-4 py-3 text-[18px]">
                <span>FREE delivery</span>
                <span className="font-semibold">
                  {formatCurrency(cartSummary?.shipping)}
                </span>
              </div>
            </div>

            <div className="rounded-[10px] border border-[#dbe5f0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <h2 className="mb-5 text-[22px] font-semibold text-[#202124]">
                Summary
              </h2>

              <div className="space-y-5 text-[18px]">
                <div className="flex items-center justify-between">
                  <span>{itemCountLabel}</span>
                  <span className="font-semibold">
                    {formatCurrency(cartSummary?.subtotalExGst)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(cartSummary?.shipping)}
                    </div>
                    <div className="text-[16px] text-[#6b7280]">
                      FREE delivery
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>GST</span>
                  <span className="font-semibold">
                    {formatCurrency(cartSummary?.gstTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-5 text-[22px] font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(cartSummary?.grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Promotional code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="h-[46px] flex-1 rounded-[6px] border border-[#cfd4dc] px-4 text-[16px] uppercase outline-none"
                />
                <button className="h-[46px] rounded-[6px] bg-[#dce8ff] px-6 text-[16px] font-semibold text-[#2454b5]">
                  Apply
                </button>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-5 h-[50px] w-full rounded-[6px] bg-[#2454b5] text-[18px] font-semibold text-white transition hover:bg-[#1e4695]"
              >
                {user?.token ? "Proceed to checkout" : "Log in to continue"}
              </button>

              {!user?.token ? (
                <p className="mt-3 text-[14px] text-[#6b7280]">
                  Your basket items are already saved. Login is required before
                  placing a wholesale order.
                </p>
              ) : null}

              <div className="mt-5 space-y-3 text-[16px] text-[#1f2937]">
                <p>✔ Any custom wholesale quantity allowed</p>
                <p>✔ Faster re-ordering and checkout</p>
                <p>✔ Save and manage your Parts list</p>
                <p>✔ View your previous orders</p>
              </div>

              <div className="mt-6 border-t border-[#e5e7eb] pt-5 text-center">
                <p className="text-[16px] text-[#111827]">
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setIsLoginOpen(true)}
                    className="cursor-pointer font-semibold text-[#2454b5]"
                  >
                    Sign up / Login
                  </span>
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-[16px] text-[#374151]">We accept</p>
                  <div className="flex flex-wrap items-center justify-center gap-4 text-[22px] font-bold text-[#2454b5]">
                    <span>AMEX</span>
                    <span>MC</span>
                    <span>RuPay</span>
                    <span>VISA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <>
            <section className="mt-8 rounded-[16px] border border-[#d8e8f8] bg-gradient-to-r from-[#f8fcff] to-[#eef6ff] p-6 shadow-[0_10px_30px_rgba(36,84,181,0.06)] sm:p-8">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-[#cfe2ff] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2454b5]">
                  Dynamic basket insights
                </span>
                <h2 className="mt-4 text-[30px] font-semibold leading-tight text-[#102033] sm:text-[38px]">
                  Your current basket at a glance
                </h2>
                <p className="mt-4 text-[16px] leading-8 text-[#4f6478]">
                  These details are generated from the products currently added
                  to your basket, so the section updates automatically with real
                  cart data.
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {cartInsights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[14px] border border-[#d8e8f8] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                    >
                      <div className="mb-4 inline-flex rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                        <Icon size={22} />
                      </div>
                      <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#5d7287]">
                        {item.label}
                      </p>
                      <h3 className="mt-2 text-[32px] font-bold text-[#102033]">
                        {item.value}
                      </h3>
                      <p className="mt-3 text-[15px] leading-7 text-[#5d7287]">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[16px] border border-[#dbe8f5] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="inline-flex rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                    <Boxes size={22} />
                  </div>
                  <div>
                    <h2 className="text-[28px] font-semibold text-[#102033]">
                      Basket coverage and business context
                    </h2>
                    <p className="mt-2 text-[15px] leading-7 text-[#5d7287]">
                      These blocks are generated using your live basket data.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                  {dynamicBuyerHelp.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="rounded-[14px] border border-[#dbe8f5] bg-[#f9fcff] p-5"
                      >
                        <div className="mb-4 inline-flex rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                          <Icon size={20} />
                        </div>
                        <h3 className="text-[19px] font-semibold text-[#102033]">
                          {card.title}
                        </h3>
                        <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[#5d7287]">
                          {card.points.map((point) => (
                            <li key={point} className="flex gap-2">
                              <CheckCircle2
                                size={18}
                                className="mt-1 shrink-0 text-[#2454b5]"
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              <section className="rounded-[18px] bg-gradient-to-r from-[#0f3f84] via-[#2454b5] to-[#2f7de1] px-6 py-8 text-white shadow-[0_16px_40px_rgba(36,84,181,0.18)] sm:px-8">
                <div>
                  <h2 className="text-[30px] font-semibold leading-tight sm:text-[34px]">
                    Need quotation, alternate part or large quantity pricing?
                  </h2>
                  <p className="mt-4 text-[16px] leading-8 text-white/90">
                    For very high quantities, OEM sourcing or project-wise
                    procurement, our team can verify stock and pricing before
                    final dispatch.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-[8px] bg-white px-5 py-3 text-[15px] font-semibold text-[#2454b5] transition hover:bg-[#eef5ff]">
                      Request bulk quotation
                    </button>
                    <button className="rounded-[8px] border border-white/50 bg-white/10 px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-white/15">
                      Upload product list / BOM
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {serviceHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-[14px] border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                      >
                        <div className="mb-3 inline-flex rounded-full bg-white/15 p-2">
                          <Icon size={20} />
                        </div>
                        <h3 className="text-[17px] font-semibold">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-6 text-white/85">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </section>

            <section className="mt-8 rounded-[16px] border border-[#dbe8f5] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
              <div className="flex items-start gap-3">
                <div className="inline-flex rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                  <CircleDollarSign size={22} />
                </div>
                <div>
                  <h2 className="text-[28px] font-semibold text-[#102033]">
                    How this order process works
                  </h2>
                  <p className="mt-2 text-[15px] leading-7 text-[#5d7287]">
                    These next steps also adapt based on basket totals and login
                    state.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {nextSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-[14px] border border-[#dbe8f5] bg-[#f9fcff] p-5"
                  >
                    <div className="mb-4 text-[28px] font-bold text-[#2454b5]">
                      {item.step}
                    </div>
                    <h3 className="text-[18px] font-semibold text-[#102033]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-[#5d7287]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-[14px] border border-[#dbe8f5] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="mb-4 inline-flex rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                  <Clock3 size={22} />
                </div>
                <h3 className="text-[22px] font-semibold text-[#102033]">
                  Delivery and dispatch notes
                </h3>
                <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[#5d7287]">
                  <li>• Estimated delivery is currently shown for selected items.</li>
                  <li>
                    • Delivery cost in basket:{" "}
                    {formatCurrency(cartSummary?.shipping || 0)}
                  </li>
                  <li>• Current in-stock line items: {inStockCount}</li>
                  <li>• Final dispatch timing may vary based on order size.</li>
                </ul>
              </div>

              <div className="rounded-[14px] border border-[#dbe8f5] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="mb-4 inline-flex rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                  <Layers3 size={22} />
                </div>
                <h3 className="text-[22px] font-semibold text-[#102033]">
                  Brands currently in basket
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {uniqueBrands.length > 0 ? (
                    uniqueBrands.map((brand) => (
                      <span
                        key={brand}
                        className="rounded-full border border-[#d9e8ff] bg-[#f4f9ff] px-4 py-2 text-[14px] font-semibold text-[#2454b5]"
                      >
                        {brand}
                      </span>
                    ))
                  ) : (
                    <span className="text-[15px] text-[#5d7287]">
                      No brand data available.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-[14px] border border-[#dbe8f5] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="mb-4 inline-flex rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                  <CircleHelp size={22} />
                </div>
                <h3 className="text-[22px] font-semibold text-[#102033]">
                  Basket help and buyer FAQs
                </h3>
                <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[#5d7287]">
                  {faqItems.map((item) => (
                    <li key={item.question}>
                      <span className="font-semibold text-[#102033]">
                        {item.question}
                      </span>
                      <br />
                      {item.answer}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        ) : null}

        <section className="mt-8 rounded-[18px] border border-[#d6e6fb] bg-gradient-to-r from-[#eff6ff] via-[#f8fbff] to-[#edf5ff] px-6 py-8 sm:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-[28px] font-semibold text-[#102033]">
                Payment & business order options
              </h3>
              <div className="flex flex-wrap gap-3 text-[20px] font-bold text-[#2454b5]">
                <span className="rounded-full border border-[#d9e8ff] bg-white px-4 py-2">
                  AMEX
                </span>
                <span className="rounded-full border border-[#d9e8ff] bg-white px-4 py-2">
                  MC
                </span>
                <span className="rounded-full border border-[#d9e8ff] bg-white px-4 py-2">
                  RuPay
                </span>
                <span className="rounded-full border border-[#d9e8ff] bg-white px-4 py-2">
                  VISA
                </span>
              </div>
              <p className="mt-5 text-[16px] leading-8 text-[#5d7287]">
                Use online payment for faster order processing, or continue with
                a quotation / bank transfer-oriented flow for commercial
                purchasing requirements.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-[28px] font-semibold text-[#102033]">
                Basket settings & commercial clarity
              </h3>
              <div className="rounded-[14px] border border-[#d9e8ff] bg-white p-5">
                <p className="text-[18px] font-semibold text-[#2454b5]">
                  Excluding GST / Including GST
                </p>
                <p className="mt-3 text-[15px] leading-7 text-[#5d7287]">
                  Pricing visibility is structured for business buyers who
                  compare base cost, tax impact and final payable amount during
                  procurement review.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openRegister={() => {}}
      />
    </div>
  );
}