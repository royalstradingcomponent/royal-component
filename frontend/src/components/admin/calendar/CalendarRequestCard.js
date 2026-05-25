"use client";

import Link from "next/link";

export default function CalendarRequestCard({
  request,
}) {

  return (

    <Link
      href={`/admin/component-requests/${request._id}`}
      className="block rounded-3xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-black text-[#102033]">

            {request.items?.[0]?.componentName}

          </h2>

          <p className="mt-2 text-lg text-slate-500">

            {request.customerName}

          </p>

          <p className="mt-2 text-sm font-bold uppercase text-blue-600">

            {request.status}

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

  );

}