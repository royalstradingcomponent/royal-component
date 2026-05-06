"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil, X, Save, UploadCloud } from "lucide-react";
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
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

function resolveImage(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

const uploadCategoryImage = async (file) => {
  if (!file) return;

  try {
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "categories");

    const data = await adminRequest("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const url = data.file?.url || "";

    if (!url) {
      toast.error("Image upload failed");
      return;
    }

    setForm((p) => ({
      ...p,
      image: url,
    }));

    toast.success("Category image uploaded");
  } catch (error) {
    toast.error(error.message || "Image upload failed");
  } finally {
    setUploadingImage(false);
  }
};

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminRequest("/api/admin/categories");
      setCategories(data.categories || []);
    } catch (error) {
      toast.error(error.message || "Categories load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filtered = categories.filter((cat) => {
    const q = search.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.slug?.toLowerCase().includes(q) ||
      cat.parentSlug?.toLowerCase().includes(q) ||
      cat.group?.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditId("");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditId(cat._id);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || "",
      iconAlt: cat.iconAlt || "",
      parentSlug: cat.parentSlug || "",
      group: cat.group || "",
      countText: cat.countText || "",
      order: cat.order || 0,
      isActive: cat.isActive !== false,
      metaTitle: cat.seo?.metaTitle || "",
      metaDescription: cat.seo?.metaDescription || "",
      metaKeywords: cat.seo?.metaKeywords?.join(", ") || "",
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Category name required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        order: Number(form.order || 0),
      };

      if (editId) {
        await adminRequest(`/api/admin/categories/${editId}`, {
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

      setModalOpen(false);
      await loadCategories();
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await adminRequest(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      toast.success("Category deleted");
      await loadCategories();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Categories</h1>
          <p className="text-sm text-slate-500">
            Manage main, sub and child categories.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2454b5] px-4 py-3 text-sm font-bold text-white hover:bg-[#1d469b]"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category, slug, parent..."
            className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading categories...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No categories found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left text-sm">
              <thead className="bg-[#f3f7fb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Slug</th>
                  <th className="px-4 py-4">Parent</th>
                  <th className="px-4 py-4">Group</th>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border bg-slate-100">
                          {cat.image ? (
                            <img
                              src={resolveImage(cat.image)}
                              alt={cat.iconAlt || cat.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                              No Img
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-[#102033]">{cat.name}</p>
                          <p className="text-xs text-slate-500">
                            {cat.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold">{cat.slug}</td>
                    <td className="px-4 py-4">{cat.parentSlug || "Main"}</td>
                    <td className="px-4 py-4">{cat.group || "-"}</td>
                    <td className="px-4 py-4">{cat.order || 0}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          cat.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => deleteCategory(cat._id)}
                          className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#102033]">
                  {editId ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-sm text-slate-500">
                  Main category ke liye parent empty rakho. Sub category ke liye parentSlug भरो.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border p-2"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Category Name">
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Semiconductors"
                  />
                </Field>

                <Field label="Slug">
                  <input
                    className="input"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, slug: e.target.value }))
                    }
                    placeholder="semiconductors"
                  />
                </Field>

                <Field label="Parent Slug">
                  <input
                    className="input"
                    value={form.parentSlug}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, parentSlug: e.target.value }))
                    }
                    placeholder="main category ke liye empty"
                  />
                </Field>

                <Field label="Group">
                  <input
                    className="input"
                    value={form.group}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, group: e.target.value }))
                    }
                    placeholder="semiconductors"
                  />
                </Field>

                <Field label="Image URL">
  <div className="space-y-2">
    <input
      className="input"
      value={form.image}
      onChange={(e) =>
        setForm((p) => ({ ...p, image: e.target.value }))
      }
      placeholder="/uploads/categories/semiconductor.jpg"
    />

    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">
      <UploadCloud size={15} />
      {uploadingImage ? "Uploading..." : "Upload Category Image"}
      <input
        type="file"
        accept="image/*"
        hidden
        disabled={uploadingImage}
        onChange={(e) => uploadCategoryImage(e.target.files?.[0])}
      />
    </label>

    {form.image ? (
      <img
        src={resolveImage(form.image)}
        alt="Category preview"
        className="h-20 w-20 rounded-xl border object-cover"
      />
    ) : null}
  </div>
</Field>

                <Field label="Image Alt">
                  <input
                    className="input"
                    value={form.iconAlt}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, iconAlt: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Count Text">
                  <input
                    className="input"
                    value={form.countText}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, countText: e.target.value }))
                    }
                    placeholder="Shop 15 categories"
                  />
                </Field>

                <Field label="Order">
                  <input
                    type="number"
                    className="input"
                    value={form.order}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, order: e.target.value }))
                    }
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  className="input min-h-[100px]"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Meta Title">
                  <input
                    className="input"
                    value={form.metaTitle}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, metaTitle: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Meta Keywords">
                  <input
                    className="input"
                    value={form.metaKeywords}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, metaKeywords: e.target.value }))
                    }
                    placeholder="ic, sensor, connector"
                  />
                </Field>
              </div>

              <Field label="Meta Description">
                <textarea
                  className="input min-h-[90px]"
                  value={form.metaDescription}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, metaDescription: e.target.value }))
                  }
                />
              </Field>

              <label className="flex w-fit items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                />
                Active
              </label>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border px-5 py-3 text-sm font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>

            <style jsx>{`
              .input {
                width: 100%;
                border-radius: 12px;
                border: 1px solid #d8e1ec;
                padding: 12px 14px;
                font-size: 14px;
                outline: none;
                background: white;
              }
              .input:focus {
                border-color: #2454b5;
                box-shadow: 0 0 0 3px rgba(36, 84, 181, 0.12);
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}