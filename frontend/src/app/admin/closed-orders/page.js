"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { adminRequest } from "@/lib/api";

export default function ClosedOrdersPage() {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadRequests();

  }, []);

  const loadRequests = async () => {

    try {

      const data =
        await adminRequest(
          "/api/component-requests/admin?status=closed"
        );

      setRequests(
        data.requests || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="p-10 text-2xl font-bold">
        Loading Closed Orders...
      </div>
    );

  }

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-5xl font-black text-[#0f172a]">
          Closed Orders
        </h1>

        <p className="mt-2 text-xl text-slate-500">
          Completed quotation requests
        </p>

      </div>

      <div className="space-y-6">

        {requests.map((request) => (

          <Link
            key={request._id}
            href={`/admin/component-requests/${request._id}`}
          >

            <div
              className="
                rounded-[35px]
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
                transition-all
                duration-300
                hover:scale-[1.01]
                hover:shadow-xl
                cursor-pointer
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2
                    className="
                      text-5xl
                      font-black
                      text-[#0f172a]
                    "
                  >
                    {
                      request.items?.[0]
                        ?.componentName
                    }
                  </h2>

                  <p
                    className="
                      mt-3
                      text-2xl
                      text-slate-500
                    "
                  >
                    {
                      request.customerName
                    }
                  </p>

                </div>

                <div className="text-right">

                  <h3
                    className="
                      text-5xl
                      font-black
                      text-green-600
                    "
                  >
                    ₹
                    {Number(
                      request.adminPrice || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                  <div
                    className="
                      mt-4
                      inline-block
                      rounded-full
                      bg-green-100
                      px-6
                      py-3
                      text-xl
                      font-bold
                      uppercase
                      tracking-wide
                      text-green-700
                    "
                  >
                    CLOSED
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