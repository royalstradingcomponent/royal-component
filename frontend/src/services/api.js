import { apiRequest, API_BASE } from "@/lib/api";

export { apiRequest, API_BASE };

export async function getFeaturedProducts() {
  const data = await apiRequest("/api/products/featured", {
    cache: "no-store",
  });
  return data?.products || [];
}

export async function getProducts(query = "") {
  const endpoint = query ? `/api/products?${query}` : "/api/products";
  const data = await apiRequest(endpoint, { cache: "no-store" });
  return data?.products || [];
}

export async function getProductBySlug(slug) {
  const data = await apiRequest(`/api/products/slug/${slug}`, {
    cache: "no-store",
  });
  return data?.product || null;
}