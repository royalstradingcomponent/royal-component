import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { apiRequest, API_BASE } from "@/lib/api";
import {
  getCategoryBySlug,
  semiconductorSubcategories,
} from "@/lib/categories";

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

async function getCategoryFromAPI(slug) {
  try {
    const data = await apiRequest(`/api/categories/${slug}`, {
      cache: "no-store",
    });
    return data?.category || null;
  } catch (error) {
    console.error("Category fetch error:", error);
    return null;
  }
}

async function getCategoryProducts(slug, subCategory = "") {
  try {
    const query = new URLSearchParams();
    query.set("limit", "500");
    query.set("category", slug);

    if (subCategory) {
      query.set("subCategory", subCategory);
    }

    const data = await apiRequest(`/api/products?${query.toString()}`, {
      cache: "no-store",
    });

    return data?.products || [];
  } catch (error) {
    console.error("Category products fetch error:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | Royal Component",
    };
  }

  return {
    title: `${category.name} | Royal Component`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams?.slug;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const selectedSubCategory = resolvedSearchParams?.subCategory || "";

  const [products, categoryFromAPI] = await Promise.all([
    getCategoryProducts(slug, selectedSubCategory),
    getCategoryFromAPI(slug),
  ]);

  const heroImage = categoryFromAPI?.image || "";
  const isSemiconductor = slug === "semiconductors";

  const activeSubcategoryName =
    semiconductorSubcategories.find((item) => item.slug === selectedSubCategory)?.name ||
    "All";

  return (
    <div className="min-h-screen bg-[#f4f8fc]">
      <Navbar />

      <section className="border-b border-[#dde7f1] bg-[linear-gradient(180deg,#eef5fb_0%,#e8f0f7_100%)] py-14 md:py-20">
        <div className="container-royal">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2 text-[15px] font-medium text-[#607287]">
                <Link href="/" className="transition hover:text-sky-700">
                  Home
                </Link>
                <span>/</span>
                <span>{category.name}</span>
                {selectedSubCategory ? (
                  <>
                    <span>/</span>
                    <span>{activeSubcategoryName}</span>
                  </>
                ) : null}
              </div>

              <h1 className="max-w-4xl text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] text-[#102033] md:text-[64px]">
                {category.name} Components
              </h1>

              <p className="mt-5 max-w-3xl text-[19px] leading-8 text-[#5f7388]">
                {category.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#d6e4f1] bg-white px-4 py-2 text-sm font-semibold text-[#24476b]">
                  Industrial Grade
                </span>
                <span className="rounded-full border border-[#d6e4f1] bg-white px-4 py-2 text-sm font-semibold text-[#24476b]">
                  Bulk Supply Ready
                </span>
                <span className="rounded-full border border-[#d6e4f1] bg-white px-4 py-2 text-sm font-semibold text-[#24476b]">
                  Technical Procurement
                </span>
              </div>
            </div>

            {heroImage ? (
              <div className="overflow-hidden rounded-[32px] border border-[#d7e2ee] bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                <img
                  src={getImageUrl(heroImage)}
                  alt={categoryFromAPI?.iconAlt || category.name}
                  className="h-[300px] w-full object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {isSemiconductor ? (
        <section className="border-b border-[#dfe8f1] bg-white py-7">
          <div className="container-royal">
            <div className="flex flex-wrap gap-4">
              {semiconductorSubcategories.map((item) => {
                const href = item.slug
                  ? `/category/semiconductors?subCategory=${item.slug}`
                  : `/category/semiconductors`;

                const isActive =
                  item.slug === selectedSubCategory ||
                  (!item.slug && !selectedSubCategory);

                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={`inline-flex min-h-[56px] items-center justify-center rounded-full px-7 py-3 text-[18px] font-extrabold tracking-[-0.01em] transition ${
                      isActive
                        ? "bg-sky-600 text-white shadow-[0_8px_20px_rgba(2,132,199,0.25)]"
                        : "border border-[#cad8e6] bg-white text-[#24476b] hover:border-sky-500 hover:text-sky-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#f7fbff] py-14">
        <div className="container-royal">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[38px] font-extrabold tracking-[-0.03em] text-[#102033] md:text-[54px]">
                Available Products
              </h2>
              <p className="mt-3 text-[18px] leading-8 text-[#607287]">
                {selectedSubCategory
                  ? `Explore wholesale-ready products under ${category.name} > ${activeSubcategoryName}.`
                  : `Explore wholesale-ready products available under ${category.name}.`}
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex h-[56px] items-center justify-center rounded-full border border-[#ccdae7] bg-white px-8 text-[17px] font-bold text-[#24476b] transition hover:border-sky-500 hover:text-sky-700"
            >
              View All Products
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-[#d7e3ef] bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="text-[28px] font-extrabold text-[#102033]">
                No products found
              </h3>
              <p className="mx-auto mt-4 max-w-3xl text-[18px] leading-8 text-[#6a7b90]">
                Is section ke products abhi add nahi hue hain ya subCategory mapping
                check karni hai.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}