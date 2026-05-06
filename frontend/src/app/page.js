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
      <Footer />
    </div>
  );
}