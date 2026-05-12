"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { Plus, Save, Trash2, Edit, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywordsText: "",
  order: 0,
  isActive: true,
};

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const splitText = (text = "") =>
    text
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const imagePreview = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_BASE}${url}`;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/blog-categories/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await res.json();
      setCategories(data?.categories || []);
    } catch (error) {
      console.error("Blog categories fetch error:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const uploadImage = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(`${API_BASE}/api/blog-upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Image upload failed");
        return;
      }

      updateForm("image", data.imageUrl);
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const editCategory = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || "",
      metaTitle: cat.metaTitle || "",
      metaDescription: cat.metaDescription || "",
      metaKeywordsText: (cat.metaKeywords || []).join(", "),
      order: cat.order || 0,
      isActive: !!cat.isActive,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitCategory = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        image: form.image,
        metaTitle: form.metaTitle || form.name,
        metaDescription: form.metaDescription || form.description,
        metaKeywords: splitText(form.metaKeywordsText),
        order: Number(form.order || 0),
        isActive: form.isActive,
      };

      const url = editingId
        ? `${API_BASE}/api/blog-categories/admin/${editingId}`
        : `${API_BASE}/api/blog-categories/admin`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
       toast.error(data.message || "Save failed");
        return;
      }

     toast.success(
  editingId ? "Category updated" : "Category created"
);
      resetForm();
      fetchCategories();
    } catch (error) {
     toast.error("Category save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this blog category?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/blog-categories/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Delete failed");
        return;
      }

      fetchCategories();
    } catch (error) {toast.error("Delete failed");alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8ff] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="mb-2 inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-bold text-blue-700">
            Royal Trading Component CMS
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Blog Categories
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Manage SEO blog departments like Semiconductors, Industrial
            Automation, Sensors, Relays, Connectors and Procurement Guides.
          </p>
        </div>

        <form
          onSubmit={submitCategory}
          className="mb-8 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {editingId ? "Edit Category" : "Create Category"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category Name *">
                <Input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Semiconductors"
                />
              </Field>

              <Field label="Slug">
                <Input
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  placeholder="semiconductors"
                />
              </Field>

              <Field label="Order">
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => updateForm("order", e.target.value)}
                />
              </Field>

              <Field label="Status">
                <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => updateForm("isActive", e.target.checked)}
                  />
                  Active category
                </label>
              </Field>

              <div className="md:col-span-2">
                <Field label="Description">
                  <Textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Write SEO rich category description..."
                  />
                </Field>
              </div>

              <Field label="Meta Title">
                <Input
                  value={form.metaTitle}
                  onChange={(e) => updateForm("metaTitle", e.target.value)}
                />
              </Field>

              <Field label="Meta Description">
                <Textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(e) =>
                    updateForm("metaDescription", e.target.value)
                  }
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Meta Keywords comma separated">
                  <Textarea
                    rows={3}
                    value={form.metaKeywordsText}
                    onChange={(e) =>
                      updateForm("metaKeywordsText", e.target.value)
                    }
                    placeholder="semiconductor blogs, electronic components guide"
                  />
                </Field>
              </div>
            </div>

            <div>
              <Field label="Category Image">
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  {form.image ? (
                    <img
                      src={imagePreview(form.image)}
                      alt="Preview"
                      className="mb-3 h-44 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="mb-3 flex h-44 items-center justify-center rounded-xl bg-white text-slate-400">
                      <ImagePlus size={34} />
                    </div>
                  )}

                  <input
                    value={form.image}
                    readOnly
                    onChange={() => {}}
                    className="mb-3 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none"
                    placeholder="/uploads/blogs/image.webp"
                  />

                  <label className="flex cursor-pointer items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => uploadImage(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </Field>

              <button
                disabled={saving}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-800 disabled:opacity-60"
              >
                {editingId ? <Save size={18} /> : <Plus size={18} />}
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </div>
          </div>
        </form>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-lg font-extrabold text-slate-900">
              All Blog Categories
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No categories found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Slug</th>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">SEO</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-16 overflow-hidden rounded-xl bg-slate-100">
                            {cat.image && (
                              <img
                                src={imagePreview(cat.image)}
                                alt={cat.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {cat.name}
                            </p>
                            <p className="line-clamp-1 text-xs text-slate-500">
                              {cat.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold text-blue-700">
                        {cat.slug}
                      </td>

                      <td className="px-5 py-4">{cat.order || 0}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            cat.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {cat.metaTitle ? "Meta ✅" : "Missing ❌"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => editCategory(cat)}
                            className="rounded-xl bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() => deleteCategory(cat._id)}
                            className="rounded-xl bg-red-50 p-2 text-red-700 hover:bg-red-100"
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
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
    />
  );
}