import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import ServiceLinks from "@/components/ServiceLinks";
import BrandStrip from "@/components/BrandStrip";
import Footer from "@/components/Footer";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  ReceiptText,
  Factory,
  Wrench,
  FlaskConical,
  Building2,
  PackageCheck,
  ArrowRight,
  CheckCircle2,
  SearchCheck,
  BadgeIndianRupee,
} from "lucide-react";

export const metadata = {
  title:
    "Royal Component | Industrial Electrical, Electronic & Hardware Components Supplier",
  description:
    "Buy industrial electrical, electronic, automation, sensors, switchgear, cables, tools and hardware components online. Bulk procurement, GST invoice and B2B wholesale support.",
  keywords: [
    "industrial components supplier",
    "electrical components online",
    "electronic components wholesale",
    "hardware components supplier",
    "automation parts supplier",
    "switchgear components",
    "sensors supplier India",
    "bulk procurement components",
    "B2B industrial products",
    "Royal Component",
  ],
  alternates: {
    canonical: "https://www.royalsmd.com",
  },
  openGraph: {
    title: "Royal Component | Industrial Components Supplier",
    description:
      "Source industrial electrical, electronic, automation and hardware components with bulk procurement support.",
    url: "https://www.royalsmd.com",
    siteName: "Royal Component",
    type: "website",
  },
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Genuine Components",
    text: "Original industrial, electrical and electronic products sourced from reliable suppliers.",
  },
  {
    icon: PackageCheck,
    title: "Wholesale Ready",
    text: "MOQ, stock visibility and bulk quantity support for business buyers.",
  },
  {
    icon: ReceiptText,
    title: "GST Invoice",
    text: "Business-ready GST billing support for factories, workshops and institutions.",
  },
  {
    icon: Truck,
    title: "Fast Procurement",
    text: "Quick support for urgent parts, repeat orders and project-based sourcing.",
  },
];

const industries = [
  {
    icon: Factory,
    title: "Factories & Plants",
    text: "Automation, switchgear, sensors, cables and maintenance components.",
  },
  {
    icon: Wrench,
    title: "Repair Shops",
    text: "Electronic parts, tools, connectors and replacement components.",
  },
  {
    icon: FlaskConical,
    title: "Labs & Projects",
    text: "Semiconductors, display modules, ICs and embedded project parts.",
  },
  {
    icon: Building2,
    title: "Business Buyers",
    text: "Bulk purchase, GST billing, repeat procurement and quote support.",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Royal Component",
  url: "https://www.royalsmd.com",
  logo: "https://www.royalsmd.com/logo.png",
  description:
    "Royal Component is a B2B industrial e-commerce platform for electrical, electronic, automation and hardware component sourcing.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-00000-00000",
    contactType: "sales support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Royal Component",
  url: "https://www.royalsmd.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.royalsmd.com/products?keyword={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <Navbar />
      <Hero />

      {/* TRUST BADGES / PROCUREMENT BENEFITS */}
      <section className="relative z-10 border-y border-[#d9e8f5] bg-white">
        <div className="container-royal grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#38bdf8] hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dff3ff] text-[#0284c7] transition-all duration-300 group-hover:bg-[#0284c7] group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h2 className="text-lg font-extrabold text-[#102033]">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#52677d]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <CategorySlider />
      <BrandStrip />

      {/* SEO CONTENT SECTION */}
      <section className="section-padding bg-white">
        <div className="container-royal">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
                Industrial Procurement Store
              </p>

              <h1 className="text-3xl font-extrabold leading-tight text-[#102033] md:text-5xl">
                Buy industrial electrical, electronic and hardware components online.
              </h1>

              <p className="mt-5 text-base leading-8 text-[#52677d]">
                Royal Component helps factories, workshops, engineers, repair
                businesses, labs and hardware buyers source reliable industrial
                products including automation parts, sensors, switchgear,
                semiconductors, PLC parts, cables, connectors, tools and
                electrical accessories.
              </p>

              <p className="mt-4 text-base leading-8 text-[#52677d]">
                Our platform is built for B2B buyers who need bulk procurement,
                GST invoice support, technical product clarity, wholesale-ready
                pricing and category-based product discovery.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0284c7] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#0369a1]"
                >
                  Explore Products <ArrowRight size={18} />
                </Link>

                <Link
                  href="/quote-request"
                  className="inline-flex items-center gap-2 rounded-full border border-[#b6dcff] bg-[#dff2ff] px-8 py-3 text-sm font-extrabold text-[#075985] transition hover:bg-[#cfeeff]"
                >
                  Request Bulk Quote
                </Link>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  icon: SearchCheck,
                  title: "Part Number Search",
                  text: "Find products by category, brand, SKU or technical requirement.",
                },
                {
                  icon: BadgeIndianRupee,
                  title: "Wholesale Pricing",
                  text: "Ideal for bulk orders, repeat purchase and B2B procurement.",
                },
                {
                  icon: ReceiptText,
                  title: "GST Billing",
                  text: "Proper invoice support for companies and professional buyers.",
                },
                {
                  icon: PackageCheck,
                  title: "Procurement Support",
                  text: "Support for urgent, hard-to-find and project-based products.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dff3ff] text-[#0284c7]">
                      <Icon size={23} />
                    </div>

                    <h2 className="text-lg font-extrabold text-[#102033]">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#52677d]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BULK ORDER CTA */}
      <section className="section-padding bg-[#eef8ff]">
        <div className="container-royal overflow-hidden rounded-[34px] border border-[#cde8ff] bg-[linear-gradient(135deg,#08233f_0%,#075985_55%,#0ea5e9_100%)] p-8 text-white shadow-2xl md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                Bulk Procurement Support
              </p>

              <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                Need components in bulk for factory, repair or project supply?
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#dcefff]">
                Send your requirement list, part numbers, quantities or
                technical specifications. Royal Component helps you source
                industrial, electrical, automation and hardware products with
                reliable procurement support.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href="/quote-request"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-extrabold text-[#075985] transition hover:bg-[#e0f2fe]"
                >
                  Request Bulk Quote <ArrowRight size={18} />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
                >
                  Explore Products
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur">
              {[
                "MOQ & wholesale quantity support",
                "Part number based sourcing",
                "GST invoice for business orders",
                "Support for repeat procurement",
              ].map((text) => (
                <div
                  key={text}
                  className="mb-4 flex items-center gap-3 last:mb-0"
                >
                  <CheckCircle2 className="text-[#7dd3fc]" size={22} />
                  <span className="font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* INDUSTRIES SERVED */}
      <section className="section-padding bg-white">
        <div className="container-royal">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
              Who We Serve
            </p>

            <h2 className="heading-section">
              Built for Hardware & Industrial Buyers
            </h2>

            <p className="section-subtitle">
              From small repair needs to wholesale procurement, Royal Component
              supports multiple industrial buying use cases.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {industries.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff3ff] text-[#0284c7]">
                    <Icon size={26} />
                  </div>

                  <h2 className="text-xl font-extrabold text-[#102033]">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#52677d]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ServiceLinks />

      {/* ADVANCED WHY CHOOSE */}
      <section className="section-padding bg-[#f7fbff]">
        <div className="container-royal">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
                Why Choose Us
              </p>

              <h2 className="text-3xl font-extrabold leading-tight text-[#102033] md:text-5xl">
                A smarter way to buy industrial components online.
              </h2>

              <p className="mt-5 text-base leading-8 text-[#52677d]">
                Royal Component is designed for buyers who need clear product
                discovery, technical confidence, business-ready billing and
                procurement support for hardware, electronics and industrial
                products.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0284c7] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#0369a1]"
              >
                Start Sourcing <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                "Technical product clarity",
                "Bulk order friendly checkout",
                "Reliable category structure",
                "Business procurement support",
                "Fast search and discovery",
                "Trusted industrial supply focus",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm"
                >
                  <CheckCircle2 className="shrink-0 text-[#0284c7]" size={22} />
                  <span className="font-bold text-[#102033]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}