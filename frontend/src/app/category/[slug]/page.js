import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest, API_BASE } from "@/lib/api";
import { Search } from "lucide-react";
import SearchSuggestionBox from "@/components/SearchSuggestionBox";

function getImageUrl(url) {
  if (!url) return `${API_BASE}/uploads/categories/semiconductor.jpg`;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

async function getCategoryTree(slug) {
  try {
    return await apiRequest(`/api/categories/${slug}`, { cache: "no-store" });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCategoryTree(slug);

  return {
    title: data?.category?.seo?.metaTitle || `${data?.category?.name || "Category"} | Royal Component`,
    description: data?.category?.seo?.metaDescription || data?.category?.description || "",
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;

  const selectedSubCategory = query?.subCategory || "";
  // 🔥 normalize here also
  const normalizeSubCategory = (sub) => {
    const map = {
      "sensor-ics": "sensor-ics",
      "bluetooth": "communication-wireless-module-ics",
    };
    return map[sub] || sub;
  };

  const finalSubCategory = normalizeSubCategory(selectedSubCategory);
  const productSubCategoryMap = {
    "amplifier-modules": "op-amps",
    "amplifiers-comparators": "op-amps",
  };

  const keyword = query?.keyword || "";

  const mainData = await getCategoryTree(slug);
  if (!mainData?.category) notFound();

  const activeData = finalSubCategory
    ? await getCategoryTree(finalSubCategory)
    : null;

  const pageCategory = activeData?.category || mainData.category;
  const cardsToShow = activeData?.children || mainData.children || [];

  const filteredCards = keyword
    ? cardsToShow.filter((item) =>
      `${item.name} ${item.slug} ${item.countText}`
        .toLowerCase()
        .includes(String(keyword).toLowerCase())
    )
    : cardsToShow;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <section className="bg-[var(--color-bg)] py-8 md:py-10">
        <div className="container-royal">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-[15px] font-medium text-[#174ea6]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-[#64748b]">/</span>
            <span>Electronic Components, Power & Connectors</span>
            {selectedSubCategory ? (
              <>
                <span className="text-[#64748b]">/</span>
                <Link href={`/category/${slug}`} className="hover:underline">
                  {mainData.category.name}
                </Link>
              </>
            ) : null}
          </div>

          <h1 className="text-[36px] font-extrabold tracking-[-0.03em] text-[#102033] md:text-[54px]">
            {pageCategory.name}
          </h1>

          <p className="mt-5 max-w-6xl text-[17px] leading-8 text-[#172033]">
            {pageCategory.description}
          </p>

          <Link
            href={`/category/${slug}`}
            className="mt-2 inline-flex text-[16px] font-semibold text-[#174ea6] hover:underline"
          >
            Read more
          </Link>

          <SearchSuggestionBox defaultValue={keyword} />

          {selectedSubCategory ? (
            <div className="mt-4">
              <Link
                href={`/category/${slug}`}
                className="text-[15px] font-semibold text-[#174ea6] hover:underline"
              >
                ← Back to all {mainData.category.name} categories
              </Link>
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredCards.map((item) => {
              const productSubCategory =
                productSubCategoryMap[item.slug] || item.slug;

              const href = selectedSubCategory
                ? `/products?category=${slug}&subCategory=${productSubCategory}`
                : `/category/${slug}?subCategory=${item.slug}`;

              return (
                <Link
                  key={item._id || item.slug}
                  href={href}
                  className="group flex min-h-[120px] items-center justify-between gap-4 border border-[#e8edf3] bg-white px-5 py-5 transition-all duration-300 hover:border-[#b8d7ef] hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)]"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[18px] font-semibold leading-6 text-[#102033]">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-[15px] text-[#52677d]">
                      ({item.countText || "Shop products"})
                    </p>
                  </div>

                  <div className="flex h-[88px] w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.iconAlt || `${item.name} category image`}
                      className="max-h-[84px] max-w-[112px] object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}