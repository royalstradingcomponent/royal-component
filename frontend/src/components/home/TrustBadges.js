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
    <section
      className="relative z-10"
      style={{
        borderTop: "1px solid var(--theme-border)",
        borderBottom: "1px solid var(--theme-border)",
        background: "var(--theme-surface)",
      }}
    >
      <div className="container-royal grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                borderRadius: "var(--theme-card-radius)",
                border: "1px solid var(--theme-card-border)",
                background: "var(--theme-card-bg)",
                color: "var(--theme-card-text)",
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:text-white"
                style={{
                  background: "var(--theme-menu-bg)",
                  color: "var(--theme-icon-color)",
                }}
              >
                <Icon size={23} />
              </div>

              <h2
                className="text-lg font-extrabold"
                style={{
                  color: "var(--theme-heading)",
                }}
              >
                {item.title}
              </h2>

              <p
                className="mt-2 text-sm leading-6"
                style={{
                  color: "var(--theme-body)",
                }}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}