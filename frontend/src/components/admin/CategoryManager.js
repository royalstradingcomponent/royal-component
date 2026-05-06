"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  iconAlt: "",
  parentSlug: "",
  group: "",
  countText: "",
  order: 0,
  isActive: true,
  seo: {
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  },
};

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-|-$/g, "");
}

function imageUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
}

export default function CategoryManager({
  title,
  subtitle,
  level = "main",
}) {
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const loadMain = async () => {
    const data = await adminRequest("/api/admin/categories/main");
    setMainCategories(data.categories || []);
    return data.categories || [];
  };

  const loadSub = async (mainSlug) => {
    if (!mainSlug) {
      setSubCategories([]);
      return [];
    }

    const data = await adminRequest(
      `/api/admin/categories/sub?parent=${encodeURIComponent(mainSlug)}`
    );
    setSubCategories(data.categories || []);
    return data.categories || [];
  };

  const loadList = async ({ mainSlug = selectedMain, subSlug = selectedSub } = {}) => {
    try {
      let data;

      if (level === "main") {
        data = await adminRequest("/api/admin/categories/main");
      }

      if (level === "sub") {
        if (!mainSlug) {
          setCategories([]);
          return;
        }

        data = await adminRequest(
          `/api/admin/categories/sub?parent=${encodeURIComponent(mainSlug)}`
        );
      }

      if (level === "child") {
        if (!subSlug) {
          setCategories([]);
          return;
        }

        data = await adminRequest(
          `/api/admin/categories/child?sub=${encodeURIComponent(subSlug)}`
        );
      }

      setCategories(data?.categories || []);
    } catch (error) {
      toast.error(error.message || "Categories load failed");
    }
  };

  useEffect(() => {
    const init = async () => {
      const main = await loadMain();

      if (level === "main") {
        await loadList();
        return;
      }

      const firstMain = main?.[0]?.slug || "";
      setSelectedMain(firstMain);

      if (level === "sub") {
        await loadList({ mainSlug: firstMain });
        return;
      }

      if (level === "child") {
        const subs = await loadSub(firstMain);
        const firstSub = subs?.[0]?.slug || "";
        setSelectedSub(firstSub);
        await loadList({ mainSlug: firstMain, subSlug: firstSub });
      }
    };

    init();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return categories;

    return categories.filter((cat) =>
      [cat.name, cat.slug, cat.parentSlug, cat.group]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [categories, search]);

  const openAdd = () => {
    setEditing(null);

    const parentSlug =
      level === "main" ? "" : level === "sub" ? selectedMain : selectedSub;

    setForm({
      ...emptyForm,
      parentSlug,
      group: level === "main" ? "" : selectedMain || "semiconductors",
      order: categories.length + 1,
    });

    setOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);

    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || "",
      iconAlt: cat.iconAlt || "",
      parentSlug: cat.parentSlug || "",
      group: cat.group || "",
      countText: cat.countText || "",
      order: Number(cat.order || 0),
      isActive: cat.isActive !== false,
      seo: {
        metaTitle: cat.seo?.metaTitle || "",
        metaDescription: cat.seo?.metaDescription || "",
        metaKeywords: cat.seo?.metaKeywords || [],
      },
    });

    setOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveCategory = async () => {
    try {
      if (!form.name.trim()) {
        toast.error("Category name required");
        return;
      }

      if (!form.slug.trim()) {
        toast.error("Slug required");
        return;
      }

      if (level !== "main" && !form.parentSlug) {
        toast.error("Parent category required");
        return;
      }

      setSaving(true);

      const payload = {
        ...form,
        seo: {
          ...form.seo,
          metaKeywords: Array.isArray(form.seo.metaKeywords)
            ? form.seo.metaKeywords
            : String(form.seo.metaKeywords || "")
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
        },
      };

      if (editing?._id) {
        await adminRequest(`/api/admin/categories/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Category updated");
      } else {
        await adminRequest("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Category created");
      }

      setOpen(false);
      await loadList();
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (cat) => {
    if (!confirm(`Delete "${cat.name}"?`)) return;

    try {
      await adminRequest(`/api/admin/categories/${cat._id}`, {
        method: "DELETE",
      });

      toast.success("Category deleted");
      await loadList();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const handleMainChange = async (slug) => {
    setSelectedMain(slug);

    if (level === "sub") {
      await loadList({ mainSlug: slug });
    }

    if (level === "child") {
      const subs = await loadSub(slug);
      const firstSub = subs?.[0]?.slug || "";
      setSelectedSub(firstSub);
      await loadList({ mainSlug: slug, subSlug: firstSub });
    }
  };

  const handleSubChange = async (slug) => {
    setSelectedSub(slug);
    await loadList({ subSlug: slug });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[#d7e7f4] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#102033]">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1f49a0]"
          >
            <Plus size={18} />
            Add {level === "main" ? "Main" : level === "sub" ? "Sub" : "Child"} Category
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {level !== "main" ? (
            <select
              value={selectedMain}
              onChange={(e) => handleMainChange(e.target.value)}
              className="rounded-2xl border border-[#d8e1ec] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : null}

          {level === "child" ? (
            <select
              value={selectedSub}
              onChange={(e) => handleSubChange(e.target.value)}
              className="rounded-2xl border border-[#d8e1ec] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : null}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, slug, parent..."
              className="w-full rounded-2xl border border-[#d8e1ec] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#2454b5]"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#d7e7f4] bg-white shadow-sm">
        <div className="grid grid-cols-[1.3fr_1fr_1fr_90px_120px] bg-[#f3f7fb] px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
          <div>Category</div>
          <div>Slug</div>
          <div>Parent</div>
          <div>Order</div>
          <div className="text-right">Action</div>
        </div>

        {filtered.map((cat) => (
          <div
            key={cat._id}
            className="grid grid-cols-[1.3fr_1fr_1fr_90px_120px] items-center border-t px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-xl border bg-[#f8fcff]">
                {cat.image ? (
                  <img
                    src={imageUrl(cat.image)}
                    alt={cat.iconAlt || cat.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="font-bold text-[#102033]">{cat.name}</p>
                <p className="line-clamp-1 text-xs text-slate-500">
                  {cat.description || "No description"}
                </p>
              </div>
            </div>

            <div className="font-semibold text-[#102033]">{cat.slug}</div>
            <div className="text-sm text-slate-600">
              {cat.parentSlug || "Main"}
            </div>
            <div>{cat.order || 0}</div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => openEdit(cat)}
                className="rounded-xl border p-2 hover:bg-[#eef4ff]"
              >
                <Pencil size={17} />
              </button>
              <button
                onClick={() => deleteCategory(cat)}
                className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}

        {!filtered.length ? (
          <div className="p-10 text-center text-sm font-semibold text-slate-500">
            No categories found.
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#102033]">
                  {editing ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-sm text-slate-500">
                  Category hierarchy DB ke parentSlug se dynamic manage hogi.
                </p>
              </div>

              <button onClick={() => setOpen(false)} className="rounded-xl border p-2">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name">
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => {
                    updateForm("name", e.target.value);
                    if (!editing) updateForm("slug", makeSlug(e.target.value));
                  }}
                />
              </Field>

              <Field label="Slug">
                <input
                  className="input"
                  value={form.slug}
                  onChange={(e) => updateForm("slug", makeSlug(e.target.value))}
                />
              </Field>

              <Field label="Parent Slug">
                <input className="input" value={form.parentSlug} readOnly />
              </Field>

              <Field label="Group">
                <input
                  className="input"
                  value={form.group}
                  onChange={(e) => updateForm("group", e.target.value)}
                />
              </Field>

              <Field label="Image URL">
                <input
                  className="input"
                  value={form.image}
                  onChange={(e) => updateForm("image", e.target.value)}
                />
              </Field>

              <Field label="Image Alt">
                <input
                  className="input"
                  value={form.iconAlt}
                  onChange={(e) => updateForm("iconAlt", e.target.value)}
                />
              </Field>

              <Field label="Count Text">
                <input
                  className="input"
                  value={form.countText}
                  onChange={(e) => updateForm("countText", e.target.value)}
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
            </div>

            <div className="mt-4">
              <Field label="Description">
                <textarea
                  className="input min-h-[100px]"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Meta Title">
                <input
                  className="input"
                  value={form.seo.metaTitle}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      seo: { ...p.seo, metaTitle: e.target.value },
                    }))
                  }
                />
              </Field>

              <Field label="Meta Keywords">
                <input
                  className="input"
                  value={
                    Array.isArray(form.seo.metaKeywords)
                      ? form.seo.metaKeywords.join(", ")
                      : form.seo.metaKeywords
                  }
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      seo: { ...p.seo, metaKeywords: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Meta Description">
                <textarea
                  className="input min-h-[80px]"
                  value={form.seo.metaDescription}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      seo: { ...p.seo, metaDescription: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>

            <label className="mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateForm("isActive", e.target.checked)}
              />
              Active
            </label>

            <div className="mt-6 flex justify-end gap-3 border-t pt-5">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border px-5 py-3 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Category"}
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