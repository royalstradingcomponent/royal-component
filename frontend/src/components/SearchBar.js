"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, Package, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageSearchCamera from "@/components/ImageSearchCamera";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://royal-component-backend.onrender.com";

export default function SearchBar({ mobile = false, onSearchDone }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const keyword = query.trim();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Category search error:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/api/products?limit=300`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categories.length) return [];

    if (keyword.length < 2) {
      return categories.slice(0, 8);
    }

    const lower = keyword.toLowerCase();

    return categories
      .filter((cat) => {
        return (
          String(cat?.name || "").toLowerCase().includes(lower) ||
          String(cat?.slug || "").toLowerCase().includes(lower) ||
          String(cat?.description || "").toLowerCase().includes(lower) ||
          String(cat?.iconAlt || "").toLowerCase().includes(lower) ||
          String(cat?.parentSlug || "").toLowerCase().includes(lower) ||
          String(cat?.group || "").toLowerCase().includes(lower)
        );
      })
      .slice(0, 8);
  }, [categories, keyword]);

  const filteredProducts = useMemo(() => {
    if (!products.length || keyword.length < 2) return [];

    const lower = keyword.toLowerCase();

    return products
      .filter((product) => {
        return (
          String(product?.name || "").toLowerCase().includes(lower) ||
          String(product?.slug || "").toLowerCase().includes(lower) ||
          String(product?.sku || "").toLowerCase().includes(lower) ||
          String(product?.brand || "").toLowerCase().includes(lower) ||
          String(product?.category || "").toLowerCase().includes(lower) ||
          String(product?.subCategory || "").toLowerCase().includes(lower)
        );
      })
      .slice(0, 8);
  }, [products, keyword]);

  const hasChildren = (category) => {
    return categories.some(
      (cat) => String(cat?.parentSlug || "") === String(category?.slug || "")
    );
  };

  const getRootCategorySlug = (category) => {
    if (!category) return "";

    if (category.group) return category.group;

    let current = category;
    let guard = 0;

    while (current?.parentSlug && guard < 10) {
      const parent = categories.find(
        (cat) => String(cat.slug) === String(current.parentSlug)
      );

      if (!parent) return current.parentSlug;

      current = parent;
      guard++;
    }

    return current?.slug || category.slug;
  };

  const goToCategory = (category) => {
    if (!category?.slug) return;

    const rootSlug = getRootCategorySlug(category);
    const isParent = hasChildren(category);

    if (!category.parentSlug) {
      router.push(`/category/${category.slug}`);
    } else if (isParent) {
      router.push(`/category/${rootSlug}?subCategory=${category.slug}`);
    } else {
      router.push(`/products?category=${rootSlug}&subCategory=${category.slug}`);
    }

    setOpen(false);
    setQuery("");

    if (onSearchDone) onSearchDone();
  };

  const goToProduct = (product) => {
    if (!product) return;

    router.push(`/product/${product.slug || product._id}`);
    setOpen(false);
    setQuery("");

    if (onSearchDone) onSearchDone();
  };

  const goToSearchPage = () => {
    if (!keyword) return;

    router.push(`/products?keyword=${encodeURIComponent(keyword)}`);
    setOpen(false);
    setQuery("");

    if (onSearchDone) onSearchDone();
  };

  const hasDropdown =
    open &&
    (filteredCategories.length > 0 ||
      filteredProducts.length > 0 ||
      keyword.length >= 2 ||
      loading);

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearchPage();
        }}
        className="relative w-full"
      >
        <button
          type="submit"
          className={`absolute top-1/2 -translate-y-1/2 text-[#5f7d95] transition hover:text-[#0f6cbd] ${
            mobile ? "left-4" : "left-5"
          }`}
          aria-label="Search products"
        >
          <Search size={mobile ? 18 : 20} />
        </button>

        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={
            mobile
              ? "Search products, categories..."
              : "Search product, category, SKU, brand, part number"
          }
          className={
            mobile
              ? "h-[50px] w-full rounded-full border border-[#cfe5f5] bg-[#f8fcff] py-3 pl-12 pr-20 text-sm text-[#0f172a] outline-none placeholder:text-[#8aa5b9] focus:border-[#38bdf8]"
              : "h-[58px] w-full rounded-full border border-[#cfe5f5] bg-[#f8fcff] py-3 pl-14 pr-24 text-[16px] text-[#0f172a] outline-none transition placeholder:text-[#8aa5b9] focus:border-[#38bdf8] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
          }
        />
        <ImageSearchCamera mobile={mobile} onSearchDone={onSearchDone} />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-[#7a92a7] transition hover:text-[#0f172a]"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        ) : null}
      </form>

      {hasDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[100] overflow-hidden rounded-[22px] border border-[#d7e7f4] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
          {filteredCategories.length > 0 ? (
            <div className="border-b border-[#e8f1f8] bg-[#f8fcff] px-5 py-4">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f6cbd]">
                Categories
              </p>

              <div className="flex flex-wrap gap-2">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat._id || cat.slug}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToCategory(cat)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#cfe5f5] bg-white px-3 py-1.5 text-xs font-semibold text-[#23435b] transition hover:border-[#38bdf8] hover:bg-[#eaf7ff] hover:text-[#0f6cbd]"
                  >
                    <Layers3 size={13} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {keyword.length >= 2 ? (
            <div className="max-h-[390px] overflow-y-auto py-2">
              <p className="px-5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f6cbd]">
                Products
              </p>

              {loading ? (
                <p className="px-5 py-4 text-sm text-[#64748b]">
                  Searching products...
                </p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <button
                    key={product._id || product.slug}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToProduct(product)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition hover:bg-[#f3f9ff]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ff] text-[#0f6cbd]">
                        <Package size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-bold text-[#102033]">
                          {product.name}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-[#64748b]">
                          {product.brand || "Generic"}
                          {product.sku ? ` • ${product.sku}` : ""}
                          {product.category ? ` • ${product.category}` : ""}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs font-bold text-[#0f6cbd]">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </span>
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={goToSearchPage}
                  className="w-full px-5 py-4 text-left text-sm font-semibold text-[#23435b] transition hover:bg-[#f3f9ff]"
                >
                  Search for “{keyword}”
                </button>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}