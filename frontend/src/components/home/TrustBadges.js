import {
  ShieldCheck,
  Truck,
  ReceiptText,
  PackageCheck,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Genuine Components",
    text: "Original industrial, electrical and electronic products sourced from reliable suppliers.",
  },
  {
    icon: PackageCheck,
    title: "Wholesale Ready",
    text: "MOQ, stock visibility and bulk quantity support for business buyers.",
  },
  {
    icon: ReceiptText,
    title: "GST Invoice",
    text: "Business-ready GST billing support for factories, workshops and institutions.",
  },
  {
    icon: Truck,
    title: "Fast Procurement",
    text: "Quick support for urgent parts, repeat orders and project-based sourcing.",
  },
];

export default function TrustBadges() {
  return (
    <section className="relative z-10 border-y border-[#d9e8f5] bg-white">
      <div className="container-royal grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#38bdf8] hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dff3ff] text-[#0284c7] transition-all duration-300 group-hover:bg-[#0284c7] group-hover:text-white">
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
    </section>
  );
}