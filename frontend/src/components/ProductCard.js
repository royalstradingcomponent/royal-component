"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { getProductImage } from "@/lib/getProductImage";
import WishlistToggleButton from "@/components/WishlistToggleButton";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://royal-component-backend.onrender.com";

const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/500x500?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

function getStockData(product) {
  const qty = Number(product?.stock || 0);

  const isOut =
    product?.isOutOfStock ||
    product?.stockStatus === "out_of_stock" ||
    qty <= 0;

  if (isOut) {
    return {
      label: product?.allowBackorder
        ? "Available on Request"
        : "Out of Stock",

      style: product?.allowBackorder
        ? {
          background: "var(--theme-stock-warning-bg)",
          color: "var(--theme-stock-warning-text)",
        }
        : {
          background: "var(--theme-stock-danger-bg)",
          color: "var(--theme-stock-danger-text)",
        },

      isOut: true,
    };
  }

  if (qty <= 10 || product?.stockStatus === "low_stock") {
    return {
      label: "Only few left",

      style: {
        background: "var(--theme-stock-warning-bg)",
        color: "var(--theme-stock-warning-text)",
      },

      isOut: false,
    };
  }

  return {
    label: "In Stock",

    style: {
      background: "var(--theme-stock-success-bg)",
      color: "var(--theme-stock-success-text)",
    },

    isOut: false,
  };
}

export default function ProductCard({ product }) {
  const image =
    product?.thumbnail ||
    product?.images?.find((img) => img?.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    "";

  const productLink = `/product/${product?.slug || product?._id}`;
  const stockData = getStockData(product);
  const price = Number(product?.price || 0);
  const mrp = Number(product?.mrp || 0);
  const moq = Number(product?.moq || 1);
  const rating = 4.8;

  return (
    <div
      className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{
        borderRadius: "var(--theme-card-radius)",
        border: "1px solid var(--theme-card-border)",
        background: "var(--theme-product-card-bg)",
      }}
    >
      <div
        className="relative"
        style={{
          borderBottom: "1px solid var(--theme-card-border)",
        }}
      >
        <div className="absolute right-3 top-3 z-10">
          <WishlistToggleButton product={product} />
        </div>

        <Link href={productLink} className="block">
          <div
            className="flex h-[150px] items-center justify-center overflow-hidden p-3"
            style={{
              background: "var(--theme-product-card-bg)",
            }}
          >
            <img
              src={getProductImage(product)}
              alt={product?.name || "Product"}
              className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `${API_BASE}/uploads/new-products/LM358.jpg`;
              }}
            />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className="inline-flex rounded-full px-3 py-[5px] text-[11px] font-semibold"
            style={stockData.style}
          >
            {stockData.label}
          </span>

          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-[5px] text-[11px] font-semibold"
            style={{
              background: "var(--theme-background-alt)",
              color: "var(--theme-heading)",
            }}
          >
            <Star
              size={12}
              style={{
                fill: "var(--theme-warning)",
                color: "var(--theme-warning)",
              }}
            />            {rating}
          </span>
        </div>

        <p
          className="text-[11px] font-extrabold uppercase tracking-[0.16em]"
          style={{
            color: "var(--theme-primary)",
          }}
        >
          {product?.brand || "Generic"}
        </p>

        <Link href={productLink}>
          <h3
            className="mt-2 line-clamp-2 min-h-[52px] text-[17px] font-extrabold leading-[1.2] transition"
            style={{
              color: "var(--theme-product-card-text)",
            }}
          >
            {product?.name}
          </h3>
        </Link>

        <p
          className="mt-1 line-clamp-1 min-h-[24px] text-[13px] leading-6"
          style={{
            color: "var(--theme-body)",
          }}
        >
          {product?.shortDescription || "Industrial electronic component."}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-[5px] text-[11px] font-semibold"
            style={{
              background: "var(--theme-background-alt)",
              color: "var(--theme-body)",
            }}
          >
            MOQ: {moq} {product?.unit || "piece"}
          </span>

          {Number(product?.stock || 0) > 0 ? (
            <span
              className="rounded-full px-3 py-[5px] text-[11px] font-semibold"
              style={{
                background: "var(--theme-menu-bg)",
                color: "var(--theme-primary)",
              }}
            >
              Stock: {Number(product?.stock || 0)}
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          <div className="flex items-end gap-2">
            <span
              className="text-[18px] font-extrabold leading-none"
              style={{
                color: "var(--theme-price-color)",
              }}
            >
              ₹{price.toLocaleString("en-IN")}
            </span>

            {mrp > price ? (
              <span
                className="text-[13px] font-semibold line-through"
                style={{
                  color: "var(--theme-muted)",
                }}
              >
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            ) : null}

            {mrp > price ? (
              <span
                className="text-[12px] font-semibold"
                style={{
                  color: "var(--theme-danger)",
                }}
              >
                ({Math.round(((mrp - price) / mrp) * 100)}% OFF)
              </span>
            ) : null}
          </div>

          <p
            className="mt-1 text-[11px] leading-5"
            style={{
              color: "var(--theme-muted)",
            }}
          >
            Ex. GST • Bulk procurement ready
          </p>
        </div>

        {stockData.isOut ? (
          <div className="mt-4 flex h-[44px] w-full items-center justify-center gap-2 rounded-full text-[14px] font-extrabold"
            style={{
              border: "1px solid var(--theme-danger)",
              background:
                "color-mix(in srgb, var(--theme-danger) 10%, white)",
              color: "var(--theme-danger)",
            }}>
            <ShoppingCart size={16} />
            {product?.allowBackorder ? "Request Availability" : "Out Of Stock"}
          </div>
        ) : (
          <Link
            href={productLink}
            className="mt-4 flex h-[44px] w-full items-center justify-center gap-2 rounded-full text-[14px] font-extrabold transition"
            style={{
              border: "1px solid var(--theme-cart-button-bg)",
              background: "var(--theme-cart-button-bg)",
              color: "var(--theme-cart-button-text)",
            }}
          >
            <ShoppingCart
              size={16}
              style={{
                color: "var(--theme-cart-button-text)",
              }}
            />
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
