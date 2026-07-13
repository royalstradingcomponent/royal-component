"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Building2,
  ChevronDown,
  Edit3,
  Gauge,
  Layers3,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Thermometer,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const nf = new Intl.NumberFormat("en-IN");

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function n(value) {
  return nf.format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function utilization(box) {
  const max = Number(box?.maxStickCapacity || 0);
  const occupied = Number(box?.occupiedSticks || 0);
  if (!max) return Number(box?.utilizationPercent || 0);
  return Math.min(100, Math.max(0, Math.round((occupied / max) * 100)));
}

function statusClass(status) {
  const map = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    FULL: "bg-red-50 text-red-700 ring-red-100",
    EMPTY: "bg-slate-100 text-slate-700 ring-slate-200",
    MAINTENANCE: "bg-amber-50 text-amber-700 ring-amber-100",
    RESERVED: "bg-blue-50 text-blue-700 ring-blue-100",
    DAMAGED: "bg-rose-50 text-rose-700 ring-rose-100",
    INACTIVE: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return map[status] || map.INACTIVE;
}

function StatusBadge({ status }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1", statusClass(status))}>
      {status || "INACTIVE"}
    </span>
  );
}

function Section({ title, children, action }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 text-sm">
      <p className="font-bold text-slate-500">{label}</p>
      <p className="font-extrabold text-slate-950">{value || "-"}</p>
    </div>
  );
}

function Stat({ title, value, icon: Icon, tone, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950">{value}</p>
          {helper ? <p className="mt-2 text-sm font-semibold text-slate-500">{helper}</p> : null}
        </div>
        <div className={cn("grid h-14 w-14 place-items-center rounded-2xl", tone)}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

function Donut({ value }) {
  const percent = Math.min(100, Math.max(0, Number(value || 0)));
  return (
    <div
      className="mx-auto grid h-48 w-48 place-items-center rounded-full"
      style={{ background: `conic-gradient(#2563eb ${percent * 3.6}deg, #e2e8f0 0deg)` }}
    >
      <div className="grid h-34 w-34 h-32 w-32 place-items-center rounded-full bg-white shadow-inner">
        <div className="text-center">
          <p className="text-3xl font-extrabold">{percent}%</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Used</p>
        </div>
      </div>
    </div>
  );
}

export default function WarehouseBoxDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [box, setBox] = useState(null);
  const [error, setError] = useState("");

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken")}` });

  const fetchBox = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`${API_URL}/api/warehouse-boxes/${id}`, { headers: headers() });
      setBox(data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load box.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBox();
  }, [id]);

  const used = useMemo(() => utilization(box), [box]);

  const changeStatus = async (status) => {
    try {
      setSavingStatus(true);
      await axios.patch(`${API_URL}/api/warehouse-boxes/${id}/status`, { status }, { headers: headers() });
      await fetchBox();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">Loading box details...</p>
        </div>
      </div>
    );
  }

  if (error || !box) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow">
          <Boxes className="mx-auto h-14 w-14 text-slate-300" />
          <h1 className="mt-4 text-xl font-extrabold">Box not found</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">{error || "This box is not available."}</p>
          <Link href="/admin/warehouse/boxes" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white">Back to Boxes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500">
              <Link href="/admin/warehouse/boxes" className="hover:text-blue-600">Boxes</Link>
              <ChevronDown className="h-4 w-4 -rotate-90" />
              <span className="text-slate-950">{box.boxName}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/warehouse/boxes" className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: box.color || "#2563eb" }}>
                <Boxes className="h-8 w-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-extrabold">{box.boxName}</h1>
                  <StatusBadge status={box.status} />
                </div>
                <p className="mt-2 text-sm font-bold text-slate-500">{box.boxCode} / {box.displayName || "No display name"}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/warehouse/boxes/${box._id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <Edit3 className="h-4 w-4" />
              Edit Box
            </Link>
            <Link href={`/admin/warehouse/sticks?box=${box._id}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">
              View Sticks
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat title="Occupied Sticks" value={n(box.occupiedSticks)} helper={`${used}% utilized`} icon={Boxes} tone="bg-blue-50 text-blue-600" />
          <Stat title="Free Sticks" value={n(box.freeSticks)} helper={`${n(box.maxStickCapacity)} max capacity`} icon={Package} tone="bg-emerald-50 text-emerald-600" />
          <Stat title="Components" value={n(box.statistics?.totalComponents)} helper={`${n(box.statistics?.totalQuantity)} quantity`} icon={PackageCheck} tone="bg-orange-50 text-orange-600" />
          <Stat title="Reserved" value={n(box.reservedSticks)} helper={`${n(box.availableStickCapacity)} available`} icon={ShieldCheck} tone="bg-violet-50 text-violet-600" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Section title="Box Information">
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Box Code" value={box.boxCode} />
                <Info label="Box Name" value={box.boxName} />
                <Info label="Warehouse" value={box.warehouseId?.name || box.warehouseId?.warehouseCode} />
                <Info label="Display Name" value={box.displayName} />
                <Info label="Storage Type" value={box.storageType} />
                <Info label="Floor" value={box.floor} />
                <Info label="Created At" value={formatDate(box.createdAt)} />
                <Info label="Updated At" value={formatDate(box.updatedAt)} />
              </div>
            </Section>

            <Section title="Location Details">
              <div className="grid gap-4 md:grid-cols-3">
                <Info label="Rack" value={box.rack} />
                <Info label="Shelf" value={box.shelf} />
                <Info label="Row" value={box.row} />
                <Info label="Column" value={box.column} />
                <Info label="Zone" value={box.zone} />
                <Info label="Section" value={box.section} />
              </div>
            </Section>

            <Section title="Remarks">
              <p className="text-sm font-semibold leading-7 text-slate-600">{box.remarks || "No remarks available."}</p>
            </Section>
          </div>

          <aside className="space-y-6">
            <Section title="Capacity Utilization">
              <Donut value={used} />
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm font-extrabold"><span>Occupied</span><span>{n(box.occupiedSticks)} / {n(box.maxStickCapacity)}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${used}%` }} />
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500"><span>Free: {n(box.freeSticks)}</span><span>Available: {n(box.availableStickCapacity)}</span></div>
              </div>
            </Section>

            <Section title="Status Control">
              <div className="grid gap-3">
                {["ACTIVE", "INACTIVE", "MAINTENANCE", "RESERVED", "DAMAGED"].map((status) => (
                  <button
                    key={status}
                    disabled={savingStatus}
                    onClick={() => changeStatus(status)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-left text-sm font-extrabold ring-1 transition hover:bg-slate-50 disabled:opacity-60",
                      box.status === status ? statusClass(status) : "bg-white text-slate-700 ring-slate-200"
                    )}
                  >
                    {savingStatus && box.status !== status ? <RefreshCw className="mr-2 inline h-4 w-4 animate-spin" /> : null}
                    {status}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Environment">
              <div className="space-y-4">
                <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                  <Thermometer className="h-5 w-5 text-slate-500" />
                  <div><p className="text-sm font-bold text-slate-500">Temperature</p><p className="font-extrabold">{box.temperature ?? "-"} C</p></div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  <div><p className="text-sm font-bold text-slate-500">Humidity</p><p className="font-extrabold">{box.humidity ?? "-"}%</p></div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-blue-50 p-4 text-blue-800">
                  <Building2 className="h-5 w-5" />
                  <div><p className="text-sm font-bold">Warehouse</p><p className="font-extrabold">{box.warehouseId?.name || "-"}</p></div>
                </div>
              </div>
            </Section>
          </aside>
        </div>
      </div>
    </div>
  );
}
