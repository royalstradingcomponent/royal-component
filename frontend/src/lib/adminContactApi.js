import { API_BASE } from "@/lib/api";

function getAdminToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("adminToken") || "";
}

export async function getAdminContactPage() {
  const res = await fetch(`${API_BASE}/api/contact-page/admin`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load contact page");
  }

  return data.page;
}

export async function updateAdminContactPage(payload) {
  const res = await fetch(`${API_BASE}/api/contact-page/admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update contact page");
  }

  return data.page;
}