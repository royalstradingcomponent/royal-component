"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  PackageCheck,
  Truck,
  ReceiptText,
  MapPin,
  Phone,
  Mail,
  Building2,
  CreditCard,
  ShieldCheck,
  Clock3,
  ClipboardList,
  ShoppingBag,
  CircleHelp,
  Ban,
  AlertTriangle,
  Boxes,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import { useOrders } from "@/context/OrderContext";

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function getOrderNumber(order) {
  return order?.orderNumber || order?.orderId || order?._id || "Order";
}

function getStatus(order) {
  return order?.orderStatus || order?.status || "Order Placed";
}

function getTotal(order) {
  return (
    order?.pricing?.totalAmount ||
    order?.pricing?.grandTotal ||
    order?.pricing?.total ||
    order?.grandTotal ||
    order?.totalAmount ||
    0
  );
}

function getAddressText(order) {
  const address = order?.shippingAddress || order?.deliveryAddress || {};
  return [
    address.address,
    address.addressLine,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatPaymentMethod(method) {
  if (!method) return "Commercial Payment";
  return String(method)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getItemName(item) {
  return (
    item?.name ||
    item?.productName ||
    item?.title ||
    item?.product?.name ||
    "Industrial Component"
  );
}

function getItemImage(item) {
  return (
    item?.image ||
    item?.img ||
    item?.thumbnail ||
    item?.product?.thumbnail ||
    item?.product?.image ||
    ""
  );
}

function canCancelOrder(order) {
  const status = String(getStatus(order)).toLowerCase();
  return (
    !status.includes("cancel") &&
    !status.includes("deliver") &&
    !status.includes("shipped") &&
    !status.includes("out for delivery")
  );
}

const cancelReasons = [
  "Ordered by mistake",
  "Need to change quantity or product",
  "Delivery timeline is too long",
  "Payment method needs to be changed",
  "Found alternate supplier",
  "Business requirement changed",
  "Duplicate order placed",
  "Other reason",
];

const trackingSteps = [
  "Order Request Placed",
  "Stock Verification",
  "Commercial Confirmation",
  "Dispatch Planning",
  "Delivered",
];

export default function CheckoutOrderDetailPage() {
  const { id } = useParams();
  const { fetchOrderById } = useOrders();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchOrderById(id);
      setOrder(data?.order || data || null);
    } catch (error) {
      console.error("Order details error:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const items = useMemo(() => order?.items || order?.products || [], [order]);

  const buyerName =
    order?.buyer?.fullName ||
    order?.userInfo?.name ||
    order?.user?.name ||
    "Customer";

  const buyerPhone =
    order?.buyer?.phone || order?.userInfo?.phone || order?.user?.phone || "";

  const buyerEmail =
    order?.buyer?.email || order?.userInfo?.email || order?.user?.email || "";

  const companyName = order?.buyer?.companyName || "";

  const paymentMethod =
    order?.payment?.method || order?.paymentMethod || "bank-transfer";

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error("Please select cancellation reason");
      return;
    }

    try {
      setCancelLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user?.token;

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await fetch(`${API_BASE}/api/orders/cancel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cancelReason,
          cancelComment,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Order cancellation failed");
      }

      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      setCancelReason("");
      setCancelComment("");
      await loadOrder();
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef4fa]">
        <Navbar />
        <div className="py-24 text-center text-[#607287]">
          Loading order details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#eef4fa]">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <PackageCheck size={64} className="mx-auto mb-5 text-[#2454b5]" />
          <h1 className="text-3xl font-extrabold text-[#102033]">
            Order not found
          </h1>
          <Link
            href="/checkout/order"
            className="mt-6 inline-flex rounded-xl bg-[#2454b5] px-6 py-3 font-bold text-white"
          >
            Back to Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const orderCanCancel = canCancelOrder(order);

  return (
    <div className="min-h-screen bg-[#eef4fa] text-[#1f2937]">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
        <Link
          href="/checkout/order"
          className="mb-6 inline-flex items-center gap-2 font-bold text-[#2454b5]"
        >
          <ArrowLeft size={18} />
          Back to My Orders
        </Link>

        <section className="mb-6 overflow-hidden rounded-[28px] border border-[#dbe5f0] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-[#eaf4ff] via-[#f8fbff] to-[#edf7ff] px-6 py-8 md:px-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#2454b5]">
                  Order Details
                </p>
                <h1 className="mt-3 text-[36px] font-black leading-tight text-[#102033] md:text-[52px]">
                  {getOrderNumber(order)}
                </h1>
                <p className="mt-2 text-[#607287]">
                  Ordered on {formatDate(order?.createdAt)}
                </p>
              </div>

              <div className="rounded-3xl border border-[#dbe5f0] bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-[#607287]">Grand Total</p>
                <p className="mt-1 text-3xl font-black text-[#102033]">
                  {formatCurrency(getTotal(order))}
                </p>
                <p className="mt-3 rounded-full bg-[#ecfdf3] px-4 py-2 text-center text-sm font-extrabold text-[#15803d]">
                  {getStatus(order)}
                </p>

                {orderCanCancel ? (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="mt-4 inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#ef4444] bg-white px-4 font-extrabold text-[#ef4444] transition hover:bg-[#fff1f1]"
                  >
                    <Ban size={17} />
                    Cancel Order
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">
            <section className="rounded-[24px] border border-[#dbe5f0] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                  <Truck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#102033]">
                    Order Tracking
                  </h2>
                  <p className="text-sm text-[#607287]">
                    Current procurement and delivery progress.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                {trackingSteps.map((step, index) => {
                  const status = String(getStatus(order)).toLowerCase();
                  const cancelled = status.includes("cancel");
                  const completed = cancelled ? index === 0 : index <= 1;

                  return (
                    <div
                      key={step}
                      className="rounded-2xl border border-[#dbe5f0] bg-[#f8fbff] p-4"
                    >
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                          completed
                            ? "bg-[#16a34a] text-white"
                            : "bg-white text-[#94a3b8]"
                        }`}
                      >
                        {completed ? <Check size={18} /> : index + 1}
                      </div>
                      <p className="text-sm font-extrabold text-[#102033]">
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>

              {String(getStatus(order)).toLowerCase().includes("cancel") ? (
                <div className="mt-5 rounded-2xl border border-[#fecaca] bg-[#fff1f2] p-4 text-sm text-[#991b1b]">
                  <b>Order Cancelled:</b>{" "}
                  {order?.cancelReason || "Cancellation request processed."}
                </div>
              ) : null}
            </section>

            <section className="rounded-[24px] border border-[#dbe5f0] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#102033]">
                    Items in this order
                  </h2>
                  <p className="text-sm text-[#607287]">
                    {items.length} product(s) included in this order.
                  </p>
                </div>
              </div>

              {items.length === 0 ? (
                <p className="text-[#607287]">Item details are not available.</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const image = getItemImage(item);
                    const qty = item?.quantity || item?.qty || 1;
                    const price =
                      item?.lineSubtotal ||
                      item?.lineTotal ||
                      item?.total ||
                      item?.price ||
                      item?.sellingPrice ||
                      0;

                    return (
                      <div
                        key={item?._id || item?.id || index}
                        className="grid gap-4 rounded-2xl border border-[#dbe5f0] bg-[#fbfdff] p-4 transition hover:border-[#bcd5f5] hover:bg-white md:grid-cols-[100px_1fr_160px]"
                      >
                        <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                          {image ? (
                            <img
                              src={getImageUrl(image)}
                              alt={getItemName(item)}
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <Boxes className="text-[#2454b5]" size={34} />
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-black text-[#102033]">
                            {getItemName(item)}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#607287]">
                            {item?.brand ? <span>Brand: {item.brand}</span> : null}
                            {item?.sku ? <span>SKU: {item.sku}</span> : null}
                            {item?.mpn ? <span>MPN: {item.mpn}</span> : null}
                            <span>Qty: {qty}</span>
                          </div>

                          <p className="mt-3 w-fit rounded-full bg-[#eaf3ff] px-3 py-1 text-sm font-extrabold text-[#2454b5]">
                            {item?.itemStatus || item?.status || getStatus(order)}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-sm font-bold text-[#607287]">
                            Line Total
                          </p>
                          <p className="mt-1 text-2xl font-black text-[#102033]">
                            {formatCurrency(price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-[24px] border border-[#dbe5f0] bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-2xl font-black text-[#102033]">
                Need help with this order?
              </h2>
              <p className="mt-2 text-[#607287]">
                For alternate part, delivery update, GST invoice or bulk quotation support,
                contact Royal Component support team.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <CircleHelp className="mb-3 text-[#2454b5]" />
                  <p className="font-extrabold text-[#102033]">Support</p>
                  <p className="mt-1 text-sm text-[#607287]">Order related help.</p>
                </div>

                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <ShieldCheck className="mb-3 text-[#2454b5]" />
                  <p className="font-extrabold text-[#102033]">GST Invoice</p>
                  <p className="mt-1 text-sm text-[#607287]">Business-ready billing.</p>
                </div>

                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <Clock3 className="mb-3 text-[#2454b5]" />
                  <p className="font-extrabold text-[#102033]">Timeline</p>
                  <p className="mt-1 text-sm text-[#607287]">Dispatch confirmation.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
            <section className="rounded-[24px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-2xl font-black text-[#102033]">
                Buyer Details
              </h2>

              <div className="space-y-4 text-sm text-[#607287]">
                <p className="flex gap-3">
                  <Building2 className="shrink-0 text-[#2454b5]" size={20} />
                  <span>
                    <b className="block text-[#102033]">{buyerName}</b>
                    {companyName || "Company not added"}
                  </span>
                </p>

                <p className="flex gap-3">
                  <Phone className="shrink-0 text-[#2454b5]" size={20} />
                  {buyerPhone || "Phone not available"}
                </p>

                <p className="flex gap-3">
                  <Mail className="shrink-0 text-[#2454b5]" size={20} />
                  {buyerEmail || "Email not available"}
                </p>

                <p className="flex gap-3">
                  <MapPin className="shrink-0 text-[#2454b5]" size={20} />
                  <span>{getAddressText(order) || "Address not available"}</span>
                </p>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-2xl font-black text-[#102033]">
                Price Details
              </h2>

              <div className="space-y-4 text-[15px]">
                <div className="flex justify-between">
                  <span className="text-[#607287]">Subtotal</span>
                  <b className="text-[#102033]">
                    {formatCurrency(
                      order?.pricing?.subtotalExGst ||
                        order?.pricing?.subtotal ||
                        getTotal(order)
                    )}
                  </b>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#607287]">GST</span>
                  <b className="text-[#102033]">
                    {formatCurrency(order?.pricing?.gstTotal || 0)}
                  </b>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#607287]">Delivery</span>
                  <b className="text-[#102033]">
                    {formatCurrency(order?.pricing?.shipping || 0)}
                  </b>
                </div>

                <div className="flex justify-between border-t border-[#e5e7eb] pt-4 text-xl">
                  <span className="font-black text-[#102033]">Total</span>
                  <b className="text-[#102033]">{formatCurrency(getTotal(order))}</b>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#dbe5f0] bg-[#f8fcff] p-5">
              <h2 className="mb-5 text-xl font-black text-[#102033]">
                Payment & Order
              </h2>

              <div className="space-y-4 text-sm text-[#607287]">
                <p className="flex gap-3">
                  <CreditCard className="shrink-0 text-[#2454b5]" size={20} />
                  {formatPaymentMethod(paymentMethod)}
                </p>

                <p className="flex gap-3">
                  <ReceiptText className="shrink-0 text-[#2454b5]" size={20} />
                  {getOrderNumber(order)}
                </p>

                <p className="flex gap-3">
                  <PackageCheck className="shrink-0 text-[#2454b5]" size={20} />
                  {getStatus(order)}
                </p>
              </div>
            </section>

            {orderCanCancel ? (
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#ef4444] bg-white font-black text-[#ef4444] hover:bg-[#fff1f1]"
              >
                <Ban size={18} />
                Cancel Order
              </button>
            ) : null}

            <Link
              href="/products"
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#2454b5] font-black text-white hover:bg-[#1e4695]"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </aside>
        </div>
      </main>

      {showCancelModal ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(15,23,42,0.45)] px-4 backdrop-blur-sm">
          <div className="w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f1] text-[#ef4444]">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-2xl font-black text-[#102033]">
                  Cancel this order?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#607287]">
                  Please select the correct reason. This helps the procurement team process
                  cancellation and refund/update request faster.
                </p>
              </div>

              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-full bg-[#f3f7fb] p-2 text-[#607287]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {cancelReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                    cancelReason === reason
                      ? "border-[#2454b5] bg-[#eaf3ff]"
                      : "border-[#dbe5f0] bg-white hover:bg-[#f8fbff]"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="accent-[#2454b5]"
                  />
                  <span className="text-sm font-bold text-[#102033]">
                    {reason}
                  </span>
                </label>
              ))}

              <textarea
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
                rows={4}
                placeholder="Add more details about cancellation request..."
                className="w-full rounded-2xl border border-[#dbe5f0] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowCancelModal(false)}
                className="h-[50px] flex-1 rounded-xl border border-[#dbe5f0] bg-white font-black text-[#334155] hover:bg-[#f8fbff]"
              >
                Keep Order
              </button>

              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading || !cancelReason}
                className="h-[50px] flex-1 rounded-xl bg-[#ef4444] font-black text-white hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}