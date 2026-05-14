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

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;

  const selectedSubCategory = query?.subCategory || "";

  const data = await getCategoryTree(slug);

  const subCategoryData = selectedSubCategory
    ? await getCategoryTree(selectedSubCategory)
    : null;

  const currentCategory =
    subCategoryData?.category || data?.category;

  const categoryName =
    currentCategory?.name || "Electronic Components";

  const description =
    currentCategory?.seo?.metaDescription ||
    currentCategory?.description ||
    `Buy ${categoryName} online in India from Royal Trading Component. Wholesale electronic components supplier in Delhi India.`;

  const image = currentCategory?.image
    ? currentCategory.image.startsWith("http")
      ? currentCategory.image
      : `${API_BASE}${currentCategory.image}`
    : "/og-image.jpg";

  const currentUrl = selectedSubCategory
    ? `https://www.royalsmd.com/category/${slug}?subCategory=${selectedSubCategory}`
    : `https://www.royalsmd.com/category/${slug}`;

  return {
    title:
      currentCategory?.seo?.metaTitle ||
      `${categoryName} Supplier India | Delhi Electronics Store | Royal Trading Component`,

    description,

    keywords: [
      `${categoryName}`,
      `${categoryName} supplier India`,
      `${categoryName} Delhi`,
      `${categoryName} online`,
      `${categoryName} wholesaler`,
      `${categoryName} distributor`,
      "Electronic Components India",
      "IC Supplier Delhi",
      "Electronics Store Delhi",
      "Semiconductor Supplier India",
      "Royal Trading Component",
    ],

    alternates: {
      canonical: currentUrl,
    },

    openGraph: {
      title:
        `${categoryName} | Royal Trading Component`,

      description,

      url: currentUrl,

      siteName: "Royal Trading Component",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],

      locale: "en_IN",

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title:
        `${categoryName} | Royal Trading Component`,

      description,

      images: [image],
    },

    robots: {
      index: true,
      follow: true,
    },
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

    const categoryJsonLd = {
  "@context": "https://schema.org",

  "@type": "CollectionPage",

  name: pageCategory.name,

  description:
    pageCategory.description ||
    `Buy ${pageCategory.name} online in India`,

  url: `https://www.royalsmd.com/category/${slug}`,

  image: getImageUrl(pageCategory.image),

  publisher: {
    "@type": "Organization",

    name: "Royal Trading Component",

    url: "https://www.royalsmd.com",
  },
};

  return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(categoryJsonLd),
      }}
    />

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

          <section className="mt-8 rounded-sm bg-white p-6 shadow-sm">
            <h2 className="text-[28px] font-extrabold text-[#111827]">
              Popular Electronic Component Categories
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
                href="/category/semiconductors?subCategory=amplifiers-comparators"
                className="rounded-full border border-[#dbe4f0] px-5 py-3 text-[15px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
              >
                Amplifiers & Comparators
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-[#dbe4f0] px-5 py-3 text-[15px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
              >
                Buy Electronic Components Online
              </Link>

            </div>
          </section>

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
      <section className="bg-white py-14 border-t border-[#e5e7eb]">
        <div className="container-royal">

          <div className="max-w-7xl mx-auto prose prose-lg max-w-none text-[#172033]">

            <h2 className="text-[34px] font-extrabold text-[#111827] leading-tight">
              Buy Industrial & Electronic Components Online in India
            </h2>

            <p>
              Royal Trading Component is one of the leading suppliers of industrial,
              electrical, electronic and semiconductor components in India. We provide
              high quality electronic spare parts, integrated circuits, connectors,
              modules, sensors, automation products, development boards, relays,
              displays and industrial components for manufacturers, repair engineers,
              service centers, OEM industries, educational institutions and B2B buyers.
            </p>

            <p>
              Our online electronics store helps businesses and engineers source
              genuine electronic components with fast delivery, competitive pricing,
              GST billing support and bulk procurement assistance. Whether you are
              looking for ICs, power management components, voltage regulators,
              transistors, logic ICs, wireless communication modules or embedded
              development boards, Royal Trading Component offers a wide range of
              products suitable for industrial and commercial applications.
            </p>

            <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
              Trusted Electronic Components Supplier in Delhi India
            </h2>

            <p>
              Royal Trading Component supplies electronic components across Delhi,
              Uttam Nagar, Janakpuri, Nehru Place, Lajpat Rai Market, Karol Bagh,
              Noida, Gurugram and all major industrial regions of India. Our goal is
              to simplify electronic component sourcing for engineers, technicians,
              manufacturers and wholesalers.
            </p>

            <p>
              We specialize in semiconductor components, industrial automation
              products, development modules, connectors, relays, displays and embedded
              electronics. Businesses trust us for quality products, reliable customer
              support and secure online ordering.
            </p>

            <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
              Wide Range of Electronic & Semiconductor Components
            </h2>

            <p>
              Our platform includes thousands of industrial and electronic products
              suitable for automation, robotics, embedded systems, repair projects,
              educational training, IoT development and industrial manufacturing.
            </p>

            <ul>
              <li>Integrated Circuits (ICs)</li>
              <li>Logic ICs & Power Management ICs</li>
              <li>Amplifiers & Comparators</li>
              <li>Communication & Wireless Modules</li>
              <li>Sensors & Sensor Modules</li>
              <li>Microcontrollers & Processors</li>
              <li>Arduino & Development Boards</li>
              <li>Displays, LCDs & LED Modules</li>
              <li>Voltage Regulators & Transistors</li>
              <li>Industrial Automation Components</li>
              <li>Capacitors, Resistors & Connectors</li>
              <li>Power Supply Components</li>
            </ul>

            <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
              Bulk Procurement & B2B Electronic Component Supply
            </h2>

            <p>
              Royal Trading Component supports B2B buyers, industrial companies,
              educational institutions and electronics manufacturers with wholesale
              procurement solutions. We help businesses source industrial components
              in bulk with GST invoices, quantity pricing support and dedicated order
              assistance.
            </p>

            <p>
              If you are searching for a reliable electronic components wholesaler in
              Delhi India, our platform provides access to thousands of components for
              industrial and commercial applications. Our procurement support team can
              help businesses identify suitable replacement parts and compatible
              electronic modules.
            </p>

            <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
              Electronic Components for Industrial Applications
            </h2>

            <p>
              Modern industries require high performance electronic and semiconductor
              components for automation, monitoring and control systems. Royal Trading
              Component supplies products used in manufacturing equipment, robotics,
              embedded systems, consumer electronics, repair industries, industrial
              machines, automation systems and smart electronic devices.
            </p>

            <p>
              We regularly update our inventory with high demand industrial products,
              semiconductor components and embedded development tools suitable for
              engineers, developers and electronics professionals.
            </p>

            <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
              Why Choose Royal Trading Component
            </h2>

            <ul>
              <li>Large collection of electronic components</li>
              <li>Trusted supplier in Delhi India</li>
              <li>Fast delivery support</li>
              <li>Bulk order & B2B procurement assistance</li>
              <li>GST invoice support</li>
              <li>Industrial quality components</li>
              <li>Competitive wholesale pricing</li>
              <li>Secure online ordering experience</li>
              <li>Wide semiconductor inventory</li>
              <li>Professional customer support</li>
            </ul>

            <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
              Online Electronics Store for Engineers & Businesses
            </h2>

            <p>
              Royal Trading Component is designed for electronics engineers,
              industrial procurement teams, students, developers, manufacturers,
              service engineers and repair professionals looking for high quality
              electronic components online in India.
            </p>

            <p>
              Our goal is to become one of the most trusted online electronic
              component suppliers in India by providing genuine products, reliable
              procurement support and a modern digital buying experience.
            </p>

            <h2 className="mt-12 text-[30px] font-extrabold text-[#111827] leading-tight">
              Buy Electronic Components Online from Royal Trading Component
            </h2>

            <p>
              Whether you need semiconductors, logic ICs, wireless communication
              modules, industrial automation products, voltage regulators, displays,
              development boards or embedded electronics, Royal Trading Component
              offers a professional platform for industrial and commercial sourcing.
            </p>

            <p>
              Explore our wide range of electronic components and industrial products
              with fast online ordering, secure payments and nationwide delivery
              support across India.
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
  What is {pageCategory?.name} used for?
</h3>

            <p className="mt-3 text-[17px] leading-8 text-[#374151]">
  {pageCategory?.name} is commonly used in electronic circuits,
  embedded systems, PCB projects, industrial automation,
  repair applications, IoT projects and semiconductor-based
  electronic designs.
</p>
          </div>

          <div>
            <h3 className="text-[22px] font-bold text-[#111827]">
              Where to buy {pageCategory?.name} online in India?
            </h3>

            <p className="mt-3 text-[17px] leading-8 text-[#374151]">
              You can buy {pageCategory?.name} online from Royal Trading
              Component, a trusted electronic components supplier in
              Delhi India offering wholesale pricing, bulk procurement
              support and nationwide delivery.
            </p>
          </div>

          <div>
            <h3 className="text-[22px] font-bold text-[#111827]">
              Is {pageCategory?.name} available for bulk orders?
            </h3>

            <p className="mt-3 text-[17px] leading-8 text-[#374151]">
              Yes, Royal Trading Component supports bulk quantity orders,
              OEM procurement, industrial sourcing and wholesale electronic
              component supply for manufacturers and businesses.
            </p>
          </div>

          <div>
            <h3 className="text-[22px] font-bold text-[#111827]">
              Do you provide GST invoices?
            </h3>

            <p className="mt-3 text-[17px] leading-8 text-[#374151]">
              Yes, GST invoices are available for industrial buyers,
              businesses, resellers, educational institutes and
              procurement companies across India.
            </p>
          </div>

          <div>
            <h3 className="text-[22px] font-bold text-[#111827]">
             Which industries use {pageCategory?.name}?
            </h3>

            <p className="mt-3 text-[17px] leading-8 text-[#374151]">
              {pageCategory?.name} is used in industrial automation,
              embedded electronics, robotics, PCB manufacturing,
              consumer electronics, IoT systems, repair industries
              and OEM manufacturing applications.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  </>
);
}