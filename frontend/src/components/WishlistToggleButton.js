"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import LoginModal from "@/app/authPage/LoginModel";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistToggleButton({
  product,
  size = "md",
  showText = false,
  className = "",
}) {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist, actionLoadingId } = useWishlist();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const productId = product?._id || product?.id;
  const active = isWishlisted(productId);
  const loading = String(actionLoadingId) === String(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.token) {
      setIsLoginOpen(true);
      return;
    }

    await toggleWishlist(product);
  };

  const iconSize = size === "lg" ? 22 : 18;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        className={`inline-flex items-center justify-center gap-2 rounded-full transition disabled:opacity-60 ${
          size === "lg" ? "h-[48px] px-5 text-[15px] font-bold" : "h-9 w-9"
        } ${className}`}
        style={
          active
            ? {
                border: "1px solid var(--theme-wishlist-icon-color)",
                background:
                  "color-mix(in srgb, var(--theme-wishlist-icon-color) 12%, white)",
                color: "var(--theme-wishlist-icon-color)",
              }
            : {
                border: "1px solid var(--theme-card-border)",
                background: "var(--theme-card-bg)",
                color: "var(--theme-wishlist-icon-color)",
              }
        }
      >
        <Heart size={iconSize} className={active ? "fill-current" : ""} />
        {showText ? (
          <span>{active ? "Wishlisted" : "Add to wishlist"}</span>
        ) : null}
      </button>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openRegister={() => {}}
      />
    </>
  );
}
