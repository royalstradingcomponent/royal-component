"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

import {
  Package,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";

export default function StockLocationsPage() {

  const [loading, setLoading] =
    useState(true);

  const [locations, setLocations] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const fetchLocations =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const { data } =
          await axios.get(

            `${process.env.NEXT_PUBLIC_API_URL}/stock-locations`,

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }

          );

        setLocations(
          data.data || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchLocations();

  }, []);

  const filteredLocations =
    locations.filter((item) => {

      return (

        item.productId?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.productId?.sku
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.batchNumber
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    });

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <Package className="h-8 w-8 text-blue-600" />

            Stock Locations

          </h1>

          <p className="mt-2 text-slate-500">

            Manage warehouse stock locations.

          </p>

        </div>

        <div className="flex gap-3">

          <button

            onClick={fetchLocations}

            className="flex items-center gap-2 rounded-xl border bg-white px-5 py-3"

          >

            <RefreshCw className="h-5 w-5" />

            Refresh

          </button>

          <Link

            href="/admin/stock-locations/create"

            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"

          >

            <Plus className="h-5 w-5" />

            Add Stock

          </Link>

        </div>

      </div>

      {/* Search */}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input

            type="text"

            placeholder="Search Product / SKU / Batch Number..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="w-full rounded-xl border py-3 pl-12 pr-4"

          />

        </div>

      </div>

            {/* Stock Locations Table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        {loading ? (

          <div className="flex h-80 items-center justify-center">

            <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />

          </div>

        ) : filteredLocations.length === 0 ? (

          <div className="flex h-80 flex-col items-center justify-center">

            <Package className="mb-5 h-16 w-16 text-slate-300" />

            <h3 className="text-xl font-semibold">
              No Stock Found
            </h3>

            <p className="mt-2 text-slate-500">
              Add your first stock location.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Product
                  </th>

                  <th className="px-6 py-4 text-center">
                    Warehouse
                  </th>

                  <th className="px-6 py-4 text-center">
                    Box
                  </th>

                  <th className="px-6 py-4 text-center">
                    Stick
                  </th>

                  <th className="px-6 py-4 text-center">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-center">
                    Reserved
                  </th>

                  <th className="px-6 py-4 text-center">
                    Available
                  </th>

                  <th className="px-6 py-4 text-center">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLocations.map((item) => (

                  <tr
                    key={item._id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">

                      <div>

                        <h4 className="font-semibold">
                          {item.productId?.name}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {item.productId?.sku}
                        </p>

                        {item.batchNumber && (

                          <p className="text-xs text-slate-400">
                            Batch : {item.batchNumber}
                          </p>

                        )}

                      </div>

                    </td>

                    <td className="px-6 py-5 text-center">
                      {item.warehouseId?.warehouseName || "-"}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {item.boxId?.boxName || "-"}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {item.stickId?.stickName || "-"}
                    </td>

                    <td className="px-6 py-5 text-center font-semibold">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-5 text-center text-orange-600 font-semibold">
                      {item.reservedQuantity}
                    </td>

                    <td className="px-6 py-5 text-center text-green-600 font-semibold">
                      {item.availableQuantity}
                    </td>

                    <td className="px-6 py-5 text-center">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "IN_STOCK"
                            ? "bg-green-100 text-green-700"
                            : item.status === "LOW_STOCK"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "OUT_OF_STOCK"
                            ? "bg-red-100 text-red-700"
                            : item.status === "RESERVED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-2">

                        <Link
                          href={`/admin/stock-locations/${item._id}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/stock-locations/${item._id}/edit`}
                          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                        >
                          Edit
                        </Link>

                        <button
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

          </div>

  );

}