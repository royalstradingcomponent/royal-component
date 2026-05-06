"use client";

import { useMemo, useState } from "react";
import { API_BASE } from "@/lib/api";
import { getProductImage } from "@/lib/getProductImage";

function getImageUrl(url) {
  if (!url) return "https://via.placeholder.com/800x800?text=No+Image";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  if (url.startsWith("/")) return url;
  return `${API_BASE}/${url}`;
}

export default function ProductImageGallery({ product }) {
  const images = useMemo(() => {
    const list = [];

    if (product?.thumbnail) {
      list.push({
        url: product.thumbnail,
        altText: product.name || "Product image",
        isPrimary: true,
        order: -1,
      });
    }

    if (Array.isArray(product?.images)) {
      product.images.forEach((img) => {
        if (img?.url && !list.some((item) => item.url === img.url)) {
          list.push(img);
        }
      });
    }

    if (!list.length) {
      list.push({
        url: getProductImage(product),
        altText: product?.name || "Product image",
      });
    }

    return list
      .filter((img) => img?.url)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .slice(0, 8);
  }, [product]);

  const [activeImage, setActiveImage] = useState(images[0]?.url || "");

  return (
    <div className="grid gap-4 md:grid-cols-[96px_minmax(0,1fr)]">
      <div className="flex gap-3 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
        {images.map((img, index) => {
          const url = img.url;
          const active = activeImage === url;

          return (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveImage(url)}
              className={`flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-md border-2 bg-white p-2 transition ${
                active
                  ? "border-[#2454b5] shadow-md"
                  : "border-[#dbe7f3] hover:border-[#38bdf8]"
              }`}
            >
              <img
                src={getImageUrl(url)}
                alt={img.altText || product?.name || "Product image"}
                className="h-full w-full object-contain"
              />
            </button>
          );
        })}
      </div>

      <div className="rounded-sm bg-white p-4 shadow-sm">
        <div className="flex min-h-[420px] items-center justify-center md:min-h-[560px]">
          <img
            src={getImageUrl(activeImage)}
            alt={product?.name || "Product image"}
            className="max-h-[420px] w-full object-contain md:max-h-[560px]"
          />
        </div>
      </div>
    </div>
  );
}