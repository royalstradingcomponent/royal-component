"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://royal-component-backend.onrender.com";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemiconductorProducts = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/products?category=semiconductors&limit=8`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.success) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Semiconductor products fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSemiconductorProducts();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-royal">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="heading-section">Semiconductor Products</h2>
            <p className="section-subtitle">
              Explore ICs, voltage regulators, transistors, MOSFETs and other
              semiconductor components for wholesale supply.
            </p>
          </div>

          <Link
            href="/products?category=semiconductors"
            className="hidden md:inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
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
                href="/products?category=semiconductors"
                className="inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                View All
              </Link>
            </div>
          </>
        ) : (
          <div className="card-royal p-8 text-center">
            <p className="text-sm text-slate-500">
              No semiconductor products available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}