"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AllRequestsCard({
  requests = [],
}) {

  const router = useRouter();

  const [showAll, setShowAll] = useState(false);

  const visibleRequests = showAll
    ? requests
    : requests.slice(0, 5);

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-[#102033]">
            Total Requests
          </h2>

          <p className="text-sm text-slate-500">
            View all BOM quotation requests
          </p>

        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 rounded-xl bg-[#2454b5] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4697] transition-all"
        >
          {showAll ? "Show Less" : "More"}
          <ChevronRight size={16} />
        </button>

      </div>

      <div className="space-y-3">

        {visibleRequests.length ? (

          visibleRequests.map((request) => (

            <Link
              key={request._id}
              href={`/admin/component-requests/${request._id}`}
              className="block cursor-pointer rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-bold text-[#102033]">
                    {request.items?.[0]?.componentName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {request.customerName}
                  </p>

                </div>

                <div className="text-right">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                    {request.status}
                  </span>

                </div>

              </div>

            </Link>

          ))

        ) : (

          <p className="text-sm text-slate-500">
            No requests found.
          </p>

        )}

      </div>

    </div>

  );
}