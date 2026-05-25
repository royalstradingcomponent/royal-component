"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminRequest } from "@/lib/api";

export default function TodayRequestsPage() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {

    try {

      const data = await adminRequest(
        "/api/component-requests/admin"
      );

      const today = new Date();

      const todayRequests =
        data.requests?.filter((item) => {

          const created = new Date(item.createdAt);

          return (
            created.getDate() === today.getDate() &&
            created.getMonth() === today.getMonth() &&
            created.getFullYear() === today.getFullYear()
          );

        }) || [];

      setRequests(todayRequests);

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
        Loading today's requests...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-black text-[#102033]">
          Today's Requests
        </h1>

        <p className="mt-2 text-slate-500">
          All requests received today
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
                    {request.status?.toUpperCase()}
                  </p>

                </div>

                <div className="text-right">

                  <h2 className="text-4xl font-black text-green-600">

                    ₹
                    {Number(
                      request.adminPrice || 0
                    ).toLocaleString("en-IN")}

                  </h2>

                </div>

              </div>

            </Link>

          ))

        ) : (

          <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No requests found for today.
          </div>

        )}

      </div>

    </div>

  );

}