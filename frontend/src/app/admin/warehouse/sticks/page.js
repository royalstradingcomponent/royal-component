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

export default function WarehouseSticksPage() {

  const [loading, setLoading] =
    useState(true);

  const [sticks, setSticks] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const fetchSticks = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      const { data } = await axios.get(

       `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse-sticks`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      setSticks(data.data || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchSticks();

  }, []);

  const filteredSticks =
    sticks.filter((stick) => {

      return (

        stick.stickName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        stick.stickCode
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

            Warehouse Sticks

          </h1>

          <p className="mt-2 text-slate-500">

            Manage all warehouse sticks.

          </p>

        </div>

        <div className="flex gap-3">

          <button

            onClick={fetchSticks}

            className="flex items-center gap-2 rounded-xl border bg-white px-5 py-3"

          >

            <RefreshCw className="h-5 w-5" />

            Refresh

          </button>

          <Link

            href="/admin/warehouse/sticks/create"

            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"

          >

            <Plus className="h-5 w-5" />

            Create Stick

          </Link>

        </div>

      </div>

      {/* Search */}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input

            type="text"

            placeholder="Search Stick..."

            value={search}

            onChange={(e)=>
              setSearch(
                e.target.value
              )
            }

            className="w-full rounded-xl border py-3 pl-12 pr-4"

          />

        </div>

      </div>

            {/* Sticks Table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        {loading ? (

          <div className="flex h-80 items-center justify-center">

            <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />

          </div>

        ) : filteredSticks.length === 0 ? (

          <div className="flex h-80 flex-col items-center justify-center">

            <Package className="mb-5 h-16 w-16 text-slate-300" />

            <h3 className="text-xl font-semibold">
              No Sticks Found
            </h3>

            <p className="mt-2 text-slate-500">
              Create your first warehouse stick.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Stick
                  </th>

                  <th className="px-6 py-4 text-center">
                    Warehouse
                  </th>

                  <th className="px-6 py-4 text-center">
                    Box
                  </th>

                  <th className="px-6 py-4 text-center">
                    Type
                  </th>

                  <th className="px-6 py-4 text-center">
                    Capacity
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

                {filteredSticks.map((stick) => (

                  <tr
                    key={stick._id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">

                      <div>

                        <h4 className="font-semibold">
                          {stick.stickName}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {stick.stickCode}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-5 text-center">
                      {stick.warehouseId?.warehouseName || "-"}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {stick.boxId?.boxName || "-"}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {stick.stickType}
                    </td>

                    <td className="px-6 py-5">

                      <div className="mx-auto w-44">

                        <div className="mb-2 flex justify-between text-xs">

                          <span>
                            {stick.occupiedQuantity}
                          </span>

                          <span>
                            {stick.maxCapacity}
                          </span>

                        </div>

                        <div className="h-2 rounded-full bg-slate-200">

                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{
                              width: `${stick.utilizationPercent}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5 text-center">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          stick.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : stick.status === "FULL"
                            ? "bg-red-100 text-red-700"
                            : stick.status === "EMPTY"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {stick.status}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-2">

                        <Link
                          href={`/admin/warehouse/sticks/${stick._id}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/warehouse/sticks/${stick._id}/edit`}
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