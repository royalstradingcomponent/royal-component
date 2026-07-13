"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import {
  ArrowLeft,
  Package,
  Save,
} from "lucide-react";

export default function CreateWarehouseStickPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [warehouses, setWarehouses] =
    useState([]);

  const [boxes, setBoxes] =
    useState([]);

  const [form, setForm] =
    useState({

      warehouseId: "",

      boxId: "",

      stickCode: "",

      stickName: "",

      stickType: "IC_TUBE",

      maxCapacity: 25,

      length: "",

      width: "",

      height: "",

      weight: "",

      remarks: "",

    });

  useEffect(() => {

    fetchWarehouses();

  }, []);

  useEffect(() => {

  console.log("warehouseId Changed =", form.warehouseId);

  if (form.warehouseId) {

    console.log("Calling fetchBoxes()");

    fetchBoxes(form.warehouseId);

  } else {

    console.log("No Warehouse Selected");

    setBoxes([]);

  }

}, [form.warehouseId]);

  const fetchWarehouses =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const { data } =
          await axios.get(

            `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse`,

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }

          );
        console.log("Warehouse API =", data);

        setWarehouses(
          data.warehouses || []
        );

      } catch (error) {

        console.error(error);

      }

    };

  const fetchBoxes =
    async (warehouseId) => {

      try {

        console.log("fetchBoxes() called");
        console.log("warehouseId =", warehouseId);


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

        console.log("Boxes API =", data);
        console.log("Boxes =", data.data);

        setBoxes(
          data.data || []
        );

      } catch (error) {

        console.error(error);

      }

    };

const handleChange = (e) => {

  console.log("Field =", e.target.name);
  console.log("Value =", e.target.value);

  setForm((prev) => {

    const updated = {
      ...prev,
      [e.target.name]: e.target.value,
    };

    console.log("Updated Form =", updated);

    return updated;
  });

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

          `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse-sticks`,

          form,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

        router.push(
          "/admin/warehouse/sticks"
        );

      } catch (error) {

        console.error(error);

        alert(

          error?.response?.data?.message ||

          "Failed to create stick."

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
            href="/admin/warehouse/sticks"
            className="mb-3 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >

            <ArrowLeft className="h-4 w-4" />

            Back

          </Link>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <Package className="h-8 w-8 text-blue-600" />

            Create Warehouse Stick

          </h1>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Basic Information */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-xl font-semibold">

            Basic Information

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

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
                Stick Code *
              </label>

              <input
                type="text"
                name="stickCode"
                value={form.stickCode}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
                placeholder="STK-001"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Stick Name *
              </label>

              <input
                type="text"
                name="stickName"
                value={form.stickName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3"
                placeholder="IC Storage Stick"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Stick Type
              </label>

              <select
                name="stickType"
                value={form.stickType}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="IC_TUBE">IC Tube</option>
                <option value="IC_TRAY">IC Tray</option>
                <option value="ESD_BOX">ESD Box</option>
                <option value="SMALL_BOX">Small Box</option>
                <option value="COMPONENT_BOX">Component Box</option>
                <option value="CUSTOM">Custom</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Max Capacity
              </label>

              <input
                type="number"
                name="maxCapacity"
                value={form.maxCapacity}
                onChange={handleChange}
                min={1}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Length (cm)
              </label>

              <input
                type="number"
                name="length"
                value={form.length}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Width (cm)
              </label>

              <input
                type="number"
                name="width"
                value={form.width}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Height (cm)
              </label>

              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Weight (kg)
              </label>

              <input
                type="number"
                step="0.01"
                name="weight"
                value={form.weight}
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

          <div>

            <label className="mb-2 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              name="remarks"
              rows={5}
              value={form.remarks}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Enter remarks..."
            />

          </div>

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <Link
            href="/admin/warehouse/sticks"
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Save className="h-5 w-5" />

            {loading
              ? "Creating..."
              : "Create Stick"}

          </button>

        </div>

      </form>

    </div>

  );

}