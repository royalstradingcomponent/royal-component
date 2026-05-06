import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const blogs = [
  {
    title: "How to choose the right semiconductor components for industrial use",
    desc: "Learn how engineers and buyers can compare ICs, MOSFETs, sensors and controllers for reliable sourcing.",
    href: "/blog/choose-right-semiconductor-components",
  },
  {
    title: "Why GST invoice and bulk procurement support matter for B2B buyers",
    desc: "Understand how professional procurement workflows help factories, workshops and companies manage purchases.",
    href: "/blog/bulk-procurement-gst-invoice-support",
  },
  {
    title: "Industrial automation components buying guide",
    desc: "Explore key categories such as sensors, relays, switchgear, cables, PLC parts and control components.",
    href: "/blog/industrial-automation-components-guide",
  },
];

export default function LatestBlogs() {
  return (
    <section className="section-padding bg-white">
      <div className="container-royal">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#0284c7]">
              Technical Resources
            </p>
            <h2 className="heading-section">Industrial Buying Guides</h2>
            <p className="section-subtitle !mx-0">
              SEO-focused guides for engineers, buyers and industrial sourcing teams.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#b6dcff] bg-[#dff2ff] px-6 py-3 text-sm font-extrabold text-[#075985] transition hover:bg-[#cfeeff]"
          >
            View All Guides <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.title}
              href={blog.href}
              className="group rounded-[28px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dff3ff] text-[#0284c7]">
                <BookOpen size={23} />
              </div>

              <h3 className="text-xl font-extrabold leading-snug text-[#102033] group-hover:text-[#0284c7]">
                {blog.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#52677d]">
                {blog.desc}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#0284c7]">
                Read Guide <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}