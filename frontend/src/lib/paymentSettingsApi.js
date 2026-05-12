import { API_BASE } from "@/lib/api";

export async function getAdminPaymentSettings() {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    throw new Error("Admin token not found. Please login again.");
  }

  const res = await fetch(`${API_BASE}/api/payments/settings/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Payment settings fetch failed");
  }

  return data;
}

export async function updateAdminPaymentSettings(payload) {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    throw new Error("Admin token not found. Please login again.");
  }

  const res = await fetch(`${API_BASE}/api/payments/settings/admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Payment settings update failed");
  }

  return data.settings;
}