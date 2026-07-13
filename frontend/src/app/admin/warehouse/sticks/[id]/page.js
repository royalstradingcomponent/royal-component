"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import {
  ArrowLeft,
  Package,
  Pencil,
  RefreshCw,
  Boxes,
  Building2,
} from "lucide-react";

export default function WarehouseStickDetailsPage() {

  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [stick, setStick] =
    useState(null);

  const fetchStick = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const { data } = await axios.get(

       `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse-sticks/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );
      console.log("Boxes API =", data);

      setStick(data.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (id) {

      fetchStick();

    }

  }, [id]);

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center">

        <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />

      </div>

    );

  }

  if (!stick) {

    return (

      <div className="flex h-screen items-center justify-center">

        Stick not found.

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <Link
            href="/admin/warehouse/sticks"
            className="mb-3 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >

            <ArrowLeft className="h-4 w-4" />

            Back

          </Link>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <Package className="h-8 w-8 text-blue-600" />

            {stick.stickName}

          </h1>

          <p className="mt-2 text-slate-500">

            {stick.stickCode}

          </p>

        </div>

        <Link

          href={`/admin/warehouse/sticks/${stick._id}/edit`}

          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"

        >

          <Pencil className="h-5 w-5" />

          Edit Stick

        </Link>

      </div>

      {/* Statistics */}

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Occupied
              </p>

              <h2 className="mt-2 text-4xl font-bold text-blue-600">
                {stick.occupiedQuantity}
              </h2>

            </div>

            <Package className="h-10 w-10 text-blue-600" />

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Free
              </p>

              <h2 className="mt-2 text-4xl font-bold text-green-600">
                {stick.freeQuantity}
              </h2>

            </div>

            <Boxes className="h-10 w-10 text-green-600" />

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Max Capacity
              </p>

              <h2 className="mt-2 text-4xl font-bold text-orange-600">
                {stick.maxCapacity}
              </h2>

            </div>

            <Building2 className="h-10 w-10 text-orange-600" />

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Products
              </p>

              <h2 className="mt-2 text-4xl font-bold text-purple-600">
                {stick.statistics?.totalProducts || 0}
              </h2>

            </div>

            <Package className="h-10 w-10 text-purple-600" />

          </div>

        </div>

      </div>

            {/* Main Details */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left Side */}

        <div className="rounded-2xl bg-white p-8 shadow lg:col-span-2">

          <h2 className="mb-6 text-xl font-semibold">
            Stick Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-sm text-slate-500">
                Stick Code
              </label>

              <p className="mt-1 font-semibold">
                {stick.stickCode}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Stick Name
              </label>

              <p className="mt-1 font-semibold">
                {stick.stickName}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Warehouse
              </label>

              <p className="mt-1 font-semibold">
                {stick.warehouseId?.warehouseName || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Box
              </label>

              <p className="mt-1 font-semibold">
                {stick.boxId?.boxName || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Stick Type
              </label>

              <p className="mt-1 font-semibold">
                {stick.stickType}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Status
              </label>

              <p className="mt-1 font-semibold">
                {stick.status}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Length
              </label>

              <p className="mt-1 font-semibold">
                {stick.length || 0} cm
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Width
              </label>

              <p className="mt-1 font-semibold">
                {stick.width || 0} cm
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Height
              </label>

              <p className="mt-1 font-semibold">
                {stick.height || 0} cm
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Weight
              </label>

              <p className="mt-1 font-semibold">
                {stick.weight || 0} kg
              </p>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="space-y-6">

          {/* Capacity */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-5 text-lg font-semibold">
              Capacity
            </h3>

            <div className="mb-3 flex justify-between text-sm">

              <span>
                {stick.occupiedQuantity} / {stick.maxCapacity}
              </span>

              <span className="font-semibold text-blue-600">
                {stick.utilizationPercent ?? 0}%
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${stick.utilizationPercent ?? 0}%`,
                }}
              />

            </div>

            <div className="mt-4 flex justify-between text-sm text-slate-500">

              <span>
                Free : {stick.freeQuantity}
              </span>

              <span>
                Max : {stick.maxCapacity}
              </span>

            </div>

          </div>

          {/* Status */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-4 text-lg font-semibold">
              Status
            </h3>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
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

          </div>

                    {/* Quick Actions */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-4 text-lg font-semibold">
              Quick Actions
            </h3>

            <div className="space-y-3">

              <Link
                href={`/admin/warehouse/sticks/${stick._id}/edit`}
                className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
              >
                Edit Stick
              </Link>

              <Link
                href={`/admin/stock-locations?stick=${stick._id}`}
                className="block rounded-xl bg-emerald-600 px-4 py-3 text-center font-medium text-white hover:bg-emerald-700"
              >
                View Stock
              </Link>

              <Link
                href={`/admin/transfer-stock?stick=${stick._id}`}
                className="block rounded-xl bg-orange-500 px-4 py-3 text-center font-medium text-white hover:bg-orange-600"
              >
                Transfer Stock
              </Link>

            </div>

          </div>

          {/* Statistics */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-4 text-lg font-semibold">
              Statistics
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">

                <span>Total Products</span>

                <span className="font-semibold">
                  {stick.statistics?.totalProducts || 0}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Total Quantity</span>

                <span className="font-semibold">
                  {stick.statistics?.totalQuantity || 0}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Movement Count</span>

                <span className="font-semibold">
                  {stick.statistics?.movementCount || 0}
                </span>

              </div>

            </div>

          </div>

          {/* Remarks */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-4 text-lg font-semibold">
              Remarks
            </h3>

            <p className="text-sm leading-7 text-slate-600">
              {stick.remarks || "No remarks available."}
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}