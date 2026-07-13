"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Boxes,
  ChevronDown,
  Loader2,
  MapPin,
  Package,
  Palette,
  Save,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Field({ label, name, value, onChange, required, type = "text", error }) {
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
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
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
            "h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
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
        <h2 className="text-lg font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function EditWarehouseBoxPage() {
  const { id } = useParams();
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken")}` });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [warehouseRes, boxRes] = await Promise.all([
          axios.get(`${API_URL}/api/warehouse?limit=1000`, { headers: headers() }),
          axios.get(`${API_URL}/api/warehouse-boxes/${id}`, { headers: headers() }),
        ]);
        setWarehouses(warehouseRes.data?.warehouses || warehouseRes.data?.data || []);
        const box = boxRes.data?.data;
        setForm({
          warehouseId: box?.warehouseId?._id || box?.warehouseId || "",
          boxCode: box?.boxCode || "",
          boxName: box?.boxName || "",
          displayName: box?.displayName || "",
          rack: box?.rack || "",
          shelf: box?.shelf || "",
          row: box?.row || "",
          column: box?.column || "",
          floor: box?.floor || "GROUND",
          zone: box?.zone || "",
          section: box?.section || "",
          maxStickCapacity: box?.maxStickCapacity || 100,
          storageType: box?.storageType || "IC",
          color: box?.color || "#2563eb",
          icon: box?.icon || "package",
          temperature: box?.temperature ?? "",
          humidity: box?.humidity ?? "",
          remarks: box?.remarks || "",
        });
      } catch (error) {
        alert(error?.response?.data?.message || "Failed to load box.");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.boxName.trim()) next.boxName = "Box name is required.";
    if (!form.rack.trim()) next.rack = "Rack is required.";
    if (!form.shelf.trim()) next.shelf = "Shelf is required.";
    if (Number(form.maxStickCapacity) < 0) next.maxStickCapacity = "Capacity cannot be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      await axios.put(
        `${API_URL}/api/warehouse-boxes/${id}`,
        {
          boxName: form.boxName,
          displayName: form.displayName,
          rack: form.rack,
          shelf: form.shelf,
          row: form.row,
          column: form.column,
          floor: form.floor,
          zone: form.zone,
          section: form.section,
          maxStickCapacity: Number(form.maxStickCapacity || 0),
          storageType: form.storageType,
          color: form.color,
          icon: form.icon,
          temperature: form.temperature === "" ? null : Number(form.temperature),
          humidity: form.humidity === "" ? null : Number(form.humidity),
          remarks: form.remarks,
        },
        { headers: headers() }
      );
      router.push(`/admin/warehouse/boxes/${id}`);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update box.");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">Loading box...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1500px] space-y-6 pb-24">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/warehouse/boxes/${id}`} className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold">Edit Warehouse Box</h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">Update box information, location and capacity.</p>
            </div>
          </div>
          <button disabled={saving} className="hidden items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60 lg:inline-flex">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Section title="Basic Information" icon={Boxes} tone="bg-blue-50 text-blue-600">
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField label="Warehouse" name="warehouseId" value={form.warehouseId} onChange={handleChange} required>
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => <option key={warehouse._id} value={warehouse._id}>{warehouse.name}</option>)}
                </SelectField>
                <Field label="Box Code" name="boxCode" value={form.boxCode} onChange={handleChange} required />
                <Field label="Box Name" name="boxName" value={form.boxName} onChange={handleChange} required error={errors.boxName} />
                <Field label="Display Name" name="displayName" value={form.displayName} onChange={handleChange} />
              </div>
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-700">
                Note: Backend update API boxCode and warehouseId update nahi karta, isliye save me editable fields hi send kiye gaye hain.
              </p>
            </Section>

            <Section title="Location & Capacity" icon={MapPin} tone="bg-violet-50 text-violet-600">
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Rack" name="rack" value={form.rack} onChange={handleChange} required error={errors.rack} />
                <Field label="Shelf" name="shelf" value={form.shelf} onChange={handleChange} required error={errors.shelf} />
                <SelectField label="Floor" name="floor" value={form.floor} onChange={handleChange}>
                  <option value="GROUND">Ground Floor</option>
                  <option value="FIRST">First Floor</option>
                  <option value="SECOND">Second Floor</option>
                  <option value="THIRD">Third Floor</option>
                </SelectField>
                <Field label="Row" name="row" value={form.row} onChange={handleChange} />
                <Field label="Column" name="column" value={form.column} onChange={handleChange} />
                <Field label="Max Stick Capacity" type="number" name="maxStickCapacity" value={form.maxStickCapacity} onChange={handleChange} error={errors.maxStickCapacity} />
                <Field label="Zone" name="zone" value={form.zone} onChange={handleChange} />
                <Field label="Section" name="section" value={form.section} onChange={handleChange} />
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

            <Section title="Display & Remarks" icon={Palette} tone="bg-emerald-50 text-emerald-600">
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Icon" name="icon" value={form.icon} onChange={handleChange} />
                <Field label="Temperature" type="number" name="temperature" value={form.temperature} onChange={handleChange} />
                <Field label="Humidity" type="number" name="humidity" value={form.humidity} onChange={handleChange} />
                <label className="block md:col-span-3">
                  <span className="mb-2 block text-sm font-bold text-slate-600">Box Color</span>
                  <input type="color" name="color" value={form.color} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-200 bg-white p-1" />
                </label>
                <label className="block md:col-span-3">
                  <span className="mb-2 block text-sm font-bold text-slate-600">Remarks</span>
                  <textarea name="remarks" rows={5} value={form.remarks} onChange={handleChange} className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </label>
              </div>
            </Section>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
            <h2 className="text-lg font-extrabold">Box Preview</h2>
            <div className="mt-5 rounded-2xl border border-slate-200 p-5">
              <div className="grid h-16 w-16 place-items-center rounded-2xl text-white" style={{ backgroundColor: form.color }}>
                <Package className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-extrabold">{form.boxName || "Box Name"}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">{form.boxCode}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Rack</p><p className="font-extrabold">{form.rack || "-"}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Shelf</p><p className="font-extrabold">{form.shelf || "-"}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Capacity</p><p className="font-extrabold">{form.maxStickCapacity}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Type</p><p className="font-extrabold">{form.storageType}</p></div>
              </div>
            </div>
          </aside>
        </div>
      </form>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-12px_34px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] justify-end gap-3">
          <Link href={`/admin/warehouse/boxes/${id}`} className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-700">Cancel</Link>
          <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
