"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers3, Grid3X3 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const fallbackImage = "/banner/new-products/banner-1.png";

const HOME_SEMICONDUCTOR_SLUGS = [
  "amplifierscomparators",
  "audiovideoics",
  "chipprogrammersdebuggers",
  "clocktimingfrequencyics",
  "communicationwirelessmoduleics",
  "dataconverters",
  "discretesemiconductors",
  "interfaceics",
  "logicics",
  "memorychips",
  "powermanagementics",
  "processorsmicrocontrollers",
  "programmablelogicics",
  "sensorics",
];

function getImageUrl(image) {
  if (!image) return fallbackImage;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return `${API_BASE}${image}`;
  if (image.startsWith("/")) return image;
  return `${API_BASE}/${image}`;
}

export default function CategorySlider() {
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const visibleCategories = useMemo(() => {
    return HOME_SEMICONDUCTOR_SLUGS.map((slug) =>
      categories.find((cat) => cat?.slug === slug && cat?.isActive !== false)
    ).filter(Boolean);
  }, [categories]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          cache: "no-store",
        });

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data?.categories || data?.data || [];

        setCategories(list);
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;

    const amount = Math.floor(window.innerWidth * 0.85);

    sliderRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="w-full bg-[#f5fbff] py-16">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] animate-pulse rounded-[28px] bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!visibleCategories.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#f5fbff] py-16">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b9defa] bg-white px-5 py-2 text-sm font-bold text-[#006bb6] shadow-sm">
            <Layers3 size={17} />
            Explore Product Families
          </div>

          <h2 className="text-4xl font-black tracking-tight text-[#0d1b33] md:text-5xl">
            Component Categories
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#46627f]">
            Explore industrial, electrical and electronic categories for
            procurement, repair, automation and embedded projects.
          </p>

          <div className="mt-7">
            <Link
              href="/category/semiconductors"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#8dccf7] bg-[#d8efff] px-8 py-3 text-[16px] font-black text-[#003b63] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#bfe5ff] hover:shadow-md"
            >
              <Grid3X3 size={18} />
              Explore All Categories
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        <div className="relative w-full">
          <button
            type="button"
            onClick={() => scrollSlider("left")}
            className="absolute left-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#b9defa] bg-white text-[#006bb6] shadow-lg transition hover:bg-[#eaf6ff] lg:flex"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {visibleCategories.map((cat) => {
              const slug = cat.slug || "";
              const href = `/category/semiconductors?subCategory=${slug}`;

              return (
                <Link
                  key={cat._id || slug}
                  href={href}
                  className="group flex flex-col rounded-[24px] border border-[#d7ebfb] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#38a9f4] hover:shadow-xl"
                >
                  <div className="mb-5 flex h-[140px] items-center justify-center rounded-[18px] border border-[#e0f0fb] bg-[#f5fbff]">
                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      className="h-[110px] object-contain"
                    />
                  </div>

                  <h3 className="text-[18px] font-black text-[#006bb6] leading-tight">
                    {cat.name}
                  </h3>

                  <p className="mt-2 text-[13px] text-[#46627f] line-clamp-2">
                    {cat.description}
                  </p>

                  <span className="mt-4 inline-block rounded-full bg-[#d8efff] px-4 py-2 text-xs font-bold">
                    View Category →
                  </span>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollSlider("right")}
            className="absolute right-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#b9defa] bg-white text-[#006bb6] shadow-lg transition hover:bg-[#eaf6ff] lg:flex"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}