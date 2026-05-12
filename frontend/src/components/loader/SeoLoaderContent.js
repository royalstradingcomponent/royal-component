"use client";

import Link from "next/link";
import {
  Cpu,
  Cable,
  Factory,
  PackageSearch,
  LoaderCircle,
  ShieldCheck,
  Zap,
  Boxes,
} from "lucide-react";

const iconMap = {
  Cpu,
  Cable,
  Factory,
  PackageSearch,
  ShieldCheck,
  Zap,
  Boxes,
};

const fallbackLoader = {
  title: "Industrial Electronics & Semiconductor Marketplace",
  subtitle: "Global electronic component sourcing and procurement platform",
  description:
    "Royal Component supplies semiconductors, automation products, industrial electronics, relays, sensors, ICs, PLC systems, connectors, cables and OEM procurement solutions.",
  seoHeading: "Online Industrial Component Sourcing Made Easy",
  seoParagraph:
    "Royal Component helps engineers, OEM buyers, distributors, factories and procurement teams source genuine electronic components, industrial automation parts, embedded systems, connectors, power modules and semiconductor products.",
  bottomContent:
    "Buy semiconductors, connectors, sensors, relays, switches, power modules, cables and industrial electronic hardware with bulk procurement assistance.",
  keywords: [
    { label: "Semiconductors", link: "/products?category=semiconductors" },
    { label: "Industrial Automation", link: "/products?category=automation" },
    { label: "Connectors", link: "/products?category=connectors" },
    { label: "Power Electronics", link: "/products" },
    { label: "Sensors", link: "/products" },
  ],
  cards: [
    {
      title: "Semiconductors",
      description:
        "ICs, microcontrollers, MOSFETs, diodes, transistors and industrial-grade electronic chips.",
      icon: "Cpu",
      link: "/products?category=semiconductors",
    },
    {
      title: "Bulk Procurement",
      description:
        "Fast sourcing support for OEM, factories, repair teams and distributors.",
      icon: "PackageSearch",
      link: "/request-component",
    },
    {
      title: "Automation Components",
      description:
        "Relays, sensors, PLC accessories, switches, control modules and panel parts.",
      icon: "Factory",
      link: "/products",
    },
  ],
  trustedBrands: [
    { name: "ABB" },
    { name: "Siemens" },
    { name: "Schneider Electric" },
    { name: "Texas Instruments" },
    { name: "Panasonic" },
  ],
};

export default function SeoLoaderContent({ loader }) {
  const data = loader || fallbackLoader;

  const keywords = (data.keywords || fallbackLoader.keywords).filter(
    (item) => item?.label
  );

  const cards = (data.cards || fallbackLoader.cards)
    .filter((item) => item?.isActive !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  const brands = (data.trustedBrands || fallbackLoader.trustedBrands)
    .filter((item) => item?.isActive !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8fcff] px-4 py-8 text-[#102033] sm:px-6 lg:px-10">
      <div className="absolute left-8 top-10 h-32 w-32 rounded-full border-[14px] border-[#dff2ff]" />
      <div className="absolute right-10 bottom-10 h-44 w-44 rounded-full border-[16px] border-[#dff2ff]" />
      <div className="absolute right-24 top-20 h-8 w-8 rounded-full bg-[#b8e7ff]" />
      <div className="absolute left-1/4 bottom-20 h-5 w-5 rounded-full bg-[#93d8ff]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid min-h-[72vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#c7e8ff] bg-white px-5 py-3 text-sm font-extrabold text-[#0b6aa2] shadow-sm">
              <LoaderCircle className="animate-spin" size={18} />
              Loading Royal Component Marketplace
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-[#102033] md:text-6xl">
              {data.title}
            </h1>

            <h2 className="mt-4 text-xl font-extrabold leading-snug text-[#2454b5] md:text-2xl">
              {data.subtitle}
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
              {data.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {keywords.slice(0, 10).map((item, index) => {
                const chip = (
                  <span className="inline-flex rounded-full border border-[#bde3ff] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#2454b5] shadow-sm">
                    {item.label}
                  </span>
                );

                return item.link ? (
                  <Link key={index} href={item.link}>
                    {chip}
                  </Link>
                ) : (
                  <span key={index}>{chip}</span>
                );
              })}
            </div>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-[#dff2ff]">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-[#2454b5]" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.slice(0, 4).map((card, index) => {
              const Icon = iconMap[card.icon] || Cpu;

              return (
                <Link
                  key={`${card.title}-${index}`}
                  href={card.link || "/products"}
                  className="group rounded-[28px] border border-[#d8ebfb] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-[#eef7ff] p-4 text-[#2454b5]">
                    <Icon size={30} />
                  </div>

                  <h3 className="text-lg font-black text-[#102033]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                </Link>
              );
            })}

            <div className="rounded-[28px] border border-[#d8ebfb] bg-[#102033] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-4">
                <Cable size={30} />
              </div>
              <h3 className="text-lg font-black">Fast Loading Catalogue</h3>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Preparing product categories, component data, stock status,
                technical details and procurement links.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[30px] border border-[#d8ebfb] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Factory className="text-[#2454b5]" />
              <h3 className="text-xl font-black text-[#102033]">
                {data.seoHeading}
              </h3>
            </div>

            <p className="mt-5 text-sm leading-8 text-slate-700 md:text-base">
              {data.seoParagraph}
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-700 md:text-base">
              {data.bottomContent}
            </p>
          </div>

          <div className="rounded-[30px] border border-[#d8ebfb] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-[#102033]">
              Trusted Industrial Brands
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {brands.slice(0, 12).map((brand, index) => (
                <span
                  key={`${brand.name}-${index}`}
                  className="rounded-full bg-[#eef7ff] px-3 py-2 text-xs font-extrabold text-[#2454b5]"
                >
                  {brand.name}
                </span>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Searching genuine parts, procurement availability, technical
              documents and electronics sourcing options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}