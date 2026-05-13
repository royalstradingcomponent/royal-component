import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ImageSearchResults from "@/components/ImageSearchResults";
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

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const keyword = resolvedSearchParams?.keyword || "";
  const category = resolvedSearchParams?.category || "";
  const subCategory = resolvedSearchParams?.subCategory || "";

  const title = keyword
    ? `${keyword} Electronic Components Online India | Royal Trading Component`
    : category
      ? `${category} Components Supplier India | Royal Trading Component`
      : "Electronic Components Online India | IC Supplier Delhi | Royal Trading Component";

  const description = keyword
    ? `Buy ${keyword} electronic components online in India from Royal Trading Component. Wholesale semiconductor and industrial electronics supplier in Delhi India.`
    : category
      ? `Buy ${category} electronic components online in India with bulk procurement support, GST invoice and fast delivery.`
      : "Buy electronic components, semiconductors, ICs, displays, modules and industrial electronics online in India from Royal Trading Component.";

  const currentUrl =
    keyword
      ? `https://www.royalsmd.com/products?keyword=${keyword}`
      : category
        ? `https://www.royalsmd.com/products?category=${category}`
        : "https://www.royalsmd.com/products";

  return {
    title,

    description,

    keywords: [
      "Electronic Components India",
      "IC Supplier Delhi",
      "Semiconductor Supplier India",
      "Electronic Parts Store",
      "Wholesale Electronics India",
      "Industrial Electronics Supplier",
      "PCB Components India",
      "Electronic Components Online",
      "Buy IC Online India",
      "Royal Trading Component",
      keyword,
      category,
      subCategory,
    ],

    alternates: {
      canonical: currentUrl,
    },

    openGraph: {
      title,

      description,

      url: currentUrl,

      siteName: "Royal Trading Component",

      images: [
        {
          url: "https://www.royalsmd.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Royal Trading Component",
        },
      ],

      locale: "en_IN",

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images: ["https://www.royalsmd.com/og-image.jpg"],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);

  const keyword = resolvedSearchParams?.keyword || "";
  const isImageSearch =
  resolvedSearchParams?.imageSearch === "true";

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

         {isImageSearch ? (
  <ImageSearchResults />
) : products.length > 0 ? (
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

      <section className="bg-white border-t border-[#e5e7eb] py-14">
  <div className="container-royal">

    <div className="max-w-7xl mx-auto prose prose-lg max-w-none text-[#172033]">

      <h2 className="text-[34px] font-extrabold text-[#111827] leading-tight">
        Buy Electronic Components Online in India
      </h2>

      <p>
        Royal Trading Component is one of the leading electronic components
        suppliers in India offering semiconductors, integrated circuits,
        development boards, displays, automation products, industrial
        electronics and embedded system components for engineers,
        manufacturers, OEM industries and repair professionals.
      </p>

      <p>
        Our online electronics store provides access to high quality
        industrial and semiconductor components with fast delivery,
        wholesale pricing, GST invoice support and bulk procurement
        assistance across India.
      </p>

      <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
        Trusted Semiconductor Supplier in Delhi India
      </h2>

      <p>
        Royal Trading Component supplies electronic parts in Delhi,
        Uttam Nagar, Janakpuri, Lajpat Rai Market, Nehru Place,
        Noida, Gurugram and all major industrial regions across India.
      </p>

      <p>
        Businesses trust us for semiconductor sourcing, industrial
        electronics procurement and reliable component availability
        for embedded systems, automation and PCB manufacturing.
      </p>

      <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
        Popular Electronic Components Categories
      </h2>

      <ul>
        <li>Semiconductor Components</li>
        <li>Logic ICs</li>
        <li>Power Management ICs</li>
        <li>Microcontrollers</li>
        <li>Wireless Communication Modules</li>
        <li>Displays & LCD Modules</li>
        <li>Sensors & Sensor Modules</li>
        <li>Embedded Electronics</li>
        <li>PCB Components</li>
        <li>Industrial Automation Products</li>
      </ul>

      <h3 className="mt-8 text-[24px] font-bold text-[#111827]">
        Industrial Applications & Engineering Usage
      </h3>

      <p>
        Our electronic components are widely used in industrial
        automation systems, embedded hardware, robotics, consumer
        electronics, repair industries, IoT systems, smart devices,
        educational engineering projects and PCB development.
      </p>

      <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
        Wholesale Electronic Components Supplier
      </h2>

      <p>
        Royal Trading Component supports OEM manufacturers,
        electronics businesses, repair centers and industrial
        procurement teams with bulk electronic component sourcing,
        wholesale pricing and technical procurement support.
      </p>

      <p>
        Our inventory includes semiconductors, ICs, relays,
        connectors, voltage regulators, displays, embedded
        development boards and industrial automation products.
      </p>

    </div>

  </div>
</section>

<section className="rounded-sm bg-white p-8 shadow-sm mt-8">
  <h2 className="text-[32px] font-extrabold text-[#111827]">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-6">

    <div>
      <h3 className="text-[22px] font-bold text-[#111827]">
        Where to buy electronic components online in India?
      </h3>

      <p className="mt-3 text-[17px] leading-8 text-[#374151]">
        You can buy electronic components online from Royal Trading
        Component, a trusted semiconductor and industrial electronics
        supplier in Delhi India offering wholesale pricing and fast delivery.
      </p>
    </div>

    <div>
      <h3 className="text-[22px] font-bold text-[#111827]">
        Do you provide bulk electronic components supply?
      </h3>

      <p className="mt-3 text-[17px] leading-8 text-[#374151]">
        Yes, Royal Trading Component supports OEM procurement,
        industrial sourcing, wholesale electronics supply and
        bulk quantity purchasing for businesses and manufacturers.
      </p>
    </div>

    <div>
      <h3 className="text-[22px] font-bold text-[#111827]">
        Which industries use semiconductor components?
      </h3>

      <p className="mt-3 text-[17px] leading-8 text-[#374151]">
        Semiconductor components are widely used in industrial
        automation, embedded systems, robotics, PCB manufacturing,
        consumer electronics, IoT systems and engineering projects.
      </p>
    </div>

    <div>
      <h3 className="text-[22px] font-bold text-[#111827]">
        Do you provide GST invoices?
      </h3>

      <p className="mt-3 text-[17px] leading-8 text-[#374151]">
        Yes, GST invoices are available for businesses,
        resellers, educational institutions and industrial buyers.
      </p>
    </div>

  </div>
</section>

<section className="rounded-sm bg-white p-8 shadow-sm mt-8">
  <h2 className="text-[30px] font-extrabold text-[#111827]">
    Explore Electronic Components Categories
  </h2>

  <div className="mt-6 flex flex-wrap gap-3">

    <Link
      href="/category/semiconductors"
      className="rounded-full border border-[#dbe4f0] px-5 py-3 text-[15px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
    >
      Semiconductor Components
    </Link>

    <Link
      href="/category/semiconductors?subCategory=logic-ics"
      className="rounded-full border border-[#dbe4f0] px-5 py-3 text-[15px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
    >
      Logic ICs
    </Link>

    <Link
      href="/category/semiconductors?subCategory=power-management-ics"
      className="rounded-full border border-[#dbe4f0] px-5 py-3 text-[15px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
    >
      Power Management ICs
    </Link>

    <Link
      href="/category/semiconductors?subCategory=sensor-ics"
      className="rounded-full border border-[#dbe4f0] px-5 py-3 text-[15px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
    >
      Sensor ICs
    </Link>

    <Link
      href="/products"
      className="rounded-full border border-[#dbe4f0] px-5 py-3 text-[15px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
    >
      Buy Electronic Components Online
    </Link>

  </div>
</section>

      <Footer />
    </div>
  );
}