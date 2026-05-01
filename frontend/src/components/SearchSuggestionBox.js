"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

function hasChildren(category, categories) {
  return categories.some(
    (c) => String(c?.parentSlug || "") === String(category?.slug || "")
  );
}

function getRootCategorySlug(category, categories) {
  if (!category) return "";

  if (category.group) return category.group;

  let current = category;
  let guard = 0;

  while (current?.parentSlug && guard < 10) {
    const parent = categories.find(
      (c) => String(c.slug) === String(current.parentSlug)
    );

    if (!parent) return current.parentSlug;

    current = parent;
    guard++;
  }

  return current?.slug || category.slug;
}

function getCategoryHref(category, categories) {
  const rootSlug = getRootCategorySlug(category, categories);
  const isParent = hasChildren(category, categories);

  if (!category?.parentSlug) {
    return `/category/${category.slug}`;
  }

  if (isParent) {
    return `/category/${rootSlug}?subCategory=${category.slug}`;
  }

  return `/products?category=${rootSlug}&subCategory=${category.slug}`;
}

export default function SearchSuggestionBox({ defaultValue = "" }) {
  const router = useRouter();
  const boxRef = useRef(null);

  const [keyword, setKeyword] = useState(defaultValue);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const q = keyword.trim().toLowerCase();

  useEffect(() => {
    fetch(`${API_BASE}/api/products?limit=300`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setProducts(data?.products || []))
      .catch(() => setProducts([]));

    fetch(`${API_BASE}/api/categories`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setCategories(data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    function close(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const suggestions = useMemo(() => {
    if (!q) return [];

    const productItems = products
      .filter((p) =>
        `${p.name || ""} ${p.slug || ""} ${p.sku || ""} ${p.brand || ""} ${
          p.category || ""
        } ${p.subCategory || ""}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6)
      .map((p) => ({
        type: "Product",
        title: p.name,
        subtitle: p.brand || p.subCategory || p.category || "Product",
        href: `/product/${p.slug || p._id}`,
      }));

    const categoryItems = categories
      .filter((c) =>
        `${c.name || ""} ${c.slug || ""} ${c.group || ""} ${
          c.parentSlug || ""
        }`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6)
      .map((c) => ({
        type: "Category",
        title: c.name,
        subtitle: c.countText || "Category",
        href: getCategoryHref(c, categories),
      }));

    return [...productItems, ...categoryItems].slice(0, 10);
  }, [q, products, categories]);

  function submitSearch(e) {
    e.preventDefault();

    if (!keyword.trim()) return;

    router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative mt-4 max-w-[540px]">
      <form onSubmit={submitSearch}>
        <Search
          size={24}
          className="absolute left-4 top-[27px] -translate-y-1/2 text-[#64748b]"
        />

        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, categories, SKU, brand, part number"
          className="h-[54px] w-full rounded-[4px] border border-[#c5cbd3] bg-white pl-12 pr-4 text-[17px] text-[#102033] outline-none focus:border-[#0f6cbd]"
        />
      </form>

      {open && q && (
        <div className="absolute left-0 top-[60px] z-50 max-h-[360px] w-full overflow-y-auto rounded-md border border-[#dbe3ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <button
                key={`${item.type}-${item.title}-${index}`}
                type="button"
                onClick={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
                className="flex w-full items-start gap-3 border-b border-[#eef3f8] px-4 py-3 text-left hover:bg-[#eef7ff]"
              >
                <span className="mt-1 rounded-full bg-[#e6f4ff] px-2 py-1 text-[11px] font-bold text-[#0f6cbd]">
                  {item.type}
                </span>

                <span>
                  <span className="block text-[15px] font-bold text-[#102033]">
                    {item.title}
                  </span>
                  <span className="block text-[13px] text-[#64748b]">
                    {item.subtitle}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-4 text-[14px] text-[#64748b]">
              No matching products or categories found
            </div>
          )}
        </div>
      )}
    </div>
  );
}