"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { adminRequest } from "@/lib/api";

export default function TotalRequestsPage() {

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
          "/api/component-requests/admin"
        );

      setRequests(data.requests || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="p-10 text-lg font-semibold">
        Loading Requests...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-[#f4f8fc] p-6">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1
            className="
              text-4xl
              font-black
              tracking-tight
              text-[#0f172a]
            "
          >
            Total Quotation Requests
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View all customer quotation requests
          </p>

        </div>

        <div
          className="
            rounded-3xl
            border
            border-blue-100
            bg-white
            px-6
            py-4
            shadow-sm
          "
        >

          <p className="text-sm text-slate-500">
            Total Requests
          </p>

          <h2
            className="
              mt-1
              text-4xl
              font-black
              text-[#2563eb]
            "
          >
            {requests.length}
          </h2>

        </div>

      </div>

      <div className="space-y-4">

        {requests.map((request) => (

          <Link
            key={request._id}
            href={`/admin/component-requests/${request._id}`}
          >

            <div
              className="
                flex
                items-center
                justify-between
                rounded-[28px]
                border
                border-slate-200
                bg-white
                px-8
                py-6
                shadow-sm
                transition-all
                duration-300
                hover:shadow-lg
                cursor-pointer
              "
            >

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
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
                    mt-1
                    text-base
                    text-slate-500
                  "
                >
                  {request.customerName}
                </p>

              </div>

              <div className="text-right">

                <h3
                  className="
                    text-3xl
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
                  className={`
                    mt-3
                    inline-block
                    rounded-full
                    px-5
                    py-2
                    text-sm
                    font-bold
                    uppercase
                    tracking-wide
                    ${
                      request.status ===
                      "quoted"
                        ? "bg-green-100 text-green-700"
                        : request.status ===
                          "closed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  {request.status}
                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );

}