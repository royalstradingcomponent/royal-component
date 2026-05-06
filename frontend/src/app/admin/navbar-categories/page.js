"use client";

import { useEffect, useState } from "react";
import { Save, Search } from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

function imageUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
}

export default function NavbarCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState("");

  const fetchCategories = async () => {
  try {
    let list = [];

    try {
      const data = await adminRequest("/api/admin/navbar-categories");
      list = data.categories || [];
    } catch {
      list = [];
    }

    if (!list.length) {
      const res = await fetch(`${API_BASE}/api/categories`, {
        cache: "no-store",
      });

      const data = await res.json();

      list = (data.categories || [])
        .filter((cat) => cat.isActive !== false)
        .filter((cat) => cat.parentSlug === "semiconductors")
        .sort(
          (a, b) =>
            Number(a.navbarOrder || 0) - Number(b.navbarOrder || 0) ||
            Number(a.order || 0) - Number(b.order || 0)
        );
    }

    setCategories(list);
  } catch (error) {
    toast.error(error.message || "Navbar categories load failed");
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateLocal = (id, key, value) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === id ? { ...cat, [key]: value } : cat))
    );
  };

  const saveCategory = async (cat) => {
    try {
      setSavingId(cat._id);

      await adminRequest(`/api/admin/navbar-categories/${cat._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          showInNavbar: cat.showInNavbar !== false,
          navbarOrder: Number(cat.navbarOrder || 0),
          isActive: cat.isActive !== false,
        }),
      });

      toast.success("Navbar category saved");
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setSavingId("");
    }
  };

  const filtered = categories.filter((cat) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return [cat.name, cat.slug, cat.parentSlug]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#d7e7f4] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#102033]">
          Navbar Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage semiconductor subcategories shown in website navbar. First 5 active items show directly, बाकी All Semiconductors dropdown में जाएंगे.
        </p>

        <div className="relative mt-5 max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search navbar category..."
            className="w-full rounded-2xl border border-[#d8e1ec] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#2454b5]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#d7e7f4] bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_140px_140px_120px] bg-[#f3f7fb] px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
          <div>Category</div>
          <div>Slug</div>
          <div>Show Navbar</div>
          <div>Navbar Order</div>
          <div className="text-right">Action</div>
        </div>

        {filtered.map((cat) => (
          <div
            key={cat._id}
            className="grid grid-cols-[1.4fr_1fr_140px_140px_120px] items-center border-t px-5 py-4"
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
                  {cat.description || "Semiconductor subcategory"}
                </p>
              </div>
            </div>

            <div className="font-semibold text-[#102033]">{cat.slug}</div>

            <label className="inline-flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={cat.showInNavbar !== false}
                onChange={(e) =>
                  updateLocal(cat._id, "showInNavbar", e.target.checked)
                }
              />
              Show
            </label>

            <input
              type="number"
              value={cat.navbarOrder || 0}
              onChange={(e) =>
                updateLocal(cat._id, "navbarOrder", Number(e.target.value))
              }
              className="w-24 rounded-xl border px-3 py-2 outline-none focus:border-[#2454b5]"
            />

            <div className="text-right">
              <button
                onClick={() => saveCategory(cat)}
                disabled={savingId === cat._id}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                <Save size={16} />
                {savingId === cat._id ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        ))}

        {!filtered.length ? (
          <div className="p-10 text-center text-sm font-semibold text-slate-500">
            No navbar categories found.
          </div>
        ) : null}
      </div>
    </div>
  );
}