"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Search,
} from "lucide-react";
import {
  getAdminContactPage,
  updateAdminContactPage,
} from "@/lib/adminContactApi";

const emptyCard = {
  title: "",
  value: "",
  subText: "",
  icon: "phone",
  link: "",
  isActive: true,
  order: 0,
};

export default function AdminContactPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadPage() {
    try {
      setLoading(true);
      const page = await getAdminContactPage();

      setForm({
        heroTitle: page?.heroTitle || "",
        heroSubtitle: page?.heroSubtitle || "",
        supportTitle: page?.supportTitle || "",
        supportDescription: page?.supportDescription || "",
        email: page?.email || "",
        phone: page?.phone || "",
        whatsapp: page?.whatsapp || "",
        address: page?.address || "",
        businessHours: page?.businessHours || "",
        mapEmbedUrl: page?.mapEmbedUrl || "",
        cards: page?.cards?.length ? page.cards : [emptyCard],
        seo: {
          metaTitle: page?.seo?.metaTitle || "",
          metaDescription: page?.seo?.metaDescription || "",
          metaKeywords: page?.seo?.metaKeywords || [],
        },
        isActive: page?.isActive ?? true,
      });
    } catch (error) {
      alert(error.message || "Failed to load contact page");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, []);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateSeoField(name, value) {
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }));
  }

  function updateCard(index, name, value) {
    setForm((prev) => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], [name]: value };
      return { ...prev, cards };
    });
  }

  function addCard() {
    setForm((prev) => ({
      ...prev,
      cards: [...prev.cards, { ...emptyCard, order: prev.cards.length + 1 }],
    }));
  }

  function removeCard(index) {
    setForm((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        seo: {
          ...form.seo,
          metaKeywords:
            typeof form.seo.metaKeywords === "string"
              ? form.seo.metaKeywords
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              : form.seo.metaKeywords,
        },
      };

      const updated = await updateAdminContactPage(payload);

      setForm({
        ...payload,
        cards: updated.cards || payload.cards,
      });

      alert("Contact page updated successfully");
    } catch (error) {
      alert(error.message || "Failed to save contact page");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen rounded-[28px] border border-[#c8def0] bg-[#eef7ff] p-8 shadow-sm">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="animate-spin text-sky-700" size={40} />
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen rounded-[28px] border border-[#c8def0] bg-[#eef7ff] p-4 shadow-inner sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[30px] border-2 border-[#b7d7ee] bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-700">
                Admin Control
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Contact Page Management
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                Contact page ka hero, phone, email, WhatsApp, address, cards,
                map aur SEO content yahan se dynamic update hoga.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-800 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <AdminSection
          title="Hero Section"
          description="Top banner content manage karo."
        >
          <Input
            label="Hero Title"
            value={form.heroTitle}
            onChange={(v) => updateField("heroTitle", v)}
          />

          <Textarea
            label="Hero Subtitle"
            value={form.heroSubtitle}
            onChange={(v) => updateField("heroSubtitle", v)}
            rows={4}
          />
        </AdminSection>

        <AdminSection
          title="Main Contact Details"
          description="Phone, email, WhatsApp, address aur business hours."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Phone"
              icon={Phone}
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              placeholder="+91 98765 43210"
            />

            <Input
              label="Email"
              icon={Mail}
              value={form.email}
              onChange={(v) => updateField("email", v)}
              placeholder="support@royalsmd.com"
            />

            <Input
              label="WhatsApp"
              icon={MessageCircle}
              value={form.whatsapp}
              onChange={(v) => updateField("whatsapp", v)}
              placeholder="+91 98765 43210"
            />

            <Input
              label="Business Hours"
              icon={Clock}
              value={form.businessHours}
              onChange={(v) => updateField("businessHours", v)}
              placeholder="Monday - Saturday, 10:00 AM - 7:00 PM"
            />
          </div>

          <Textarea
            label="Address"
            icon={MapPin}
            value={form.address}
            onChange={(v) => updateField("address", v)}
            rows={3}
          />

          <Input
            label="Google Map Embed URL"
            value={form.mapEmbedUrl}
            onChange={(v) => updateField("mapEmbedUrl", v)}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </AdminSection>

        <AdminSection
          title="Support Box Content"
          description="Right side procurement support card ka content."
        >
          <Input
            label="Support Title"
            value={form.supportTitle}
            onChange={(v) => updateField("supportTitle", v)}
          />

          <Textarea
            label="Support Description"
            value={form.supportDescription}
            onChange={(v) => updateField("supportDescription", v)}
            rows={4}
          />
        </AdminSection>

        <AdminSection
          title="Contact Cards"
          description="Call, Email, WhatsApp ya custom contact cards add/edit karo."
          action={
            <button
              type="button"
              onClick={addCard}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-md"
            >
              <Plus size={16} />
              Add Card
            </button>
          }
        >
          <div className="space-y-5">
            {form.cards.map((card, index) => (
              <div
                key={index}
                className="rounded-[26px] border-2 border-[#b7d7ee] bg-[#f7fcff] p-5 shadow-[0_8px_25px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#c8def0] pb-4">
                  <h3 className="text-lg font-black text-slate-950">
                    Contact Card #{index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Title"
                    value={card.title}
                    onChange={(v) => updateCard(index, "title", v)}
                    placeholder="Call Support"
                  />

                  <Input
                    label="Value"
                    value={card.value}
                    onChange={(v) => updateCard(index, "value", v)}
                    placeholder="+91 98765 43210"
                  />

                  <Select
                    label="Icon"
                    value={card.icon}
                    onChange={(v) => updateCard(index, "icon", v)}
                    options={[
                      "phone",
                      "mail",
                      "whatsapp",
                      "map",
                      "clock",
                      "truck",
                      "file",
                      "cpu",
                      "payment",
                    ]}
                  />

                  <Input
                    label="Order"
                    type="number"
                    value={card.order}
                    onChange={(v) => updateCard(index, "order", Number(v))}
                  />

                  <Input
                    label="Link"
                    value={card.link}
                    onChange={(v) => updateCard(index, "link", v)}
                    placeholder="tel:+91... / mailto:... / https://wa.me/..."
                  />

                  <Select
                    label="Active"
                    value={String(card.isActive)}
                    onChange={(v) =>
                      updateCard(index, "isActive", v === "true")
                    }
                    options={["true", "false"]}
                  />
                </div>

                <Textarea
                  label="Sub Text"
                  value={card.subText}
                  onChange={(v) => updateCard(index, "subText", v)}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          title="SEO Settings"
          description="Google ranking ke liye meta title, description aur keywords."
        >
          <Input
            label="Meta Title"
            icon={Search}
            value={form.seo.metaTitle}
            onChange={(v) => updateSeoField("metaTitle", v)}
          />

          <Textarea
            label="Meta Description"
            value={form.seo.metaDescription}
            onChange={(v) => updateSeoField("metaDescription", v)}
            rows={4}
          />

          <Textarea
            label="Meta Keywords"
            value={
              Array.isArray(form.seo.metaKeywords)
                ? form.seo.metaKeywords.join(", ")
                : form.seo.metaKeywords
            }
            onChange={(v) => updateSeoField("metaKeywords", v)}
            rows={3}
            placeholder="Royal Component contact, industrial components supplier, GST invoice support"
          />
        </AdminSection>

        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-sky-300 transition hover:bg-sky-800 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Contact Page"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminSection({ title, description, children, action }) {
  return (
    <section className="rounded-[30px] border-2 border-[#b7d7ee] bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.07)]">
      <div className="mb-6 flex flex-col gap-4 border-b-2 border-[#d6e8f6] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">{title}</h2>
          {description && (
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-900">
        {Icon ? <Icon size={16} className="text-sky-700" /> : null}
        {label}
      </span>

      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border-2 border-[#b7d7ee] bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-sky-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  icon: Icon,
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-900">
        {Icon ? <Icon size={16} className="text-sky-700" /> : null}
        {label}
      </span>

      <textarea
        value={value || ""}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-2xl border-2 border-[#b7d7ee] bg-white px-4 py-3 text-sm font-bold leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-sky-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
      />
    </label>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-900">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border-2 border-[#b7d7ee] bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm outline-none transition hover:border-sky-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}