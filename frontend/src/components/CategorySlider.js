"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Layers3 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://royal-component-backend.onrender.com";

function getImageUrl(url) {
  if (!url) return "/service-icons/ezbill.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data?.success) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f7fcff] via-[#eef8ff] to-[#eaf5fd] py-16 sm:py-20">
      {/* soft decorative blur */}
      <div className="pointer-events-none absolute left-[-80px] top-[-80px] h-[220px] w-[220px] rounded-full bg-[#bae6fd]/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-60px] h-[240px] w-[240px] rounded-full bg-[#7dd3fc]/20 blur-3xl" />

      <div className="container-royal relative z-10">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cfe8f7] bg-white/80 px-4 py-2 text-sm font-semibold text-[#0f6cbd] shadow-sm backdrop-blur">
            <Layers3 size={16} />
            Explore Product Families
          </div>

          <h2 className="text-[32px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[42px] lg:text-[52px]">
            Component Categories
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-8 text-[#4f6f86] sm:text-[18px]">
            Explore industrial, electrical and electronic categories for
            procurement, repair, automation and embedded projects.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-[320px] animate-pulse rounded-[28px] border border-[#d9edf8] bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((item) => (
              <Link
                key={item._id || item.slug}
                href={`/category/${item.slug}`}
                className="group relative overflow-hidden rounded-[28px] border border-[#d7ebf8] bg-white/95 px-6 py-7 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#8fd3ff] hover:shadow-[0_18px_45px_rgba(15,108,189,0.14)]"
              >
                {/* top hover glow */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#38bdf8] via-[#0f6cbd] to-[#38bdf8] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* image wrapper */}
                <div className="mb-6 flex h-[160px] w-full items-center justify-center rounded-[22px] border border-[#e8f4fb] bg-gradient-to-b from-[#f9fdff] to-[#eff8fe] p-4">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.iconAlt || item.name}
                    className="max-h-[120px] w-auto max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* content */}
                <h3 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#0f6cbd] transition-colors duration-300 group-hover:text-[#0b5ca0]">
                  {item.name}
                </h3>

                {item.description ? (
                  <p className="mt-4 line-clamp-3 min-h-[84px] text-[15px] leading-7 text-[#56758c]">
                    {item.description}
                  </p>
                ) : (
                  <p className="mt-4 min-h-[84px] text-[15px] leading-7 text-[#56758c]">
                    Explore quality products, industrial-grade inventory and
                    category-specific sourcing options.
                  </p>
                )}

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d7ebf8] bg-[#f4fbff] px-4 py-2 text-sm font-semibold text-[#0f6cbd] transition-all duration-300 group-hover:border-[#b9e6fb] group-hover:bg-[#eaf7ff]">
                  View Category
                  <ChevronRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#d7ebf8] bg-white p-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h3 className="text-[22px] font-bold text-[#0f172a]">
              No categories available right now
            </h3>
            <p className="mt-3 text-[15px] text-[#6b879b]">
              Please check again later for updated product categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}