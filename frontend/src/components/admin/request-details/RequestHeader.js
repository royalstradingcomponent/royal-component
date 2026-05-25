export default function RequestHeader({ request }) {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            BOM REQUEST
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-900">

            {request.items?.[0]?.componentName}

          </h1>

          <p className="mt-2 text-slate-500">

            Quotation No:
            {" "}
            {request.quotationNumber}

          </p>

        </div>

        <div className="rounded-2xl bg-blue-50 p-6">

          <p className="text-sm text-slate-500">
            Total Amount
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">

            ₹
            {Number(
              request.adminPrice || 0
            ).toLocaleString("en-IN")}

          </h2>

        </div>

      </div>

    </div>

  );

}