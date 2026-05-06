import { Star } from "lucide-react";

const reviews = [
  {
    name: "Procurement Manager",
    company: "Manufacturing Unit",
    text: "Royal Component makes industrial sourcing easier with clear categories, GST billing support and fast response for bulk requirements.",
  },
  {
    name: "Electronics Engineer",
    company: "Repair & Service Business",
    text: "The product discovery and part-based search experience is useful for engineers looking for ICs, modules and replacement components.",
  },
  {
    name: "Business Buyer",
    company: "Industrial Supplier",
    text: "Good platform for repeat procurement, wholesale quantity planning and technical component sourcing.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-[#f7fbff]">
      <div className="container-royal">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
            Customer Confidence
          </p>
          <h2 className="heading-section">Trusted by Industrial Buyers</h2>
          <p className="section-subtitle">
            Built for professional buyers who need genuine products, technical
            clarity and procurement support.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {reviews.map((item) => (
            <div
              key={item.name}
              className="rounded-[28px] border border-[#dbeafe] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex gap-1 text-[#f59e0b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-sm leading-7 text-[#52677d]">“{item.text}”</p>

              <div className="mt-5 border-t border-[#e6f1f8] pt-4">
                <h3 className="font-extrabold text-[#102033]">{item.name}</h3>
                <p className="mt-1 text-sm text-[#64748b]">{item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}