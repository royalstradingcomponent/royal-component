"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { adminRequest } from "@/lib/api";

import { ShoppingBag } from "lucide-react";

export default function TotalSalesPage() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [totalSales, setTotalSales] =
    useState(0);

  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders = async () => {

    try {

      const data =
        await adminRequest(
          "/api/orders/admin/all"
        );

      const allOrders =
        data.orders || [];

      setOrders(allOrders);

      const total =
        allOrders.reduce(
          (acc, order) =>
            acc +
            Number(
              order.finalAmount || 0
            ),
          0
        );

      setTotalSales(total);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="p-6 text-sm font-semibold">
        Loading Sales...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-[#eef3f9] p-4 md:p-6">

      {/* top section */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-5
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >

        <div
  className="
    relative
    overflow-hidden
    rounded-[28px]
    border
    border-slate-200
    bg-white
    p-6
    shadow-sm
    flex-1
  "
>

  {/* bg circle */}

  <div
    className="
      absolute
      -top-10
      -right-10
      h-[120px]
      w-[120px]
      rounded-full
      bg-slate-100
    "
  ></div>

  <div className="relative z-10">

    <div
      className="
        inline-flex
        rounded-full
        bg-blue-100
        px-3
        py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-[2px]
        text-blue-700
      "
    >
      Sales Analytics
    </div>

    <h1
      className="
        mt-4
        text-3xl
        font-black
        text-[#0f172a]
      "
    >
      Total Sales
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      Revenue from all ecommerce orders
    </p>

  </div>

</div>

        {/* revenue card */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            xl:min-w-[320px]
          "
        >

          <div
            className="
              absolute
              -top-10
              -right-10
              h-[120px]
              w-[120px]
              rounded-full
              bg-slate-100
            "
          ></div>

          <div className="relative z-10">

            <div
              className="
                inline-flex
                rounded-full
                bg-green-100
                px-3
                py-1.5
                text-[10px]
                font-bold
                uppercase
                tracking-[2px]
                text-green-700
              "
            >
              Total Orders
            </div>

            <h2
              className="
                mt-4
                text-xs
                font-bold
                uppercase
                tracking-[2px]
                text-slate-500
              "
            >
              Total Revenue
            </h2>

            <h1
              className="
                mt-3
                break-all
                text-[34px]
                font-black
                leading-tight
                text-[#0f172a]
              "
            >
              ₹
              {Number(
                totalSales || 0
              ).toLocaleString("en-IN")}
            </h1>

            <div
              className="
                mt-4
                inline-flex
                rounded-full
                bg-emerald-100
                px-3
                py-1.5
                text-[10px]
                font-bold
                uppercase
                tracking-[2px]
                text-emerald-700
              "
            >
              All Order Revenue
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {orders.length} Orders
            </p>

          </div>

        </div>

      </div>

      {/* orders list */}

      <div className="space-y-4">

        {orders.map((order) => (

          <Link
            key={order._id}
            href={`/admin/orders/${order._id}`}
          >

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:shadow-lg
              "
            >

              <div
                className="
                  absolute
                  -top-10
                  -right-10
                  h-[120px]
                  w-[120px]
                  rounded-full
                  bg-slate-100
                "
              ></div>

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  gap-5
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >

                {/* left */}

                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-blue-500
                      to-indigo-700
                      text-white
                      shadow-md
                    "
                  >

                    <ShoppingBag size={24} />

                  </div>

                  <div>

                    <div
                      className="
                        inline-flex
                        rounded-full
                        bg-blue-100
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[2px]
                        text-blue-700
                      "
                    >
                      Order Revenue
                    </div>

                    <h2
                      className="
                        mt-3
                        text-2xl
                        font-black
                        text-[#0f172a]
                      "
                    >
                      {
                        order.products?.[0]
                          ?.name
                      }
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      {
                        order.userInfo?.name
                      }
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Order No :
                      {" "}
                      {order.orderNumber}
                    </p>

                  </div>

                </div>

                {/* right */}

                <div className="text-left xl:text-right">

                  <h2
                    className="
                      break-all
                      text-[32px]
                      font-black
                      text-emerald-600
                    "
                  >
                    ₹
                    {Number(
                      order.finalAmount || 0
                    ).toLocaleString("en-IN")}
                  </h2>

                  <div
                    className="
                      mt-3
                      inline-flex
                      rounded-full
                      bg-green-100
                      px-4
                      py-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-green-700
                    "
                  >
                    {
                      order.orderStatus
                    }
                  </div>

                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );

}