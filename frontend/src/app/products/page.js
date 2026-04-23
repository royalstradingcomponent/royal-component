import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { apiRequest } from "@/lib/api";
import {
  categories,
  getCategoryBySlug,
  semiconductorSubcategories,
} from "@/lib/categories";

async function getProducts(searchParams) {
  try {
    const query = new URLSearchParams();
    query.set("limit", "500");

    if (searchParams?.category) {
      query.set("category", searchParams.category);
    }

    if (searchParams?.subCategory) {
      query.set("subCategory", searchParams.subCategory);
    }

    if (searchParams?.featured) {
      query.set("featured", searchParams.featured);
    }

    if (searchParams?.keyword) {
      query.set("keyword", searchParams.keyword);
    }

    const data = await apiRequest(`/api/products?${query.toString()}`, {
      cache: "no-store",
    });

    return data?.products || [];
  } catch (error) {
    console.error("Products fetch error:", error);
    return [];
  }
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);

  const selectedCategory = resolvedSearchParams?.category
    ? getCategoryBySlug(resolvedSearchParams.category)
    : null;

  const isSemiconductorPage = selectedCategory?.slug === "semiconductors";
  const activeSubCategory = resolvedSearchParams?.subCategory || "";

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <section className="section-padding">
        <div className="container-royal">
          <div className="mb-8">
            <h1 className="heading-section">
              {selectedCategory
                ? `${selectedCategory.name} Products`
                : "All Products"}
            </h1>

            <p className="section-subtitle">
              {selectedCategory
                ? selectedCategory.description
                : "Explore industrial, electrical and electronic products."}
            </p>
          </div>

          {/* all categories */}
          {!selectedCategory ? (
            <div className="mb-8 flex flex-wrap gap-3">
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-heading)] transition hover:border-sky-600 hover:text-sky-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ) : null}

          {/* semiconductor sub categories */}
          {isSemiconductorPage ? (
            <div className="mb-8 flex flex-wrap gap-3">
              {semiconductorSubcategories.map((item) => {
                const href = item.slug
                  ? `/products?category=semiconductors&subCategory=${item.slug}`
                  : `/products?category=semiconductors`;

                const isActive = activeSubCategory === item.slug;

                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-sky-600 text-white shadow-sm"
                        : "border border-[#d2dce8] bg-white text-[#42566d] hover:border-sky-500 hover:text-sky-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="card-royal p-8 text-center text-[var(--color-muted)]">
              No products available.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}