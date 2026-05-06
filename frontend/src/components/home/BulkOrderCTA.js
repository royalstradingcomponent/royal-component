import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const points = [
  "MOQ & wholesale quantity support",
  "Part number based sourcing",
  "GST invoice for business orders",
  "Support for repeat procurement",
];

export default function BulkOrderCTA() {
  return (
    <section className="section-padding bg-[#eef8ff]">
      <div className="container-royal overflow-hidden rounded-[34px] border border-[#cde8ff] bg-[linear-gradient(135deg,#08233f_0%,#075985_55%,#0ea5e9_100%)] p-8 text-white shadow-2xl md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              Bulk Procurement Support
            </p>

            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Need components in bulk for factory, repair or project supply?
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#dcefff]">
              Send your requirement list, part numbers, quantities or technical
              specifications. Royal Component helps you source industrial,
              electrical, automation and hardware products with reliable
              procurement support.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/quote-request"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-extrabold text-[#075985] transition hover:bg-[#e0f2fe]"
              >
                Request Bulk Quote <ArrowRight size={18} />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
              >
                Explore Products
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur">
            {points.map((text) => (
              <div key={text} className="mb-4 flex items-center gap-3 last:mb-0">
                <CheckCircle2 className="text-[#7dd3fc]" size={22} />
                <span className="font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}