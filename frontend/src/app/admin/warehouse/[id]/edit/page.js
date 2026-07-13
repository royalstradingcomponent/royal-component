"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
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
  Home,
  ImagePlus,
  Layers3,
  Loader2,
  Lock,
  MapPin,
  Menu,
  Package,
  PackageCheck,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ToggleLeft,
  TrendingUp,
  Upload,
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

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
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

function PageShell({ children }) {
  const menu = [
    ["Dashboard", Home, "/admin/dashboard"],
    ["Warehouses", Warehouse, "/admin/warehouse", true],
    ["Boxes", Boxes, "/admin/warehouse/boxes"],
    ["Sticks", Package, "/admin/warehouse/sticks"],
    ["Components", Component, "/admin/components"],
    ["Stock Transfers", ArrowRight, "/admin/warehouse/transfers"],
    ["Stock In", Upload, "/admin/stock-in"],
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

function SectionCard({ title, icon: Icon, tone = "bg-blue-50 text-blue-600", children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)] sm:p-6">
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

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  disabled,
  placeholder,
  error,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-600">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-xl border bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200"
          )}
        />
        {disabled ? (
          <Lock className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        ) : null}
      </div>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  );
}

function TextArea({ label, name, value, onChange, required, placeholder, rows = 4, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-600">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
          error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200"
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
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200"
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

function Toggle({ checked, onChange, label, helper }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-3 text-left"
    >
      <span
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition",
          checked ? "bg-blue-600" : "bg-slate-200"
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
      <span>
        <span className="block text-sm font-bold text-slate-700">{label}</span>
        {helper ? <span className="mt-1 block text-xs font-medium text-slate-500">{helper}</span> : null}
      </span>
    </button>
  );
}

function SummaryRow({ icon: Icon, label, value, tone = "bg-blue-50 text-blue-600" }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-8 w-8 place-items-center rounded-xl", tone)}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-sm font-extrabold text-slate-950">{value}</span>
    </div>
  );
}

function LoadingPage() {
  return (
    <PageShell>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid min-h-[65vh] place-items-center rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">Loading warehouse form...</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default function EditWarehousePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warehouse, setWarehouse] = useState(null);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    warehouseCode: "",
    name: "",
    managerName: "",
    phone: "",
    email: "",
    status: "ACTIVE",
    isDefault: false,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    description: "",
    remarks: "",
    allowNegativeStock: false,
    enableQRCode: true,
    enableBarcode: true,
  });

  const fetchWarehouse = async () => {
    try {
      setPageLoading(true);
      setServerError("");

      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const item = data?.warehouse || data?.data || data;
      setWarehouse(item);
      setForm({
        warehouseCode: item?.warehouseCode || "",
        name: item?.name || "",
        managerName: item?.managerName || "",
        phone: item?.phone || "",
        email: item?.email || "",
        status: item?.status || "ACTIVE",
        isDefault: Boolean(item?.isDefault),
        addressLine1: item?.address?.line1 || "",
        addressLine2: item?.address?.line2 || "",
        city: item?.address?.city || "",
        state: item?.address?.state || "",
        country: item?.address?.country || "India",
        pincode: item?.address?.pincode || "",
        description: item?.description || "",
        remarks: "",
        allowNegativeStock: Boolean(item?.settings?.allowNegativeStock),
        enableQRCode: item?.settings?.enableQRCode !== false,
        enableBarcode: item?.settings?.enableBarcode !== false,
      });
    } catch (error) {
      console.error("Load warehouse error:", error);
      setServerError(error?.response?.data?.message || "Failed to load warehouse.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchWarehouse();
  }, [id]);

  const utilization = useMemo(() => getUtilization(warehouse), [warehouse]);
  const stats = warehouse?.statistics || {};
  const estimatedValue = Number(stats.totalQuantity || 0) * 125;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const setToggle = (name) => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Warehouse name is required.";
    if (!form.addressLine1.trim()) nextErrors.addressLine1 = "Address line 1 is required.";
    if (!form.city.trim()) nextErrors.city = "City is required.";
    if (!form.state.trim()) nextErrors.state = "State is required.";
    if (!form.country.trim()) nextErrors.country = "Country is required.";
    if (!form.pincode.trim()) nextErrors.pincode = "Pincode is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);
      setServerError("");

      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        managerName: form.managerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        isDefault: form.isDefault,
        address: {
          line1: form.addressLine1.trim(),
          line2: form.addressLine2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          pincode: form.pincode.trim(),
        },
        settings: {
          allowNegativeStock: form.allowNegativeStock,
          enableQRCode: form.enableQRCode,
          enableBarcode: form.enableBarcode,
        },
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouse/${id}`, payload, {
        headers,
      });

      if (warehouse?.status && warehouse.status !== form.status) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/warehouse/${id}/status`,
          {},
          { headers }
        );
      }

      router.push(`/admin/warehouse/${id}`);
    } catch (error) {
      console.error("Update warehouse error:", error);
      setServerError(error?.response?.data?.message || "Failed to update warehouse.");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) return <LoadingPage />;

  if (serverError && !warehouse) {
    return (
      <PageShell>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid min-h-[65vh] place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600">
                <XCircle className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-slate-950">
                Unable to load warehouse
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">{serverError}</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/admin/warehouse"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Back
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
      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-[1660px] space-y-5 p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-28">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-500">
                <Link href="/admin/warehouse" className="transition hover:text-blue-600">
                  Warehouses
                </Link>
                <ChevronDown className="h-4 w-4 -rotate-90" />
                <span className="text-slate-950">Edit Warehouse</span>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/warehouse/${id}`}
                  className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
                    Edit Warehouse
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Update warehouse information and settings
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden gap-3 lg:flex">
              <Link
                href={`/admin/warehouse/${id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>

          {serverError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {serverError}
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
            <div className="space-y-5">
              <SectionCard
                title="Warehouse Information"
                icon={Warehouse}
                tone="bg-blue-50 text-blue-600"
              >
                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    label="Warehouse Code"
                    name="warehouseCode"
                    value={form.warehouseCode}
                    onChange={handleChange}
                    disabled
                    required
                  />
                  <Field
                    label="Warehouse Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    error={errors.name}
                  />
                  <Field
                    label="Manager Name"
                    name="managerName"
                    value={form.managerName}
                    onChange={handleChange}
                    placeholder="Enter manager name"
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                  <Field
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="manager@example.com"
                    error={errors.email}
                  />
                  <SelectField
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </SelectField>
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
                  <Toggle
                    checked={form.isDefault}
                    onChange={() => setToggle("isDefault")}
                    label="Default Warehouse"
                    helper="Set as default warehouse"
                  />
                  <Toggle
                    checked={form.enableQRCode}
                    onChange={() => setToggle("enableQRCode")}
                    label="Enable QR Code"
                    helper="Allow QR code labels"
                  />
                  <Toggle
                    checked={form.enableBarcode}
                    onChange={() => setToggle("enableBarcode")}
                    label="Enable Barcode"
                    helper="Allow barcode labels"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Address Information"
                icon={MapPin}
                tone="bg-violet-50 text-violet-600"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Address Line 1"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    required
                    error={errors.addressLine1}
                  />
                  <Field
                    label="Address Line 2"
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                    placeholder="Building, floor, area"
                  />
                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    error={errors.city}
                  />
                  <Field
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    error={errors.state}
                  />
                  <SelectField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    error={errors.country}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Singapore">Singapore</option>
                  </SelectField>
                  <Field
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    error={errors.pincode}
                  />
                </div>

                <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Map
                  </button>
                </div>
              </SectionCard>

              <SectionCard
                title="Additional Information"
                icon={PackageCheck}
                tone="bg-emerald-50 text-emerald-600"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <TextArea
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Primary warehouse for electronic components..."
                    rows={4}
                  />
                  <TextArea
                    label="Remarks (Optional)"
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Internal note before saving changes..."
                    rows={4}
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Toggle
                    checked={form.allowNegativeStock}
                    onChange={() => setToggle("allowNegativeStock")}
                    label="Allow Negative Stock"
                    helper="Use carefully. This permits stock issue even when available stock is low."
                  />
                </div>
              </SectionCard>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <Warehouse className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-950">
                    Warehouse Summary
                  </h2>
                </div>

                <div>
                  <SummaryRow
                    icon={Boxes}
                    label="Total Boxes"
                    value={formatNumber(stats.totalBoxes)}
                    tone="bg-emerald-50 text-emerald-600"
                  />
                  <SummaryRow
                    icon={Package}
                    label="Total Sticks"
                    value={formatNumber(stats.totalSticks)}
                    tone="bg-orange-50 text-orange-600"
                  />
                  <SummaryRow
                    icon={Component}
                    label="Total Components"
                    value={formatNumber(stats.totalComponents)}
                    tone="bg-violet-50 text-violet-600"
                  />
                  <SummaryRow
                    icon={ToggleLeft}
                    label="Capacity Utilization"
                    value={`${Math.round(utilization)}%`}
                    tone="bg-cyan-50 text-cyan-600"
                  />
                  <SummaryRow
                    icon={ShieldCheck}
                    label="Warehouse Value (INR)"
                    value={`₹ ${formatNumber(estimatedValue)}`}
                    tone="bg-blue-50 text-blue-600"
                  />
                  <SummaryRow
                    icon={CalendarDays}
                    label="Created On"
                    value={formatDateTime(warehouse?.createdAt)}
                    tone="bg-slate-100 text-slate-600"
                  />
                  <SummaryRow
                    icon={RefreshCw}
                    label="Last Updated"
                    value={formatDateTime(warehouse?.updatedAt)}
                    tone="bg-slate-100 text-slate-600"
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-950">
                    Warehouse Image
                  </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85"
                    alt="Warehouse building"
                    className="h-48 w-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50"
                >
                  <Upload className="h-4 w-4" />
                  Change Image
                </button>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  JPG, PNG or WebP (Max. 2MB)
                </p>
              </section>
            </aside>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-12px_34px_rgba(15,23,42,0.08)] backdrop-blur xl:left-[270px]">
          <div className="mx-auto flex max-w-[1660px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <ShieldCheck className="h-5 w-5 text-slate-400" />
              Make sure all details are correct before saving changes.
            </p>
            <div className="flex gap-3">
              <Link
                href={`/admin/warehouse/${id}`}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50 sm:flex-none"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
