"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Component,
  Edit3,
  Eye,
  Gauge,
  Home,
  Layers3,
  Menu,
  Package,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
  Users,
  Warehouse,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const numberFormat = new Intl.NumberFormat("en-IN");

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value) {
  return numberFormat.format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDashboardUtilization(stats) {
  const total = Number(stats?.totalCapacity || 0);
  const occupied = Number(stats?.occupiedCapacity || 0);
  if (!total) return Number(stats?.utilization || 0);
  return Math.min(100, Math.max(0, Number(((occupied / total) * 100).toFixed(2))));
}

function getWarehouseUtilization(warehouse) {
  const total = Number(warehouse?.statistics?.totalCapacity || 0);
  const occupied = Number(warehouse?.statistics?.occupiedCapacity || 0);
  if (!total) return Number(warehouse?.utilizationPercent || 0);
  return Math.min(100, Math.max(0, Number(((occupied / total) * 100).toFixed(2))));
}

function StatusBadge({ status }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-4 py-2 whitespace-nowrap text-xs font-extrabold ring-1",
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-red-50 text-red-700 ring-red-100"
      )}
    >
      <span
        className={cn(
          "mr-1.5 h-2 w-2 rounded-full",
          isActive ? "bg-emerald-500" : "bg-red-500"
        )}
      />
      {status || "INACTIVE"}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  tone,
  helper,
  children,
}) {
  return (
    <div
      className="
group
relative
overflow-hidden
rounded-[20px]
bg-white
px-7
py-6
border
border-[#edf2f7]
shadow-[0_8px_20px_rgba(15,23,42,0.05)]
transition-all
duration-300
hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]
"
    >
      <div className="flex items-start justify-between">

        <div className="flex-1">

          <p className="text-[17px] font-semibold leading-6 text-[#5f6f89]">
            {title}
          </p>

          <h2 className="mt-3 text-[28px] font-extrabold leading-none tracking-[-0.02em] text-[#0f172a]">
            {value}
          </h2>

        </div>

        <div
          className={`
    flex
    h-14
    w-14
    items-center
    justify-center
    rounded-2xl
    ${tone}
    shadow-[0_8px_18px_rgba(15,23,42,0.05)]
  `}
        >
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
      </div>

      {helper && (
        <div className="mt-8">
          <p className="text-[15px] font-medium leading-6 text-[#64748b]">
            {helper}
          </p>
        </div>
      )}

      {children && (
        <div className="mt-8">
          {children}
        </div>
      )}
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

function ProgressBar({ value, color = "bg-blue-600" }) {
  const width = Math.min(100, Math.max(0, Number(value || 0)));
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn("h-full rounded-full transition-all duration-700", color)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function CapacityDonut({ percent }) {
  const value = Math.min(100, Math.max(0, Number(percent || 0)));

  return (
    <div
      className="relative mx-auto grid h-52 w-52 place-items-center rounded-full"
      style={{
        background: `conic-gradient(#2563eb ${value * 3.6}deg, #e2e8f0 0deg)`,
      }}
    >
      <div className="grid h-36 w-36 place-items-center rounded-full bg-white shadow-inner">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-slate-950">{Math.round(value)}%</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Utilized</p>
        </div>
      </div>
    </div>
  );
}

function DashboardSidebar() {
  const menu = [
    ["Dashboard", Home, "/admin/warehouse/dashboard", true],
    ["Warehouses", Warehouse, "/admin/warehouse"],
    ["Boxes", Boxes, "/admin/warehouse/boxes"],
    ["Sticks", Package, "/admin/warehouse/sticks"],
    ["Components", Component, "/admin/components"],
    ["Stock Transfers", Activity, "/admin/warehouse/transfers"],
    ["Inventory", Layers3, "/admin/inventory"],
  ];

  return (
    <aside className="hidden min-h-screen w-[270px] shrink-0 bg-[#06152d] text-white xl:block">
      <div className="flex h-full flex-col p-4">
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-2 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <PackageCheck className="h-5 w-5" />
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
            <Link href="/admin/reports" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white">
              <BarChart3 className="h-5 w-5" />
              Reports
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white">
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
            <Link href="/admin/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white">
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
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-[1660px] animate-pulse space-y-6">
        <div className="h-16 rounded-2xl bg-white" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-36 rounded-2xl bg-white" />
          ))}
        </div>
        <div className="h-[520px] rounded-2xl bg-white" />
      </div>
    </div>
  );
}

function EmptyState({ onRefresh }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Warehouse className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-lg font-extrabold text-slate-950">No warehouse found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        Abhi warehouse create nahi hua hai. Pehla warehouse create karne ke baad View, Edit aur Delete actions yahan dikhenge.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/admin/warehouse/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Create Warehouse
        </Link>
        <button type="button" onClick={onRefresh} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}

function WarehouseOverviewChart({ warehouses, stats }) {
  const bars = useMemo(() => {
    const base = warehouses.slice(0, 8);

    if (!base.length) {
      return Array.from({ length: 8 }).map((_, index) => ({
        label: `${index + 1}`,
        value: [18, 28, 35, 44, 52, 61, 70, Math.round(getDashboardUtilization(stats))][index],
      }));
    }

    return base.map((warehouse) => ({
      label: warehouse.warehouseCode?.replace("WH-", "") || warehouse.name,
      value: getWarehouseUtilization(warehouse),
    }));
  }, [warehouses, stats]);

  const points = bars
    .map((bar, index) => {
      const x = (index / Math.max(1, bars.length - 1)) * 100;
      const y = 100 - Math.min(100, Math.max(0, bar.value));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <div className="h-60 rounded-2xl bg-gradient-to-b from-white to-blue-50/60 p-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          {[20, 40, 60, 80].map((line) => (
            <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="0.6" />
          ))}
          <polygon fill="rgba(37,99,235,0.12)" points={`0,100 ${points} 100,100`} />
          <polyline fill="none" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" points={points} />
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3 border-t border-slate-100 pt-4">
        {[
          ["Quantity", stats?.totalQuantity || 0],
          ["Low Stock", stats?.lowStockItems || 0],
          ["Occupied", stats?.occupiedCapacity || 0],
          ["Capacity", stats?.totalCapacity || 0],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="truncate text-xs font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-extrabold text-slate-950">{formatNumber(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WarehouseActionTable({
  warehouses,
  search,
  status,
  setSearch,
  setStatus,
  onDelete,
  deletingId,
}) {
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      const keyword = search.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        warehouse.name?.toLowerCase().includes(keyword) ||
        warehouse.warehouseCode?.toLowerCase().includes(keyword) ||
        warehouse.managerName?.toLowerCase().includes(keyword) ||
        warehouse.address?.city?.toLowerCase().includes(keyword);

      const matchesStatus = status === "ALL" || warehouse.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [warehouses, search, status]);

  return (
    <SectionCard
      className="p-0 overflow-hidden"
    >
      {/* ======================= PREMIUM HEADER ======================= */}

      <div className="mb-7 rounded-[28px] border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50 shadow-sm">

        <div className="flex flex-col gap-6 p-6 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5">

              <Warehouse className="h-4 w-4 text-blue-600" />

              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">

                Warehouse Control Center

              </span>

            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">

              Warehouse Management

            </h2>

            <p className="mt-2 max-w-2xl text-[15px] font-medium leading-7 text-slate-500">

              Search, filter, view, edit and manage every warehouse from one place.

            </p>

          </div>

          <Link
            href="/admin/warehouse/create"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-blue-600 px-7 text-[15px] font-extrabold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Warehouse
          </Link>

        </div>

        <div className="border-t border-slate-200 bg-white p-6">

          <div className="grid gap-4 xl:grid-cols-[1fr_220px_170px]">

            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search warehouse, manager, code or city..."
                className="
          h-14
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          pl-14
          pr-5
          text-[15px]
          font-semibold
          text-slate-800
          outline-none
          transition-all
          duration-300
          focus:border-blue-500
          focus:bg-white
          focus:ring-4
          focus:ring-blue-500/10
          "
              />

            </div>

            {/* STATUS */}

            <div className="relative">

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
          h-14
          w-full
          appearance-none
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-5
          pr-10
          text-[15px]
          font-bold
          text-slate-700
          outline-none
          transition
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-500/10
          "
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <ChevronDown className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            </div>

            {/* CLEAR */}

            <button
              onClick={() => {
                setSearch("");
                setStatus("ALL");
              }}
              className="
        flex
        h-14
        items-center
        justify-center
        gap-2
        rounded-2xl
        border
        border-slate-200
        bg-white
        text-[15px]
        font-bold
        text-slate-700
        transition
        hover:bg-slate-50
        "
            >
              <SlidersHorizontal className="h-5 w-5" />

              Reset Filters

            </button>

          </div>

        </div>

      </div>

      {/* ======================= END HEADER ======================= */}

      {filteredWarehouses.length === 0 ? (
        <EmptyState onRefresh={() => { }} />
      ) : (
        <>
          <div className="hidden space-y-5 lg:block">

            {filteredWarehouses.map((warehouse) => {

              const utilization = getWarehouseUtilization(warehouse);

              return (

                <div
                  key={warehouse._id}
                  className="
group
rounded-[26px]
border
border-slate-200
bg-white
shadow-sm
transition-all
duration-300
hover:-translate-y-1
hover:border-blue-200
hover:shadow-2xl
"
                >

                  <div
                    className="
    p-7
    space-y-6
  "
                  >

                    {/* ===== TOP ROW ===== */}

                    <div
                      className="
      grid
      gap-6
      items-start
      xl:grid-cols-[2.2fr_1.3fr_2fr]
    "
                    >
                      {/* Warehouse */}

                      <div className="flex items-center gap-5">

                        <div
                          className="
      flex
      h-16
      w-16
      items-center
      justify-center
      rounded-3xl
      bg-gradient-to-br
      from-blue-50
      to-blue-100
      text-blue-600
      shadow-inner
    "
                        >
                          <Warehouse className="h-8 w-8" />
                        </div>

                        <div className="min-w-0">

                          <h3 className="text-3xl font-extrabold text-slate-900 break-words">
                            {warehouse.name}
                          </h3>

                          <p className="mt-1 text-base font-bold text-slate-400">
                            {warehouse.warehouseCode}
                          </p>

                        </div>

                      </div>

                      {/* Manager */}

                      <div className="flex items-center">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-bold">

                            {warehouse.managerName?.charAt(0) || "A"}

                          </div>

                          <div className="min-w-0">

                            <p className="font-bold text-slate-900">

                              {warehouse.managerName || "-"}

                            </p>

                            <p className="text-xs text-slate-500">

                              {warehouse.phone || "-"}

                            </p>

                          </div>

                        </div>

                      </div>

                      {/* City */}

                      {/* Address Details */}

                      <div className="w-full">

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">

                          <h4 className="mb-3 text-sm font-bold text-slate-700">
                            Address Details
                          </h4>

                          <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">

                            <div className="font-semibold text-slate-500">
                              Company
                            </div>
                            <div className="break-words font-bold text-slate-900">
                              {warehouse.address?.company || "-"}
                            </div>

                            <div className="font-semibold text-slate-500">
                              Building
                            </div>
                            <div className="break-words font-bold text-slate-900">
                              {warehouse.address?.building || "-"}
                            </div>

                            <div className="font-semibold text-slate-500">
                              Area
                            </div>
                            <div className="break-words font-bold text-slate-900">
                              {warehouse.address?.area || "-"}
                            </div>

                            <div className="font-semibold text-slate-500">
                              Phase
                            </div>
                            <div className="break-words font-bold text-slate-900">
                              {warehouse.address?.phase || "-"}
                            </div>

                            <div className="font-semibold text-slate-500">
                              City
                            </div>
                            <div className="break-words font-bold text-slate-900">
                              {warehouse.address?.city || "-"}
                            </div>

                            <div className="font-semibold text-slate-500">
                              State
                            </div>
                            <div className="break-words font-bold text-slate-900">
                              {warehouse.address?.state || "-"}
                            </div>

                            <div className="font-semibold text-slate-500">
                              Pincode
                            </div>
                            <div className="break-words font-bold text-slate-900">
                              {warehouse.address?.pincode || "-"}
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* ===== BOTTOM ROW ===== */}

                    <div
                      className="
      grid
      gap-6
      items-center
      xl:grid-cols-[1.5fr_170px_180px_1fr]
    "
                    >

                      {/* Stats */}

                      <div className="col-span-2">

                        <div className="grid grid-cols-4 gap-3 items-center">

                          <div className="
flex
h-[86px]
items-center
justify-center
rounded-2xl
bg-orange-50
text-center
">

                            <p className="text-xs text-slate-500">

                              Boxes

                            </p>

                            <p className="font-extrabold text-orange-600">

                              {formatNumber(warehouse.statistics?.totalBoxes)}

                            </p>

                          </div>

                          <div className="
flex
h-[86px]
items-center
justify-center
rounded-2xl
bg-violet-50
text-center
">

                            <p className="text-xs text-slate-500">

                              Sticks

                            </p>

                            <p className="font-extrabold text-violet-600">

                              {formatNumber(warehouse.statistics?.totalSticks)}

                            </p>

                          </div>

                          <div className="
flex
h-[86px]
items-center
justify-center
rounded-2xl
bg-cyan-50
text-center
">

                            <p className="text-xs text-slate-500">

                              Comp.

                            </p>

                            <p className="font-extrabold text-cyan-700">

                              {formatNumber(warehouse.statistics?.totalComponents)}

                            </p>

                          </div>

                        </div>

                      </div>

                      {/* Capacity */}

                      <div className="col-span-1">

                        <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">

                          <span>

                            {Math.round(utilization)}%

                          </span>

                        </div>

                        <ProgressBar
                          value={utilization}
                          color={
                            utilization >= 80
                              ? "bg-red-500"
                              : utilization >= 60
                                ? "bg-orange-500"
                                : "bg-blue-600"
                          }
                        />

                      </div>

                      {/* Status */}

                      <div className="col-span-1">

                        <StatusBadge status={warehouse.status} />

                      </div>

                      {/* Actions */}

                      <div className="col-span-1">

                        <div
                          className="
flex
items-center
justify-end
gap-4
whitespace-nowrap
"
                        >

                          <Link
                            href={`/admin/warehouse/${warehouse._id}`}
                            className="
inline-flex
items-center
justify-center
gap-2
min-w-[125px]
h-14
rounded-2xl
bg-blue-600
px-6
text-[18px]
font-bold
text-white
transition
hover:bg-blue-700
"
                          >

                            <Eye className="mr-2 h-4 w-4" />

                            View

                          </Link>

                          <Link
                            href={`/admin/warehouse/${warehouse._id}/edit`}
                            className="
inline-flex
items-center
justify-center
gap-2
min-w-[125px]
h-14
rounded-2xl
bg-amber-50
px-6
text-[18px]
font-bold
text-amber-700
transition
hover:bg-amber-100
"
                          >

                            <Edit3 className="mr-2 h-4 w-4" />

                            Edit

                          </Link>

                          <button
                            onClick={() => onDelete(warehouse)}
                            disabled={deletingId === warehouse._id}
                            className="
inline-flex
items-center
justify-center
gap-2
min-w-[125px]
h-14
rounded-2xl
bg-red-50
px-6
text-[18px]
font-bold
text-red-600
transition
hover:bg-red-100
"
                          >

                            {deletingId === warehouse._id

                              ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" />

                              : <Trash2 className="mr-2 h-4 w-4" />}

                            Delete

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredWarehouses.map((warehouse) => {
              const utilization = getWarehouseUtilization(warehouse);

              return (
                <div key={warehouse._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                        <Warehouse className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-950">{warehouse.name}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">{warehouse.warehouseCode}</p>
                      </div>
                    </div>
                    <StatusBadge status={warehouse.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3 text-center">
                    <div>
                      <p className="text-xs font-bold text-slate-500">Boxes</p>
                      <p className="mt-1 font-extrabold text-slate-950">{formatNumber(warehouse.statistics?.totalBoxes)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Sticks</p>
                      <p className="mt-1 font-extrabold text-slate-950">{formatNumber(warehouse.statistics?.totalSticks)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Comp.</p>
                      <p className="mt-1 font-extrabold text-slate-950">{formatNumber(warehouse.statistics?.totalComponents)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Capacity</span>
                      <span>{Math.round(utilization)}%</span>
                    </div>
                    <ProgressBar value={utilization} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link href={`/admin/warehouse/${warehouse._id}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-extrabold text-white">
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Link href={`/admin/warehouse/${warehouse._id}/edit`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-extrabold text-amber-700 ring-1 ring-amber-200">
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button type="button" onClick={() => onDelete(warehouse)} disabled={deletingId === warehouse._id} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-extrabold text-red-700 ring-1 ring-red-200 disabled:opacity-60">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </SectionCard>
  );
}

function QuickActions() {
  const actions = [
    ["Add New Warehouse", "Create warehouse master", "/admin/warehouse/create", Plus, "bg-blue-50 text-blue-600"],
    ["Open Warehouse List", "View all warehouse rows", "/admin/warehouse", Warehouse, "bg-emerald-50 text-emerald-600"],
    ["Manage Boxes", "Add boxes to warehouse", "/admin/warehouse/boxes", Boxes, "bg-orange-50 text-orange-600"],
    ["Manage Sticks", "Add sticks to boxes", "/admin/warehouse/sticks", Package, "bg-violet-50 text-violet-600"],
  ];

  return (
    <div className="space-y-3">
      {actions.map(([label, description, href, Icon, tone]) => (
        <Link key={label} href={href} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-blue-200 hover:bg-blue-50">
          <div className={cn("grid h-11 w-11 place-items-center rounded-2xl", tone)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-slate-950">{label}</p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-500">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>
      ))}
    </div>
  );
}

export default function WarehouseDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const fetchDashboard = async () => {
    try {
      setError("");
      setRefreshing(true);

      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [warehouseRes, dashboardRes] = await Promise.all([
        axios.get(`${API_URL}/api/warehouse?limit=1000`, { headers }),
        axios.get(`${API_URL}/api/warehouse/dashboard`, { headers }),
      ]);

      setWarehouses(warehouseRes.data?.warehouses || []);
      setStats(dashboardRes.data?.stats || null);
    } catch (err) {
      console.error("Warehouse dashboard error:", err);
      setError(err?.response?.data?.message || "Unable to load warehouse dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDelete = async (warehouse) => {
    const confirmed = window.confirm(
      `Delete warehouse "${warehouse.name}"?\n\nAgar is warehouse me boxes honge to backend delete allow nahi karega.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(warehouse._id);
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/api/warehouse/${warehouse._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDashboard();
    } catch (err) {
      console.error("Delete warehouse error:", err);
      alert(err?.response?.data?.message || "Failed to delete warehouse.");
    } finally {
      setDeletingId("");
    }
  };

  const utilization = getDashboardUtilization(stats);
  const activeWarehouses = stats?.activeWarehouses ?? 0;
  const inactiveWarehouses = stats?.inactiveWarehouses ?? 0;
  const totalCapacity = Number(stats?.totalCapacity || 0);
  const occupiedCapacity = Number(stats?.occupiedCapacity || 0);
  const freeCapacity = Math.max(0, Number(stats?.freeCapacity ?? totalCapacity - occupiedCapacity));

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">



      <div className="mx-auto max-w-[1660px] space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
              Warehouse Dashboard
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Yahin se warehouse View, Edit aur Delete easily manage kar sakte ho.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <CalendarDays className="h-4 w-4" />
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </button>
            <button type="button" onClick={fetchDashboard} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60">
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")} type="button">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Total Warehouses" value={formatNumber(stats?.totalWarehouses)} icon={Warehouse} tone="bg-blue-50 text-blue-600">
            <div className="flex items-center gap-2 text-[13px] font-semibold">
              <span className="text-[#16a34a]">Active: {formatNumber(activeWarehouses)}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-[#ef4444]">Inactive: {formatNumber(inactiveWarehouses)}</span>
            </div>
          </StatCard>
          <StatCard title="Total Boxes" value={formatNumber(stats?.totalBoxes)} helper="Boxes across all warehouses" icon={Boxes} tone="bg-orange-50 text-orange-500" />
          <StatCard title="Total Sticks" value={formatNumber(stats?.totalSticks)} helper="Sticks available in boxes" icon={Package} tone="bg-violet-50 text-violet-600" />
          <StatCard title="Total Components" value={formatNumber(stats?.totalComponents)} helper={`${formatNumber(stats?.lowStockItems)} low stock items`} icon={Component} tone="bg-[#f5f1ff] text-[#7c3aed]" />
          <StatCard title="Capacity Utilization" value={`${Math.round(utilization)}%`} helper="Overall warehouse capacity" icon={Gauge} tone="bg-cyan-50 text-cyan-500" />
        </div>

        <WarehouseActionTable
          warehouses={warehouses}
          search={search}
          status={status}
          setSearch={setSearch}
          setStatus={setStatus}
          onDelete={handleDelete}
          deletingId={deletingId}
        />

        <div className="grid gap-5 xl:grid-cols-12">
          <SectionCard title="Warehouse Overview" className="xl:col-span-5">
            <WarehouseOverviewChart warehouses={warehouses} stats={stats} />
          </SectionCard>

          <SectionCard title="Capacity Utilization" className="xl:col-span-3">
            <CapacityDonut percent={utilization} />
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  Used Capacity
                </span>
                <span className="font-extrabold text-slate-950">
                  {formatNumber(occupiedCapacity)} / {formatNumber(totalCapacity)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  Free Capacity
                </span>
                <span className="font-extrabold text-slate-950">
                  {formatNumber(freeCapacity)} / {formatNumber(totalCapacity)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-extrabold text-blue-600">
                <span>Total Capacity</span>
                <span>{formatNumber(totalCapacity)}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Quick Actions" className="xl:col-span-4">
            <QuickActions />
          </SectionCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-12">
          <SectionCard title="Warehouse Status" className="xl:col-span-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4 text-sm font-extrabold text-emerald-700">
                <span>Active Warehouses</span>
                <span>{formatNumber(activeWarehouses)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-red-50 p-4 text-sm font-extrabold text-red-700">
                <span>Inactive Warehouses</span>
                <span>{formatNumber(inactiveWarehouses)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-orange-50 p-4 text-sm font-extrabold text-orange-700">
                <span>Low Stock Items</span>
                <span>{formatNumber(stats?.lowStockItems)}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Recent Activities" className="xl:col-span-4">
            <div className="space-y-4">
              {warehouses.slice(0, 4).map((warehouse) => (
                <Link key={warehouse._id} href={`/admin/warehouse/${warehouse._id}`} className="flex gap-3 rounded-2xl p-2 transition hover:bg-blue-50">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-slate-950">Warehouse Created</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-500">{warehouse.name}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{formatDate(warehouse.createdAt)}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Alerts & Notifications" className="xl:col-span-4">
            <div className="space-y-4">
              {[
                ["Low Stock Alert", `${formatNumber(stats?.lowStockItems)} components are running low in stock`, AlertTriangle, "bg-red-50 text-red-600"],
                ["Capacity Warning", utilization >= 75 ? "Warehouse capacity is above 75%" : "Warehouse capacity is under control", Gauge, "bg-orange-50 text-orange-600"],
                ["System Update", "Warehouse dashboard synced successfully", ShieldCheck, "bg-blue-50 text-blue-600"],
              ].map(([title, body, Icon, tone]) => (
                <div key={title} className="flex gap-3">
                  <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-2xl", tone)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

    </div>
  );
}
