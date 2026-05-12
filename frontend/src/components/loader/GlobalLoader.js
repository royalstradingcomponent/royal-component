"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import SeoLoaderContent from "./SeoLoaderContent";

export default function GlobalLoader() {
  const [loader, setLoader] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchLoader = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/seo-loader`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (mounted) {
          setLoader(data?.loader || null);
        }
      } catch (error) {
        console.error("SEO LOADER FETCH ERROR:", error);
      }
    };

    fetchLoader();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fcff]">
      <SeoLoaderContent loader={loader} />
    </div>
  );
}