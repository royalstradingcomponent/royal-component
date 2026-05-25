"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { adminRequest } from "@/lib/api";

export default function AvailableQuotationsPage() {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadRequests();

  }, []);

  const loadRequests = async () => {

    try {

      const response = await adminRequest(
        "/api/component-requests/admin?status=available&limit=500"
      );

      console.log("FULL RESPONSE =>", response);

      const requestsData =
        response?.requests ||
        response?.data?.requests ||
        [];

      console.log("REQUESTS =>", requestsData);

      setRequests(requestsData);

    } catch (error) {

      console.log("AVAILABLE ERROR =>", error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="p-10 text-2xl font-bold">
        Loading available quotations...
      </div>
    );

  }

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-black text-[#102033]">
          Available Quotations
        </h1>

        <p className="mt-2 text-slate-500">
          All available customer quotation requests
        </p>

      </div>

      <div className="grid gap-5">

        {requests.length > 0 ? (

          requests.map((request) => (

            <Link
              key={request._id}
              href={`/admin/component-requests/${request._id}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-black text-[#102033]">
                    {request.items?.[0]?.componentName}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    {request.customerName}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-3xl font-black text-green-600">
                    ₹{request.subTotal || 0}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-bold uppercase text-green-700">
                    {request.status}
                  </span>

                </div>

              </div>

            </Link>

          ))

        ) : (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <p className="text-xl font-bold text-slate-500">
              No available quotations found
            </p>

          </div>

        )}

      </div>

    </div>

  );

}