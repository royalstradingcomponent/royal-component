import { Factory, Wrench, FlaskConical, Building2 } from "lucide-react";

const industries = [
  {
    icon: Factory,
    title: "Factories & Plants",
    text: "Automation, switchgear, sensors, cables and maintenance components.",
  },
  {
    icon: Wrench,
    title: "Repair Shops",
    text: "Electronic parts, tools, connectors and replacement components.",
  },
  {
    icon: FlaskConical,
    title: "Labs & Projects",
    text: "Semiconductors, display modules, ICs and embedded project parts.",
  },
  {
    icon: Building2,
    title: "Business Buyers",
    text: "Bulk purchase, GST billing, repeat procurement and quote support.",
  },
];

export default function IndustriesServed() {
  return (
    <section className="section-padding bg-white">
      <div className="container-royal">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
            Who We Serve
          </p>

          <h2 className="heading-section">
            Built for Hardware & Industrial Buyers
          </h2>

          <p className="section-subtitle">
            From small repair needs to wholesale procurement, Royal Component
            supports multiple industrial buying use cases.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[28px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff3ff] text-[#0284c7]">
                  <Icon size={26} />
                </div>

                <h2 className="text-xl font-extrabold text-[#102033]">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#52677d]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}