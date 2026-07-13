"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import {
  ArrowLeft,
  Save,
  Package,
} from "lucide-react";

export default function EditStockLocationPage() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [products, setProducts] =
    useState([]);

  const [warehouses, setWarehouses] =
    useState([]);

  const [boxes, setBoxes] =
    useState([]);

  const [sticks, setSticks] =
    useState([]);

  const [suppliers, setSuppliers] =
    useState([]);

  const [form, setForm] =
    useState({

      productId: "",

      warehouseId: "",

      boxId: "",

      stickId: "",

      quantity: 0,

      reservedQuantity: 0,

      damagedQuantity: 0,

      batchNumber: "",

      lotNumber: "",

      serialNumber: "",

      supplierSourceId: "",

      purchasePrice: 0,

      sellingPrice: 0,

      mrp: 0,

      gstPercent: 18,

      manufacturingDate: "",

      expiryDate: "",

      remarks: "",

    });

  useEffect(() => {

    if (id) {

      fetchData();

    }

  }, [id]);

  useEffect(() => {

    if (form.warehouseId) {

      fetchBoxes(form.warehouseId);

    }

  }, [form.warehouseId]);

  useEffect(() => {

    if (form.boxId) {

      fetchSticks(form.boxId);

    }

  }, [form.boxId]);

  const fetchData =
    async () => {

      try {

        setFetching(true);

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [

          productRes,

          warehouseRes,

          supplierRes,

          stockRes,

        ] = await Promise.all([

          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
            { headers }
          ),

          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse`,
            { headers }
          ),

          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/supplier-sources`,
            { headers }
          ),

          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/stock-locations/${id}`,
            { headers }
          ),

        ]);

        setProducts(
          productRes.data.data || []
        );

        console.log("Warehouse API =", warehouseRes.data);

        setWarehouses(
          warehouseRes.data.data || []
        );
        setSuppliers(
          supplierRes.data.data || []
        );

        const stock =
          stockRes.data.data;

        await fetchBoxes(
          stock.warehouseId?._id ||
          stock.warehouseId
        );

        await fetchSticks(
          stock.boxId?._id ||
          stock.boxId
        );

        setForm({

          productId:
            stock.productId?._id ||
            stock.productId,

          warehouseId:
            stock.warehouseId?._id ||
            stock.warehouseId,

          boxId:
            stock.boxId?._id ||
            stock.boxId,

          stickId:
            stock.stickId?._id ||
            stock.stickId ||
            "",

          quantity:
            stock.quantity,

          reservedQuantity:
            stock.reservedQuantity,

          damagedQuantity:
            stock.damagedQuantity,

          batchNumber:
            stock.batchNumber || "",

          lotNumber:
            stock.lotNumber || "",

          serialNumber:
            stock.serialNumber || "",

          supplierSourceId:
            stock.supplierSourceId?._id ||
            stock.supplierSourceId ||
            "",

          purchasePrice:
            stock.purchasePrice,

          sellingPrice:
            stock.sellingPrice,

          mrp:
            stock.mrp,

          gstPercent:
            stock.gstPercent,

          manufacturingDate:
            stock.manufacturingDate
              ? stock.manufacturingDate.slice(0, 10)
              : "",

          expiryDate:
            stock.expiryDate
              ? stock.expiryDate.slice(0, 10)
              : "",

          remarks:
            stock.remarks || "",

        });

      } catch (error) {

        console.error(error);

      } finally {

        setFetching(false);

      }

    };

  const fetchBoxes =
    async (warehouseId) => {

      const token =
        localStorage.getItem(
          "adminToken"
        );

      const { data } =
        await axios.get(

          `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse-boxes?warehouseId=${warehouseId}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

      setBoxes(
        data.data || []
      );

    };

  const fetchSticks =
    async (boxId) => {

      const token =
        localStorage.getItem(
          "adminToken"
        );

      const { data } =
        await axios.get(

          `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse-sticks?boxId=${boxId}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

      setSticks(
        data.data || []
      );

    };

  const handleChange = (e) => {

    setForm((prev) => ({

      ...prev,

      [e.target.name]:
        e.target.value,

    }));

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "adminToken"
          );

        await axios.put(

          `${process.env.NEXT_PUBLIC_API_URL}/stock-locations/${id}`,

          form,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

        router.push(
          `/admin/stock-locations/${id}`
        );

      } catch (error) {

        console.error(error);

        alert(

          error?.response?.data?.message ||

          "Failed to update stock location."

        );

      } finally {

        setLoading(false);

      }

    };

  if (fetching) {

    return (

      <div className="flex h-screen items-center justify-center">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <Link
            href={`/admin/stock-locations/${id}`}
            className="mb-3 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >

            <ArrowLeft className="h-4 w-4" />

            Back

          </Link>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <Package className="h-8 w-8 text-blue-600" />

            Edit Stock Location

          </h1>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Product & Location */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-xl font-semibold">
            Product & Location
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Product *
              </label>

              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Product
                </option>

                {products.map((product) => (

                  <option
                    key={product._id}
                    value={product._id}
                  >
                    {product.name}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Warehouse *
              </label>

              <select
                name="warehouseId"
                value={form.warehouseId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Warehouse
                </option>

                {warehouses.map((warehouse) => (

                  <option
                    key={warehouse._id}
                    value={warehouse._id}
                  >
                    {warehouse.name}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Box *
              </label>

              <select
                name="boxId"
                value={form.boxId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Box
                </option>

                {boxes.map((box) => (

                  <option
                    key={box._id}
                    value={box._id}
                  >
                    {box.boxName}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Stick
              </label>

              <select
                name="stickId"
                value={form.stickId}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Loose Stock
                </option>

                {sticks.map((stick) => (

                  <option
                    key={stick._id}
                    value={stick._id}
                  >
                    {stick.stickName}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Quantity *
              </label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min={0}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Reserved Quantity
              </label>

              <input
                type="number"
                name="reservedQuantity"
                value={form.reservedQuantity}
                onChange={handleChange}
                min={0}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Damaged Quantity
              </label>

              <input
                type="number"
                name="damagedQuantity"
                value={form.damagedQuantity}
                onChange={handleChange}
                min={0}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Batch Number
              </label>

              <input
                type="text"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Lot Number
              </label>

              <input
                type="text"
                name="lotNumber"
                value={form.lotNumber}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Serial Number
              </label>

              <input
                type="text"
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        {/* Supplier & Pricing */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-xl font-semibold">
            Supplier & Pricing
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Supplier
              </label>

              <select
                name="supplierSourceId"
                value={form.supplierSourceId}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Supplier
                </option>

                {suppliers.map((supplier) => (

                  <option
                    key={supplier._id}
                    value={supplier._id}
                  >
                    {supplier.supplierCompany}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Purchase Price
              </label>

              <input
                type="number"
                name="purchasePrice"
                value={form.purchasePrice}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Selling Price
              </label>

              <input
                type="number"
                name="sellingPrice"
                value={form.sellingPrice}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                MRP
              </label>

              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                GST %
              </label>

              <input
                type="number"
                name="gstPercent"
                value={form.gstPercent}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Manufacturing Date
              </label>

              <input
                type="date"
                name="manufacturingDate"
                value={form.manufacturingDate}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Expiry Date
              </label>

              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>

        {/* Remarks */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-xl font-semibold">
            Remarks
          </h2>

          <textarea
            name="remarks"
            rows={5}
            value={form.remarks}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Enter remarks..."
          />

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <Link
            href={`/admin/stock-locations/${id}`}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >

            <Save className="h-5 w-5" />

            {loading
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </form>

    </div>

  );

}