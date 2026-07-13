"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import axios from "axios";

import {
  ArrowLeft,
  Building2,
  Save,
} from "lucide-react";

export default function CreateWarehousePage() {
  console.log("CREATE PAGE LOADED");
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
  warehouseCode: "WH-001",

  warehouseName: "",

  contactPerson: "",

  phone: "",

  email: "",

  address: "",

  city: "",

  state: "",

  country: "India",

  pincode: "",

  remarks: "",
});

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

        console.log(
  "API URL =>",
  `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse`
);

     const payload = {
  warehouseCode: form.warehouseCode,

  name: form.warehouseName,

  managerName: form.contactPerson,

  phone: form.phone,

  email: form.email,

  description: form.remarks,

  address: {
    line1: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
    pincode: form.pincode,
  },
};

console.log("PAYLOAD =", payload);

await axios.post(
  `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse`,
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      router.push("/admin/warehouse");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to create warehouse."
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
            href="/admin/warehouse"
            className="mb-3 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <h1 className="flex items-center gap-3 text-3xl font-bold">

            <Building2 className="h-8 w-8 text-blue-600" />

            Create Warehouse

          </h1>

        </div>

      </div>

            <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Warehouse Information */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Warehouse Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Warehouse Code *
              </label>

              <input
                type="text"
                name="warehouseCode"
                value={form.warehouseCode}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="WH-001"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Warehouse Name *
              </label>

              <input
                type="text"
                name="warehouseName"
                value={form.warehouseName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Main Warehouse"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Contact Person
              </label>

              <input
                type="text"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="John Doe"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="+91XXXXXXXXXX"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="warehouse@email.com"
              />

            </div>

          </div>

        </div>

                {/* Address Information */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Address Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Address
              </label>

              <textarea
                name="address"
                rows={4}
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Enter complete warehouse address..."
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                City
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Remarks
              </label>

              <textarea
                rows={4}
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Any notes..."
              />

            </div>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <Link
            href="/admin/warehouse"
            className="rounded-xl border px-6 py-3 font-medium hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >

            <Save className="h-5 w-5" />

            {loading
              ? "Creating..."
              : "Create Warehouse"}

          </button>

        </div>

      </form>

    </div>
  );
}