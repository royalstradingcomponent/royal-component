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
  Warehouse,
} from "lucide-react";

export default function StockLocationDetailsPage() {

  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [stock, setStock] =
    useState(null);

  const fetchStock = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const { data } =
        await axios.get(

          `${process.env.NEXT_PUBLIC_API_URL}/stock-locations/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

      setStock(data.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (id) {

      fetchStock();

    }

  }, [id]);

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center">

        <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />

      </div>

    );

  }

  if (!stock) {

    return (

      <div className="flex h-screen items-center justify-center">

        Stock Location not found.

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <Link
            href="/admin/stock-locations"
            className="mb-3 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >

            <ArrowLeft className="h-4 w-4" />

            Back

          </Link>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <Package className="h-8 w-8 text-blue-600" />

            {stock.productId?.name}

          </h1>

          <p className="mt-2 text-slate-500">

            {stock.productId?.sku}

          </p>

        </div>

        <Link

          href={`/admin/stock-locations/${stock._id}/edit`}

          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"

        >

          <Pencil className="h-5 w-5" />

          Edit Stock

        </Link>

      </div>

      {/* Summary Cards */}

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Quantity
              </p>

              <h2 className="mt-2 text-4xl font-bold text-blue-600">
                {stock.quantity}
              </h2>

            </div>

            <Package className="h-10 w-10 text-blue-600" />

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Available
              </p>

              <h2 className="mt-2 text-4xl font-bold text-green-600">
                {stock.availableQuantity}
              </h2>

            </div>

            <Boxes className="h-10 w-10 text-green-600" />

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Reserved
              </p>

              <h2 className="mt-2 text-4xl font-bold text-orange-600">
                {stock.reservedQuantity}
              </h2>

            </div>

            <Warehouse className="h-10 w-10 text-orange-600" />

          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Damaged
              </p>

              <h2 className="mt-2 text-4xl font-bold text-red-600">
                {stock.damagedQuantity}
              </h2>

            </div>

            <Package className="h-10 w-10 text-red-600" />

          </div>

        </div>

      </div>

            {/* Main Details */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left */}

        <div className="rounded-2xl bg-white p-8 shadow lg:col-span-2">

          <h2 className="mb-6 text-xl font-semibold">
            Product & Location Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-sm text-slate-500">
                Product
              </label>

              <p className="mt-1 font-semibold">
                {stock.productId?.name || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                SKU
              </label>

              <p className="mt-1 font-semibold">
                {stock.productId?.sku || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Warehouse
              </label>

              <p className="mt-1 font-semibold">
                {stock.warehouseId?.warehouseName || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Box
              </label>

              <p className="mt-1 font-semibold">
                {stock.boxId?.boxName || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Stick
              </label>

              <p className="mt-1 font-semibold">
                {stock.stickId?.stickName || "Loose Stock"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Location Type
              </label>

              <p className="mt-1 font-semibold">
                {stock.locationType || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Batch Number
              </label>

              <p className="mt-1 font-semibold">
                {stock.batchNumber || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Lot Number
              </label>

              <p className="mt-1 font-semibold">
                {stock.lotNumber || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Serial Number
              </label>

              <p className="mt-1 font-semibold">
                {stock.serialNumber || "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Status
              </label>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  stock.status === "IN_STOCK"
                    ? "bg-green-100 text-green-700"
                    : stock.status === "LOW_STOCK"
                    ? "bg-yellow-100 text-yellow-700"
                    : stock.status === "OUT_OF_STOCK"
                    ? "bg-red-100 text-red-700"
                    : stock.status === "RESERVED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {stock.status}
              </span>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Purchase Price
              </label>

              <p className="mt-1 font-semibold">
                ₹ {stock.purchasePrice}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Selling Price
              </label>

              <p className="mt-1 font-semibold">
                ₹ {stock.sellingPrice}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                MRP
              </label>

              <p className="mt-1 font-semibold">
                ₹ {stock.mrp}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                GST
              </label>

              <p className="mt-1 font-semibold">
                {stock.gstPercent}%
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Manufacturing Date
              </label>

              <p className="mt-1 font-semibold">
                {stock.manufacturingDate
                  ? new Date(
                      stock.manufacturingDate
                    ).toLocaleDateString()
                  : "-"}
              </p>

            </div>

            <div>

              <label className="text-sm text-slate-500">
                Expiry Date
              </label>

              <p className="mt-1 font-semibold">
                {stock.expiryDate
                  ? new Date(
                      stock.expiryDate
                    ).toLocaleDateString()
                  : "-"}
              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

                      {/* Supplier Information */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-4 text-lg font-semibold">
              Supplier Information
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">

                <span>Supplier</span>

                <span className="font-semibold">
                  {stock.supplierName ||
                    stock.supplierSourceId?.supplierCompany ||
                    "-"}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Invoice No.</span>

                <span className="font-semibold">
                  {stock.supplierInvoiceNo || "-"}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Purchase Order</span>

                <span className="font-semibold">
                  {stock.purchaseOrderNo || "-"}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Received Date</span>

                <span className="font-semibold">
                  {stock.receivedDate
                    ? new Date(
                        stock.receivedDate
                      ).toLocaleDateString()
                    : "-"}
                </span>

              </div>

            </div>

          </div>

          {/* Quick Actions */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-4 text-lg font-semibold">
              Quick Actions
            </h3>

            <div className="space-y-3">

              <Link
                href={`/admin/stock-locations/${stock._id}/edit`}
                className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
              >
                Edit Stock
              </Link>

              <Link
                href={`/admin/transfer-stock?stock=${stock._id}`}
                className="block rounded-xl bg-orange-500 px-4 py-3 text-center font-medium text-white hover:bg-orange-600"
              >
                Transfer Stock
              </Link>

              <Link
                href={`/admin/stock-locations/reserve/${stock._id}`}
                className="block rounded-xl bg-emerald-600 px-4 py-3 text-center font-medium text-white hover:bg-emerald-700"
              >
                Reserve Stock
              </Link>

            </div>

          </div>

          {/* Remarks */}

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-4 text-lg font-semibold">
              Remarks
            </h3>

            <p className="text-sm leading-7 text-slate-600">

              {stock.remarks ||
                "No remarks available."}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}