"use client";

import { adminRequest } from "@/lib/api";

const statuses = [
  "new",
  "checking",
  "available",
  "quoted",
  "closed",
];

export default function StatusTracker({
  request,
}) {

  const handleStatusChange = async (
    status
  ) => {

    try {

      const response =
        await adminRequest(
          `/api/component-requests/admin/${request._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

      console.log(response);

      window.location.reload();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-black text-[#102033]">
        Request Status
      </h2>

      <div className="space-y-4">

        {statuses.map((status) => {

          const active =
            request.status?.toLowerCase() ===
            status;

          return (

            <button
              key={status}
              onClick={() =>
                handleStatusChange(status)
              }
              className={`w-full rounded-2xl border p-5 text-left text-xl font-black uppercase transition-all duration-300
              ${
                active
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >

              {status}

            </button>

          );

        })}

      </div>

    </div>

  );

}