import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const points = [
  "Technical product clarity",
  "Bulk order friendly checkout",
  "Reliable category structure",
  "Business procurement support",
  "Fast search and discovery",
  "Trusted industrial supply focus",
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-[#f7fbff]">
      <div className="container-royal">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
              Why Choose Us
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-[#102033] md:text-5xl">
              A smarter way to buy industrial components online.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#52677d]">
              Royal Component is designed for buyers who need clear product
              discovery, technical confidence, business-ready billing and
              procurement support for hardware, electronics and industrial
              products.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-8 py-3 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#6d28d9] hover:to-[#1d4ed8]"
            >
              <span className="text-white">
                Start Sourcing
              </span>

              <ArrowRight
                size={18}
                className="text-white"
              />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {points.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CheckCircle2 className="shrink-0 text-[#0284c7]" size={22} />
                <span className="font-bold text-[#102033]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}