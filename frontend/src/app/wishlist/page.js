"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

function getImageUrl(product) {
  const url =
    product?.thumbnail ||
    product?.images?.find((img) => img?.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    product?.image ||
    "";

  if (!url) return "https://via.placeholder.com/500x500?text=No+Image";
  if (url.startsWith("http")) return url;

  return `${API_BASE}${url}`;
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToCart, cartActionLoading } = useCart();

  const {
    wishlist,
    loading: wishlistLoading,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user?.token) {
      router.replace("/");
    }
  }, [authLoading, user?.token, router]);

  const handleMoveToCart = async (product) => {
    const productId = product?._id || product?.id;

    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    try {
      const res = await addToCart({
        productId,
        qty: 1,
      });

      if (res?.success !== false) {
        await removeFromWishlist(productId);
        toast.success("Product moved to cart");
      }
    } catch (error) {
      toast.error(error?.message || "Move to cart failed");
    }
  };

  if (authLoading) return null;
  if (!user?.token) return null;

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-[#f4f8fc]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[#64748b]">
          Loading wishlist...
        </div>
        <Footer />
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f8fc]">
        <Navbar />

        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
          <Heart size={80} className="mb-5 text-[#0f8fd8]" />

          <h1 className="text-3xl font-extrabold text-[#102033]">
            Your wishlist is empty
          </h1>

          <p className="mt-3 max-w-xl text-[#607287]">
            Save electronic, electrical and mechanical hardware components here
            for quick repeat buying.
          </p>

          <Link
            href="/products"
            className="mt-7 rounded-full bg-[#0f8fd8] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#0b76b6]"
          >
            Browse Products
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8fc]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[#102033]">
              <Heart className="fill-[#ef4444] text-[#ef4444]" size={26} />
              Your Wishlist Items [{wishlist.length}]
            </h1>

            <p className="mt-2 text-sm text-[#607287]">
              Save components for later and move them to cart whenever you are
              ready to buy.
            </p>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="rounded-lg border border-[#d2dce8] bg-white px-5 py-2 text-sm font-semibold text-[#42566d] transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
          >
            Delete All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {wishlist.map((item) => {
            const productId = item?._id || item?.id;
            const price = item?.price || item?.minPrice || 0;
            const mrp = item?.mrp || price;
            const imageUrl = getImageUrl(item);

            return (
              <div
                key={productId}
                className="group overflow-hidden rounded-2xl border border-[#dbe5f0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.10)]"
              >
                <div className="relative flex aspect-square items-center justify-center bg-[#f8fbff] p-5">
                  <Link href={`/product/${item?.slug || productId}`}>
                    <img
                      src={imageUrl}
                      alt={item?.name || "Product"}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(productId)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#42566d] shadow transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="p-4">
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0f6cbd]">
                    {item?.brand || "Generic"}
                  </p>

                  <Link href={`/product/${item?.slug || productId}`}>
                    <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-extrabold leading-6 text-[#102033] hover:text-[#0f6cbd]">
                      {item?.name}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-[#607287]">
                    {item?.shortDescription ||
                      item?.description ||
                      "Industrial component for electronic, electrical and mechanical procurement."}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-lg font-extrabold text-[#102033]">
                      {formatCurrency(price)}
                    </span>

                    {mrp > price ? (
                      <span className="text-sm text-[#94a3b8] line-through">
                        {formatCurrency(mrp)}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
                    <span className="rounded-full bg-[#e2f5ea] px-3 py-1 text-[#067647]">
                      {Number(item?.stock || 0) > 0 ? "In Stock" : "Check Stock"}
                    </span>

                    {item?.sku ? (
                      <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[#2452c6]">
                        SKU: {item.sku}
                      </span>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  disabled={cartActionLoading}
                  className="flex w-full items-center justify-center gap-2 border-t border-[#e5edf5] bg-[#0f8fd8] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#0b76b6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingCart size={17} />
                  Move to Cart
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}