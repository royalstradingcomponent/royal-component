"use client";

export default function SupplierHistory({ request }) {

  const suppliers = request?.matchedSupplierSources || [];

  if (!suppliers.length) {

    return (

      <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-black text-slate-900">
          Supplier History
        </h2>

        <p className="mt-6 text-slate-500">
          No supplier history available.
        </p>

      </div>

    );

  }

  return (

    <div className="rounded-[30px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-3xl font-black text-slate-900">
          Supplier History
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Complete supplier sourcing, pricing, margin and purchase history.
        </p>

      </div>

      <div className="space-y-8">

        {suppliers.map((supplier, index) => {

          const quantity =
            request?.items?.[0]?.quantity || 1;

          const usdPrice =
            Number(form.usdPrice || 0);

          const usdRate =
            Number(form.usdRate || 85);

          const purchasePrice =
            usdPrice > 0
              ? usdPrice * usdRate
              : Number(form.purchasePrice || 0);

          const purchaseTotal =
            purchasePrice * quantity;

          const extraCharge =
            supplier.extraCharge || 0;

          const profitPercent =
            supplier.profitPercent || 0;

          const gstPercent =
            supplier.gstPercent || 0;

          const profitAmount =
            (purchaseTotal * profitPercent) / 100;

          const finalBeforeGST =
            purchaseTotal +
            extraCharge +
            profitAmount;

          const gstAmount =
            (finalBeforeGST * gstPercent) / 100;

          const finalSell =
            finalBeforeGST + gstAmount;

          return (

            <div
              key={index}
              className="rounded-[28px] border border-slate-200 bg-slate-50 p-6"
            >

              {/* TOP */}

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div>

                  <h3 className="text-2xl font-black uppercase text-slate-900">

                    {supplier.supplierCompany || "Supplier"}

                  </h3>

                  <p className="mt-2 text-lg font-bold text-slate-700">

                    {supplier.partNumber}

                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">

                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                      {supplier.brand || "N/A"}
                    </span>

                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                      {supplier.availabilityStatus || "AVAILABLE"}
                    </span>

                    {supplier.isPreferred && (
                      <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
                        Preferred Supplier
                      </span>
                    )}

                  </div>

                </div>

              </div>

              {/* PRICING GRID */}

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <Card
                  title="Quantity"
                  value={quantity}
                />

                <Card
                  title="MOQ"
                  value={supplier.moq || 0}
                />

                <Card
                  title="Unit Buy Price"
                  value={`₹ ${purchasePrice}`}
                  blue
                />

                <Card
                  title="Purchase Total"
                  value={`₹ ${purchaseTotal.toFixed(2)}`}
                />

                <Card
                  title="Extra Charge"
                  value={`₹ ${extraCharge}`}
                  orange
                />

                <Card
                  title="Profit %"
                  value={`${profitPercent}%`}
                  green
                />

                <Card
                  title="Profit Amount"
                  value={`₹ ${profitAmount.toFixed(2)}`}
                  green
                />

                <Card
                  title="GST %"
                  value={`${gstPercent}%`}
                  orange
                />

                <Card
                  title="GST Amount"
                  value={`₹ ${gstAmount.toFixed(2)}`}
                  orange
                />

                <Card
                  title="Final Selling Price"
                  value={`₹ ${finalSell.toFixed(2)}`}
                  blue
                />

                <Card
                  title="Lead Time"
                  value={supplier.leadTime || "N/A"}
                />

                <Card
                  title="Last Purchase"
                  value={
                    supplier.lastPurchaseDate
                      ? new Date(
                        supplier.lastPurchaseDate
                      ).toLocaleDateString()
                      : "N/A"
                  }
                />

              </div>

              {/* CONTACT */}

              <div className="mt-8 grid gap-5 md:grid-cols-2">

                <InfoBox
                  label="Supplier Phone"
                  value={supplier.phone || "N/A"}
                />

                <InfoBox
                  label="WhatsApp"
                  value={supplier.whatsapp || "N/A"}
                />

                <InfoBox
                  label="Supplier Email"
                  value={supplier.email || "N/A"}
                />

                <InfoBox
                  label="Contact Person"
                  value={supplier.contactPerson || "N/A"}
                />

              </div>

              {/* ADDRESS */}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Supplier Address
                </p>

                <p className="mt-3 text-base leading-8 text-slate-800">
                  {supplier.address || "No address available"}
                </p>

              </div>

              {/* QUALITY NOTE */}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Quality Note
                </p>

                <p className="mt-3 text-base leading-8 text-slate-800">
                  {supplier.qualityNote || "No quality note"}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

/* CARD */

function Card({
  title,
  value,
  blue,
  green,
  orange,
}) {

  return (

    <div
      className={`rounded-2xl border p-5 ${blue
          ? "border-blue-100 bg-blue-50"
          : green
            ? "border-green-100 bg-green-50"
            : orange
              ? "border-orange-100 bg-orange-50"
              : "border-slate-200 bg-white"
        }`}
    >

      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <h3
        className={`mt-3 text-2xl font-black break-all ${blue
            ? "text-blue-600"
            : green
              ? "text-green-600"
              : orange
                ? "text-orange-600"
                : "text-slate-900"
          }`}
      >
        {value}
      </h3>

    </div>

  );

}

/* INFO BOX */

function InfoBox({ label, value }) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <h3 className="mt-3 break-all text-lg font-bold text-slate-900">
        {value}
      </h3>

    </div>

  );

}