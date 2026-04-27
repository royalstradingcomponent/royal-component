"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const WishlistContext = createContext(null);

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken(user) {
  return user?.token || null;
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const wishlistIds = useMemo(() => {
    return new Set((wishlistItems || []).map((item) => String(item?._id)));
  }, [wishlistItems]);

  const wishlistCount = wishlistItems.length;

  const fetchWishlist = async () => {
    const token = getToken(user);

    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlistItems(res.data?.wishlist || []);
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?.token]);

  const isWishlisted = (productId) => {
    if (!productId) return false;
    return wishlistIds.has(String(productId));
  };

  const toggleWishlist = async (product) => {
    const token = getToken(user);

    if (!token) {
      toast.error("Please login to add products to wishlist");
      return { success: false, needLogin: true };
    }

    const productId = product?._id || product?.id || product?.productId;

    if (!productId) {
      toast.error("Product ID missing");
      return { success: false };
    }

    try {
      setActionLoadingId(String(productId));

      const res = await axios.post(
        `${API_BASE}/api/wishlist/toggle`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchWishlist();

      if (res.data?.action === "added") {
        toast.success("Product added to wishlist");
      } else if (res.data?.action === "removed") {
        toast.success("Product removed from wishlist");
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist update failed");
      return { success: false };
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = getToken(user);

    if (!token || !productId) return;

    try {
      setActionLoadingId(String(productId));

      await axios.delete(`${API_BASE}/api/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlistItems((prev) =>
        prev.filter((item) => String(item._id) !== String(productId))
      );

      toast.success("Product removed from wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Remove failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const clearWishlist = async () => {
    for (const item of wishlistItems) {
      await removeFromWishlist(item._id);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: wishlistItems,
        wishlistItems,
        wishlistCount,
        loading,
        actionLoadingId,
        fetchWishlist,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);