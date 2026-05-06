import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";

async function getPolicy(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/policies/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.page || null;
  } catch {
    return null;
  }
}

function getPolicyIcon(slug = "") {
  if (slug.includes("refund")) return RefreshCcw;
  if (slug.includes("return")) return PackageCheck;
  if (slug.includes("exchange")) return Truck;
  return ShieldCheck;
}

function getPolicyPoints(slug = "") {
  if (slug.includes("refund")) {
    return [
      "Refund timeline and approval process",
      "Payment reversal after verification",
      "Original payment method preferred",
      "Transparent support for every order",
    ];
  }

  if (slug.includes("exchange")) {
    return [
      "Exchange for wrong or defective products",
      "Replacement based on stock availability",
      "Original packaging and invoice required",
      "Business-friendly procurement support",
    ];
  }

  return [
    "Return for wrong, damaged or defective item",
    "Original invoice and packaging required",
    "Request must be raised within allowed window",
    "Quality verification before approval",
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = await getPolicy(slug);

  if (!policy) {
    return {
      title: "Page Not Found | Royal Component",
    };
  }

  const title = policy.seo?.metaTitle || `${policy.title} | Royal Component`;
  const description =
    policy.seo?.metaDescription ||
    policy.shortDescription ||
    "Royal Component policy page for industrial, electronic and electrical component buyers.";

  return {
    title,
    description,
    keywords: policy.seo?.metaKeywords || [],
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function DynamicPolicyPage({ params }) {
  const { slug } = await params;
  const policy = await getPolicy(slug);

  if (!policy) notFound();

  const PolicyIcon = getPolicyIcon(slug);
  const points = getPolicyPoints(slug);

  const sections = (policy.sections || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  const faqs = (policy.faqs || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-[#eef8ff] text-[#102033]">
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

      <Navbar />

      <main className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#bfe6ff] bg-white px-5 py-2.5 text-sm font-extrabold text-[#075985] shadow-sm transition hover:bg-[#f0fbff]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <section className="overflow-hidden rounded-[34px] border border-[#cdefff] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.09)]">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative p-7 sm:p-10 lg:p-14">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-[#e0f5ff]" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bfe6ff] bg-[#f0fbff] px-4 py-2 text-sm font-extrabold text-[#0369a1]">
                  <PolicyIcon size={18} />
                  Royal Component Policy
                </div>

                <h1 className="mt-6 max-w-4xl text-[34px] font-black leading-tight tracking-[-0.04em] text-[#0f172a] sm:text-[44px] lg:text-[58px]">
                  {policy.title}
                </h1>

                {policy.shortDescription ? (
                  <p className="mt-5 max-w-3xl text-[17px] leading-8 text-[#486581] lg:text-[19px]">
                    {policy.shortDescription}
                  </p>
                ) : null}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {points.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-[#dbeafe] bg-[#f8fcff] p-4"
                    >
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-[#0284c7]"
                        size={20}
                      />
                      <span className="text-sm font-bold leading-6 text-[#1e3a5f]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="bg-gradient-to-br from-[#dff4ff] via-[#f7fcff] to-white p-7 sm:p-10 lg:p-12">
              <div className="rounded-[28px] border border-[#cdefff] bg-white/85 p-6 shadow-sm backdrop-blur">
                <h2 className="text-xl font-black text-[#102033]">
                  Quick Policy Support
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex gap-3 rounded-2xl bg-[#f0fbff] p-4">
                    <Clock className="shrink-0 text-[#0284c7]" size={22} />
                    <div>
                      <p className="font-extrabold text-[#102033]">
                        Review Timeline
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Policy requests are checked with order details, invoice,
                        product condition and procurement status.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-2xl bg-[#f0fbff] p-4">
                    <Mail className="shrink-0 text-[#0284c7]" size={22} />
                    <div>
                      <p className="font-extrabold text-[#102033]">
                        Faster Support
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Keep order number, product images and issue details
                        ready before contacting support.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex w-full justify-center rounded-2xl bg-[#0284c7] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-sky-200 transition hover:bg-[#0369a1]"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {policy.content ? (
          <section className="mt-8 rounded-[30px] border border-[#dbeafe] bg-white p-6 shadow-sm md:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f5ff] text-[#0284c7]">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#102033]">
                Policy Overview
              </h2>
            </div>

            <div className="mt-6 whitespace-pre-line rounded-3xl bg-[#f8fcff] p-6 text-[16px] leading-9 text-[#334155]">
              {policy.content}
            </div>
          </section>
        ) : null}

        {sections.length > 0 ? (
          <section className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0284c7]">
              Details
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#102033]">
              Important Policy Information
            </h2>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {sections.map((section, index) => (
                <article
                  key={`${section.heading}-${index}`}
                  className="rounded-[28px] border border-[#dbeafe] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f5ff] text-[#0284c7]">
                    <ShieldCheck size={24} />
                  </div>

                  <h3 className="text-[22px] font-black text-[#102033]">
                    {section.heading}
                  </h3>

                  <p className="mt-4 whitespace-pre-line text-[15.5px] leading-8 text-[#475569]">
                    {section.content}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: PackageCheck,
              title: "Invoice Required",
              text: "Keep invoice, order ID and product images ready for any policy request.",
            },
            {
              icon: Truck,
              title: "B2B Procurement",
              text: "Special procurement, custom sourcing and bulk orders may follow separate conditions.",
            },
            {
              icon: ShieldCheck,
              title: "Quality Verification",
              text: "Every request is reviewed to protect genuine buyers and product authenticity.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[26px] border border-[#dbeafe] bg-white p-6 shadow-sm"
              >
                <Icon className="text-[#0284c7]" size={30} />
                <h3 className="mt-4 text-lg font-black text-[#102033]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>

        {faqs.length > 0 ? (
          <section className="mt-8 rounded-[30px] border border-[#dbeafe] bg-white p-6 shadow-sm md:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f5ff] text-[#0284c7]">
                <HelpCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0284c7]">
                  FAQs
                </p>
                <h2 className="text-3xl font-black text-[#102033]">
                  Frequently Asked Questions
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={`${faq.question}-${index}`}
                  className="group rounded-2xl border border-[#dbeafe] bg-[#f8fcff] p-5"
                >
                  <summary className="cursor-pointer list-none text-base font-black text-[#102033]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}