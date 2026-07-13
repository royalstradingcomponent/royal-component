"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  Boxes,
  Building2,
  ChevronDown,
  Edit3,
  Eye,
  Filter,
  Gauge,
  Layers3,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const nf = new Intl.NumberFormat("en-IN");

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function n(value) {
  return nf.format(Number(value || 0));
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

function StatCard({ title, value, icon: Icon, tone, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
          {helper ? <p className="mt-2 text-sm font-semibold text-slate-500">{helper}</p> : null}
        </div>
        <div className={cn("grid h-14 w-14 place-items-center rounded-2xl", tone)}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1", statusClass(status))}>
      {status || "INACTIVE"}
    </span>
  );
}

function Progress({ value }) {
  const color = value >= 90 ? "bg-red-500" : value >= 70 ? "bg-amber-500" : "bg-blue-600";
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function WarehouseBoxesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [error, setError] = useState("");

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  });

  const fetchBoxes = async () => {
    try {
      setRefreshing(true);
      setError("");
      const [boxRes, statRes] = await Promise.all([
        axios.get(`${API_URL}/api/warehouse-boxes?limit=1000`, { headers: headers() }),
        axios.get(`${API_URL}/api/warehouse-boxes/dashboard`, { headers: headers() }),
      ]);
      setBoxes(boxRes.data?.data || []);
      setStats(statRes.data?.data || null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load warehouse boxes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  const filteredBoxes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return boxes.filter((box) => {
      const matchesSearch =
        !q ||
        box.boxName?.toLowerCase().includes(q) ||
        box.boxCode?.toLowerCase().includes(q) ||
        box.displayName?.toLowerCase().includes(q) ||
        box.rack?.toLowerCase().includes(q) ||
        box.shelf?.toLowerCase().includes(q) ||
        box.warehouseId?.name?.toLowerCase().includes(q);
      const matchesStatus = status === "ALL" || box.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [boxes, search, status]);

  const totals = useMemo(() => {
    return boxes.reduce(
      (acc, box) => {
        acc.capacity += Number(box.maxStickCapacity || 0);
        acc.occupied += Number(box.occupiedSticks || 0);
        acc.free += Number(box.freeSticks || 0);
        acc.components += Number(box.statistics?.totalComponents || 0);
        return acc;
      },
      { capacity: 0, occupied: 0, free: 0, components: 0 }
    );
  }, [boxes]);

  const deleteBox = async (box) => {
    if (!window.confirm(`Delete box "${box.boxName}"?`)) return;
    try {
      setDeletingId(box._id);
      await axios.delete(`${API_URL}/api/warehouse-boxes/${box._id}`, { headers: headers() });
      await fetchBoxes();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete box.");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
          <div className="h-20 rounded-2xl bg-white" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-36 rounded-2xl bg-white" />)}
          </div>
          <div className="h-[520px] rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Link href="/admin/warehouse" className="hover:text-blue-600">Warehouse</Link>
              <ChevronDown className="h-4 w-4 -rotate-90" />
              <span className="text-slate-950">Boxes</span>
            </div>
            <h1 className="mt-3 flex items-center gap-3 text-3xl font-extrabold">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <Boxes className="h-7 w-7" />
              </span>
              Warehouse Boxes
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Box capacity, location, status, View, Edit and Delete sab yahin se manage karo.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={fetchBoxes}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Refresh
            </button>
            <Link href="/admin/warehouse/boxes/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Create Box
            </Link>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Total Boxes" value={n(stats?.totalBoxes || boxes.length)} icon={Boxes} tone="bg-blue-50 text-blue-600" helper="All warehouse boxes" />
          <StatCard title="Active Boxes" value={n(stats?.activeBoxes)} icon={Package} tone="bg-emerald-50 text-emerald-600" helper="Available for storage" />
          <StatCard title="Full Boxes" value={n(stats?.fullBoxes)} icon={Gauge} tone="bg-red-50 text-red-600" helper="No free stick slots" />
          <StatCard title="Empty Boxes" value={n(stats?.emptyBoxes)} icon={Layers3} tone="bg-slate-100 text-slate-700" helper="Ready to receive sticks" />
          <StatCard title="Components" value={n(totals.components)} icon={Package} tone="bg-violet-50 text-violet-600" helper={`${n(totals.occupied)} / ${n(totals.capacity)} sticks used`} />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Box Management</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">View, Edit, Delete buttons har row me clearly diye gaye hain.</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-[360px_190px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search box, code, rack, shelf..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-extrabold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="FULL">Full</option>
                  <option value="EMPTY">Empty</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="DAMAGED">Damaged</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <Filter className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {filteredBoxes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <Boxes className="mx-auto h-14 w-14 text-slate-300" />
              <h3 className="mt-4 text-lg font-extrabold">No Boxes Found</h3>
              <p className="mt-2 text-sm font-semibold text-slate-500">Create your first warehouse box.</p>
              <Link href="/admin/warehouse/boxes/create" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white">
                <Plus className="h-4 w-4" />
                Create Box
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Box", "Warehouse", "Location", "Storage", "Capacity", "Status", "Actions"].map((head) => (
                        <th key={head} className={cn("px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500", head === "Actions" ? "text-right" : "text-left")}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBoxes.map((box) => {
                      const used = utilization(box);
                      return (
                        <tr key={box._id} className="transition hover:bg-blue-50/40">
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: box.color || "#2563eb" }}>
                                <Boxes className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-extrabold">{box.boxName}</p>
                                <p className="mt-1 text-xs font-bold text-slate-500">{box.boxCode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 text-sm font-bold text-slate-700">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              {box.warehouseId?.name || "-"}
                            </div>
                          </td>
                          <td className="px-5 py-5 text-sm font-bold text-slate-700">
                            Rack {box.rack || "-"} / Shelf {box.shelf || "-"}
                            <p className="mt-1 text-xs font-semibold text-slate-400">Row {box.row || "-"} / Col {box.column || "-"}</p>
                          </td>
                          <td className="px-5 py-5 text-sm font-bold text-slate-700">{box.storageType || "-"}</td>
                          <td className="px-5 py-5">
                            <div className="w-44">
                              <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                                <span>{n(box.occupiedSticks)} / {n(box.maxStickCapacity)}</span>
                                <span>{used}%</span>
                              </div>
                              <Progress value={used} />
                            </div>
                          </td>
                          <td className="px-5 py-5"><StatusBadge status={box.status} /></td>
                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/warehouse/boxes/${box._id}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-blue-700"><Eye className="h-4 w-4" />View</Link>
                              <Link href={`/admin/warehouse/boxes/${box._id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-extrabold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"><Edit3 className="h-4 w-4" />Edit</Link>
                              <button onClick={() => deleteBox(box)} disabled={deletingId === box._id} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-700 ring-1 ring-red-200 hover:bg-red-100 disabled:opacity-60">
                                {deletingId === box._id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 lg:hidden">
                {filteredBoxes.map((box) => {
                  const used = utilization(box);
                  return (
                    <div key={box._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ backgroundColor: box.color || "#2563eb" }}>
                            <Boxes className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-extrabold">{box.boxName}</p>
                            <p className="text-xs font-bold text-slate-500">{box.boxCode}</p>
                          </div>
                        </div>
                        <StatusBadge status={box.status} />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3 text-center">
                        <div><p className="text-xs font-bold text-slate-500">Rack</p><p className="font-extrabold">{box.rack || "-"}</p></div>
                        <div><p className="text-xs font-bold text-slate-500">Shelf</p><p className="font-extrabold">{box.shelf || "-"}</p></div>
                        <div><p className="text-xs font-bold text-slate-500">Sticks</p><p className="font-extrabold">{n(box.occupiedSticks)}</p></div>
                      </div>
                      <div className="mt-4">
                        <div className="mb-2 flex justify-between text-xs font-bold text-slate-500"><span>Capacity</span><span>{used}%</span></div>
                        <Progress value={used} />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Link href={`/admin/warehouse/boxes/${box._id}`} className="inline-flex justify-center gap-1 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-extrabold text-white"><Eye className="h-4 w-4" />View</Link>
                        <Link href={`/admin/warehouse/boxes/${box._id}/edit`} className="inline-flex justify-center gap-1 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-extrabold text-amber-700 ring-1 ring-amber-200"><Edit3 className="h-4 w-4" />Edit</Link>
                        <button onClick={() => deleteBox(box)} className="inline-flex justify-center gap-1 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-extrabold text-red-700 ring-1 ring-red-200"><Trash2 className="h-4 w-4" />Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
