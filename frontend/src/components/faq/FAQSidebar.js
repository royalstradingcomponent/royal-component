"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CircleHelp,
  Truck,
  PackageSearch,
  CreditCard,
  FileText,
  RotateCcw,
  Cpu,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export const faqCategories = [
  { id: "top-queries", label: "Top Queries", icon: CircleHelp },
  { id: "shipping", label: "Shipping & Delivery", icon: Truck },
  { id: "orders", label: "Orders & Bulk Purchase", icon: PackageSearch },
  { id: "payments", label: "Payments & Proof", icon: CreditCard },
  { id: "gst", label: "GST Invoice", icon: FileText },
  { id: "returns", label: "Returns & Cancellation", icon: RotateCcw },
  { id: "technical", label: "Technical Support", icon: Cpu },
  { id: "terms-conditions", label: "Terms & Conditions", icon: ShieldCheck },
  { id: "contact-us", label: "Contact & Support", icon: Headphones },
];

export default function FAQSidebar() {
  const [active, setActive] = useState("top-queries");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      setActive(window.location.hash.replace("#", ""));
    }

    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0.25,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="w-full">
      <nav className="space-y-2">
        {faqCategories.map((cat) => {
          const isActive = active === cat.id;
          const Icon = cat.icon;

          return (
            <Link
              key={cat.id}
              href={`#${cat.id}`}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all"
              style={{
                background: isActive ? "#eaf6ff" : "transparent",
                border: isActive ? "1px solid #bae6fd" : "1px solid transparent",
                color: isActive ? "#075985" : "#334155",
                fontWeight: isActive ? 800 : 600,
              }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: isActive ? "#dff3ff" : "#f1f5f9",
                  color: isActive ? "#0284c7" : "#64748b",
                }}
              >
                <Icon size={17} />
              </span>

              <span>{cat.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}