"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Boxes,
  Building2,
  ChevronDown,
  Gauge,
  Layers3,
  MapPin,
  Package,
  Palette,
  Save,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Field({ label, name, value, onChange, required, type = "text", placeholder, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-600">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
          error ? "border-red-300" : "border-slate-200"
        )}
      />
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  );
}

function SelectField({ label, name, value, onChange, required, children, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-600">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={cn(
            "h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
            error ? "border-red-300" : "border-slate-200"
          )}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  );
}

function Section({ title, icon: Icon, tone, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
      <div className="mb-6 flex items-center gap-3">
        <div className={cn("grid h-11 w-11 place-items-center rounded-2xl", tone)}>
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function CreateWarehouseBoxPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    warehouseId: "",
    boxCode: "",
    boxName: "",
    displayName: "",
    rack: "",
    shelf: "",
    row: "",
    column: "",
    floor: "GROUND",
    zone: "",
    section: "",
    maxStickCapacity: 100,
    storageType: "IC",
    color: "#2563eb",
    icon: "package",
    temperature: "",
    humidity: "",
    remarks: "",
  });

  const selectedWarehouse = useMemo(
    () => warehouses.find((warehouse) => warehouse._id === form.warehouseId),
    [warehouses, form.warehouseId]
  );

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`${API_URL}/api/warehouse?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWarehouses(data?.warehouses || data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWarehouses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.warehouseId) nextErrors.warehouseId = "Warehouse is required.";
    if (!form.boxCode.trim()) nextErrors.boxCode = "Box code is required.";
    if (!form.boxName.trim()) nextErrors.boxName = "Box name is required.";
    if (!form.rack.trim()) nextErrors.rack = "Rack is required.";
    if (!form.shelf.trim()) nextErrors.shelf = "Shelf is required.";
    if (Number(form.maxStickCapacity) < 0) nextErrors.maxStickCapacity = "Capacity cannot be negative.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${API_URL}/api/warehouse-boxes`,
        {
          ...form,
          maxStickCapacity: Number(form.maxStickCapacity || 0),
          temperature: form.temperature === "" ? null : Number(form.temperature),
          humidity: form.humidity === "" ? null : Number(form.humidity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/admin/warehouse/boxes");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create box.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1500px] space-y-6 pb-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/warehouse/boxes" className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold">Create Warehouse Box</h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">Add a storage box with location, capacity and display settings.</p>
            </div>
          </div>
          <div className="hidden gap-3 lg:flex">
            <Link href="/admin/warehouse/boxes" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">Cancel</Link>
            <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60">
              <Save className="h-4 w-4" />
              {loading ? "Creating..." : "Create Box"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Section title="Basic Information" icon={Boxes} tone="bg-blue-50 text-blue-600">
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField label="Warehouse" name="warehouseId" value={form.warehouseId} onChange={handleChange} required error={errors.warehouseId}>
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>)}
                </SelectField>
                <Field label="Box Code" name="boxCode" value={form.boxCode} onChange={handleChange} required placeholder="BOX-001" error={errors.boxCode} />
                <Field label="Box Name" name="boxName" value={form.boxName} onChange={handleChange} required placeholder="IC Storage Box A1" error={errors.boxName} />
                <Field label="Display Name" name="displayName" value={form.displayName} onChange={handleChange} placeholder="Front Label Name" />
              </div>
            </Section>

            <Section title="Location & Capacity" icon={MapPin} tone="bg-violet-50 text-violet-600">
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Rack" name="rack" value={form.rack} onChange={handleChange} required placeholder="RACK-A" error={errors.rack} />
                <Field label="Shelf" name="shelf" value={form.shelf} onChange={handleChange} required placeholder="SHELF-01" error={errors.shelf} />
                <SelectField label="Floor" name="floor" value={form.floor} onChange={handleChange}>
                  <option value="GROUND">Ground Floor</option>
                  <option value="FIRST">First Floor</option>
                  <option value="SECOND">Second Floor</option>
                  <option value="THIRD">Third Floor</option>
                </SelectField>
                <Field label="Row" name="row" value={form.row} onChange={handleChange} placeholder="ROW-1" />
                <Field label="Column" name="column" value={form.column} onChange={handleChange} placeholder="COLUMN-A" />
                <Field label="Max Stick Capacity" type="number" name="maxStickCapacity" value={form.maxStickCapacity} onChange={handleChange} error={errors.maxStickCapacity} />
                <Field label="Zone" name="zone" value={form.zone} onChange={handleChange} placeholder="ZONE-1" />
                <Field label="Section" name="section" value={form.section} onChange={handleChange} placeholder="SECTION-A" />
                <SelectField label="Storage Type" name="storageType" value={form.storageType} onChange={handleChange}>
                  <option value="IC">IC</option>
                  <option value="RESISTOR">RESISTOR</option>
                  <option value="CAPACITOR">CAPACITOR</option>
                  <option value="TRANSISTOR">TRANSISTOR</option>
                  <option value="MIXED">MIXED</option>
                  <option value="CUSTOM">CUSTOM</option>
                </SelectField>
              </div>
            </Section>

            <Section title="Display & Environment" icon={Palette} tone="bg-emerald-50 text-emerald-600">
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Icon" name="icon" value={form.icon} onChange={handleChange} placeholder="package" />
                <Field label="Temperature" type="number" name="temperature" value={form.temperature} onChange={handleChange} placeholder="25" />
                <Field label="Humidity" type="number" name="humidity" value={form.humidity} onChange={handleChange} placeholder="40" />
                <label className="block md:col-span-3">
                  <span className="mb-2 block text-sm font-bold text-slate-600">Box Color</span>
                  <input type="color" name="color" value={form.color} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-200 bg-white p-1" />
                </label>
                <label className="block md:col-span-3">
                  <span className="mb-2 block text-sm font-bold text-slate-600">Remarks</span>
                  <textarea name="remarks" rows={5} value={form.remarks} onChange={handleChange} placeholder="Enter remarks..." className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </label>
              </div>
            </Section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
              <h2 className="text-lg font-extrabold">Live Preview</h2>
              <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                <div className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: form.color }}>
                  <Boxes className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-extrabold">{form.boxName || "Box Name"}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{form.boxCode || "BOX-001"}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Rack</p><p className="mt-1 font-extrabold">{form.rack || "-"}</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Shelf</p><p className="mt-1 font-extrabold">{form.shelf || "-"}</p></div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
              <h2 className="text-lg font-extrabold">Selected Warehouse</h2>
              <div className="mt-4 flex gap-3 rounded-2xl bg-blue-50 p-4 text-blue-800">
                <Building2 className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-extrabold">{selectedWarehouse?.name || "No warehouse selected"}</p>
                  <p className="mt-1 text-sm font-semibold">{selectedWarehouse?.warehouseCode || "Choose warehouse first"}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3 rounded-2xl bg-slate-50 p-4">
                <Gauge className="h-5 w-5 shrink-0 text-slate-500" />
                <p className="text-sm font-semibold text-slate-600">Capacity should match the number of sticks this box can safely store.</p>
              </div>
            </section>
          </aside>
        </div>
      </form>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-12px_34px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] justify-end gap-3">
          <Link href="/admin/warehouse/boxes" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-700">Cancel</Link>
          <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white disabled:opacity-60">
            <Save className="h-4 w-4" />
            {loading ? "Creating..." : "Create Box"}
          </button>
        </div>
      </div>
    </div>
  );
}
