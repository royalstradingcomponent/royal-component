"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, API_BASE } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

const GUEST_CART_KEY = "guest_cart";
const DEFAULT_GST_PERCENT = 18;

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function buildEmptySummary() {
  return {
    itemCount: 0,
    subtotalExGst: 0,
    gstTotal: 0,
    shipping: 0,
    grandTotal: 0,
  };
}

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function getGuestCartFromStorage() {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestCartToStorage(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestCartStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}

function buildGuestCartItemFromProduct(product, qty = 1) {
  const price = toNumber(product?.price, 0);
  const gstPercent = toNumber(product?.gstPercent, DEFAULT_GST_PERCENT);
  const quantity = Math.max(1, toNumber(qty, 1));
  const lineSubtotal = price * quantity;
  const gstAmount = (lineSubtotal * gstPercent) / 100;
  const lineTotal = lineSubtotal + gstAmount;

  return {
    id: `guest-${product?._id}`,
    productId: product?._id,
    slug: product?.slug || "",
    name: product?.name || "",
    brand: product?.brand || "Generic",
    sku: product?.sku || "",
    mpn: product?.mpn || "",
    image:
      product?.thumbnail ||
      product?.images?.find((img) => img?.isPrimary)?.url ||
      product?.images?.[0]?.url ||
      "",
    price,
    mrp: toNumber(product?.mrp, price),
    quantity,
    gstPercent,
    gstAmount,
    lineSubtotal,
    lineTotal,
    stock: toNumber(product?.stock, 0),
    hsnCode: product?.hsnCode || "",
    estimatedDelivery: "2-5 business days",
    stockLabel: toNumber(product?.stock, 0) > 0 ? "In stock" : "Out of stock",
  };
}

function normalizeGuestItem(item) {
  const price = toNumber(item?.price, 0);
  const quantity = Math.max(1, toNumber(item?.quantity, 1));
  const gstPercent = toNumber(item?.gstPercent, DEFAULT_GST_PERCENT);
  const lineSubtotal = price * quantity;
  const gstAmount = (lineSubtotal * gstPercent) / 100;
  const lineTotal = lineSubtotal + gstAmount;

  return {
    ...item,
    id: item?.id || `guest-${item?.productId}`,
    quantity,
    gstPercent,
    lineSubtotal,
    gstAmount,
    lineTotal,
    stockLabel:
      typeof item?.stockLabel === "string"
        ? item.stockLabel
        : toNumber(item?.stock, 0) > 0
        ? "In stock"
        : "Out of stock",
    estimatedDelivery: item?.estimatedDelivery || "2-5 business days",
  };
}

function buildGuestSummary(items) {
  const normalizedItems = items.map(normalizeGuestItem);
  const subtotalExGst = normalizedItems.reduce((sum, item) => sum + item.lineSubtotal, 0);
  const gstTotal = normalizedItems.reduce((sum, item) => sum + item.gstAmount, 0);
  const shipping = 0;
  const grandTotal = subtotalExGst + gstTotal + shipping;
  const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    itemCount,
    subtotalExGst,
    gstTotal,
    shipping,
    grandTotal,
  };
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(buildEmptySummary());
  const [cartLoading, setCartLoading] = useState(true);
  const [cartActionLoading, setCartActionLoading] = useState(false);

  const hasMergedAfterLoginRef = useRef(false);

  const setGuestCartState = (items) => {
    const normalizedItems = items.map(normalizeGuestItem);
    setCartItems(normalizedItems);
    setCartSummary(buildGuestSummary(normalizedItems));
  };

  const fetchGuestCart = () => {
    const guestItems = getGuestCartFromStorage();
    setGuestCartState(guestItems);
    setCartLoading(false);
  };

  const fetchServerCart = async () => {
    try {
      setCartLoading(true);

      const data = await apiRequest("/api/cart", {
        method: "GET",
        cache: "no-store",
      });

      if (data?.success) {
        setCartItems(data.items || []);
        setCartSummary(data.summary || buildEmptySummary());
      } else {
        setCartItems([]);
        setCartSummary(buildEmptySummary());
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCartItems([]);
      setCartSummary(buildEmptySummary());
    } finally {
      setCartLoading(false);
    }
  };

  const fetchCart = async () => {
    if (authLoading) return;

    if (user?.token) {
      await fetchServerCart();
    } else {
      fetchGuestCart();
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.token, authLoading]);

  const mergeGuestCartToServer = async () => {
    const guestItems = getGuestCartFromStorage();

    if (!user?.token || guestItems.length === 0) {
      return;
    }

    try {
      await apiRequest("/api/cart/merge", {
        method: "POST",
        body: JSON.stringify({
          items: guestItems.map((item) => ({
            productId: item.productId,
            qty: item.quantity,
          })),
        }),
      });

      clearGuestCartStorage();
    } catch (error) {
      console.error("Guest cart merge error:", error);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (user?.token) {
      if (!hasMergedAfterLoginRef.current) {
        hasMergedAfterLoginRef.current = true;
        mergeGuestCartToServer().finally(() => {
          fetchServerCart();
        });
      }
    } else {
      hasMergedAfterLoginRef.current = false;
    }
  }, [user?.token, authLoading]);

  const fetchProductForGuestCart = async (productId) => {
    const data = await apiRequest(`/api/products/${encodeURIComponent(productId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!data?.product) {
      throw new Error("Product not found");
    }

    return data.product;
  };

  const addToGuestCart = async ({ productId, qty = 1 }) => {
    const product = await fetchProductForGuestCart(productId);
    const currentItems = getGuestCartFromStorage();
    const existingIndex = currentItems.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (existingIndex > -1) {
      currentItems[existingIndex] = normalizeGuestItem({
        ...currentItems[existingIndex],
        quantity: toNumber(currentItems[existingIndex].quantity, 1) + Math.max(1, toNumber(qty, 1)),
      });
    } else {
      currentItems.push(buildGuestCartItemFromProduct(product, qty));
    }

    saveGuestCartToStorage(currentItems);
    setGuestCartState(currentItems);

    return {
      success: true,
      message: "Item added to cart",
    };
  };

  const addToCart = async ({ productId, qty = 1 }) => {
    try {
      setCartActionLoading(true);

      if (!user?.token) {
        return await addToGuestCart({ productId, qty });
      }

      const data = await apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productId,
          qty,
        }),
      });

      await fetchServerCart();
      return data;
    } finally {
      setCartActionLoading(false);
    }
  };

  const updateQty = async (itemId, quantity) => {
    try {
      setCartActionLoading(true);

      if (!user?.token) {
        const currentItems = getGuestCartFromStorage();
        const updatedItems = currentItems
          .map((item) =>
            item.id === itemId
              ? normalizeGuestItem({
                  ...item,
                  quantity: Math.max(1, toNumber(quantity, 1)),
                })
              : normalizeGuestItem(item)
          );

        saveGuestCartToStorage(updatedItems);
        setGuestCartState(updatedItems);

        return {
          success: true,
          message: "Quantity updated",
        };
      }

      const data = await apiRequest(`/api/cart/item/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity,
        }),
      });

      await fetchServerCart();
      return data;
    } finally {
      setCartActionLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setCartActionLoading(true);

      if (!user?.token) {
        const currentItems = getGuestCartFromStorage();
        const updatedItems = currentItems.filter((item) => item.id !== itemId);
        saveGuestCartToStorage(updatedItems);
        setGuestCartState(updatedItems);

        return {
          success: true,
          message: "Item removed from cart",
        };
      }

      const data = await apiRequest(`/api/cart/item/${itemId}`, {
        method: "DELETE",
      });

      await fetchServerCart();
      return data;
    } finally {
      setCartActionLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setCartActionLoading(true);

      if (!user?.token) {
        clearGuestCartStorage();
        setGuestCartState([]);

        return {
          success: true,
          message: "Cart cleared",
        };
      }

      const data = await apiRequest("/api/cart/clear", {
        method: "DELETE",
      });

      await fetchServerCart();
      return data;
    } finally {
      setCartActionLoading(false);
    }
  };
  const applyCoupon = async (code) => {
  try {
    setCartActionLoading(true);

    const couponCode = String(code || "").trim().toUpperCase();

    if (!couponCode) {
      return {
        success: false,
        message: "Please enter coupon code.",
      };
    }

    if (!user?.token) {
      return {
        success: false,
        needLogin: true,
        message: "Login required to apply coupon.",
      };
    }

    const data = await apiRequest("/api/cart/apply-coupon", {
      method: "POST",
      body: JSON.stringify({ code: couponCode }),
    });

    await fetchServerCart();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Coupon apply failed.",
    };
  } finally {
    setCartActionLoading(false);
  }
};

  const cartCount = useMemo(
    () => cartSummary?.itemCount || 0,
    [cartSummary]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary,
        cartCount,
        cartLoading,
        cartActionLoading,
        fetchCart,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        applyCoupon,
        mergeGuestCartToServer,
        isGuestCart: !user?.token,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}