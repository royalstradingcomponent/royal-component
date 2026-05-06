"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

const emptyForm = {
  key: "featured-products",
  title: "Semiconductor Products",
  subtitle:
    "Explore ICs, voltage regulators, transistors, MOSFETs and other semiconductor components for wholesale supply.",
  categorySlug: "semiconductors",
  limit: 8,
  viewAllText: "View All",
  viewAllLink: "/products?category=semiconductors",
  order: 1,
  isActive: true,
};

export default function HomeSectionsPage() {
  const [sections, setSections] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchSections = async () => {
    try {
      const data = await adminRequest("/api/admin/home-sections");
      setSections(data.sections || []);
    } catch (error) {
      toast.error(error.message || "Home sections load failed");
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: sections.length + 1 });
    setOpen(true);
  };

  const openEdit = (section) => {
    setEditing(section);
    setForm({
      key: section.key || "",
      title: section.title || "",
      subtitle: section.subtitle || "",
      categorySlug: section.categorySlug || "",
      limit: Number(section.limit || 8),
      viewAllText: section.viewAllText || "View All",
      viewAllLink: section.viewAllLink || "/products",
      order: Number(section.order || 0),
      isActive: section.isActive !== false,
    });
    setOpen(true);
  };

  const saveSection = async () => {
    try {
      if (!form.key.trim()) return toast.error("Section key required");
      if (!form.title.trim()) return toast.error("Title required");

      setSaving(true);

      if (editing?._id) {
        await adminRequest(`/api/admin/home-sections/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Section updated");
      } else {
        await adminRequest("/api/admin/home-sections", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Section created");
      }

      setOpen(false);
      fetchSections();
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (section) => {
    if (!confirm(`Delete "${section.title}"?`)) return;

    try {
      await adminRequest(`/api/admin/home-sections/${section._id}`, {
        method: "DELETE",
      });
      toast.success("Section deleted");
      fetchSections();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#d7e7f4] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#102033]">
              Home Sections
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage homepage product sections like Featured Products.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white hover:bg-[#1f49a0]"
          >
            <Plus size={18} />
            Add Section
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#d7e7f4] bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_100px_100px_120px] bg-[#f3f7fb] px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
          <div>Section</div>
          <div>Category</div>
          <div>Limit</div>
          <div>Status</div>
          <div className="text-right">Action</div>
        </div>

        {sections.map((section) => (
          <div
            key={section._id}
            className="grid grid-cols-[1.4fr_1fr_100px_100px_120px] items-center border-t px-5 py-4"
          >
            <div>
              <p className="font-extrabold text-[#102033]">{section.title}</p>
              <p className="line-clamp-1 text-sm text-slate-500">
                {section.subtitle}
              </p>
              <p className="mt-1 text-xs font-bold text-[#2454b5]">
                Key: {section.key}
              </p>
            </div>

            <div className="font-semibold">{section.categorySlug || "-"}</div>
            <div>{section.limit}</div>
            <div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  section.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {section.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => openEdit(section)}
                className="rounded-xl border p-2 text-[#2454b5] hover:bg-[#eef4ff]"
              >
                <Pencil size={17} />
              </button>
              <button
                onClick={() => deleteSection(section)}
                className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}

        {!sections.length ? (
          <div className="p-10 text-center text-sm font-semibold text-slate-500">
            No home sections found.
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#102033]">
                  {editing ? "Edit Home Section" : "Add Home Section"}
                </h2>
                <p className="text-sm text-slate-500">
                  This controls homepage product section content.
                </p>
              </div>

              <button onClick={() => setOpen(false)} className="rounded-xl border p-2">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Section Key" value={form.key} onChange={(v) => setForm({ ...form, key: v })} />
              <Input label="Category Slug" value={form.categorySlug} onChange={(v) => setForm({ ...form, categorySlug: v })} />

              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />

              <Input label="Product Limit" type="number" value={form.limit} onChange={(v) => setForm({ ...form, limit: Number(v) })} />

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Subtitle
                </label>
                <textarea
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="min-h-[100px] w-full rounded-xl border px-4 py-3 outline-none focus:border-[#2454b5]"
                />
              </div>

              <Input label="View All Text" value={form.viewAllText} onChange={(v) => setForm({ ...form, viewAllText: v })} />
              <Input label="View All Link" value={form.viewAllLink} onChange={(v) => setForm({ ...form, viewAllLink: v })} />
              <Input label="Order" type="number" value={form.order} onChange={(v) => setForm({ ...form, order: Number(v) })} />

              <label className="mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                Active Section
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-5">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border px-5 py-3 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={saveSection}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Section"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border px-4 outline-none focus:border-[#2454b5]"
      />
    </label>
  );
}