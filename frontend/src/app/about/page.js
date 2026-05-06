import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Cpu,
  Factory,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  Layers,
  SearchCheck,
  ClipboardCheck,
  Headphones,
  HelpCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";

async function getAboutPage() {
  try {
    const res = await fetch(`${API_BASE}/api/about-page`, {
      cache: "no-store",
    });

    const data = await res.json();
    return data?.page || null;
  } catch {
    return null;
  }
}

function getImageUrl(url) {
  if (!url) return "/banner/royal-hero-banner.jpg";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export async function generateMetadata() {
  const page = await getAboutPage();

  return {
    title:
      page?.seo?.metaTitle ||
      "About Royal Component | Industrial Components Supplier",
    description:
      page?.seo?.metaDescription ||
      "Royal Component is a trusted industrial electronics, electrical, mechanical and automation component supplier.",
    keywords: page?.seo?.metaKeywords || [],
  };
}

const defaultItems = {
  productGroups: [],
  capabilities: [],
  qualityProcess: [],
  industries: [],
  whyChooseUs: [],
  faq: [],
};

export default async function AboutPage() {
  const page = await getAboutPage();

  if (!page) {
    return (
      <div className="min-h-screen bg-[#f5fbff]">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-3xl font-black text-[#0f172a]">
            About page content not available
          </h1>
        </main>
        <Footer />
      </div>
    );
  }

  const productGroups = page.productGroups || defaultItems.productGroups;
  const capabilities = page.capabilities || defaultItems.capabilities;
  const qualityProcess = page.qualityProcess || defaultItems.qualityProcess;
  const industries = page.industries || defaultItems.industries;
  const whyChooseUs = page.whyChooseUs || defaultItems.whyChooseUs;
  const faq = page.faq || defaultItems.faq;

  return (
    <div className="min-h-screen bg-[#f5fbff] text-[#0f172a]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-[#dbeafe] bg-gradient-to-br from-white via-[#eff9ff] to-[#dff3ff]">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-extrabold text-[#075985] shadow-sm">
                <Sparkles size={16} />
                {page.hero?.badge}
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#082f49] md:text-6xl">
                {page.hero?.title}
              </h1>

              <h2 className="mt-4 text-2xl font-black leading-snug text-[#0284c7] md:text-4xl">
                {page.hero?.highlight}
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                {page.hero?.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={page.hero?.primaryButtonLink || "/products"}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#0ea5e9] px-7 py-4 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5"
                >
                  {page.hero?.primaryButtonText || "Explore Products"}
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href={page.hero?.secondaryButtonLink || "/request-component"}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-7 py-4 text-sm font-black text-[#075985] shadow-sm transition hover:-translate-y-0.5"
                >
                  <PackageSearch size={18} />
                  {page.hero?.secondaryButtonText || "Request Component"}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-r from-sky-300/40 to-blue-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-white bg-white shadow-2xl">
                <img
                  src={getImageUrl(page.hero?.image)}
                  alt={page.hero?.title || "About Royal Component"}
                  className="h-[360px] w-full object-cover md:h-[520px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto -mt-8 max-w-7xl px-4 md:px-6">
          <div className="relative z-10 grid gap-4 rounded-[28px] border border-sky-100 bg-white p-4 shadow-xl md:grid-cols-4">
            {(page.stats || []).map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#dbeafe] bg-[#f8fcff] p-6 text-center"
              >
                <div className="text-3xl font-black text-[#0284c7]">
                  {item.value}
                </div>
                <div className="mt-2 text-sm font-bold text-slate-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[30px] border border-sky-100 bg-white shadow-lg">
            <img
              src={getImageUrl(page.overview?.image)}
              alt={page.overview?.title || "Royal Component Overview"}
              className="h-full min-h-[430px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-[#075985]">
              <Building2 size={16} />
              Company Overview
            </div>

            <h2 className="text-3xl font-black text-[#082f49] md:text-5xl">
              {page.overview?.title}
            </h2>

            <p className="mt-6 text-lg leading-9 text-slate-700">
              {page.overview?.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                { icon: ShieldCheck, text: "Trusted sourcing support" },
                { icon: Truck, text: "Bulk B2B procurement" },
                { icon: Cpu, text: "Electronics expertise" },
                { icon: Wrench, text: "Industrial application focus" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
                  >
                    <span className="rounded-xl bg-sky-100 p-3 text-[#0284c7]">
                      <Icon size={20} />
                    </span>
                    <span className="font-extrabold text-slate-700">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-[34px] border border-[#dbeafe] bg-gradient-to-br from-[#eff9ff] to-white p-6 shadow-xl md:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#075985] shadow-sm">
                    <Cpu size={17} />
                    Electronics Department
                  </div>

                  <h2 className="text-3xl font-black text-[#082f49] md:text-5xl">
                    {page.electronicsDepartment?.title}
                  </h2>

                  <p className="mt-5 text-lg leading-9 text-slate-700">
                    {page.electronicsDepartment?.description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {(page.electronicsDepartment?.points || []).map(
                    (point, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
                      >
                        <CheckCircle2
                          size={22}
                          className="mt-1 shrink-0 text-[#0284c7]"
                        />
                        <p className="font-bold leading-7 text-slate-700">
                          {point}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <LandingGrid
          badge="Product Range"
          title="Complete Industrial Component Categories"
          description="Royal Component supports multiple departments required by electronics manufacturing, electrical maintenance, machine automation, repair service and procurement teams."
          items={productGroups}
          icon={Layers}
        />

        <LandingGrid
          badge="Capabilities"
          title="Procurement Capabilities Built for B2B Buyers"
          description="From part-number based sourcing to bulk order handling, our process is designed for serious business buyers who need accuracy, speed and reliability."
          items={capabilities}
          icon={SearchCheck}
          light
        />

        <ProcessSection items={qualityProcess} />

        <section className="bg-[#eef8ff] py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#075985] shadow-sm">
                <Factory size={17} />
                Industries We Support
              </div>
              <h2 className="text-3xl font-black text-[#082f49] md:text-5xl">
                Built for Industrial Buyers
              </h2>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-sky-100 bg-white p-5 font-extrabold text-slate-700 shadow-sm"
                >
                  <BadgeCheck className="mb-3 text-[#0284c7]" size={24} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="rounded-[34px] bg-[#082f49] p-8 text-white shadow-2xl md:p-12">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-sky-100">
                  <ShieldCheck size={17} />
                  Why Choose Us
                </div>

                <h2 className="text-3xl font-black md:text-5xl">
                  Why Choose Royal Component?
                </h2>
                <p className="mt-5 text-lg leading-8 text-sky-100">
                  We are focused on professional industrial procurement, where
                  product accuracy, technical clarity, sourcing reliability and
                  bulk order support matter the most.
                </p>
              </div>

              <div className="grid gap-4">
                {whyChooseUs.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <CheckCircle2 className="shrink-0 text-sky-300" />
                    <span className="font-bold text-sky-50">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FaqSection faq={faq} />

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <div className="overflow-hidden rounded-[36px] border border-sky-100 bg-gradient-to-br from-white via-[#eff9ff] to-[#dff3ff] p-8 text-[#082f49] shadow-2xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-black md:text-5xl">
                  {page.cta?.title || "Need Industrial Components for Your Business?"}
                </h2>
                <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-blue-50">
                  {page.cta?.description}
                </p>
              </div>

              <div className="flex lg:justify-end">
                <Link
                  href={page.cta?.buttonLink || "/request-component"}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-[#075985] shadow-xl"
                >
                  {page.cta?.buttonText || "Request Component"}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function LandingGrid({ badge, title, description, items, icon: Icon, light }) {
  return (
    <section className={light ? "bg-[#eef8ff] py-16" : "bg-white py-16"}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#075985] shadow-sm">
            <Icon size={17} />
            {badge}
          </div>
          <h2 className="text-3xl font-black text-[#082f49] md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(items || []).map((item, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-[#0284c7]">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-black text-[#082f49]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ items }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[36px] border border-sky-100 bg-gradient-to-br from-[#f8fcff] to-white p-6 shadow-xl md:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-[#075985]">
              <ClipboardCheck size={17} />
              Quality Process
            </div>
            <h2 className="text-3xl font-black text-[#082f49] md:text-5xl">
              From Requirement to Dispatch
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Every industrial component request needs accuracy. Our process is
              designed to reduce sourcing confusion and improve procurement
              confidence.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(items || []).map((item, index) => (
              <div key={index} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0284c7] text-xl font-black text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-black text-[#082f49]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faq }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-[#075985]">
            <HelpCircle size={17} />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-black text-[#082f49] md:text-5xl">
            Buyer Questions Answered
          </h2>
        </div>

        <div className="mt-10 grid gap-4">
          {(faq || []).map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-sky-100 bg-[#f8fcff] p-6 shadow-sm"
            >
              <h3 className="flex gap-3 text-lg font-black text-[#082f49]">
                <Headphones className="mt-1 shrink-0 text-[#0284c7]" />
                {item.question}
              </h3>
              <p className="mt-3 pl-9 text-sm font-semibold leading-7 text-slate-600">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}