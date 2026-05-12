"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Globe2,
  Building2,
  Link as LinkIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

const emptyFooter = {
  companyName: "",
  tagline: "",
  description: "",
  email: "",
  phone: "",
  whatsapp: "",
  supportHours: "",
  address: "",
  componentLinks: [],
  shopLinks: [],
  supportLinks: [],
  companyLinks: [],
  policyLinks: [],
  bottomText: "",
  isActive: true,
};

const sectionConfig = [
  {
    key: "componentLinks",
    title: "Components",
    description: "Footer me semiconductor component SEO links control karo.",
  },
  {
    key: "shopLinks",
    title: "Shop",
    description: "Main shopping category links control karo.",
  },
  {
    key: "supportLinks",
    title: "Support",
    description: "Customer support, request, order aur cart links control karo.",
  },
  {
    key: "companyLinks",
    title: "Company",
    description: "Company information pages ke links control karo.",
  },
  {
    key: "policyLinks",
    title: "Policies",
    description: "Legal policy pages ke links control karo.",
  },
];

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function Field({ label, value, onChange, placeholder, textarea = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[#0f172a]">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none rounded-2xl border border-[#d6e8f5] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] outline-none transition focus:border-[#38bdf8] focus:ring-4 focus:ring-sky-100"
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-[#d6e8f5] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] outline-none transition focus:border-[#38bdf8] focus:ring-4 focus:ring-sky-100"
        />
      )}
    </div>
  );
}

function LinkRow({ item, index, onChange, onDelete }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-[#dbeafe] bg-[#f8fcff] p-3 md:grid-cols-[1.2fr_1.8fr_90px_90px_44px]">
      <input
        value={item.label || ""}
        onChange={(e) => onChange(index, "label", e.target.value)}
        placeholder="Label"
        className="rounded-xl border border-[#d6e8f5] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#38bdf8]"
      />

      <input
        value={item.link || ""}
        onChange={(e) => onChange(index, "link", e.target.value)}
        placeholder="/components/amplifierscomparators"
        className="rounded-xl border border-[#d6e8f5] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#38bdf8]"
      />

      <input
        type="number"
        value={item.order ?? 0}
        onChange={(e) => onChange(index, "order", Number(e.target.value))}
        placeholder="Order"
        className="rounded-xl border border-[#d6e8f5] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#38bdf8]"
      />

      <button
        type="button"
        onClick={() => onChange(index, "isActive", item.isActive === false)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition ${
          item.isActive === false
            ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        }`}
      >
        {item.isActive === false ? (
          <>
            <EyeOff size={14} />
            Hide
          </>
        ) : (
          <>
            <Eye size={14} />
            Live
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => onDelete(index)}
        className="inline-flex items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
        aria-label="Delete link"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}

function LinkSection({ title, description, links, onChange }) {
  const updateItem = (index, field, value) => {
    const next = [...(links || [])];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange(next);
  };

  const addItem = () => {
    onChange([
      ...(links || []),
      {
        label: "",
        link: "",
        order: (links || []).length + 1,
        isActive: true,
      },
    ]);
  };

  const deleteItem = (index) => {
    const next = [...(links || [])];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <section className="rounded-[28px] border border-[#d6e8f5] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex flex-col gap-3 border-b border-[#e8f1f8] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#0f172a]">{title}</h2>
          <p className="mt-1 text-sm font-medium text-[#5f7d95]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f6cbd] px-4 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-[#0b5ca3]"
        >
          <Plus size={17} />
          Add Link
        </button>
      </div>

      <div className="space-y-3">
        {(links || []).length > 0 ? (
          links.map((item, index) => (
            <LinkRow
              key={item._id || `${item.label}-${index}`}
              item={item}
              index={index}
              onChange={updateItem}
              onDelete={deleteItem}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#b9e6fb] bg-[#f2fbff] p-5 text-center text-sm font-bold text-[#0f6cbd]">
            Abhi koi link nahi hai. Add Link click karo.
          </div>
        )}
      </div>
    </section>
  );
}

export default function AdminFooterPage() {
  const [footer, setFooter] = useState(emptyFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeCount = useMemo(() => {
    return sectionConfig.reduce((total, section) => {
      return (
        total +
        (footer[section.key] || []).filter((item) => item?.isActive !== false)
          .length
      );
    }, 0);
  }, [footer]);

  const totalCount = useMemo(() => {
    return sectionConfig.reduce((total, section) => {
      return total + (footer[section.key] || []).length;
    }, 0);
  }, [footer]);

  const updateField = (field, value) => {
    setFooter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchFooter = async () => {
    try {
      setLoading(true);

      const token = getAdminToken();

      const res = await fetch(`${API_BASE}/api/footer-page/admin`, {
        cache: "no-store",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Footer data load failed");
      }

      setFooter({
        ...emptyFooter,
        ...data.footer,
        componentLinks: data.footer?.componentLinks || [],
        shopLinks: data.footer?.shopLinks || [],
        supportLinks: data.footer?.supportLinks || [],
        companyLinks: data.footer?.companyLinks || [],
        policyLinks: data.footer?.policyLinks || [],
      });
    } catch (error) {
      toast.error(error.message || "Footer load failed");
    } finally {
      setLoading(false);
    }
  };

  const saveFooter = async () => {
    try {
      setSaving(true);

      const token = getAdminToken();

      const payload = {
        ...footer,
        componentLinks: footer.componentLinks || [],
        shopLinks: footer.shopLinks || [],
        supportLinks: footer.supportLinks || [],
        companyLinks: footer.companyLinks || [],
        policyLinks: footer.policyLinks || [],
      };

      const res = await fetch(`${API_BASE}/api/footer-page/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Footer update failed");
      }

      setFooter({
        ...emptyFooter,
        ...data.footer,
        componentLinks: data.footer?.componentLinks || [],
        shopLinks: data.footer?.shopLinks || [],
        supportLinks: data.footer?.supportLinks || [],
        companyLinks: data.footer?.companyLinks || [],
        policyLinks: data.footer?.policyLinks || [],
      });

      toast.success("Footer updated successfully");
    } catch (error) {
      toast.error(error.message || "Footer save failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f9ff] p-6">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-[28px] border border-[#d6e8f5] bg-white p-8 text-center shadow-lg">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#0f6cbd]" />
            <p className="mt-4 text-sm font-black text-[#0f172a]">
              Loading footer settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f9ff] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 overflow-hidden rounded-[32px] border border-[#cfe5f5] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-[#0f6cbd] via-[#1792e8] to-[#38bdf8] px-6 py-6 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
                  <Globe2 size={16} />
                  Footer Management
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                  Website Footer Control
                </h1>

                <p className="mt-2 max-w-3xl text-sm font-semibold text-sky-50">
                  Company details, component SEO links, shop links, support,
                  policies aur footer content yahin se update hoga.
                </p>
              </div>

              <button
                type="button"
                onClick={saveFooter}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-[#0f6cbd] shadow-xl transition hover:bg-[#f2fbff] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Footer
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fcff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5f7d95]">
                Total Links
              </p>
              <p className="mt-2 text-3xl font-black text-[#0f172a]">
                {totalCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fcff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5f7d95]">
                Active Links
              </p>
              <p className="mt-2 text-3xl font-black text-[#0f6cbd]">
                {activeCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fcff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5f7d95]">
                Footer Status
              </p>
              <button
                type="button"
                onClick={() => updateField("isActive", !footer.isActive)}
                className={`mt-2 rounded-full px-4 py-2 text-sm font-black ${
                  footer.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {footer.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        </div>

        <section className="mb-6 rounded-[28px] border border-[#d6e8f5] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center gap-3 border-b border-[#e8f1f8] pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf7ff] text-[#0f6cbd]">
              <Building2 size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#0f172a]">
                Company Details
              </h2>
              <p className="text-sm font-medium text-[#5f7d95]">
                Footer me visible company information yahan se change hoga.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Company Name"
              value={footer.companyName}
              onChange={(value) => updateField("companyName", value)}
              placeholder="Royal Trading Component"
            />

            <Field
              label="Tagline"
              value={footer.tagline}
              onChange={(value) => updateField("tagline", value)}
              placeholder="Industrial Solutions Store"
            />

            <Field
              label="Email"
              value={footer.email}
              onChange={(value) => updateField("email", value)}
              placeholder="sales@royalcomponent.com"
            />

            <Field
              label="Phone"
              value={footer.phone}
              onChange={(value) => updateField("phone", value)}
              placeholder="+91 88511 49032"
            />

            <Field
              label="WhatsApp"
              value={footer.whatsapp}
              onChange={(value) => updateField("whatsapp", value)}
              placeholder="+91 88511 49032"
            />

            <Field
              label="Support Hours"
              value={footer.supportHours}
              onChange={(value) => updateField("supportHours", value)}
              placeholder="Mon - Sat | 9 AM - 7 PM"
            />

            <div className="md:col-span-2">
              <Field
                label="Office Address"
                value={footer.address}
                onChange={(value) => updateField("address", value)}
                placeholder="4th Floor, Ansari Road..."
                textarea
              />
            </div>

            <div className="md:col-span-2">
              <Field
                label="Description"
                value={footer.description}
                onChange={(value) => updateField("description", value)}
                placeholder="Short company footer description"
                textarea
              />
            </div>

            <div className="md:col-span-2">
              <Field
                label="Bottom Copyright Text"
                value={footer.bottomText}
                onChange={(value) => updateField("bottomText", value)}
                placeholder="© 2026 Royal Trading Component. All rights reserved."
              />
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {sectionConfig.map((section) => (
            <LinkSection
              key={section.key}
              title={section.title}
              description={section.description}
              links={footer[section.key]}
              onChange={(nextLinks) => updateField(section.key, nextLinks)}
            />
          ))}
        </div>

        <div className="sticky bottom-4 z-20 mt-6 flex justify-end">
          <button
            type="button"
            onClick={saveFooter}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f6cbd] px-7 py-4 text-sm font-black text-white shadow-[0_20px_50px_rgba(15,108,189,0.35)] transition hover:bg-[#0b5ca3] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Footer...
              </>
            ) : (
              <>
                <Save size={18} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}