"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";

const OrderContext = createContext(null);

function getToken() {
  if (typeof window === "undefined") return null;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.token || null;
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const placeOrder = useCallback(async (payload) => {
    try {
      setActionLoading(true);

      const res = await axios.post(`${API_BASE}/api/orders`, payload, {
        headers: authHeaders(),
      });

      toast.success("Order placed successfully");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Order place failed";
      toast.error(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }, []);

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/orders/my-orders`, {
        headers: authHeaders(),
      });

      setOrders(res.data?.orders || []);
      return res.data?.orders || [];
    } catch (error) {
      console.error("Fetch orders error:", error);
      setOrders([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/orders/${orderId}`, {
        headers: authHeaders(),
      });

      setCurrentOrder(res.data?.order || null);
      return res.data?.order || null;
    } catch (error) {
      console.error("Fetch order error:", error);
      setCurrentOrder(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/orders/track/${orderId}`, {
        headers: authHeaders(),
      });

      return res.data?.order || null;
    } catch (error) {
      toast.error(error.response?.data?.message || "Order not found");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId, reason = "", comment = "") => {
    try {
      setActionLoading(true);

      const res = await axios.put(
        `${API_BASE}/api/orders/cancel/${orderId}`,
        { reason, comment },
        { headers: authHeaders() }
      );

      toast.success("Order cancelled successfully");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Cancel order failed";
      toast.error(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }, []);

  const cancelOrderItem = useCallback(
    async (orderId, itemId, reason = "", comment = "") => {
      try {
        setActionLoading(true);

        const res = await axios.put(
          `${API_BASE}/api/orders/cancel-item/${orderId}/${itemId}`,
          { reason, comment },
          { headers: authHeaders() }
        );

        toast.success("Item cancelled successfully");

        const updatedOrder = res.data?.order || null;

        if (updatedOrder) {
          setCurrentOrder(updatedOrder);

          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order
            )
          );
        }

        return updatedOrder;
      } catch (error) {
        const message =
          error.response?.data?.message || "Cancel item failed";
        toast.error(message);
        throw new Error(message);
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      orders,
      currentOrder,
      loading,
      actionLoading,
      placeOrder,
      fetchMyOrders,
      fetchOrderById,
      trackOrder,
      cancelOrder,
      cancelOrderItem,
    }),
    [
      orders,
      currentOrder,
      loading,
      actionLoading,
      placeOrder,
      fetchMyOrders,
      fetchOrderById,
      trackOrder,
      cancelOrder,
      cancelOrderItem,
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => useContext(OrderContext);