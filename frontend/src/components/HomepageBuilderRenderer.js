import { API_BASE } from "@/lib/api";
import PromoBannerSection from "./PromoBannerSection";

async function getSections() {
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

export default async function HomepageBuilderRenderer() {
  const sections = await getSections();

  if (!sections.length) return null;

  return (
    <>
      {sections.map((section) => (
        <PromoBannerSection
          key={section._id}
          banners={section.banners}
        />
      ))}
    </>
  );
}