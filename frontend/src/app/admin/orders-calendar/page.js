"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { adminRequest } from "@/lib/api";

const statusColors = {

  "Order Placed":
    "bg-blue-100 text-blue-700",

  Processing:
    "bg-yellow-100 text-yellow-700",

  Packed:
    "bg-orange-100 text-orange-700",

  Shipped:
    "bg-purple-100 text-purple-700",

  "Out for Delivery":
    "bg-pink-100 text-pink-700",

  Delivered:
    "bg-green-100 text-green-700",

  Cancelled:
    "bg-red-100 text-red-700",

};

export default function OrdersCalendarPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [selectedDate, setSelectedDate] =
    useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const loadOrders = async () => {

    try {

      const data = await adminRequest(
        "/api/orders/admin/all"
      );

      setOrders(data.orders || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadOrders();

  }, []);

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const d = new Date(order.createdAt);

      return (
        d.getMonth() === month &&
        d.getFullYear() === year
      );

    });

  }, [orders, month, year]);

  const getOrdersByDay = (day) => {

    return filteredOrders.filter((order) => {

      const d = new Date(order.createdAt);

      return d.getDate() === day;

    });

  };

  const selectedOrders =
    selectedDate !== null
      ? getOrdersByDay(selectedDate)
      : [];

  const totalRevenue =
    filteredOrders.reduce(
      (acc, item) =>
        acc +
        Number(item.finalAmount || 0),
      0
    );

  const deliveredCount =
    filteredOrders.filter(
      (o) => o.status === "Delivered"
    ).length;

  const processingCount =
    filteredOrders.filter(
      (o) => o.status === "Processing"
    ).length;

  const packedCount =
    filteredOrders.filter(
      (o) => o.status === "Packed"
    ).length;

  const shippedCount =
    filteredOrders.filter(
      (o) => o.status === "Shipped"
    ).length;

  const outForDeliveryCount =
    filteredOrders.filter(
      (o) => o.status === "Out for Delivery"
    ).length;

  const cancelledCount =
    filteredOrders.filter(
      (o) => o.status === "Cancelled"
    ).length;

  if (loading) {

    return (
      <div className="p-10 text-2xl font-bold">
        Loading orders...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      {/* HEADER */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <div>

          <h1 className="text-5xl font-black text-[#102033]">
            Orders Calendar
          </h1>

          <p className="mt-2 text-slate-500">
            Track all orders day wise
          </p>

        </div>

        <div className="flex gap-3">

          <select
            value={month}
            onChange={(e) =>
              setMonth(Number(e.target.value))
            }
            className="rounded-2xl border bg-white px-5 py-3 font-bold shadow-sm"
          >

            {monthNames.map((m, i) => (

              <option key={i} value={i}>
                {m}
              </option>

            ))}

          </select>

          <select
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
            className="rounded-2xl border bg-white px-5 py-3 font-bold shadow-sm"
          >

            {Array.from(
              { length: 15 },
              (_, i) =>
                new Date().getFullYear() - 5 + i
            ).map((y) => (

              <option key={y} value={y}>
                {y}
              </option>

            ))}

          </select>

        </div>

      </div>

      {/* STATS */}
      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <Link
          href="/admin/orders"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Total Orders
          </p>

          <h2 className="mt-3 text-5xl font-black text-[#102033]">
            {filteredOrders.length}
          </h2>

        </Link>

        <Link
          href="/admin/order-status/delivered"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Delivered Orders
          </p>

          <h2 className="mt-3 text-5xl font-black text-green-600">
            {deliveredCount}
          </h2>

        </Link>

        <Link
          href="/admin/revenue"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Revenue
          </p>

          <h2 className="mt-3 break-all text-[34px] leading-none font-black text-blue-600">
            ₹
            {totalRevenue.toLocaleString("en-IN")}
          </h2>

        </Link>

        <Link
          href="/admin/order-status/processing"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Processing
          </p>

          <h2 className="mt-3 text-5xl font-black text-yellow-500">
            {processingCount}
          </h2>

        </Link>

        <Link
          href="/admin/order-status/packed"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Packed
          </p>

          <h2 className="mt-3 text-5xl font-black text-orange-500">
            {packedCount}
          </h2>

        </Link>

        <Link
          href="/admin/order-status/shipped"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Shipped
          </p>

          <h2 className="mt-3 text-5xl font-black text-purple-600">
            {shippedCount}
          </h2>

        </Link>

        <Link
          href="/admin/order-status/out-for-delivery"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Out For Delivery
          </p>

          <h2 className="mt-3 text-5xl font-black text-pink-600">
            {outForDeliveryCount}
          </h2>

        </Link>

        <Link
          href="/admin/order-status/cancelled"
          className="rounded-[30px] bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
        >

          <p className="text-sm font-semibold text-slate-500">
            Cancelled
          </p>

          <h2 className="mt-3 text-5xl font-black text-red-600">
            {cancelledCount}
          </h2>

        </Link>

      </div>

      {/* CALENDAR */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="mb-6 grid grid-cols-7 gap-4 text-center text-lg font-bold text-slate-500">

          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (

            <div key={day}>
              {day}
            </div>

          ))}

        </div>

        <div className="grid grid-cols-7 gap-4">

          {Array.from({
            length: firstDay,
          }).map((_, i) => (

            <div key={i}></div>

          ))}

          {Array.from({
            length: daysInMonth,
          }).map((_, i) => {

            const day = i + 1;

            const dayOrders =
              getOrdersByDay(day);

            const revenue =
              dayOrders.reduce(
                (acc, item) =>
                  acc +
                  Number(
                    item.finalAmount || 0
                  ),
                0
              );

            return (

              <button
                key={day}
                onClick={() =>
                  setSelectedDate(day)
                }
                className={`min-h-[150px] overflow-hidden rounded-[28px] border border-slate-300 bg-white p-5 text-left transition-all hover:shadow-xl ${selectedDate === day
                  ? "border-blue-500 bg-blue-50"
                  : "bg-slate-50"
                  }`}
              >

                <div className="text-[42px] leading-none font-black text-[#102033]">
                  {day}
                </div>

                <div className="mt-3 text-sm font-semibold text-slate-500">

                  {dayOrders.length}
                  {" "}
                  Orders

                </div>

                <div className="mt-3 flex flex-wrap gap-2">

                  {[
                    "Order Placed",
                    "Processing",
                    "Packed",
                    "Shipped",
                    "Out for Delivery",
                    "Delivered",
                    "Cancelled",
                  ].map((status) => {

                    const count = dayOrders.filter(
                      (o) => o.status === status
                    ).length;

                    if (count === 0) return null;

                    return (

                      <div
                        key={status}
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusColors[status]
                          }`}
                      >
                        {count}
                      </div>

                    );

                  })}

                </div>

                <div className="mt-3 text-[16px] leading-tight font-black text-green-600 break-all">

                  ₹
                  {revenue.toLocaleString(
                    "en-IN"
                  )}

                </div>

              </button>

            );

          })}

        </div>

      </div>

      {/* SELECTED ORDERS */}
      <div className="mt-10">

        <h2 className="mb-5 text-3xl font-black text-[#102033]">

          {selectedDate
            ? `Orders on ${selectedDate} ${monthNames[month]}`
            : "Select a date"}

        </h2>

        <div className="space-y-5">

          {selectedOrders.map((order) => (

            <Link
              key={order._id}
              href={`/admin/orders/${order._id}`}
              className="block rounded-[30px] bg-white p-6 shadow-sm transition-all hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-2xl font-black text-[#102033]">
                    {order.orderNumber}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {order.userInfo?.name}
                  </p>

                </div>

                <div className="text-right">

                  <div className="text-2xl font-black text-blue-600">
                    ₹
                    {Number(
                      order.finalAmount || 0
                    ).toLocaleString("en-IN")}
                  </div>

                  <div
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusColors[
                      order.status
                    ] || "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {order.status}
                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>

  );

}