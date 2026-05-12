"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";

const initialState = {
  heroLabel: "",
  heroTitle: "",
  heroDescription: "",
  heroImage: "",

  searchPlaceholder: "",

  recentTitle: "",
  popularTitle: "",

  semiconductorTitle: "",
  automationTitle: "",

  buyingGuideTitle: "",
  procurementTitle: "",

  departmentTitle: "",

  ctaTitle: "",
  ctaDescription: "",
  ctaButtonText: "",
  ctaButtonLink: "",
  ctaImage: "",

  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
};

export default function BlogSettingsPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const adminToken =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/blog-page-setting/admin`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await res.json();

      if (data?.success && data?.setting) {
        setForm({
          ...initialState,
          ...data.setting,
          metaKeywords: data.setting.metaKeywords || [],
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "metaKeywords"
          ? value.split(",").map((v) => v.trim())
          : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const adminToken =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/blog-page-setting/admin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data?.success) {
  toast.success("Blog settings updated successfully");
} else {
  toast.error(data?.message || "Failed to update settings");
}
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-lg font-bold">
        Loading blog settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-950">
            Blog Page Settings
          </h1>

          <p className="mt-2 text-slate-600">
            Control blog homepage headings, CTA, hero section and SEO.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* HERO */}
          <SectionCard title="Hero Section">
            <Input
              label="Hero Label"
              name="heroLabel"
              value={form.heroLabel}
              onChange={handleChange}
            />

            <Textarea
              label="Hero Title"
              name="heroTitle"
              value={form.heroTitle}
              onChange={handleChange}
            />

            <Textarea
              label="Hero Description"
              name="heroDescription"
              value={form.heroDescription}
              onChange={handleChange}
            />

            <Input
              label="Hero Image URL"
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
            />

            <Input
              label="Search Placeholder"
              name="searchPlaceholder"
              value={form.searchPlaceholder}
              onChange={handleChange}
            />
          </SectionCard>

          {/* SECTION TITLES */}
          <SectionCard title="Homepage Section Titles">
            <Input
              label="Recent Posts Title"
              name="recentTitle"
              value={form.recentTitle}
              onChange={handleChange}
            />

            <Input
              label="Popular Posts Title"
              name="popularTitle"
              value={form.popularTitle}
              onChange={handleChange}
            />

            <Input
              label="Semiconductor Section Title"
              name="semiconductorTitle"
              value={form.semiconductorTitle}
              onChange={handleChange}
            />

            <Input
              label="Automation Section Title"
              name="automationTitle"
              value={form.automationTitle}
              onChange={handleChange}
            />

            <Input
              label="Buying Guide Title"
              name="buyingGuideTitle"
              value={form.buyingGuideTitle}
              onChange={handleChange}
            />

            <Input
              label="Procurement Guide Title"
              name="procurementTitle"
              value={form.procurementTitle}
              onChange={handleChange}
            />

            <Input
              label="Department Title"
              name="departmentTitle"
              value={form.departmentTitle}
              onChange={handleChange}
            />
          </SectionCard>

          {/* CTA */}
          <SectionCard title="CTA Section">
            <Input
              label="CTA Title"
              name="ctaTitle"
              value={form.ctaTitle}
              onChange={handleChange}
            />

            <Textarea
              label="CTA Description"
              name="ctaDescription"
              value={form.ctaDescription}
              onChange={handleChange}
            />

            <Input
              label="CTA Button Text"
              name="ctaButtonText"
              value={form.ctaButtonText}
              onChange={handleChange}
            />

            <Input
              label="CTA Button Link"
              name="ctaButtonLink"
              value={form.ctaButtonLink}
              onChange={handleChange}
            />

            <Input
              label="CTA Image URL"
              name="ctaImage"
              value={form.ctaImage}
              onChange={handleChange}
            />
          </SectionCard>

          {/* SEO */}
          <SectionCard title="SEO Settings">
            <Input
              label="Meta Title"
              name="metaTitle"
              value={form.metaTitle}
              onChange={handleChange}
            />

            <Textarea
              label="Meta Description"
              name="metaDescription"
              value={form.metaDescription}
              onChange={handleChange}
            />

            <Textarea
              label="Meta Keywords (comma separated)"
              name="metaKeywords"
              value={form.metaKeywords.join(", ")}
              onChange={handleChange}
            />
          </SectionCard>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-blue-700 px-6 py-4 text-lg font-black text-white transition hover:bg-blue-800 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Blog Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-2xl font-black text-slate-950">
        {title}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </label>

      <input
        {...props}
        className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-blue-700"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </label>

      <textarea
        {...props}
        rows={5}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-blue-700"
      />
    </div>
  );
}