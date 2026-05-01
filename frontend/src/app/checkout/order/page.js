"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Eye,
  Clock3,
  ShieldCheck,
  Boxes,
  CalendarDays,
  UserRound,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";

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

function getOrderNumber(order) {
  return order?.orderNumber || order?.orderId || order?._id || "Order";
}

function getStatus(order) {
  return order?.orderStatus || order?.status || "Order Placed";
}

function getItems(order) {
  return order?.items || order?.products || [];
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

function getBuyerName(order) {
  return (
    order?.buyer?.fullName ||
    order?.userInfo?.name ||
    order?.user?.name ||
    "Customer"
  );
}

export default function CheckoutOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token;

        if (!token) {
          setOrders([]);
          return;
        }

        const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await res.json();

        console.log("MY ORDERS RESPONSE:", data);

        const list =
          data?.orders ||
          data?.data ||
          data?.myOrders ||
          data?.userOrders ||
          [];

        setOrders(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Orders fetch error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return orders;

    return orders.filter((order) => {
      const items = getItems(order);

      const orderNo = String(getOrderNumber(order)).toLowerCase();
      const status = String(getStatus(order)).toLowerCase();
      const buyer = String(getBuyerName(order)).toLowerCase();
      const itemNames = items.map(getItemName).join(" ").toLowerCase();

      return (
        orderNo.includes(q) ||
        status.includes(q) ||
        buyer.includes(q) ||
        itemNames.includes(q)
      );
    });
  }, [orders, search]);

  const totalItems = useMemo(() => {
    return orders.reduce((sum, order) => sum + getItems(order).length, 0);
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = String(getStatus(order)).toLowerCase();
      return !status.includes("deliver") && !status.includes("cancel");
    }).length;
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#eef4fa] text-[#1f2937]">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
        <section className="mb-8 overflow-hidden rounded-[28px] border border-[#d8e6f4] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-[#eaf4ff] via-[#f8fbff] to-[#edf7ff] px-6 py-8 md:px-9 md:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#2454b5]">
                  Royal Component
                </p>

                <h1 className="mt-3 text-[42px] font-black leading-tight text-[#102033] md:text-[58px]">
                  My Orders
                </h1>

                <p className="mt-3 max-w-3xl text-[17px] leading-8 text-[#607287]">
                  Track your industrial component orders, quotation requests,
                  GST-ready commercial purchases and procurement status in one place.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#2454b5] px-6 text-[15px] font-extrabold text-white shadow-[0_12px_28px_rgba(36,84,181,0.22)] transition hover:bg-[#1e4695]"
              >
                <ShoppingBag size={18} />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
            <div className="rounded-2xl border border-[#dbe5f0] bg-[#fbfdff] p-5">
              <ReceiptText className="mb-3 text-[#2454b5]" size={26} />
              <p className="text-sm font-bold text-[#607287]">Total Orders</p>
              <h3 className="mt-1 text-4xl font-black text-[#102033]">
                {orders.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-[#dbe5f0] bg-[#fbfdff] p-5">
              <PackageCheck className="mb-3 text-[#2454b5]" size={26} />
              <p className="text-sm font-bold text-[#607287]">
                Active Requests
              </p>
              <h3 className="mt-1 text-4xl font-black text-[#102033]">
                {activeOrders}
              </h3>
            </div>

            <div className="rounded-2xl border border-[#dbe5f0] bg-[#fbfdff] p-5">
              <Boxes className="mb-3 text-[#2454b5]" size={26} />
              <p className="text-sm font-bold text-[#607287]">
                Ordered Items
              </p>
              <h3 className="mt-1 text-4xl font-black text-[#102033]">
                {totalItems}
              </h3>
            </div>
          </div>
        </section>

        <div className="mb-6 rounded-[22px] border border-[#dbe5f0] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3 rounded-2xl border border-[#dbe5f0] bg-[#f8fbff] px-4">
            <Search size={21} className="text-[#607287]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number, product name, status or buyer..."
              className="h-[56px] w-full bg-transparent text-[15px] outline-none placeholder:text-[#8aa0b5]"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-[#dbe5f0] bg-white p-12 text-center text-[#607287] shadow-sm">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-[24px] border border-[#dbe5f0] bg-white p-14 text-center shadow-sm">
            <PackageCheck size={70} className="mx-auto mb-5 text-[#2454b5]" />
            <h2 className="text-3xl font-black text-[#102033]">
              No orders found
            </h2>
            <p className="mt-3 text-[#607287]">
              Your placed order requests will appear here.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex rounded-2xl bg-[#2454b5] px-7 py-3 font-extrabold text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const orderId = order?._id || order?.id;
              const items = getItems(order);
              const previewItems = items.slice(0, 4);
              const remainingItems = Math.max(items.length - previewItems.length, 0);

              return (
                <section
                  key={orderId}
                  className="overflow-hidden rounded-[26px] border border-[#dbe5f0] bg-white shadow-[0_14px_38px_rgba(15,23,42,0.07)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_48px_rgba(15,23,42,0.1)]"
                >
                  <div className="flex flex-col gap-4 border-b border-[#e5edf6] bg-[#f8fbff] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#607287]">
                        Order Number
                      </p>
                      <h2 className="mt-1 text-[22px] font-black text-[#102033]">
                        {getOrderNumber(order)}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#d8e8ff] bg-white px-4 py-2 text-sm font-bold text-[#2454b5]">
                        <CalendarDays size={16} />
                        {formatDate(order?.createdAt)}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-[#bfecd0] bg-[#ecfdf3] px-4 py-2 text-sm font-bold text-[#15803d]">
                        <PackageCheck size={16} />
                        {getStatus(order)}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-5">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex shrink-0 -space-x-3">
                          {previewItems.length > 0 ? (
                            previewItems.map((item, index) => {
                              const image = getItemImage(item);

                              return (
                                <div
                                  key={item?._id || item?.id || index}
                                  className="h-[78px] w-[78px] overflow-hidden rounded-2xl border-4 border-white bg-[#f3f7fb] shadow-sm"
                                >
                                  {image ? (
                                    <img
                                      src={getImageUrl(image)}
                                      alt={getItemName(item)}
                                      className="h-full w-full object-contain p-2"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <Boxes size={26} className="text-[#2454b5]" />
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex h-[78px] w-[78px] items-center justify-center rounded-2xl bg-[#f3f7fb]">
                              <Boxes size={30} className="text-[#2454b5]" />
                            </div>
                          )}

                          {remainingItems > 0 ? (
                            <div className="flex h-[78px] w-[78px] items-center justify-center rounded-2xl border-4 border-white bg-[#eaf3ff] text-lg font-black text-[#2454b5] shadow-sm">
                              +{remainingItems}
                            </div>
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-black leading-snug text-[#102033]">
                            {items.length > 1
                              ? `${items.length} products in this order`
                              : getItemName(items[0])}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#607287]">
                            Buyer:{" "}
                            <b className="text-[#102033]">{getBuyerName(order)}</b>{" "}
                            • Commercial procurement request
                          </p>

                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {previewItems.map((item, index) => (
                              <div
                                key={item?._id || item?.id || index}
                                className="rounded-2xl border border-[#e4edf8] bg-[#fbfdff] p-4"
                              >
                                <p className="line-clamp-1 font-extrabold text-[#102033]">
                                  {getItemName(item)}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[#607287]">
                                  {item?.brand ? <span>{item.brand}</span> : null}
                                  {item?.sku ? <span>SKU: {item.sku}</span> : null}
                                  {item?.mpn ? <span>MPN: {item.mpn}</span> : null}
                                  <span>Qty: {item?.quantity || item?.qty || 1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <aside className="rounded-[22px] border border-[#dbe5f0] bg-[#fbfdff] p-5">
                      <p className="text-sm font-bold text-[#607287]">
                        Total Amount
                      </p>

                      <p className="mt-1 text-3xl font-black text-[#102033]">
                        {formatCurrency(getTotal(order))}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-[#607287]">
                        <p className="flex items-center gap-2">
                          <UserRound size={16} className="text-[#2454b5]" />
                          {getBuyerName(order)}
                        </p>

                        <p className="flex items-center gap-2">
                          <ShieldCheck size={16} className="text-[#2454b5]" />
                          GST-ready B2B order
                        </p>

                        <p className="flex items-center gap-2">
                          <Clock3 size={16} className="text-[#2454b5]" />
                          {formatDate(order?.createdAt)}
                        </p>
                      </div>

                      <Link
                        href={`/checkout/order/${orderId}`}
                        className="mt-5 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#2454b5] text-white font-extrabold shadow-[0_10px_24px_rgba(36,84,181,0.2)] transition hover:bg-[#1e4695] opacity-100"
                        >
                        <Eye size={18} />
                        <span>View Details</span>
                      </Link>
                    </aside>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}