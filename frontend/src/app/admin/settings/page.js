"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  ExternalLink,
  KeyRound,
  RefreshCcw,
  Server,
  Settings,
  ShieldCheck,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE, adminRequest } from "@/lib/api";

export default function AdminSettingsPage() {
  const [token, setToken] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  const [adminStatus, setAdminStatus] = useState("checking");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    try {
      setLoading(true);
      setApiStatus("checking");
      setAdminStatus("checking");

      const savedToken =
        typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";
      setToken(savedToken || "");

      const healthRes = await fetch(`${API_BASE}/health`, {
        cache: "no-store",
      });

      if (healthRes.ok) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }

      try {
        await adminRequest("/api/admin/stats/counts");
        setAdminStatus("authorized");
      } catch {
        setAdminStatus("unauthorized");
      }
    } catch (error) {
      setApiStatus("offline");
      setAdminStatus("unauthorized");
      toast.error(error.message || "Status check failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const clearAdminSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    toast.success("Admin session cleared");
    checkStatus();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Settings</h1>
          <p className="text-sm text-slate-500">
            Admin panel configuration, API status and quick controls.
          </p>
        </div>

        <button
          onClick={checkStatus}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCcw size={18} />
          {loading ? "Checking..." : "Refresh Status"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusCard
          icon={Server}
          title="API Server"
          value={apiStatus === "online" ? "Online" : apiStatus === "offline" ? "Offline" : "Checking"}
          active={apiStatus === "online"}
          note={API_BASE}
        />

        <StatusCard
          icon={ShieldCheck}
          title="Admin Auth"
          value={
            adminStatus === "authorized"
              ? "Authorized"
              : adminStatus === "unauthorized"
              ? "Unauthorized"
              : "Checking"
          }
          active={adminStatus === "authorized"}
          note={token ? "Admin token found" : "No admin token"}
        />

        <StatusCard
          icon={Database}
          title="Database"
          value={apiStatus === "online" ? "Connected" : "Unknown"}
          active={apiStatus === "online"}
          note="Checked through backend health/API"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
            <Store size={20} />
            Store Information
          </h2>

          <div className="grid gap-4">
            <InfoRow label="Store Name" value="Royal Component" />
            <InfoRow
              label="Business Type"
              value="Industrial, Electrical & Electronic Components Store"
            />
            <InfoRow label="Frontend URL" value="https://royalsmd.com" />
            <InfoRow label="API Base URL" value={API_BASE} />
          </div>

          <p className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm leading-6 text-yellow-800">
            Ye section abhi read-only hai. Agar aap chahte ho ki store name,
            bank details, GST, WhatsApp number, support email admin panel se
            dynamic save ho, to next step me hum backend <b>Setting model</b>{" "}
            aur <b>/api/admin/settings</b> API banayenge.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
            <KeyRound size={20} />
            Admin Session
          </h2>

          <div className="space-y-4">
            <div className="rounded-xl bg-[#f3f7fb] p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                Token Status
              </p>
              <p className="mt-1 font-bold text-[#102033]">
                {token ? "Token available in localStorage" : "No token found"}
              </p>
              {token ? (
                <p className="mt-2 break-all text-xs text-slate-500">
                  {token.slice(0, 26)}...
                </p>
              ) : null}
            </div>

            <button
              onClick={clearAdminSession}
              className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              Clear Admin Session
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
          <Settings size={20} />
          Quick Admin Links
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickLink href="/admin/products" title="Products" />
          <QuickLink href="/admin/categories" title="Categories" />
          <QuickLink href="/admin/inventory" title="Inventory" />
          <QuickLink href="/admin/orders" title="Orders" />
          <QuickLink href="/admin/customers" title="Customers" />
          <QuickLink href="/admin/coupons" title="Coupons" />
          <QuickLink href="/admin/chats" title="Support Chats" />
          <QuickLink href="/admin/reports" title="Reports" />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-[#102033]">
          Next Recommended Dynamic Settings
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <Feature text="Store name, logo, favicon control" />
          <Feature text="Support email, phone, WhatsApp number" />
          <Feature text="Bank transfer details for checkout" />
          <Feature text="GST number and invoice settings" />
          <Feature text="COD enable/disable and order limit" />
          <Feature text="Shipping charge and free delivery threshold" />
          <Feature text="Homepage banners and SEO settings" />
          <Feature text="Email/WhatsApp notification templates" />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, title, value, active, note }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3
            className={`mt-2 text-2xl font-bold ${
              active ? "text-green-600" : "text-red-600"
            }`}
          >
            {value}
          </h3>
          <p className="mt-2 break-all text-xs text-slate-500">{note}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl border bg-[#f8fbff] p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-all font-bold text-[#102033]">{value}</p>
    </div>
  );
}

function QuickLink({ href, title }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border bg-[#f8fbff] px-4 py-3 text-sm font-bold text-[#102033] hover:border-[#2454b5] hover:bg-[#eef4ff]"
    >
      {title}
      <ExternalLink size={15} />
    </Link>
  );
}

function Feature({ text }) {
  return (
    <div className="rounded-xl bg-[#f3f7fb] px-4 py-3 text-sm font-semibold text-slate-700">
      {text}
    </div>
  );
}