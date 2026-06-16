import { API_BASE } from "./api";

export async function getHomepageSections() {
  try {
    const res = await fetch(
      `${API_BASE}/api/homepage-builder/active`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    return data.sections || [];
  } catch {
    return [];
  }
}