"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { API_BASE } from "@/lib/api";

const fallbackSection = {
  title: "Semiconductor Products",
  subtitle:
    "Explore ICs, voltage regulators, transistors, MOSFETs and other semiconductor components for wholesale supply.",
  categorySlug: "semiconductors",
  limit: 8,
  viewAllText: "View All",
  viewAllLink: "/products?category=semiconductors",
};

export default function FeaturedProducts() {
  const [section, setSection] = useState(fallbackSection);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSection = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/home-sections`, {
        cache: "no-store",
      });

      const data = await res.json();

      const selected = (data.sections || []).find(
        (item) => item.key === "featured-products"
      );

      if (selected) {
        setSection({
          ...fallbackSection,
          ...selected,
        });
        return selected;
      }
    } catch (error) {
      console.error("Home section fetch error:", error);
    }

    return fallbackSection;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const activeSection = await fetchSection();

        const category = activeSection?.categorySlug || "semiconductors";
        const limit = activeSection?.limit || 8;

        const res = await fetch(
          `${API_BASE}/api/products?category=${encodeURIComponent(
            category
          )}&limit=${limit}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.success) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Featured products fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (section?.isActive === false) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-royal">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="heading-section">{section.title}</h2>
            <p className="section-subtitle">{section.subtitle}</p>
          </div>

          <Link
            href={section.viewAllLink || "/products"}
            className="hidden rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:from-[#1d4ed8] hover:to-[#6d28d9] md:inline-flex"
          >
            <span className="text-white">
              {section.viewAllText || "View All"}
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(Number(section.limit || 8))].map((_, index) => (
              <div
                key={index}
                className="card-royal h-[340px] animate-pulse bg-white"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center md:hidden">
              <Link
                href={section.viewAllLink || "/products"}
                className="inline-flex rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:from-[#1d4ed8] hover:to-[#6d28d9]"
              >
                <span className="text-white">
                  {section.viewAllText || "View All"}
                </span>
              </Link>
            </div>
          </>
        ) : (
          <div className="card-royal p-8 text-center">
            <p className="text-sm text-slate-500">
              No products available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}