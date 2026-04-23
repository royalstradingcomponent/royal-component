"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const WishlistContext = createContext();

const GUEST_WISHLIST_KEY = "guest_wishlist";

function getGuestWishlist() {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestWishlist(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
}

function clearGuestWishlistStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_WISHLIST_KEY);
}

export function WishlistProvider({ children }) {
  const { user, logout } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user || !user.token) {
      setWishlist(getGuestWishlist());
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Wishlist fetch error:", err?.response?.data || err);

        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, API_BASE, logout]);

  const toggleWishlist = async (product) => {
    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    if (!user || !user.token) {
      const current = getGuestWishlist();
      const exists = current.find((p) => p._id === product._id);

      let updated;

      if (exists) {
        updated = current.filter((p) => p._id !== product._id);
        toast.success("Removed from wishlist");
      } else {
        updated = [...current, product];
        toast.success("Added to wishlist");
      }

      saveGuestWishlist(updated);
      setWishlist(updated);
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/wishlist/toggle`,
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setWishlist((prev) => {
        const exists = prev.find((p) => p._id === product._id);

        if (exists) {
          return prev.filter((p) => p._id !== product._id);
        }
        return [...prev, product];
      });
    } catch (err) {
      console.error("Toggle wishlist error:", err?.response?.data || err);

      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return;

    if (!user || !user.token) {
      const updated = getGuestWishlist().filter((p) => p._id !== productId);
      saveGuestWishlist(updated);
      setWishlist(updated);
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Remove wishlist error:", err?.response?.data || err);

      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const clearWishlist = () => {
    if (!user || !user.token) {
      clearGuestWishlistStorage();
    }
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
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