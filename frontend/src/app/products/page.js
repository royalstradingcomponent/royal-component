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

    // 🔥 FIX: normalize subCategory (important)
    const normalizeSubCategory = (sub) => {
      if (!sub) return "";

      const map = {
        // Amplifier
        amplifiermodules: "op-amps",
        "amplifier-modules": "op-amps",
        amplifierscomparators: "op-amps",
        "amplifiers-comparators": "op-amps",
        audioamplifierics: "op-amps",
        "audio-amplifier-ics": "op-amps",
        opamps: "op-amps",
        "op-amps": "op-amps",

        // Wireless
        bluetooth: "communication-wireless-module-ics",
        "bluetooth-modules": "communication-wireless-module-ics",
        wifimodules: "communication-wireless-module-ics",
        "wifi-modules": "communication-wireless-module-ics",
        "communication-wireless-module-ics": "communication-wireless-module-ics",

        // Sensors
        sensorics: "sensor-ics",
        "sensor-ics": "sensor-ics",
        lightsensorics: "sensor-ics",
        "light-sensor-ics": "sensor-ics",

        // Other common semiconductor groups
        dataconverters: "data-converters",
        "data-converters": "data-converters",
        discretesemiconductors: "discrete-semiconductors",
        "discrete-semiconductors": "discrete-semiconductors",
        interfaceics: "interface-ics",
        "interface-ics": "interface-ics",
        logicics: "logic-ics",
        "logic-ics": "logic-ics",
        memorychips: "memory-chips",
        "memory-chips": "memory-chips",
        powermanagementics: "power-management-ics",
        "power-management-ics": "power-management-ics",
        processorsmicrocontrollers: "processors-microcontrollers",
        "processors-microcontrollers": "processors-microcontrollers",
        programmablelogicics: "programmable-logic-ics",
        "programmable-logic-ics": "programmable-logic-ics",
      };

      return map[sub] || sub;
    };

    if (searchParams?.subCategory) {
      const finalSubCategory = normalizeSubCategory(searchParams.subCategory);
      query.set("subCategory", finalSubCategory);
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

  const keyword = resolvedSearchParams?.keyword || "";

  const selectedCategory = resolvedSearchParams?.category
    ? getCategoryBySlug(resolvedSearchParams.category)
    : null;

  const isSemiconductorPage = selectedCategory?.slug === "semiconductors";
  const activeSubCategory = resolvedSearchParams?.subCategory || "";

  const pageTitle = keyword
    ? `Search Results for "${keyword}"`
    : selectedCategory
      ? `${selectedCategory.name} Products`
      : "All Products";

  const pageDescription = keyword
    ? `Showing matching industrial, electrical and electronic components for "${keyword}".`
    : selectedCategory
      ? selectedCategory.description
      : "Explore industrial, electrical and electronic products.";

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <section className="section-padding">
        <div className="container-royal">
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="heading-section">{pageTitle}</h1>

                <p className="section-subtitle">{pageDescription}</p>

                {keyword ? (
                  <p className="mt-3 text-sm font-semibold text-[#0f6cbd]">
                    {products.length} product(s) found
                  </p>
                ) : null}
              </div>

              {keyword ? (
                <Link
                  href="/products"
                  className="rounded-full border border-[#cfe5f5] bg-white px-5 py-3 text-sm font-bold text-[#0f3d67] transition hover:border-[#38bdf8] hover:bg-[#f2fbff]"
                >
                  Clear Search
                </Link>
              ) : null}
            </div>
          </div>

          {!keyword && !selectedCategory ? (
            <div className="mb-8 flex flex-wrap gap-3">
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products?category=${item.slug}`}
                  className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-heading)] transition hover:border-sky-600 hover:text-sky-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ) : null}

          {isSemiconductorPage && !keyword ? (
            <div className="mb-8 flex flex-wrap gap-3">
              {semiconductorSubcategories.map((item) => {
                const href = item.slug
                  ? `/category/semiconductors?subCategory=${item.slug}`
                  : `/products?category=semiconductors`;

                const isActive = activeSubCategory === item.slug;

                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${isActive
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
            <div className="card-royal p-10 text-center">
              <h2 className="text-2xl font-extrabold text-[#102033]">
                No products found
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                We could not find products matching your search. Try another
                keyword like IC, sensor, cable, switchgear, MOSFET or brand name.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}