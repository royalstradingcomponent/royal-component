import Link from "next/link";
import {
  ArrowRight,
  SearchCheck,
  BadgeIndianRupee,
  ReceiptText,
  PackageCheck,
} from "lucide-react";

const cards = [
  {
    icon: SearchCheck,
    title: "Part Number Search",
    text: "Find products by category, brand, SKU, MPN or technical requirement.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Wholesale Pricing",
    text: "Ideal for bulk orders, repeat purchase and B2B procurement.",
  },
  {
    icon: ReceiptText,
    title: "GST Billing",
    text: "Proper invoice support for companies and professional buyers.",
  },
  {
    icon: PackageCheck,
    title: "Procurement Support",
    text: "Support for urgent, hard-to-find and project-based products.",
  },
];

export default function SeoIntroSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-royal">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
              Industrial Procurement Store
            </p>

            <h1 className="text-3xl font-extrabold leading-tight text-[#102033] md:text-5xl">
              Buy industrial electrical, electronic and hardware components online.
            </h1>

            <p className="mt-5 text-base leading-8 text-[#52677d]">
              Royal Component helps factories, workshops, engineers, repair
              businesses, labs and hardware buyers source reliable industrial
              products including automation parts, sensors, switchgear,
              semiconductors, PLC parts, cables, connectors, tools and
              electrical accessories.
            </p>

            <p className="mt-4 text-base leading-8 text-[#52677d]">
              Our platform is built for B2B buyers who need bulk procurement,
              GST invoice support, technical product clarity, wholesale-ready
              pricing and category-based product discovery.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#0284c7] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#0369a1]"
              >
                Explore Products <ArrowRight size={18} />
              </Link>

              <Link
                href="/quote-request"
                className="inline-flex items-center gap-2 rounded-full border border-[#b6dcff] bg-[#dff2ff] px-8 py-3 text-sm font-extrabold text-[#075985] transition hover:bg-[#cfeeff]"
              >
                Request Bulk Quote
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {cards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dff3ff] text-[#0284c7]">
                    <Icon size={23} />
                  </div>

                  <h2 className="text-lg font-extrabold text-[#102033]">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#52677d]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}