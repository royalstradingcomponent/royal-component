import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import WishlistToggleButton from "@/components/WishlistToggleButton";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://royal-component-backend.onrender.com";

const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/500x500?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

function getStockData(stock) {
  const qty = Number(stock || 0);

  if (qty <= 0) {
    return {
      label: "Temporarily out of stock",
      className: "bg-[#f3e8ff] text-[#6b21a8]",
    };
  }

  if (qty <= 10) {
    return {
      label: "Only few left",
      className: "bg-[#fff4e5] text-[#c26a00]",
    };
  }

  return {
    label: "In Stock",
    className: "bg-[#e8f8ee] text-[#0f8a4b]",
  };
}

export default function ProductCard({ product }) {
  const image =
    product?.thumbnail ||
    product?.images?.find((img) => img?.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    "";

  const productLink = `/product/${product?.slug || product?._id}`;
  const stockData = getStockData(product?.stock);
  const price = Number(product?.price || 0);
  const mrp = Number(product?.mrp || 0);
  const moq = Number(product?.moq || 1);
  const rating = 4.8;

  return (
    <div className="group overflow-hidden rounded-[16px] border border-[#d8e2ec] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative border-b border-[#edf2f7]">
        <div className="absolute right-3 top-3 z-10">
          <WishlistToggleButton product={product} />
        </div>

        <Link href={productLink} className="block">
          <div className="flex h-[150px] items-center justify-center overflow-hidden bg-white p-3">
            <img
              src={getImageUrl(image)}
              alt={product?.name || "Product"}
              className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-[5px] text-[11px] font-semibold ${stockData.className}`}
          >
            {stockData.label}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f7fb] px-3 py-[5px] text-[11px] font-semibold text-[#1f3b57]">
            <Star size={12} className="fill-[#f5b301] text-[#f5b301]" />
            {rating}
          </span>
        </div>

        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0b6aa2]">
          {product?.brand || "Generic"}
        </p>

        <Link href={productLink}>
          <h3 className="mt-2 line-clamp-2 min-h-[52px] text-[17px] font-extrabold leading-[1.2] text-[#102033] transition hover:text-[#0b6aa2]">
            {product?.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-1 min-h-[24px] text-[13px] leading-6 text-[#61758a]">
          {product?.shortDescription || "Industrial electronic component."}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f4f7fb] px-3 py-[5px] text-[11px] font-semibold text-[#5b7087]">
            MOQ: {moq} {product?.unit || "piece"}
          </span>

          {Number(product?.stock || 0) > 0 ? (
            <span className="rounded-full bg-[#eef8ff] px-3 py-[5px] text-[11px] font-semibold text-[#0b6aa2]">
              Stock: {Number(product?.stock || 0)}
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          <div className="flex items-end gap-2">
            <span className="text-[18px] font-extrabold leading-none text-[#102033]">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {mrp > price ? (
              <span className="text-[13px] font-semibold text-[#8a97a6] line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            ) : null}

            {mrp > price ? (
              <span className="text-[12px] font-semibold text-[#ff6b35]">
                ({Math.round(((mrp - price) / mrp) * 100)}% OFF)
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-[11px] leading-5 text-[#6c8095]">
            Ex. GST • Bulk procurement ready
          </p>
        </div>

        <Link
          href={productLink}
          className="mt-4 flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#d6ecff] text-[14px] font-extrabold text-[#000000] border border-[#b6dcff] transition hover:bg-[#c5e4ff]"
          >
          <ShoppingCart size={16} className="text-[#0b6aa2]" />
          View Details
        </Link>
      </div>
    </div>
  );
}