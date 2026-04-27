"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

const AddressContext = createContext(null);

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

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/users/address`, {
        headers: authHeaders(),
      });

      const list = res.data?.addresses || [];
      setAddresses(list);

      const defaultAddress = list.find((item) => item.isDefault) || list[0];
      if (defaultAddress?._id) {
        setSelectedAddressId(String(defaultAddress._id));
      }

      return list;
    } catch (error) {
      console.error("Address fetch error:", error);
      setAddresses([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (payload) => {
    try {
      setActionLoading(true);

      const res = await axios.post(`${API_BASE}/api/users/address`, payload, {
        headers: authHeaders(),
      });

      const list = res.data?.addresses || [];
      setAddresses(list);

      const defaultAddress = list.find((item) => item.isDefault) || list[list.length - 1];
      if (defaultAddress?._id) {
        setSelectedAddressId(String(defaultAddress._id));
      }

      toast.success("Address added successfully");
      return list;
    } catch (error) {
      toast.error(error.response?.data?.message || "Address add failed");
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (id, payload) => {
    try {
      setActionLoading(true);

      const res = await axios.put(`${API_BASE}/api/users/address/${id}`, payload, {
        headers: authHeaders(),
      });

      const list = res.data?.addresses || [];
      setAddresses(list);

      toast.success("Address updated successfully");
      return list;
    } catch (error) {
      toast.error(error.response?.data?.message || "Address update failed");
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (id) => {
    try {
      setActionLoading(true);

      await axios.delete(`${API_BASE}/api/users/address/${id}`, {
        headers: authHeaders(),
      });

      const list = await fetchAddresses();

      if (String(selectedAddressId) === String(id)) {
        const defaultAddress = list.find((item) => item.isDefault) || list[0];
        setSelectedAddressId(defaultAddress?._id ? String(defaultAddress._id) : "");
      }

      toast.success("Address deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Address delete failed");
    } finally {
      setActionLoading(false);
    }
  }, [fetchAddresses, selectedAddressId]);

  const setDefaultAddress = useCallback(async (id) => {
    try {
      setActionLoading(true);

      await axios.patch(`${API_BASE}/api/users/address/default/${id}`, {}, {
        headers: authHeaders(),
      });

      setSelectedAddressId(String(id));
      await fetchAddresses();

      toast.success("Default address updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Default update failed");
    } finally {
      setActionLoading(false);
    }
  }, [fetchAddresses]);

  const selectedAddress = useMemo(() => {
    return addresses.find((item) => String(item._id) === String(selectedAddressId)) || null;
  }, [addresses, selectedAddressId]);

  const value = useMemo(
    () => ({
      addresses,
      selectedAddress,
      selectedAddressId,
      setSelectedAddressId,
      loading,
      actionLoading,
      fetchAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
    }),
    [
      addresses,
      selectedAddress,
      selectedAddressId,
      loading,
      actionLoading,
      fetchAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
    ]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export const useAddress = () => useContext(AddressContext);