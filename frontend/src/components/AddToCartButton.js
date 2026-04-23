"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function AddToCartButton({ productId, qty = 1 }) {
  const { addToCart, cartActionLoading, isGuestCart } = useCart();
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    try {
      setMessage("");

      await addToCart({
        productId,
        qty,
      });

      if (user?.token) {
        setMessage("Added to cart");
      } else if (isGuestCart) {
        setMessage("Added to cart as guest");
      } else {
        setMessage("Added to cart");
      }
    } catch (error) {
      setMessage(error?.message || "Add to cart failed");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={cartActionLoading}
        className="btn-primary-royal"
      >
        {cartActionLoading ? "Adding..." : "Add to Cart"}
      </button>

      {message ? (
        <p className="mt-2 text-sm text-[var(--color-muted)]">{message}</p>
      ) : null}
    </div>
  );
}