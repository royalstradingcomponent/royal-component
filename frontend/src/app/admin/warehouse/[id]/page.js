"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  Boxes,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Component,
  Edit3,
  Eye,
  Gauge,
  Home,
  Layers3,
  Loader2,
  MapPin,
  Menu,
  MoreHorizontal,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Warehouse,
  XCircle,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("en-IN");

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getUtilization(warehouse) {
  const total = Number(warehouse?.statistics?.totalCapacity || 0);
  const occupied = Number(warehouse?.statistics?.occupiedCapacity || 0);

  if (!total) return Number(warehouse?.utilizationPercent || 0);

  return Math.min(100, Math.max(0, Number(((occupied / total) * 100).toFixed(2))));
}

function StatusBadge({ status }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ring-1",
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-red-50 text-red-700 ring-red-100"
      )}
    >
      {active ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {status || "INACTIVE"}
    </span>
  );
}

function PageShell({ children }) {
  const menu = [
    ["Dashboard", Home, "/admin/dashboard"],
    ["Warehouses", Warehouse, "/admin/warehouse", true],
    ["Boxes", Boxes, "/admin/warehouse/boxes"],
    ["Sticks", Package, "/admin/warehouse/sticks"],
    ["Components", Component, "/admin/components"],
    ["Stock Transfers", Activity, "/admin/warehouse/transfers"],
    ["Stock In", Plus, "/admin/stock-in"],
    ["Stock Out", ArrowRight, "/admin/stock-out"],
    ["Inventory", Layers3, "/admin/inventory"],
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      <div className="flex">
        <aside className="hidden min-h-screen w-[270px] shrink-0 bg-[#06152d] text-white xl:block">
          <div className="flex h-full flex-col p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-2 py-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
                <Box className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold tracking-normal">RT COMPONENT</span>
            </Link>

            <nav className="mt-7 space-y-1">
              {menu.map(([label, Icon, href, active]) => (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition duration-200",
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              <p className="px-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Reports & Analytics
              </p>
              <div className="mt-2 space-y-1">
                <Link
                  href="/admin/reports"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <BarChart3 className="h-5 w-5" />
                  Reports
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <TrendingUp className="h-5 w-5" />
                  Analytics
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <p className="px-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Settings
              </p>
              <div className="mt-2 space-y-1">
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Users className="h-5 w-5" />
                  Users & Roles
                </Link>
              </div>
            </div>

            <div className="mt-auto rounded-2xl bg-blue-600/20 p-5 ring-1 ring-white/10">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <CircleHelp className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-extrabold">Need Help?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Contact support team for assistance.
              </p>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-blue-500">
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100">
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden w-full max-w-[470px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                  placeholder="Search anything..."
                  type="text"
                />
                <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-400">
                  Ctrl + K
                </kbd>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <button className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    5
                  </span>
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100">
                  <CircleHelp className="h-5 w-5" />
                </button>
                <div className="hidden items-center gap-3 sm:flex">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#123a76] text-sm font-extrabold text-white">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">Admin</p>
                    <p className="text-xs font-medium text-slate-500">Administrator</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

function SectionCard({ title, action, children, className }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)]",
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-slate-950">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value, children }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-4 text-sm">
      <p className="font-semibold text-slate-500">{label}</p>
      <div className="min-w-0 font-bold text-slate-950">{children || value || "-"}</div>
    </div>
  );
}

function StatCard({ title, value, helper, icon: Icon, tone, progress }) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.10)]">
      <div className="flex items-start gap-4">
        <div className={cn("grid h-14 w-14 place-items-center rounded-2xl", tone)}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-normal text-slate-950">
            {value}
          </p>
          {helper ? (
            <p className="mt-2 flex items-center gap-1 text-sm font-bold text-emerald-600">
              {helper}
              <TrendingUp className="h-4 w-4" />
            </p>
          ) : null}
        </div>
      </div>
      {progress !== undefined ? (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function Donut({ percent }) {
  const value = Math.min(100, Math.max(0, Number(percent || 0)));

  return (
    <div
      className="relative grid h-44 w-44 place-items-center rounded-full"
      style={{
        background: `conic-gradient(#2563eb ${value * 3.6}deg, #e2e8f0 0deg)`,
      }}
    >
      <div className="grid h-32 w-32 place-items-center rounded-full bg-white shadow-inner">
        <div className="text-center">
          <p className="text-3xl font-extrabold text-slate-950">{Math.round(value)}%</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">Utilized</p>
        </div>
      </div>
    </div>
  );
}

function ProgressLine({ label, value, total, icon: Icon, tone, bar }) {
  const percent = total ? Math.min(100, Math.max(0, (Number(value || 0) / Number(total)) * 100)) : 0;

  return (
    <div className="grid grid-cols-[44px_1fr] gap-4">
      <div className={cn("grid h-11 w-11 place-items-center rounded-2xl", tone)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="font-extrabold text-slate-950">{label}</p>
          <p className="font-bold text-slate-700">
            {formatNumber(value)} / {formatNumber(total)}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full transition-all duration-700", bar)}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs font-bold text-slate-500">
          {Math.round(percent)}%
        </p>
      </div>
    </div>
  );
}

function WarehouseImageCard() {
  return (
    <SectionCard title="Warehouse Image">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85"
          alt="Modern warehouse building"
          className="h-60 w-full object-cover"
        />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {[0, 1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={cn(
              "h-2 w-2 rounded-full",
              item === 0 ? "bg-blue-600" : "bg-slate-200"
            )}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function LoadingPage() {
  return (
    <PageShell>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid min-h-[60vh] place-items-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">Loading warehouse details...</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default function WarehouseDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [warehouse, setWarehouse] = useState(null);
  const [error, setError] = useState("");

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWarehouse(data?.warehouse || null);
    } catch (err) {
      console.error("Warehouse details error:", err);
      setError(err?.response?.data?.message || "Unable to load warehouse details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchWarehouse();
  }, [id]);

  const utilization = useMemo(() => getUtilization(warehouse), [warehouse]);
  const stats = warehouse?.statistics || {};
  const capacity = Number(stats.totalCapacity || 0);
  const occupied = Number(stats.occupiedCapacity || 0);
  const free = Number(stats.freeCapacity ?? Math.max(0, capacity - occupied));
  const componentCapacity = Math.max(Number(stats.totalComponents || 0), 3500);
  const stickCapacity = Math.max(Number(stats.totalSticks || 0), 200);
  const boxCapacity = Math.max(Number(stats.totalBoxes || 0), 40);
  const estimatedValue = Number(stats.totalQuantity || 0) * 125;

  if (loading) return <LoadingPage />;

  if (error || !warehouse) {
    return (
      <PageShell>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid min-h-[60vh] place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600">
                <XCircle className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-slate-950">
                Warehouse not found
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {error || "This warehouse record is not available."}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/admin/warehouse"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Warehouses
                </Link>
                <button
                  onClick={fetchWarehouse}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-[1660px] space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-500">
              <Link href="/admin/warehouse" className="transition hover:text-blue-600">
                Warehouses
              </Link>
              <ChevronDown className="h-4 w-4 -rotate-90" />
              <span className="text-slate-950">{warehouse.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Warehouse className="h-10 w-10" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
                    {warehouse.name}
                  </h1>
                  <StatusBadge status={warehouse.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
                  <span>{warehouse.warehouseCode}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Created on {formatDate(warehouse.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/warehouse/${warehouse._id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Warehouse
            </Link>
            <Link
              href="/admin/warehouse/boxes"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-extrabold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <Box className="h-4 w-4" />
              Add Box
            </Link>
            <Link
              href="/admin/warehouse/sticks"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3 text-sm font-extrabold text-orange-600 shadow-sm transition hover:bg-orange-50"
            >
              <Package className="h-4 w-4" />
              Add Stick
            </Link>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              <MoreHorizontal className="h-4 w-4" />
              More
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-12">
          <SectionCard title="Warehouse Information" className="xl:col-span-4">
            <div className="space-y-4">
              <InfoRow label="Warehouse Code" value={warehouse.warehouseCode} />
              <InfoRow label="Warehouse Name" value={warehouse.name} />
              <InfoRow label="Manager" value={warehouse.managerName || "-"} />
              <InfoRow label="Phone" value={warehouse.phone || "-"} />
              <InfoRow label="Email" value={warehouse.email || "-"} />
              <InfoRow label="Status">
                <StatusBadge status={warehouse.status} />
              </InfoRow>
              <InfoRow label="Default Warehouse">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold",
                    warehouse.isDefault
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {warehouse.isDefault ? <Check className="h-3.5 w-3.5" /> : null}
                  {warehouse.isDefault ? "Yes" : "No"}
                </span>
              </InfoRow>
              <InfoRow label="Description" value={warehouse.description || "-"} />
            </div>
          </SectionCard>

          <SectionCard title="Address" className="xl:col-span-3">
            <p className="text-sm font-bold leading-7 text-slate-950">
              {[warehouse.address?.line1, warehouse.address?.line2]
                .filter(Boolean)
                .join(", ") || "Address not available"}
              <br />
              {[warehouse.address?.city, warehouse.address?.state, warehouse.address?.pincode]
                .filter(Boolean)
                .join(" - ")}
              <br />
              {warehouse.address?.country || "India"}
            </p>

            <div className="mt-8 space-y-4">
              <InfoRow label="City" value={warehouse.address?.city || "-"} />
              <InfoRow label="State" value={warehouse.address?.state || "-"} />
              <InfoRow label="Country" value={warehouse.address?.country || "India"} />
              <InfoRow label="Pincode" value={warehouse.address?.pincode || "-"} />
            </div>

            <button className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50">
              <MapPin className="h-4 w-4" />
              View on Map
            </button>
          </SectionCard>

          <div className="xl:col-span-5">
            <WarehouseImageCard />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Boxes"
            value={formatNumber(stats.totalBoxes)}
            helper={`Utilization: ${Math.round((Number(stats.totalBoxes || 0) / boxCapacity) * 100)}%`}
            icon={Boxes}
            tone="bg-emerald-50 text-emerald-600"
            progress={(Number(stats.totalBoxes || 0) / boxCapacity) * 100}
          />
          <StatCard
            title="Total Sticks"
            value={formatNumber(stats.totalSticks)}
            helper={`Utilization: ${Math.round((Number(stats.totalSticks || 0) / stickCapacity) * 100)}%`}
            icon={Package}
            tone="bg-orange-50 text-orange-600"
            progress={(Number(stats.totalSticks || 0) / stickCapacity) * 100}
          />
          <StatCard
            title="Total Components"
            value={formatNumber(stats.totalComponents)}
            helper={`Utilization: ${Math.round((Number(stats.totalComponents || 0) / componentCapacity) * 100)}%`}
            icon={Component}
            tone="bg-violet-50 text-violet-600"
            progress={(Number(stats.totalComponents || 0) / componentCapacity) * 100}
          />
          <StatCard
            title="Total Capacity"
            value={`${Math.round(utilization)}%`}
            helper="Overall Utilization"
            icon={Gauge}
            tone="bg-cyan-50 text-cyan-600"
            progress={utilization}
          />
          <StatCard
            title="Total Value (INR)"
            value={`₹ ${formatNumber(estimatedValue)}`}
            helper="Stock Value"
            icon={ShieldCheck}
            tone="bg-blue-50 text-blue-600"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-12">
          <SectionCard title="Capacity Utilization" className="xl:col-span-4">
            <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
              <Donut percent={utilization} />
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="h-3 w-3 rounded-full bg-blue-600" />
                    Used Capacity
                  </span>
                  <span className="font-extrabold text-slate-950">
                    {formatNumber(occupied)} / {formatNumber(capacity)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="h-3 w-3 rounded-full bg-slate-300" />
                    Free Capacity
                  </span>
                  <span className="font-extrabold text-slate-950">
                    {formatNumber(free)} / {formatNumber(capacity)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-extrabold text-blue-600">
                  <span>Total Capacity</span>
                  <span>{formatNumber(capacity)}</span>
                </div>
              </div>
            </div>

            <p className="mt-7 flex items-center gap-2 text-sm font-bold text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              {utilization >= 75 ? "Capacity needs attention" : "Capacity is healthy"}
            </p>
          </SectionCard>

          <SectionCard
            title="Stock Summary"
            className="xl:col-span-4"
            action={
              <Link
                href="/admin/inventory"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-600 hover:text-blue-700"
              >
                <Eye className="h-4 w-4" />
                Detailed
              </Link>
            }
          >
            <div className="space-y-5">
              <ProgressLine
                label="Components"
                value={stats.totalComponents}
                total={componentCapacity}
                icon={Component}
                tone="bg-violet-50 text-violet-600"
                bar="bg-blue-600"
              />
              <ProgressLine
                label="Sticks"
                value={stats.totalSticks}
                total={stickCapacity}
                icon={Package}
                tone="bg-orange-50 text-orange-600"
                bar="bg-orange-500"
              />
              <ProgressLine
                label="Boxes"
                value={stats.totalBoxes}
                total={boxCapacity}
                icon={Boxes}
                tone="bg-emerald-50 text-emerald-600"
                bar="bg-emerald-500"
              />
            </div>

            <Link
              href="/admin/inventory"
              className="mt-6 inline-flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-extrabold text-blue-600 hover:text-blue-700"
            >
              View Detailed Inventory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionCard>

          <SectionCard
            title="Recent Stock Movement"
            className="xl:col-span-4"
            action={
              <Link href="/admin/warehouse/transfers" className="text-sm font-extrabold text-blue-600">
                View All
              </Link>
            }
          >
            <div className="space-y-4">
              {[
                ["IN", "Stock In", "Components received in warehouse", "+500 pcs", "text-emerald-600", "bg-emerald-50"],
                ["OUT", "Stock Out", "Items issued for production", "-200 pcs", "text-red-600", "bg-red-50"],
                ["IN", "Stock In", "Boxes updated in warehouse", "+150 pcs", "text-emerald-600", "bg-emerald-50"],
                ["OUT", "Stock Out", "Sticks transferred from warehouse", "-300 pcs", "text-red-600", "bg-red-50"],
              ].map(([type, title, body, qty, text, bg], index) => (
                <div key={`${title}-${index}`} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1 rounded-full px-3 py-1 text-xs font-extrabold",
                      bg,
                      text
                    )}
                  >
                    {type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-slate-950">{title}</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">{body}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-sm font-extrabold", text)}>{qty}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {formatDate(warehouse.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/warehouse/transfers"
              className="mt-5 inline-flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-extrabold text-blue-600 hover:text-blue-700"
            >
              View All Movements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionCard>
        </div>

        <SectionCard title="Activity Timeline">
          <div className="space-y-5">
            {[
              {
                title: "Warehouse Created",
                body: `${warehouse.name} has been created by Admin`,
                date: warehouse.createdAt,
                icon: Plus,
                tone: "bg-emerald-500 text-white",
              },
              {
                title: "Warehouse Updated",
                body: "Warehouse information has been updated",
                date: warehouse.updatedAt,
                icon: Edit3,
                tone: "bg-blue-100 text-blue-600",
              },
              {
                title: "Box Added",
                body: `${formatNumber(stats.totalBoxes)} boxes mapped with warehouse`,
                date: warehouse.updatedAt,
                icon: Box,
                tone: "bg-orange-100 text-orange-600",
              },
              {
                title: "Stick Added",
                body: `${formatNumber(stats.totalSticks)} sticks available in warehouse`,
                date: warehouse.updatedAt,
                icon: Package,
                tone: "bg-violet-100 text-violet-600",
              },
            ].map((item, index) => (
              <div key={item.title} className="grid gap-4 sm:grid-cols-[44px_1fr_220px] sm:items-start">
                <div className={cn("grid h-10 w-10 place-items-center rounded-full", item.tone)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{item.body}</p>
                </div>
                <p className="text-left text-sm font-semibold text-slate-500 sm:text-right">
                  {formatDateTime(item.date)}
                </p>
                {index < 3 ? (
                  <div className="ml-5 hidden h-4 w-px bg-slate-200 sm:block" />
                ) : null}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
