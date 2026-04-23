import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import ServiceLinks from "@/components/ServiceLinks";
import BrandStrip from "@/components/BrandStrip";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />
      <Hero />
      <CategorySlider />
      <BrandStrip />
      <FeaturedProducts />
      <ServiceLinks />

      <section className="section-padding bg-white">
        <div className="container-royal">
          <div className="mb-8 text-center">
            <h2 className="heading-section">Why Choose Royal Component</h2>
            <p className="section-subtitle">
              Built for professional sourcing, technical clarity and scalable industrial procurement.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-royal p-6">
              <h3 className="text-xl font-bold text-[#102033]">Trusted Products</h3>
              <p className="mt-3 text-sm leading-7 text-[#64748b]">
                Genuine industrial, electrical and electronic products from reliable suppliers.
              </p>
            </div>

            <div className="card-royal p-6">
              <h3 className="text-xl font-bold text-[#102033]">Category-Based Discovery</h3>
              <p className="mt-3 text-sm leading-7 text-[#64748b]">
                Browse by sensors, automation, power, semiconductors, connectors and more.
              </p>
            </div>

            <div className="card-royal p-6">
              <h3 className="text-xl font-bold text-[#102033]">Business Ready</h3>
              <p className="mt-3 text-sm leading-7 text-[#64748b]">
                Ideal for student projects, labs, repair shops, industrial buyers and repeat procurement.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/products"
              className="inline-flex rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}