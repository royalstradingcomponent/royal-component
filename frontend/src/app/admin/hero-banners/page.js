"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

const emptyForm = {
  label: "",
  title1: "",
  title2: "",
  item: "",
  description: "",
  image: "",
  primaryText: "Shop Components",
  primaryLink: "/products",
  secondaryText: "Request Bulk Quote",
  secondaryLink: "/quote-request",
  order: 0,
  isActive: true,
};

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function HeroBannersPage() {
  const [slides, setSlides] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await adminRequest("/api/admin/hero-slides");
      setSlides(data.slides || []);
    } catch (error) {
      toast.error(error.message || "Hero banners load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      order: slides.length + 1,
    });
    setOpen(true);
  };

  const openEdit = (slide) => {
    setEditing(slide);
    setForm({
      label: slide.label || "",
      title1: slide.title1 || "",
      title2: slide.title2 || "",
      item: slide.item || "",
      description: slide.description || "",
      image: slide.image || "",
      primaryText: slide.primaryText || "Shop Components",
      primaryLink: slide.primaryLink || "/products",
      secondaryText: slide.secondaryText || "Request Bulk Quote",
      secondaryLink: slide.secondaryLink || "/quote-request",
      order: Number(slide.order || 0),
      isActive: slide.isActive !== false,
    });
    setOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImage = async (file) => {
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);

      const data = await adminRequest("/api/admin/upload?type=hero", {
        method: "POST",
        body: fd,
      });

      updateForm("image", data.file?.url || data.file?.path || "");
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message || "Image upload failed");
    }
  };

  const saveSlide = async () => {
    try {
      if (!form.title1.trim()) {
        toast.error("Title line 1 required");
        return;
      }

      if (!form.title2.trim()) {
        toast.error("Title line 2 required");
        return;
      }

      if (!form.image.trim()) {
        toast.error("Hero image required");
        return;
      }

      setSaving(true);

      if (editing?._id) {
        await adminRequest(`/api/admin/hero-slides/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Hero banner updated");
      } else {
        await adminRequest("/api/admin/hero-slides", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Hero banner created");
      }

      setOpen(false);
      await fetchSlides();
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (slide) => {
    if (!confirm(`Delete "${slide.title1}" banner?`)) return;

    try {
      await adminRequest(`/api/admin/hero-slides/${slide._id}`, {
        method: "DELETE",
      });

      toast.success("Hero banner deleted");
      await fetchSlides();
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
              Hero Banners
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage homepage hero images, animated text, CTA buttons and order.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white hover:bg-[#1f49a0]"
          >
            <Plus size={18} />
            Add Hero Banner
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#d7e7f4] bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-sm font-semibold text-slate-500">
            Loading hero banners...
          </div>
        ) : slides.length === 0 ? (
          <div className="p-10 text-center">
            <ImagePlus className="mx-auto mb-3 text-[#2454b5]" size={44} />
            <h3 className="text-lg font-bold text-[#102033]">
              No hero banner found
            </h3>
            <button
              onClick={openAdd}
              className="mt-5 rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white"
            >
              Add First Banner
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {slides.map((slide) => (
              <div key={slide._id} className="grid gap-4 p-5 lg:grid-cols-[220px_1fr_160px] lg:items-center">
                <div className="h-[120px] overflow-hidden rounded-2xl border bg-[#f8fcff]">
                  {slide.image ? (
                    <img
                      src={getImageUrl(slide.image)}
                      alt={slide.label || slide.title1}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#eaf7ff] px-3 py-1 text-xs font-bold text-[#0f6cbd]">
                      Order {slide.order || 0}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        slide.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {slide.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-extrabold text-[#102033]">
                    {slide.title1} {slide.title2}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-[#2454b5]">
                    {slide.item}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {slide.description || "No description"}
                  </p>
                </div>

                <div className="flex justify-start gap-2 lg:justify-end">
                  <button
                    onClick={() => openEdit(slide)}
                    className="rounded-xl border p-3 text-[#2454b5] hover:bg-[#eef4ff]"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => deleteSlide(slide)}
                    className="rounded-xl border border-red-200 p-3 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#102033]">
                  {editing ? "Edit Hero Banner" : "Add Hero Banner"}
                </h2>
                <p className="text-sm text-slate-500">
                  This content will appear on homepage hero section.
                </p>
              </div>

              <button onClick={() => setOpen(false)} className="rounded-xl border p-2">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Small Label">
                  <input
                    className="input"
                    value={form.label}
                    onChange={(e) => updateForm("label", e.target.value)}
                    placeholder="Industrial Components"
                  />
                </Field>

                <Field label="Animated Item">
                  <input
                    className="input"
                    value={form.item}
                    onChange={(e) => updateForm("item", e.target.value)}
                    placeholder="Automation Components"
                  />
                </Field>

                <Field label="Title Line 1">
                  <input
                    className="input"
                    value={form.title1}
                    onChange={(e) => updateForm("title1", e.target.value)}
                    placeholder="Industrial Electrical &"
                  />
                </Field>

                <Field label="Title Line 2">
                  <input
                    className="input"
                    value={form.title2}
                    onChange={(e) => updateForm("title2", e.target.value)}
                    placeholder="Electronic Components Supplier"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      className="input min-h-[100px]"
                      value={form.description}
                      onChange={(e) => updateForm("description", e.target.value)}
                      placeholder="Source electrical, electronic, mechanical and automation products..."
                    />
                  </Field>
                </div>

                <Field label="Primary Button Text">
                  <input
                    className="input"
                    value={form.primaryText}
                    onChange={(e) => updateForm("primaryText", e.target.value)}
                  />
                </Field>

                <Field label="Primary Button Link">
                  <input
                    className="input"
                    value={form.primaryLink}
                    onChange={(e) => updateForm("primaryLink", e.target.value)}
                  />
                </Field>

                <Field label="Secondary Button Text">
                  <input
                    className="input"
                    value={form.secondaryText}
                    onChange={(e) => updateForm("secondaryText", e.target.value)}
                  />
                </Field>

                <Field label="Secondary Button Link">
                  <input
                    className="input"
                    value={form.secondaryLink}
                    onChange={(e) => updateForm("secondaryLink", e.target.value)}
                  />
                </Field>

                <Field label="Order">
                  <input
                    type="number"
                    className="input"
                    value={form.order}
                    onChange={(e) => updateForm("order", Number(e.target.value))}
                  />
                </Field>

                <label className="mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => updateForm("isActive", e.target.checked)}
                  />
                  Active Banner
                </label>
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Hero Image
                </label>

                <div className="overflow-hidden rounded-2xl border bg-[#f8fcff]">
                  {form.image ? (
                    <img
                      src={getImageUrl(form.image)}
                      alt="Hero preview"
                      className="h-[220px] w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-[220px] items-center justify-center text-sm font-semibold text-slate-400">
                      No image selected
                    </div>
                  )}
                </div>

                <input
                  className="mt-4 input"
                  value={form.image}
                  onChange={(e) => updateForm("image", e.target.value)}
                  placeholder="/uploads/products/banner.png"
                />

                <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#2454b5] bg-[#eaf7ff] px-4 py-3 text-sm font-bold text-[#2454b5] hover:bg-[#dff2ff]">
                  <ImagePlus size={18} />
                  Upload Hero Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => uploadImage(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-5">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border px-5 py-3 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={saveSlide}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Banner"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #d8e1ec;
          padding: 12px 14px;
          outline: none;
          font-size: 14px;
        }
        .input:focus {
          border-color: #2454b5;
          box-shadow: 0 0 0 3px rgba(36, 84, 181, 0.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}