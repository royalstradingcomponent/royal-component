import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySlider from "@/components/CategorySlider";
import ProcurementInfoBanner from "@/components/home/ProcurementInfoBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import ServiceLinks from "@/components/ServiceLinks";
import BrandStrip from "@/components/BrandStrip";
import Footer from "@/components/Footer";

import TrustBadges from "@/components/home/TrustBadges";
import SeoIntroSection from "@/components/home/SeoIntroSection";
import BulkOrderCTA from "@/components/home/BulkOrderCTA";
import IndustriesServed from "@/components/home/IndustriesServed";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import StatsSection from "@/components/home/StatsSection";
import Testimonials from "@/components/home/Testimonials";
import LatestBlogs from "@/components/home/LatestBlogs";
import NewsletterCTA from "@/components/home/NewsletterCTA";

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
    "semiconductor components supplier",
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

    images: [
      {
        url: "https://www.royalsmd.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Royal Trading Component",
      },
    ],

    twitter: {
      card: "summary_large_image",

      title:
        "Royal Component | Industrial Electrical & Electronic Components Supplier",

      description:
        "Buy industrial electronic components, semiconductors, ICs and automation products online in India.",

      images: ["https://www.royalsmd.com/og-image.jpg"],
    },
    type: "website",
  },
};

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
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",

  mainEntity: [
    {
      "@type": "Question",

      name: "Where to buy electronic components online in India?",

      acceptedAnswer: {
        "@type": "Answer",

        text: "You can buy electronic components online from Royal Trading Component, a trusted semiconductor and industrial electronics supplier in Delhi India.",
      },
    },

    {
      "@type": "Question",

      name: "Do you provide wholesale electronic components supply?",

      acceptedAnswer: {
        "@type": "Answer",

        text: "Yes, Royal Trading Component supports wholesale procurement, OEM sourcing, industrial purchasing and bulk quantity electronic component supply.",
      },
    },

    {
      "@type": "Question",

      name: "Which industries use semiconductor components?",

      acceptedAnswer: {
        "@type": "Answer",

        text: "Semiconductor components are used in industrial automation, embedded systems, robotics, IoT systems, PCB manufacturing and consumer electronics.",
      },
    },

    {
      "@type": "Question",

      name: "Do you provide GST invoices for businesses?",

      acceptedAnswer: {
        "@type": "Answer",

        text: "Yes, GST invoices are available for industrial buyers, OEM manufacturers, educational institutes and B2B businesses.",
      },
    },
  ],
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <Navbar />
      <Hero />

      <h1 className="sr-only">
        Electronic Components Supplier India | Semiconductor & IC Supplier Delhi | Royal Trading Component
      </h1>
      <TrustBadges />
      <CategorySlider />
      <ProcurementInfoBanner />
      <FeaturedProducts />
      <SeoIntroSection />
      <BulkOrderCTA />
      <IndustriesServed />
      <ServiceLinks />
      <BrandStrip />
      <StatsSection />
      <Testimonials />
      <LatestBlogs />
      <WhyChooseUs />
      <NewsletterCTA />

      <section className="bg-white border-t border-[#e5e7eb] py-16">
        <div className="container-royal">

          <div className="max-w-7xl mx-auto prose prose-lg max-w-none text-[#172033]">

            <h2 className="text-[38px] font-extrabold text-[#111827] leading-tight">
              Electronic Components Supplier in India
            </h2>

            <p>
              Royal Trading Component is one of the leading electronic
              components suppliers in India offering semiconductors,
              integrated circuits, displays, embedded electronics,
              development boards, automation products, industrial
              electronics and PCB components for engineers,
              manufacturers and B2B buyers.
            </p>

            <p>
              Our online electronics platform helps industries,
              OEM manufacturers, repair professionals and
              engineering businesses source genuine electronic
              components with wholesale pricing, GST invoice
              support and fast nationwide delivery.
            </p>

            <h2 className="mt-12 text-[32px] font-extrabold text-[#111827] leading-tight">
              Trusted Semiconductor & IC Supplier in Delhi India
            </h2>

            <p>
              Royal Trading Component supplies electronic
              components across Delhi, Uttam Nagar,
              Janakpuri, Lajpat Rai Market, Nehru Place,
              Noida, Gurugram and major industrial cities
              across India.
            </p>

            <p>
              We specialize in semiconductor sourcing,
              industrial electronics procurement,
              embedded hardware components, logic ICs,
              power management ICs, sensors, displays
              and communication modules.
            </p>

            <h3 className="mt-8 text-[26px] font-bold text-[#111827]">
              Popular Electronic Components Categories
            </h3>

            <ul>
              <li>Semiconductor Components</li>
              <li>Logic ICs</li>
              <li>Power Management ICs</li>
              <li>Wireless Communication Modules</li>
              <li>Sensor ICs & Modules</li>
              <li>Microcontrollers & Processors</li>
              <li>Displays & LCD Modules</li>
              <li>PCB Components</li>
              <li>Embedded Electronics</li>
              <li>Industrial Automation Products</li>
            </ul>

            <h2 className="mt-12 text-[32px] font-extrabold text-[#111827] leading-tight">
              Wholesale Electronic Components Supplier
            </h2>

            <p>
              Royal Trading Component supports wholesale
              procurement, OEM sourcing, industrial
              purchasing and B2B electronics supply for
              businesses, repair industries, engineering
              institutions and manufacturers.
            </p>

            <p>
              Our inventory includes industrial electronics,
              semiconductors, relays, connectors,
              transistors, voltage regulators, sensors,
              displays and embedded development boards
              suitable for commercial and industrial
              applications.
            </p>

            <h3 className="mt-8 text-[26px] font-bold text-[#111827]">
              Industrial Applications & Engineering Usage
            </h3>

            <p>
              Our electronic components are widely used
              in industrial automation, robotics,
              embedded systems, PCB manufacturing,
              consumer electronics, IoT systems,
              communication devices and repair industries.
            </p>

            <h2 className="mt-12 text-[32px] font-extrabold text-[#111827] leading-tight">
              Buy Electronic Components Online in India
            </h2>

            <p>
              Buy electronic components online from
              Royal Trading Component with secure
              ordering, fast shipping, procurement
              assistance and bulk quantity support.
            </p>

            <p>
              Explore semiconductors, ICs, displays,
              embedded hardware, automation products,
              sensors and industrial electronic
              components suitable for engineering,
              manufacturing and commercial projects.
            </p>

          </div>

        </div>
      </section>


      <section className="bg-white py-14 border-t border-[#e5e7eb]">
        <div className="container-royal">

          <h2 className="text-[34px] font-extrabold text-[#111827]">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 space-y-8">

            <div>
              <h3 className="text-[24px] font-bold text-[#111827]">
                Where to buy electronic components online in India?
              </h3>

              <p className="mt-3 text-[17px] leading-8 text-[#374151]">
                You can buy electronic components online from
                Royal Trading Component, a trusted semiconductor
                and industrial electronics supplier in Delhi India.
              </p>
            </div>

            <div>
              <h3 className="text-[24px] font-bold text-[#111827]">
                Do you provide bulk electronic components supply?
              </h3>

              <p className="mt-3 text-[17px] leading-8 text-[#374151]">
                Yes, we support OEM sourcing, wholesale
                procurement, industrial purchasing and
                bulk quantity supply for businesses and manufacturers.
              </p>
            </div>

            <div>
              <h3 className="text-[24px] font-bold text-[#111827]">
                Which industries use semiconductor components?
              </h3>

              <p className="mt-3 text-[17px] leading-8 text-[#374151]">
                Semiconductor components are used in
                industrial automation, robotics,
                embedded electronics, IoT systems,
                PCB manufacturing and consumer electronics.
              </p>
            </div>

          </div>

        </div>
      </section>

      <section className="bg-white py-14 border-t border-[#e5e7eb]">
        <div className="container-royal">

          <h2 className="text-[32px] font-extrabold text-[#111827]">
            Explore Electronic Components Categories
          </h2>

          <div className="mt-8 flex flex-wrap gap-4">

            <a
              href="/products"
              className="rounded-full border border-[#dbe4f0] px-6 py-3 text-[16px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
            >
              Electronic Components India
            </a>

            <a
              href="/category/semiconductors"
              className="rounded-full border border-[#dbe4f0] px-6 py-3 text-[16px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
            >
              Semiconductor Components
            </a>

            <a
              href="/category/semiconductors?subCategory=logic-ics"
              className="rounded-full border border-[#dbe4f0] px-6 py-3 text-[16px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
            >
              Logic IC Supplier India
            </a>

            <a
              href="/category/semiconductors?subCategory=power-management-ics"
              className="rounded-full border border-[#dbe4f0] px-6 py-3 text-[16px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
            >
              Power Management ICs
            </a>

            <a
              href="/contact"
              className="rounded-full border border-[#dbe4f0] px-6 py-3 text-[16px] font-semibold text-[#174ea6] transition hover:bg-[#174ea6] hover:text-white"
            >
              Contact Electronic Components Supplier
            </a>

          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}