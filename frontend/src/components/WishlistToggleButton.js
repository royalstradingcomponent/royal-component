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
        className={`inline-flex items-center justify-center gap-2 rounded-full border transition disabled:opacity-60 ${
          active
            ? "border-[#ef4444] bg-[#fff1f2] text-[#ef4444]"
            : "border-[#d8e2ec] bg-white text-[#56708a] hover:border-[#38bdf8] hover:text-[#0f6cbd]"
        } ${
          size === "lg"
            ? "h-[48px] px-5 text-[15px] font-bold"
            : "h-9 w-9"
        } ${className}`}
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