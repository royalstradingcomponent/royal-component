const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SERVER_API_BASE =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const API_BASE =
  typeof window === "undefined" ? SERVER_API_BASE : PUBLIC_API_BASE;

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}

export function getUserToken() {
  if (typeof window === "undefined") return null;

  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    const parsedUser = JSON.parse(rawUser);
    return parsedUser?.token || null;
  } catch {
    return null;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = options.admin ? getAdminToken() : getUserToken();

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: options.cache || "no-store",
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}

export async function adminRequest(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    admin: true,
  });
}