"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminRequest } from "@/lib/api";

export default function QuotedRequestsPage() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {

    try {

      const data = await adminRequest(
        "/api/component-requests/admin"
      );

      const quotedOnly =
        data.requests?.filter(
          (item) => item.status === "quoted"
        ) || [];

      setRequests(quotedOnly);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadRequests();

  }, []);

  if (loading) {

    return (
      <div className="p-10 text-xl font-bold">
        Loading quoted requests...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-black text-[#102033]">
          Quoted Requests
        </h1>

        <p className="mt-2 text-slate-500">
          All ready quotations
        </p>

      </div>

      <div className="space-y-5">

        {requests.length ? (

          requests.map((request) => (

            <Link
              key={request._id}
              href={`/admin/component-requests/${request._id}`}
              className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-3xl font-black text-[#102033]">
                    {request.items?.[0]?.componentName}
                  </h2>

                  <p className="mt-2 text-lg text-slate-500">
                    {request.customerName}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    Quotation No:
                    {" "}
                    {request.quotationNumber}
                  </p>

                </div>

                <div className="text-right">

                  <h2 className="text-4xl font-black text-green-600">

                    ₹
                    {Number(
                      request.adminPrice || 0
                    ).toLocaleString("en-IN")}

                  </h2>

                  <div className="mt-3 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-green-700">
                    QUOTED
                  </div>

                </div>

              </div>

            </Link>

          ))

        ) : (

          <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No quoted requests found.
          </div>

        )}

      </div>

    </div>

  );

}