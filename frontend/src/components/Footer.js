"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

const fallbackFooter = {
  companyName: "Royal Trading Component",
  tagline: "Industrial Solutions Store",
  description:
    "Trusted B2B industrial sourcing platform for electronic, electrical, automation, mechanical and hardware components.",
  email: "sales@royalcomponent.com",
  phone: "+91 88511 49032",
  whatsapp: "+91 88511 49032",
  supportHours: "Mon - Sat | 9 AM - 7 PM",
  address:
    "4th Floor, Ansari Road, Near Hanuman Mandir, Darya Ganj, New Delhi - 110002",
  bottomText: "© 2026 Royal Trading Component. All rights reserved.",

  componentLinks: [
    {
      label: "Amplifiers & Comparators",
      link: "/components/amplifierscomparators",
      order: 1,
      isActive: true,
    },
    {
      label: "Audio & Video ICs",
      link: "/components/audiovideoics",
      order: 2,
      isActive: true,
    },
    {
      label: "Chip Programmers & Debuggers",
      link: "/components/chipprogrammersdebuggers",
      order: 3,
      isActive: true,
    },
    {
      label: "Clock, Timing & Frequency ICs",
      link: "/components/clocktimingfrequencyics",
      order: 4,
      isActive: true,
    },
    {
      label: "Communication & Wireless Module ICs",
      link: "/components/communicationwirelessmoduleics",
      order: 5,
      isActive: true,
    },
    {
      label: "Data Converters",
      link: "/components/dataconverters",
      order: 6,
      isActive: true,
    },
    {
      label: "Discrete Semiconductors",
      link: "/components/discretesemiconductors",
      order: 7,
      isActive: true,
    },
    {
      label: "Interface ICs",
      link: "/components/interfaceics",
      order: 8,
      isActive: true,
    },
    {
      label: "Logic ICs",
      link: "/components/logicics",
      order: 9,
      isActive: true,
    },
    {
      label: "Memory Chips",
      link: "/components/memorychips",
      order: 10,
      isActive: true,
    },
    {
      label: "Power Management ICs",
      link: "/components/powermanagementics",
      order: 11,
      isActive: true,
    },
    {
      label: "Processors & Microcontrollers",
      link: "/components/processorsmicrocontrollers",
      order: 12,
      isActive: true,
    },
    {
      label: "Programmable Logic ICs",
      link: "/components/programmablelogicics",
      order: 13,
      isActive: true,
    },
    {
      label: "Sensor ICs",
      link: "/components/sensorics",
      order: 14,
      isActive: true,
    },
  ],

  shopLinks: [
    { label: "All Products", link: "/products", order: 1, isActive: true },
    {
      label: "Semiconductors",
      link: "/products?category=semiconductors",
      order: 2,
      isActive: true,
    },
    {
      label: "Automation",
      link: "/products?category=automation",
      order: 3,
      isActive: true,
    },
    {
      label: "Switchgear",
      link: "/products?category=switchgear",
      order: 4,
      isActive: true,
    },
    {
      label: "Sensors",
      link: "/products?category=sensors",
      order: 5,
      isActive: true,
    },
  ],

  supportLinks: [
    {
      label: "Request BOM",
      link: "/request-component",
      order: 1,
      isActive: true,
    },
    {
      label: "Track Request",
      link: "/request-component/my-requests",
      order: 2,
      isActive: true,
    },
    {
      label: "My Orders",
      link: "/checkout/order",
      order: 3,
      isActive: true,
    },
    { label: "Track Order", link: "/track", order: 4, isActive: true },
    { label: "Cart", link: "/checkout/cart", order: 5, isActive: true },
    { label: "Wishlist", link: "/wishlist", order: 6, isActive: true },
  ],

  companyLinks: [
    { label: "Home", link: "/", order: 1, isActive: true },
    { label: "About Us", link: "/about", order: 2, isActive: true },
    { label: "Contact Us", link: "/contact", order: 3, isActive: true },
    { label: "FAQ", link: "/contact#faq", order: 4, isActive: true },
    { label: "Blogs", link: "/blog", order: 5, isActive: true },
  ],

  policyLinks: [
    {
      label: "Privacy Policy",
      link: "/privacy-policy",
      order: 1,
      isActive: true,
    },
    {
      label: "Terms & Conditions",
      link: "/terms-and-conditions",
      order: 2,
      isActive: true,
    },
    {
      label: "Shipping Policy",
      link: "/shipping-policy",
      order: 3,
      isActive: true,
    },
    {
      label: "Return Policy",
      link: "/return-policy",
      order: 4,
      isActive: true,
    },
    {
      label: "Refund Policy",
      link: "/refund-policy",
      order: 5,
      isActive: true,
    },
    {
      label: "Cancellation Policy",
      link: "/cancellation-policy",
      order: 6,
      isActive: true,
    },
  ],
};

async function getFooterData() {
  try {
    const res = await fetch(`${API_BASE}/api/footer-page`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (data?.success && data?.footer) {
      return {
        ...fallbackFooter,
        ...data.footer,
        componentLinks:
          data.footer.componentLinks?.length > 0
            ? data.footer.componentLinks
            : fallbackFooter.componentLinks,
        shopLinks:
          data.footer.shopLinks?.length > 0
            ? data.footer.shopLinks
            : fallbackFooter.shopLinks,
        supportLinks:
          data.footer.supportLinks?.length > 0
            ? data.footer.supportLinks
            : fallbackFooter.supportLinks,
        companyLinks:
          data.footer.companyLinks?.length > 0
            ? data.footer.companyLinks
            : fallbackFooter.companyLinks,
        policyLinks:
          data.footer.policyLinks?.length > 0
            ? data.footer.policyLinks
            : fallbackFooter.policyLinks,
      };
    }

    return fallbackFooter;
  } catch (error) {
    console.error("Footer fetch failed:", error);
    return fallbackFooter;
  }
}

function getActiveLinks(links = []) {
  return links
    .filter((item) => item?.isActive !== false && item?.label && item?.link)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

function FooterColumn({ title, links }) {
  const finalLinks = getActiveLinks(links);

  return (
    <div>
      <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-sky-200">
        {title}
      </h4>

      <div className="space-y-2.5">
        {finalLinks.map((item) => (
          <Link
            key={`${item.label}-${item.link}`}
            href={item.link}
            className="group flex items-start gap-2 text-[13px] font-semibold leading-5 text-slate-300 transition hover:text-white"
          >
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300 transition group-hover:translate-x-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ComponentsColumn({ links }) {
  const finalLinks = getActiveLinks(links);

  return (
    <div className="lg:col-span-2">
      <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-sky-200">
        Components
      </h4>

      <div className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
        {finalLinks.map((item) => (
          <Link
            key={`${item.label}-${item.link}`}
            href={item.link}
            className="group flex items-start gap-2 rounded-lg py-0.5 text-[13px] font-semibold leading-5 text-slate-300 transition hover:text-white"
          >
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300 transition group-hover:translate-x-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const [data, setData] = useState(fallbackFooter);

  useEffect(() => {
    let mounted = true;

    async function loadFooter() {
      const footerData = await getFooterData();

      if (mounted) {
        setData(footerData);
      }
    }

    loadFooter();

    return () => {
      mounted = false;
    };
  }, []);

  const cleanPhone = String(data.phone || "").replace(/\s/g, "");
  const cleanWhatsapp = String(data.whatsapp || "").replace(/\D/g, "");

  return (
    <footer className="mt-14 overflow-hidden bg-[#07111f] text-white">
      <div className="bg-gradient-to-r from-[#0f6cbd] via-[#1792e8] to-[#38bdf8]">
        <div className="container-royal grid gap-3 py-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-sm font-black">Trusted Components</p>
          </div>

          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <PackageSearch className="h-5 w-5" />
            <p className="text-sm font-black">BOM Sourcing</p>
          </div>

          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <Truck className="h-5 w-5" />
            <p className="text-sm font-black">Fast Procurement</p>
          </div>

          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <BadgeCheck className="h-5 w-5" />
            <p className="text-sm font-black">B2B Support</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-24 top-10 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container-royal relative py-9">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 lg:col-span-3">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1792e8] to-[#0f6cbd] text-lg font-black shadow-lg shadow-sky-900/30">
                  RC
                </div>

                <div>
                  <h3 className="text-xl font-black leading-tight">
                    {data.companyName}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-sky-200">
                    {data.tagline}
                  </p>
                </div>
              </Link>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {data.description}
              </p>

              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                  <span>{data.address}</span>
                </p>

                <p className="flex gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-sky-300" />
                  <a href={`tel:${cleanPhone}`} className="hover:text-white">
                    {data.phone}
                  </a>
                </p>

                <p className="flex gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-sky-300" />
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    {data.whatsapp}
                  </a>
                </p>

                <p className="flex gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-sky-300" />
                  <a href={`mailto:${data.email}`} className="hover:text-white">
                    {data.email}
                  </a>
                </p>

                <p className="flex gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-sky-300" />
                  {data.supportHours}
                </p>
              </div>
            </div>

            <div className="lg:col-span-9">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-6">
                  <ComponentsColumn links={data.componentLinks} />
                  <FooterColumn title="Shop" links={data.shopLinks} />
                  <FooterColumn title="Support" links={data.supportLinks} />
                  <FooterColumn title="Company" links={data.companyLinks} />
                  <FooterColumn title="Policies" links={data.policyLinks} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/request-component"
                  className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm font-black text-sky-100 transition hover:bg-sky-400/15"
                >
                  Request BOM
                </Link>

                <Link
                  href="/request-component/my-requests"
                  className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm font-black text-sky-100 transition hover:bg-sky-400/15"
                >
                  Track Request
                </Link>

                <Link
                  href="/contact"
                  className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm font-black text-sky-100 transition hover:bg-sky-400/15"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-slate-700 pt-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>{data.bottomText}</p>

            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/blog" className="hover:text-white">
                Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}