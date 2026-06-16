import { API_BASE } from "./api";

export async function getPromoBanners(
  position
) {
  try {
    const res = await fetch(
      `${API_BASE}/api/promo-banners/position/${position}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    return data.banners || [];
  } catch {
    return [];
  }
}