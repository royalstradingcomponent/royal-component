"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Hash,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CancelOrderItemModal from "@/components/CancelOrderItemModal";
import { API_BASE } from "@/lib/api";
import { useOrders } from "@/context/OrderContext";
import { getOrderStatusColor, getOrderStatusLabel } from "@/lib/orderStatus";

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getImageUrl(url) {
  if (!url) return "https://via.placeholder.com/200x200?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
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

const steps = [
  "Order Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function getActiveStep(status) {
  const index = steps.findIndex(
    (step) => step.toLowerCase() === String(status || "").toLowerCase()
  );
  return index >= 0 ? index : 0;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#eef2f7] py-3 last:border-b-0">
      <span className="text-sm text-[#607287]">{label}</span>
      <span className="break-all text-right text-sm font-bold text-[#102033]">
        {value || "N/A"}
      </span>
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-[18px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4ff] text-[#2454b5]">
        {icon}
      </div>
      <p className="text-sm text-[#607287]">{label}</p>
      <h3 className="mt-1 text-xl font-black text-[#102033]">{value}</h3>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { fetchOrderById, cancelOrderItem, actionLoading } = useOrders();

  const [order, setOrder] = useState(null);
  const [cancelItem, setCancelItem] = useState(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const loadOrder = async () => {
    const data = await fetchOrderById(id);
    setOrder(data);
  };

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const status = order?.status || order?.orderStatus || "Order Placed";

  const activeItems = useMemo(() => {
    return (order?.products || []).filter(
      (item) => String(item.itemStatus || "").toLowerCase() !== "cancelled"
    );
  }, [order]);

  const cancelledItems = useMemo(() => {
    return (order?.products || []).filter(
      (item) => String(item.itemStatus || "").toLowerCase() === "cancelled"
    );
  }, [order]);

  const activeStep = getActiveStep(status);

  const canCancelItem = (item) => {
    const itemStatus = item?.itemStatus || status;
    return !["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
      itemStatus
    );
  };

  const closeCancelForm = () => {
    setCancelItem(null);
    setReason("");
    setComment("");
  };

  const handleCancelItem = async (e) => {
    e.preventDefault();

    if (!cancelItem?._id) return;

    if (!reason) {
      alert("Please select cancellation reason");
      return;
    }

    await cancelOrderItem(id, cancelItem._id, reason, comment);
    await loadOrder();
    closeCancelForm();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f3f7fb]">
        <Navbar />
        <main className="mx-auto max-w-[1280px] px-4 py-16">
          <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-10 text-center shadow-sm">
            <PackageCheck size={52} className="mx-auto mb-4 text-[#2454b5]" />
            <p className="font-bold text-[#607287]">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f3f7fb] text-[#1f2937]">
      <Navbar />

      <main className="mx-auto max-w-[1280px] px-4 py-8">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe5f0] bg-white px-4 py-2 text-sm font-bold text-[#2454b5] shadow-sm hover:bg-[#eef4ff]"
        >
          <ArrowLeft size={17} />
          Back to orders
        </Link>

        <section className="mb-6 overflow-hidden rounded-[24px] border border-[#dbe5f0] bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#102033_0%,#2454b5_100%)] p-6 text-white md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-bold">
                  <ShieldCheck size={16} />
                  Secure Order Summary
                </p>

                <h1 className="text-[34px] font-black leading-tight md:text-[42px]">
                  Order Details
                </h1>

                <div className="mt-4 grid gap-2 text-sm text-white/85 md:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Hash size={16} />
                    Order Number:{" "}
                    <span className="font-bold text-white">
                      {order.orderNumber}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-4 py-2 text-sm font-black ${getOrderStatusColor(
                  status
                )}`}
              >
                {getOrderStatusLabel(status)}
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-4">
            <SummaryCard
              icon={<PackageCheck size={22} />}
              label="Total Items"
              value={`${order.products?.length || 0} item(s)`}
            />
            <SummaryCard
              icon={<Truck size={22} />}
              label="Active Items"
              value={`${activeItems.length} active`}
            />
            <SummaryCard
              icon={<ReceiptText size={22} />}
              label="Order Total"
              value={formatCurrency(order.pricing?.totalAmount)}
            />
            <SummaryCard
              icon={<WalletCards size={22} />}
              label="Payment"
              value={order.payment?.status || "Pending"}
            />
          </div>
        </section>

        <section className="mb-6 rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-black text-[#102033]">
            Delivery Progress
          </h2>

          <div className="grid gap-3 md:grid-cols-6">
            {steps.map((step, index) => {
              const done = index <= activeStep && status !== "Cancelled";

              return (
                <div
                  key={step}
                  className={`flex min-h-[92px] flex-col justify-center rounded-[16px] border p-4 ${
                    done
                      ? "border-[#2454b5] bg-[#eef4ff]"
                      : "border-[#dbe5f0] bg-[#f8fafc]"
                  }`}
                >
                  <CheckCircle2
                    size={22}
                    className={done ? "text-[#2454b5]" : "text-[#94a3b8]"}
                  />
                  <p
                    className={`mt-2 text-sm font-black ${
                      done ? "text-[#102033]" : "text-[#607287]"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-5">
            <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-black text-[#102033]">
                <PackageCheck size={25} />
                Ordered Items
              </h2>

              <div className="space-y-4">
                {(order.products || []).map((item) => {
                  const itemStatus = item.itemStatus || status;
                  const cancelled =
                    String(itemStatus).toLowerCase() === "cancelled";

                  return (
                    <div
                      key={item._id || item.productId}
                      className={`rounded-[18px] border p-4 ${
                        cancelled
                          ? "border-red-200 bg-red-50/50"
                          : "border-[#e5edf6] bg-white"
                      }`}
                    >
                      <div className="grid gap-4 md:grid-cols-[110px_1fr_190px]">
                        <div className="flex h-[105px] w-[105px] items-center justify-center rounded-[16px] border border-[#edf2f7] bg-[#f8fafc]">
                          <img
                            src={getImageUrl(item.img)}
                            alt={item.name}
                            className="h-[92px] w-[92px] object-contain"
                          />
                        </div>

                        <div>
                          <h3 className="text-xl font-black text-[#102033]">
                            {item.name}
                          </h3>

                          <div className="mt-3 grid gap-2 text-sm text-[#607287] sm:grid-cols-2">
                            <p>
                              Brand:{" "}
                              <span className="font-bold text-[#102033]">
                                {item.brand || "Generic"}
                              </span>
                            </p>
                            <p>
                              Qty:{" "}
                              <span className="font-bold text-[#2454b5]">
                                {item.quantity}
                              </span>
                            </p>
                            {item.sku ? <p>SKU: {item.sku}</p> : null}
                            {item.mpn ? <p>MPN: {item.mpn}</p> : null}
                            {item.hsnCode ? <p>HSN: {item.hsnCode}</p> : null}
                            <p>GST: {item.gstPercent || 18}%</p>
                          </div>

                          <span
                            className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-black ${getOrderStatusColor(
                              itemStatus
                            )}`}
                          >
                            {getOrderStatusLabel(itemStatus)}
                          </span>

                          {item?.cancellation?.cancelReason ? (
                            <div className="mt-3 rounded-[12px] border border-red-200 bg-white p-3 text-sm text-red-700">
                              <p className="font-black">
                                Cancel Reason:{" "}
                                {item.cancellation.cancelReason}
                              </p>
                              {item.cancellation.cancelComment ? (
                                <p className="mt-1">
                                  Note: {item.cancellation.cancelComment}
                                </p>
                              ) : null}
                              {item.cancellation.cancelledAt ? (
                                <p className="mt-1">
                                  Cancelled on{" "}
                                  {formatDate(item.cancellation.cancelledAt)}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-col items-start justify-between gap-4 md:items-end">
                          <div className="w-full rounded-[14px] bg-[#f8fafc] p-4 text-left md:text-right">
                            <p className="text-sm text-[#607287]">Item Price</p>
                            <p className="text-xl font-black text-[#102033]">
                              {formatCurrency(item.lineSubtotal)}
                            </p>
                            <p className="mt-1 text-sm text-[#607287]">
                              GST: {formatCurrency(item.gstAmount)}
                            </p>
                            <p className="text-sm font-bold text-[#102033]">
                              Total: {formatCurrency(item.lineTotal)}
                            </p>
                          </div>

                          {canCancelItem(item) ? (
                            <button
                              type="button"
                              onClick={() => setCancelItem(item)}
                              className="w-full rounded-[12px] border border-red-300 bg-red-50 px-4 py-3 text-sm font-black text-red-700 hover:bg-red-100"
                            >
                              Cancel Item
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-black text-[#102033]">
                <Truck size={25} />
                Tracking Timeline
              </h2>

              <div className="space-y-4">
                {(order.trackingEvents || []).map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2454b5] text-white">
                        <CheckCircle2 size={18} />
                      </span>
                      <span className="mt-2 h-full w-[3px] rounded-full bg-[#dbe5f0]" />
                    </div>

                    <div className="pb-4">
                      <p className="font-black text-[#102033]">
                        {event.status}
                      </p>
                      <p className="mt-1 text-sm text-[#607287]">
                        {event.message}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#94a3b8]">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                  <Truck size={22} />
                  Shipment Details
                </h2>

                <InfoRow label="Courier" value={order.shipment?.courier} />
                <InfoRow
                  label="Tracking ID"
                  value={order.shipment?.trackingId}
                />
                <InfoRow
                  label="Estimated Delivery"
                  value={formatDate(order.shipment?.estimatedDelivery)}
                />
                <InfoRow
                  label="Shipped At"
                  value={formatDate(order.shipment?.shippedAt)}
                />
                <InfoRow
                  label="Delivered At"
                  value={formatDate(order.shipment?.deliveredAt)}
                />

                {order.shipment?.trackingUrl ? (
                  <a
                    href={order.shipment.trackingUrl}
                    target="_blank"
                    className="mt-4 inline-flex w-full justify-center rounded-[12px] bg-[#2454b5] px-4 py-3 text-sm font-black text-white hover:bg-[#1e4695]"
                  >
                    Track Shipment
                  </a>
                ) : null}
              </div>

              <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                  <Building2 size={22} />
                  Business Details
                </h2>

                <InfoRow
                  label="Company"
                  value={order.userInfo?.companyName || "N/A"}
                />
                <InfoRow
                  label="GSTIN"
                  value={order.userInfo?.gstNumber || "N/A"}
                />
                <InfoRow
                  label="Email"
                  value={order.userInfo?.email || "N/A"}
                />
                <InfoRow
                  label="Alt Phone"
                  value={order.userInfo?.alternatePhone || "N/A"}
                />
              </div>

              <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm md:col-span-2">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                  <FileText size={22} />
                  Order Meta
                </h2>

                <div className="grid gap-x-6 md:grid-cols-2">
                  <InfoRow
                    label="Invoice No."
                    value={order.invoiceNumber || "N/A"}
                  />
                  <InfoRow label="Order ID" value={order._id} />
                  <InfoRow label="Note" value={order.note || "N/A"} />
                  <InfoRow
                    label="Cancelled Items"
                    value={`${cancelledItems.length}`}
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
            <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                <ReceiptText size={22} />
                Price Details
              </h2>

              <InfoRow
                label="Subtotal"
                value={formatCurrency(order.pricing?.subtotal)}
              />
              <InfoRow
                label="Product Discount"
                value={`- ${formatCurrency(order.pricing?.productDiscount)}`}
              />
              <InfoRow
                label="Coupon Discount"
                value={`- ${formatCurrency(order.pricing?.couponDiscount)}`}
              />
              <InfoRow label="GST" value={formatCurrency(order.pricing?.tax)} />
              <InfoRow
                label="Delivery"
                value={formatCurrency(order.pricing?.shippingCharge)}
              />
              <InfoRow
                label="Platform Fee"
                value={formatCurrency(order.pricing?.platformFee)}
              />

              <div className="mt-4 flex justify-between rounded-[16px] bg-[#102033] px-4 py-4 text-white">
                <span className="font-black">Grand Total</span>
                <span className="font-black">
                  {formatCurrency(order.pricing?.totalAmount)}
                </span>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                <CreditCard size={22} />
                Payment Details
              </h2>

              <InfoRow label="Method" value={order.payment?.method} />
              <InfoRow label="Status" value={order.payment?.status} />
              <InfoRow label="Payment ID" value={order.payment?.paymentId} />
              <InfoRow label="Paid At" value={formatDate(order.payment?.paidAt)} />
            </div>

            <div className="rounded-[22px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                <MapPin size={22} />
                Delivery Address
              </h2>

              <p className="font-black text-[#102033]">{order.userInfo?.name}</p>
              <p className="mt-2 text-[#607287]">{order.userInfo?.addressLine1}</p>

              {order.userInfo?.addressLine2 ? (
                <p className="text-[#607287]">{order.userInfo.addressLine2}</p>
              ) : null}

              <p className="text-[#607287]">
                {order.userInfo?.city}, {order.userInfo?.state} -{" "}
                {order.userInfo?.pincode}
              </p>

              <p className="text-[#607287]">{order.userInfo?.country}</p>

              <p className="mt-4 flex items-center gap-2 font-bold text-[#607287]">
                <Phone size={17} />
                {order.userInfo?.phone}
              </p>
            </div>
          </aside>
        </div>
      </main>

      {cancelItem ? (
        <CancelOrderItemModal
          item={cancelItem}
          reasons={cancelReasons}
          reason={reason}
          setReason={setReason}
          comment={comment}
          setComment={setComment}
          onClose={closeCancelForm}
          onSubmit={handleCancelItem}
          loading={actionLoading}
        />
      ) : null}

      <Footer />
    </div>
  );
}