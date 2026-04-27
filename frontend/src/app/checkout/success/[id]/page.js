"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  PackageCheck,
  ReceiptText,
  Truck,
  ShoppingBag,
  ShieldCheck,
  ClipboardList,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock3,
  CreditCard,
  ArrowRight,
  CircleHelp,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from "@/context/OrderContext";

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPaymentMethod(method) {
  if (!method) return "Commercial Payment";
  return String(method)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getAddressText(order) {
  const address = order?.shippingAddress || order?.address || {};

  const parts = [
    address.address,
    address.addressLine,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

export default function CheckoutSuccessPage() {
  const { id } = useParams();
  const { fetchOrderById } = useOrders();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      try {
        if (!id) return;

        const data = await fetchOrderById(id);

        if (!active) return;

        setOrder(data?.order || data || null);
      } catch (error) {
        console.error("Order success fetch error:", error);
        if (active) setOrder(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id, fetchOrderById]);

  const buyerName =
    order?.buyer?.fullName ||
    order?.user?.name ||
    order?.userInfo?.name ||
    "Customer";

  const buyerPhone =
    order?.buyer?.phone || order?.user?.phone || order?.userInfo?.phone || "";

  const buyerEmail =
    order?.buyer?.email || order?.user?.email || order?.userInfo?.email || "";

  const companyName = order?.buyer?.companyName || "";

  const orderNumber =
    order?.orderNumber || order?.orderId || order?._id || id || "Loading...";

  const orderStatus =
    order?.orderStatus || order?.status || "Order Request Placed";

  const paymentMethod =
    order?.payment?.method || order?.paymentMethod || "bank-transfer";

  const totalAmount =
    order?.pricing?.totalAmount ||
    order?.pricing?.grandTotal ||
    order?.totalAmount ||
    order?.grandTotal ||
    0;

  const addressText = getAddressText(order);

  const orderItems = useMemo(() => {
    return order?.items || order?.products || [];
  }, [order]);

  return (
    <div className="min-h-screen bg-[#f3f7fb] text-[#1f2937]">
      <Navbar />

      <main className="mx-auto max-w-[1180px] px-4 py-8 md:py-12">
        <section className="overflow-hidden rounded-[24px] border border-[#dbe5f0] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-[#eaf4ff] via-[#f8fbff] to-[#edf7ff] px-5 py-8 text-center md:px-10 md:py-12">
            <div className="mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#16a34a] shadow-[0_12px_30px_rgba(22,163,74,0.28)]">
              <CheckCircle2 size={58} className="text-white" />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#2454b5]">
              Royal Component
            </p>

            <h1 className="mt-3 text-[34px] font-extrabold leading-tight text-[#102033] md:text-[46px]">
              Order Request Placed Successfully
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-7 text-[#607287] md:text-[18px]">
              Your industrial procurement request has been received. Our team
              will verify stock, quantity, GST details and delivery timeline
              before final confirmation.
            </p>

            <div className="mx-auto mt-7 grid max-w-4xl gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
                <ReceiptText className="mx-auto mb-3 text-[#2454b5]" size={28} />
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#607287]">
                  Order No.
                </p>
                <p className="mt-2 break-words text-[17px] font-extrabold text-[#102033]">
                  {loading ? "Loading..." : orderNumber}
                </p>
              </div>

              <div className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
                <PackageCheck className="mx-auto mb-3 text-[#2454b5]" size={28} />
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#607287]">
                  Status
                </p>
                <p className="mt-2 text-[17px] font-extrabold capitalize text-[#102033]">
                  {loading ? "Loading..." : orderStatus}
                </p>
              </div>

              <div className="rounded-2xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
                <CreditCard className="mx-auto mb-3 text-[#2454b5]" size={28} />
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#607287]">
                  Total Amount
                </p>
                <p className="mt-2 text-[17px] font-extrabold text-[#102033]">
                  {loading ? "Loading..." : formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <section className="rounded-[18px] border border-[#dbe5f0] bg-[#fbfdff] p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                    <Truck size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[22px] font-extrabold text-[#102033]">
                      Delivery & Buyer Details
                    </h2>

                    {loading ? (
                      <p className="mt-3 text-[#607287]">Loading delivery details...</p>
                    ) : order ? (
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-[#dbe5f0] bg-white p-4">
                          <p className="flex items-center gap-2 text-sm font-bold text-[#102033]">
                            <Building2 size={17} className="text-[#2454b5]" />
                            Buyer
                          </p>
                          <p className="mt-2 font-semibold text-[#334155]">
                            {buyerName}
                          </p>
                          {companyName ? (
                            <p className="mt-1 text-sm text-[#607287]">
                              {companyName}
                            </p>
                          ) : null}
                        </div>

                        <div className="rounded-xl border border-[#dbe5f0] bg-white p-4">
                          <p className="flex items-center gap-2 text-sm font-bold text-[#102033]">
                            <Phone size={17} className="text-[#2454b5]" />
                            Contact
                          </p>
                          <p className="mt-2 text-sm text-[#607287]">
                            {buyerPhone || "Phone not available"}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-[#607287]">
                            <Mail size={15} />
                            {buyerEmail || "Email not available"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#dbe5f0] bg-white p-4 md:col-span-2">
                          <p className="flex items-center gap-2 text-sm font-bold text-[#102033]">
                            <MapPin size={17} className="text-[#2454b5]" />
                            Delivering To
                          </p>
                          <p className="mt-2 text-sm leading-7 text-[#607287]">
                            {addressText || "Address details not available"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-[#ef4444]">
                        Order details could not be loaded.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-[#dbe5f0] bg-white p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                    <ClipboardList size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[22px] font-extrabold text-[#102033]">
                      What happens next?
                    </h2>

                    <div className="mt-5 space-y-4">
                      {[
                        {
                          title: "Stock verification",
                          desc: "Our team checks current product availability and requested quantity.",
                        },
                        {
                          title: "Commercial confirmation",
                          desc: "GST, payment mode, invoice and business order details are reviewed.",
                        },
                        {
                          title: "Dispatch timeline",
                          desc: "Delivery estimate is confirmed based on product stock and location.",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.title}
                          className="flex gap-4 rounded-xl border border-[#e4edf8] bg-[#f8fbff] p-4"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2454b5] text-sm font-extrabold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#102033]">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-[#607287]">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-[#dbe5f0] bg-white p-5 md:p-6">
                <h2 className="text-[22px] font-extrabold text-[#102033]">
                  Order Items
                </h2>

                {loading ? (
                  <p className="mt-4 text-[#607287]">Loading items...</p>
                ) : orderItems.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {orderItems.slice(0, 4).map((item, index) => {
                      const name =
                        item.name ||
                        item.productName ||
                        item.title ||
                        item.product?.name ||
                        "Product";

                      const qty = item.quantity || item.qty || 1;

                      const price =
                        item.lineSubtotal ||
                        item.total ||
                        item.price ||
                        item.sellingPrice ||
                        0;

                      return (
                        <div
                          key={item._id || item.id || index}
                          className="flex items-center justify-between gap-4 rounded-xl border border-[#e4edf8] bg-[#f8fbff] p-4"
                        >
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 font-bold text-[#102033]">
                              {name}
                            </h3>
                            <p className="mt-1 text-sm text-[#607287]">
                              Qty: {qty}
                            </p>
                          </div>

                          <p className="shrink-0 font-extrabold text-[#102033]">
                            {formatCurrency(price)}
                          </p>
                        </div>
                      );
                    })}

                    {orderItems.length > 4 ? (
                      <p className="text-sm font-semibold text-[#607287]">
                        + {orderItems.length - 4} more item(s)
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-4 text-[#607287]">
                    Item details will appear in order details page.
                  </p>
                )}
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[18px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
                <h2 className="text-[22px] font-extrabold text-[#102033]">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-4 text-[15px] text-[#334155]">
                  <div className="flex justify-between gap-4">
                    <span>Payment Method</span>
                    <b className="text-right text-[#102033]">
                      {formatPaymentMethod(paymentMethod)}
                    </b>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Order Status</span>
                    <b className="text-right capitalize text-[#102033]">
                      {loading ? "Loading..." : orderStatus}
                    </b>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-[#e5e7eb] pt-4 text-[18px]">
                    <span className="font-bold">Grand Total</span>
                    <b className="text-[#102033]">
                      {loading ? "Loading..." : formatCurrency(totalAmount)}
                    </b>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-[#dbe5f0] bg-[#f8fcff] p-5">
                <h3 className="text-[20px] font-extrabold text-[#102033]">
                  Business Order Protection
                </h3>

                <div className="mt-4 space-y-4 text-sm leading-6 text-[#4f6478]">
                  <p className="flex gap-3">
                    <ShieldCheck className="shrink-0 text-[#2454b5]" size={20} />
                    GST-ready commercial order review.
                  </p>
                  <p className="flex gap-3">
                    <PackageCheck className="shrink-0 text-[#2454b5]" size={20} />
                    Bulk quantity and MOQ verification.
                  </p>
                  <p className="flex gap-3">
                    <Clock3 className="shrink-0 text-[#2454b5]" size={20} />
                    Delivery timeline confirmation before dispatch.
                  </p>
                  <p className="flex gap-3">
                    <CircleHelp className="shrink-0 text-[#2454b5]" size={20} />
                    Support for alternate part or quote request.
                  </p>
                </div>
              </section>

              <div className="grid gap-3">
                <Link
                  href={`/checkout/order/${id}`}
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#2454b5] px-5 text-[15px] font-extrabold text-white transition hover:bg-[#1e4695]"
                >
                  View Order Details
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/checkout/order"
                  className="inline-flex h-[52px] items-center justify-center rounded-xl border border-[#2454b5] bg-white px-5 text-[15px] font-extrabold text-[#2454b5] transition hover:bg-[#f3f8ff]"
                >
                  My Orders
                </Link>

                <Link
                  href="/products"
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-[#dbe5f0] bg-white px-5 text-[15px] font-extrabold text-[#334155] transition hover:bg-[#f8fbff]"
                >
                  <ShoppingBag size={18} />
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}