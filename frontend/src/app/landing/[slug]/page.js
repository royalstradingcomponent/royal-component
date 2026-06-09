import { API_BASE } from "@/lib/api";
import LandingPageView from "@/components/LandingPageView";

async function getPage(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/landing-pages/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.page || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const page = await getPage(slug);

  return {
    title: page?.seoTitle || page?.title || "Landing Page",
    description:
      page?.seoDescription ||
      page?.description ||
      "",
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const page = await getPage(slug);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Landing Page Not Found
      </div>
    );
  }

  return <LandingPageView page={page} />;
}