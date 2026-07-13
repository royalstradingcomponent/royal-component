"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import {
  ArrowLeft,
  Save,
  Package,
} from "lucide-react";

export default function CreateStockLocationPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

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

    loadInitialData();

  }, []);

  useEffect(() => {

    if (form.warehouseId) {

      fetchBoxes(form.warehouseId);

    } else {

      setBoxes([]);
      setSticks([]);

    }

  }, [form.warehouseId]);

  useEffect(() => {

    if (form.boxId) {

      fetchSticks(form.boxId);

    } else {

      setSticks([]);

    }

  }, [form.boxId]);

  const loadInitialData =
    async () => {

      try {

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

        ]);

        setProducts(
          productRes.data.data || []
        );

        console.log("Warehouse API =", warehouseRes.data);

        setWarehouses(
    warehouseRes.data.warehouses || []
);

        setSuppliers(
          supplierRes.data.data || []
        );

      } catch (error) {

        console.error(error);

      }

    };

  const fetchBoxes =
    async (warehouseId) => {

      try {

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

      } catch (error) {

        console.error(error);

      }

    };

  const fetchSticks =
    async (boxId) => {

      try {

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

      } catch (error) {

        console.error(error);

      }

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

        await axios.post(

          `${process.env.NEXT_PUBLIC_API_URL}/api/stock-locations`,

          form,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

        router.push(
          "/admin/stock-locations"
        );

      } catch (error) {

        console.error(error);

        alert(

          error?.response?.data?.message ||

          "Failed to create stock location."

        );

      } finally {

        setLoading(false);

      }

    };

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

            Add Stock Location

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
                placeholder="Batch Number"
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
                placeholder="Lot Number"
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
                placeholder="Serial Number"
              />

            </div>

          </div>

        </div>

        {/* Pricing & Supplier */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-xl font-semibold">
            Pricing & Supplier
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
            Additional Information
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
            href="/admin/stock-locations"
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
              : "Add Stock"}

          </button>

        </div>

      </form>

    </div>

  );

}