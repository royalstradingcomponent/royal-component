"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CreditCard,
  Save,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminPaymentSettings,
  updateAdminPaymentSettings,
} from "@/lib/paymentSettingsApi";

export default function AdminPaymentSettingsPage() {
  const [form, setForm] = useState({
    bankAccountName: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfsc: "",
    companyUpiId: "",
    companyUpiName: "",
  });

  const [fallback, setFallback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const data = await getAdminPaymentSettings();
      const settings = data.settings;
      setFallback(data.fallback || null);

      setForm({
        bankAccountName:
          settings?.bankAccountName || data.fallback?.accountName || "",
        bankName: settings?.bankName || data.fallback?.bankName || "",
        bankAccountNumber:
          settings?.bankAccountNumber || data.fallback?.accountNumber || "",
        bankIfsc: settings?.bankIfsc || data.fallback?.ifsc || "",
        companyUpiId: settings?.companyUpiId || data.fallback?.upiId || "",
        companyUpiName:
          settings?.companyUpiName || data.fallback?.upiName || "",
      });
    } catch (error) {
      toast.error(error.message || "Payment settings load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateAdminPaymentSettings(form);
      toast.success("Payment settings saved successfully");
      await loadSettings();
    } catch (error) {
      toast.error(error.message || "Payment settings update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-sm font-semibold text-slate-500">
        Loading payment settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#cdefff] bg-gradient-to-br from-[#e0f5ff] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">
              Royal Component Admin
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#102033]">
              Payment Settings
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              Customer checkout page par bank account, UPI ID aur payment
              instructions yahi se control honge. Data MongoDB me save hoga.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSettings}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-black text-[#102033] hover:bg-[#f8fbff]"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[#e0f2fe] p-3 text-[#0284c7]">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#102033]">
              Bank Transfer Details
            </h2>
            <p className="text-sm text-slate-500">
              NEFT / RTGS / IMPS payment ke liye details.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Bank Account Name"
            name="bankAccountName"
            value={form.bankAccountName}
            onChange={handleChange}
            placeholder="Royal Trading Co"
          />

          <Input
            label="Bank Name"
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
            placeholder="ICICI Bank"
          />

          <Input
            label="Bank Account Number"
            name="bankAccountNumber"
            value={form.bankAccountNumber}
            onChange={handleChange}
            placeholder="Enter account number"
          />

          <Input
            label="IFSC Code"
            name="bankIfsc"
            value={form.bankIfsc}
            onChange={handleChange}
            placeholder="ICIC0000000"
          />
        </div>

        <div className="my-8 border-t" />

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[#dcfce7] p-3 text-green-700">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#102033]">
              UPI Payment Details
            </h2>
            <p className="text-sm text-slate-500">
              Customer ko checkout par ye UPI details show hongi.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Company UPI ID"
            name="companyUpiId"
            value={form.companyUpiId}
            onChange={handleChange}
            placeholder="8851149032@pthdfc"
          />

          <Input
            label="Company UPI Name"
            name="companyUpiName"
            value={form.companyUpiName}
            onChange={handleChange}
            placeholder="Royal Trading Co"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2454b5] px-7 py-3 text-sm font-black text-white shadow hover:bg-[#1e4695] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Payment Settings"}
          </button>
        </div>
      </form>

      <section className="rounded-[24px] border border-[#bae6fd] bg-[#f8fbff] p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-[#0284c7]" />
          <h2 className="text-xl font-black text-[#102033]">
            Checkout Preview
          </h2>
        </div>

        <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <Preview label="Account Name" value={form.bankAccountName} />
          <Preview label="Bank Name" value={form.bankName} />
          <Preview label="Account Number" value={form.bankAccountNumber} />
          <Preview label="IFSC" value={form.bankIfsc} />
          <Preview label="UPI ID" value={form.companyUpiId} />
          <Preview label="UPI Name" value={form.companyUpiName} />
        </div>

        {fallback ? (
          <p className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">
            Note: Agar database settings empty hongi to backend .env fallback
            details use karega.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0284c7] focus:ring-4 focus:ring-[#e0f2fe]"
      />
    </label>
  );
}

function Preview({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all font-black text-[#102033]">
        {value || "-"}
      </p>
    </div>
  );
}