"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileText, ShieldCheck, Truck, Wrench } from "lucide-react";
import { API_BASE } from "@/lib/api";

const fallbackSlides = [
  {
    image: "/banner/banner-1.png",
    label: "Bulk Procurement",
    title1: "Bulk Procurement For",
    title2: "Industrial Components",
    item: "Semiconductors, Sensors & Automation Parts",
    description:
      "Buy electrical, electronic, mechanical and automation components online with trusted brand sourcing, technical specifications, bulk quantity support and reliable B2B delivery across India.",
    primaryText: "Shop Components",
    primaryLink: "/products",
    secondaryText: "Request Bulk Quote",
    secondaryLink: "/quote-request",
  },
];

const trustItems = [
  { icon: ShieldCheck, text: "Trusted industrial sourcing" },
  { icon: Truck, text: "Bulk order support" },
  { icon: Wrench, text: "Technical product guidance" },
];

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

export default function Hero() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedTitle1, setTypedTitle1] = useState("");
  const [typedTitle2, setTypedTitle2] = useState("");
  const [typedItem, setTypedItem] = useState("");

  const activeSlide = useMemo(() => {
    return slides[currentSlide] || slides[0] || fallbackSlides[0];
  }, [slides, currentSlide]);

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/hero-slides`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success && Array.isArray(data.slides) && data.slides.length) {
          const activeSlides = data.slides
            .filter((slide) => slide.isActive !== false)
            .sort(
              (a, b) =>
                Number(a.order || 0) - Number(b.order || 0) ||
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );

          if (activeSlides.length) {
            setSlides(activeSlides);
            setCurrentSlide(0);
          }
        }
      } catch (error) {
        console.error("Hero slides fetch error:", error);
      }
    };

    fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [slides]);

  useEffect(() => {
    const fullTitle1 = activeSlide?.title1 || "";
    const fullTitle2 = activeSlide?.title2 || "";
    const fullItem = activeSlide?.item || "";

    setTypedTitle1("");
    setTypedTitle2("");
    setTypedItem("");

    let title1Index = 0;
    let title2Index = 0;
    let itemIndex = 0;

    let title2Timer = null;
    let itemTimer = null;

    const title1Timer = setInterval(() => {
      title1Index += 1;
      setTypedTitle1(fullTitle1.slice(0, title1Index));

      if (title1Index >= fullTitle1.length) {
        clearInterval(title1Timer);

        title2Timer = setInterval(() => {
          title2Index += 1;
          setTypedTitle2(fullTitle2.slice(0, title2Index));

          if (title2Index >= fullTitle2.length) {
            clearInterval(title2Timer);

            itemTimer = setInterval(() => {
              itemIndex += 1;
              setTypedItem(fullItem.slice(0, itemIndex));

              if (itemIndex >= fullItem.length) {
                clearInterval(itemTimer);
              }
            }, 28);
          }
        }, 28);
      }
    }, 28);

    return () => {
      clearInterval(title1Timer);
      if (title2Timer) clearInterval(title2Timer);
      if (itemTimer) clearInterval(itemTimer);
    };
  }, [activeSlide]);

  return (
    <section className="relative isolate min-h-[650px] overflow-hidden bg-white sm:min-h-[590px] md:min-h-[560px] lg:min-h-[540px]">
      {slides.map((slide, index) => (
        <div
          key={slide._id || slide.image || index}
          className={`absolute inset-0 bg-cover bg-[78%_center] transition-opacity duration-700 sm:bg-[72%_center] md:bg-center ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${getImageUrl(slide.image)}')`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/88 to-white/55 sm:from-white/96 sm:via-white/80 sm:to-white/25 lg:from-white/90 lg:via-white/65 lg:to-transparent" />

      <div className="container-royal relative z-10 flex min-h-[650px] items-center px-4 py-8 sm:min-h-[590px] sm:px-6 md:min-h-[560px] lg:min-h-[540px]">
        <div className="w-full max-w-[760px]">
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#bae6fd] bg-white/90 px-3 py-2 text-[11px] font-bold text-[#0f172a] shadow-sm sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#1296db]" />
            <span className="truncate">
              {activeSlide?.label || "Trusted Industrial Components"} • Fast
              Procurement • B2B Supply
            </span>
          </div>

          <h1 className="max-w-3xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-[44px] md:text-[50px] lg:text-[56px]">
            <span className="bg-gradient-to-r from-[#06152f] via-[#0f5f99] to-[#1296db] bg-clip-text text-transparent">
              {typedTitle1}
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#1296db] via-[#0f5f99] to-[#06152f] bg-clip-text text-transparent">
              {typedTitle2}
            </span>
          </h1>

          <div className="mt-4 text-[18px] font-extrabold sm:text-[22px] md:text-[24px]">
            <span className="text-[#0f172a]">We supply </span>
            <span className="inline-block bg-gradient-to-r from-[#1d4ed8] to-[#38bdf8] bg-clip-text text-transparent">
              {typedItem}
            </span>
          </div>

          <div className="mt-2 text-[13px] font-semibold text-[#475569] sm:text-[14px]">
            Wholesale rates • Bulk procurement • Fast B2B delivery
          </div>

          <p className="mt-4 max-w-2xl text-[14px] leading-7 text-[#334155] sm:text-[16px] md:text-[17px]">
            {activeSlide?.description ||
              "Source electrical, electronic, mechanical, automation and hardware products with technical clarity, trusted brand availability and reliable wholesale supply support."}
          </p>

          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Link
              href={activeSlide?.primaryLink || "/products"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#38bdf8] px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:-translate-y-0.5 hover:from-[#1e40af] hover:to-[#0ea5e9] sm:w-auto sm:px-7 sm:py-3.5"
            >
              {activeSlide?.primaryText || "Shop Components"}
              <ArrowRight size={18} />
            </Link>

            <Link
              href={activeSlide?.secondaryLink || "/quote-request"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#bae6fd] bg-[#dff2ff] px-6 py-3 text-sm font-extrabold text-[#274967] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#cfeeff] sm:w-auto sm:px-7 sm:py-3.5"
            >
              <FileText size={18} />
              {activeSlide?.secondaryText || "Request Bulk Quote"}
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white/95 px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e0f2fe] text-[#0284c7]">
                    <Icon size={18} />
                  </span>
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide._id || slide.image || index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-[#0f172a]"
                  : "w-2.5 bg-[#94a3b8]"
              }`}
              type="button"
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}