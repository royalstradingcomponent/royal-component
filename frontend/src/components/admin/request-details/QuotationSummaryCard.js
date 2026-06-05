"use client";

import { useState } from "react";
import { adminRequest } from "@/lib/api";

export default function QuotationSummaryCard({ request }) {

  const [editableItems, setEditableItems] = useState(
    request?.items || []
  );

  const items = request?.items || [];

  const quantity =
    items.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    );

  const unitPrice =
    quantity > 0
      ? Number(request.subTotal || 0) / quantity
      : 0;

  const calculatedSubTotal =
    editableItems.reduce(
      (sum, item) =>
        sum + Number(item.lineTotal || 0),
      0
    );

  const subTotal = calculatedSubTotal;

  const sgst =
    Number(request.sgstAmount || 0);

  const cgst =
    Number(request.cgstAmount || 0);

  const grandTotal =
    calculatedSubTotal +
    sgst +
    cgst;

  const handleItemChange = (
    index,
    field,
    value
  ) => {

    const updated = [...editableItems];

    updated[index][field] = value;

    const qty =
      Number(updated[index].quantity || 0);

    const unitPrice =
      Number(updated[index].unitPrice || 0);

    const gstAmount =
      Number(updated[index].gstAmount || 0);

    updated[index].lineTotal =
      qty * unitPrice + gstAmount;

    setEditableItems(updated);

  };
  return (

    <div className="rounded-[32px] border border-slate-200 bg-white p-4 md:p-8 shadow-sm">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            Quotation Summary
          </h2>

          <p className="mt-2 text-xs md:text-sm font-medium text-slate-500">
            Complete quotation pricing breakdown with GST and totals.
          </p>

        </div>

        <div className="inline-flex w-fit items-center rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
          GST Included
        </div>

      </div>

      {/* SUMMARY */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* UNIT PRICE */}

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

          <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-slate-500">
            Unit Price
          </p>

          <h3 className="mt-4 text-xl md:text-2xl font-black text-blue-700">
            ₹{unitPrice.toFixed(2)}
          </h3>

        </div>

        {/* QUANTITY */}

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

          <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-slate-500">
            Quantity
          </p>

          <h3 className="mt-4 text-2xl md:text-3xl font-black text-slate-900">
            {quantity}
          </h3>

        </div>

        {/* SUB TOTAL */}

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

          <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-slate-500">
            Sub Total
          </p>

          <h3 className="mt-4 text-2xl md:text-3xl font-black text-slate-900">
            ₹{subTotal.toFixed(2)}
          </h3>

        </div>

        {/* SGST */}

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">

          <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-orange-700">
            SGST
          </p>

          <h3 className="mt-4 text-2xl md:text-3xl font-black text-orange-600">
            ₹{sgst.toFixed(2)}
          </h3>

        </div>

        {/* CGST */}

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">

          <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-orange-700">
            CGST
          </p>

          <h3 className="mt-4 text-2xl md:text-3xl font-black text-orange-600">
            ₹{cgst.toFixed(2)}
          </h3>

        </div>

        {/* GRAND TOTAL */}

        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow-lg sm:col-span-2 xl:col-span-1">

          <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-blue-100">
            Grand Total
          </p>

          <h3 className="mt-4 text-2xl md:text-3xl font-black">
            ₹{grandTotal.toFixed(2)}
          </h3>

        </div>

      </div>

      {/* BREAKDOWN TABLE */}

      <div className="mt-12">

        <div>

          <h3 className="text-xl md:text-2xl font-black text-slate-900">
            Component Breakdown
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Detailed pricing calculation for each component.
          </p>

        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-4 text-left text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  Component
                </th>

                <th className="px-4 py-4 text-left text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  Part Number
                </th>

                <th className="px-4 py-4 text-left text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  Brand
                </th>

                <th className="px-4 py-4 text-center text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  Qty
                </th>

                <th className="px-4 py-4 text-center text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  Status
                </th>

                <th className="px-4 py-4 text-right text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  Unit Price
                </th>

                <th className="px-4 py-4 text-right text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  GST
                </th>

                <th className="px-4 py-4 text-right text-xs md:text-sm font-black uppercase tracking-wider text-slate-700">
                  Total
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">

              {editableItems.map((item, index) => {
                const qty =
                  Number(item.quantity || 0);


                return (

                  <tr
                    key={index}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-4 py-4">

                      <div className="font-bold text-slate-900">
                        {item.componentName}
                      </div>

                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {item.partNumber}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {item.brand}
                    </td>

                    <td className="px-4 py-4 text-center font-bold text-slate-900">
                      {qty}
                    </td>

                    <td className="px-4 py-4 text-center">

                      <select
                        value={item.availabilityStatus}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "availabilityStatus",
                            e.target.value
                          )
                        }
                        className="rounded-lg border px-2 py-1"
                      >
                        <option value="checking">
                          CHECKING
                        </option>

                        <option value="available">
                          AVAILABLE
                        </option>
                      </select>

                    </td>

                    <td className="px-4 py-4 text-right font-bold text-blue-700">
                      <input
                        type="number"
                        value={item.unitPrice || 0}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "unitPrice",
                            Number(e.target.value)
                          )
                        }
                        className="w-24 rounded border p-2 text-right"
                      />
                    </td>

                    <>
                      <td className="px-4 py-4 text-right font-bold text-orange-600">
                        <input
                          type="number"
                          value={item.gstAmount || 0}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "gstAmount",
                              Number(e.target.value)
                            )
                          }
                          className="w-24 rounded border p-2 text-right"
                        />
                      </td>

                      <td className="px-4 py-4 text-right font-black text-green-700">
                        ₹{Number(item.lineTotal || 0).toFixed(2)}
                      </td>
                    </>

                  </tr>

                );
              })}

            </tbody>

          </table>

          <div className="flex justify-end p-4">

            <button
              onClick={async () => {

                await adminRequest(
                  `/api/component-requests/admin/${request._id}`,
                  {
                    method: "PUT",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      items: editableItems,
                    }),
                  }
                );

                alert("Items Updated");

                window.location.reload();

              }}
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
            >
              Save Component Pricing
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

