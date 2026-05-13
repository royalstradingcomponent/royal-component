"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ImageSearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("imageSearchResults");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setProducts(parsed);
        }
      }
    } catch (error) {
      console.error("Image search localStorage error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-bold text-[#0f6cbd]">
          Searching products...
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-[#d7e7f4] bg-white p-10 text-center">
        <h2 className="text-2xl font-extrabold text-[#102033]">
          No matching products found
        </h2>

        <p className="mt-2 text-[#5f7d95]">
          Try another product image.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#102033]">
          Image Search Results
        </h1>

        <p className="mt-2 text-[#5f7d95]">
          {products.length} matching product(s) found
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.slug}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}