import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageSearch } from "lucide-react";

const points = [
  "Part number sourcing",
  "Bulk quantity support",
  "Genuine components",
  "Fast procurement",
];

export default function ProcurementInfoBanner() {
  return (
    <section className="bg-white py-10">
      <div className="container-royal">
        <div className="overflow-hidden rounded-[28px] border border-[#dbeafe] bg-[#f7fbff] shadow-[0_14px_38px_rgba(15,23,42,0.07)]">
          <div className="grid lg:grid-cols-2">
            {/* LEFT IMAGE */}
            <div className="relative min-h-[220px] bg-[#eaf7ff] sm:min-h-[260px] lg:min-h-[340px]">
              <Image
                src="/banner/procurement-support-banner.png"
                alt="Industrial electronic components procurement support"
                fill
                priority={false}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#08233f]/10 via-transparent to-transparent" />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#b9e6fb] bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#0284c7]">
                <PackageSearch size={15} />
                Procurement Support
              </p>

              <h2 className="text-2xl font-black leading-tight text-[#102033] md:text-4xl">
                Source industrial components with confidence.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#52677d] md:text-base">
                Royal Component helps buyers source semiconductors, automation,
                electrical and hardware components with bulk procurement support.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {points.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-[#dbeafe] bg-white px-3 py-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-[#0284c7]"
                    />
                    <span className="text-sm font-bold text-[#23435b]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0284c7] px-6 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#0369a1]"
                >
                  Explore Products <ArrowRight size={17} />
                </Link>

                <Link
                  href="/quote-request"
                  className="inline-flex items-center gap-2 rounded-full border border-[#b6dcff] bg-[#dff2ff] px-6 py-2.5 text-sm font-extrabold text-[#075985] transition hover:bg-[#cfeeff]"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}