"use client";

export default function CustomerInfoCard({ request }) {

  const fullAddress = `
    ${request?.addressLine1 || ""}
    ${request?.addressLine2 || ""}
    ${request?.city || ""}
    ${request?.state || ""}
    ${request?.pinCode || ""}
  `;

  return (

    <div className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            Customer Information
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Customer profile and delivery address details.
          </p>

        </div>

      </div>

      {/* GRID */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* CUSTOMER NAME */}

        <div>

          <p className="text-sm font-semibold text-slate-500">
            Customer Name
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {request?.customerName || "N/A"}
          </h3>

        </div>

        {/* EMAIL */}

        <div>

          <p className="text-sm font-semibold text-slate-500">
            Email Address
          </p>

          <h3 className="mt-2 break-all text-lg font-bold text-slate-900">
            {request?.customerEmail || "N/A"}
          </h3>

        </div>

        {/* PHONE */}

        <div>

          <p className="text-sm font-semibold text-slate-500">
            Phone Number
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {request?.customerPhone || "N/A"}
          </h3>

        </div>

        {/* COMPANY */}

        <div>

          <p className="text-sm font-semibold text-slate-500">
            Company Name
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {request?.companyName || "N/A"}
          </h3>

        </div>

        {/* ADDRESS */}

        <div className="md:col-span-2">

          <p className="text-sm font-semibold text-slate-500">
            Full Address
          </p>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <p className="text-base leading-8 text-slate-800">

              {request?.addressLine1}

              {request?.addressLine2 && (
                <>
                  <br />
                  {request?.addressLine2}
                </>
              )}

              <br />

              {request?.city}, {request?.state}

              <br />

              PIN - {request?.pinCode}

            </p>

          </div>

        </div>

        {/* REQUEST ID */}

        <div>

          <p className="text-sm font-semibold text-slate-500">
            Request ID
          </p>

          <h3 className="mt-2 break-all text-base font-bold text-slate-900">
            {request?._id}
          </h3>

        </div>

        {/* CREATED DATE */}

        <div>

          <p className="text-sm font-semibold text-slate-500">
            Request Date
          </p>

          <h3 className="mt-2 text-base font-bold text-slate-900">

            {request?.createdAt
              ? new Date(request.createdAt).toLocaleString()
              : "N/A"}

          </h3>

        </div>

      </div>

    </div>

  );

}