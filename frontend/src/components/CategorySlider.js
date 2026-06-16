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
      categories.find((cat) => cat?.slug === slug && cat?.isActive !== false),
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
      <section
        className="w-full py-16"
        style={{
          background: "var(--theme-section-bg)",
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] animate-pulse shadow-sm"
                style={{
                  borderRadius: "var(--theme-card-radius)",
                  background: "var(--theme-card-bg)",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!visibleCategories.length) return null;

  return (
  <section className="w-full py-0">
      <div className="w-full px-4 sm:px-6 lg:px-10">
       <div className="mb-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow-sm"
            style={{
              border: "1px solid var(--theme-navbar-border)",
              background: "var(--theme-card-bg)",
              color: "var(--theme-primary)",
            }}>
            <Layers3 size={17} />
            Explore Product Families
          </div>

          <h2
            className="text-4xl font-black tracking-tight md:text-5xl"
            style={{
              color: "var(--theme-heading)",
            }}
          >
            Component Categories
          </h2>

          <p
            className="mx-auto mt-4 max-w-3xl text-lg leading-8"
            style={{
              color: "var(--theme-body)",
            }}
          >
            Explore industrial, electrical and electronic categories for
            procurement, repair, automation and embedded projects.
          </p>

          <div className="mt-4">
            <Link
              href="/category/semiconductors"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-[16px] font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{
                border: "1px solid var(--theme-navbar-border)",
                background: "var(--theme-menu-bg)",
                color: "var(--theme-heading)",
              }} >
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
            className="absolute left-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition lg:flex"
            style={{
              border: "1px solid var(--theme-navbar-border)",
              background: "var(--theme-card-bg)",
              color: "var(--theme-primary)",
            }}>
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
                  className="group flex h-full flex-col p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    borderRadius: "var(--theme-card-radius)",
                    border: "1px solid var(--theme-card-border)",
                    background: "var(--theme-product-card-bg)",
                  }}
                >
                  <div
                    className="mb-5 flex h-[140px] items-center justify-center rounded-[18px]"
                    style={{
                      border: "1px solid var(--theme-card-border)",
                      background: "var(--theme-background-alt)",
                    }}
                  >                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      className="h-[110px] object-contain"
                    />
                  </div>

                  <h3
                    className="text-[18px] font-black leading-tight"
                    style={{
                      color: "var(--theme-primary)",
                    }}
                  >
                    {cat.name}
                  </h3>

                  <p
                    className="mt-2 text-[13px] line-clamp-2"
                    style={{
                      color: "var(--theme-body)",
                    }}
                  >
                    {cat.description}
                  </p>

                  <span
                    className="mt-auto mb-1 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(90deg,
                     var(--theme-gradient2-start),
                      var(--theme-gradient2-end)
                           )`,
                    }}
                  >
                    View Category →
                  </span>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollSlider("right")}
            className="absolute right-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition lg:flex"
            style={{
              border: "1px solid var(--theme-navbar-border)",
              background: "var(--theme-card-bg)",
              color: "var(--theme-primary)",
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
