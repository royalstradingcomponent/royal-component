"use client";

import FAQLayout from "@/components/faq/FAQLayout";
import FAQAccordion from "@/components/faq/FAQAccordion";
import { faqData } from "@/data/faqData";
import { useEffect } from "react";

export default function FAQPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;

      if (hash) {
        const el = document.querySelector(hash);

        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    }
  }, []);

  const categories = Object.entries(faqData);

  return (
    <FAQLayout>
      {categories.map(([key, section]) => (
        <section key={key} id={key} className="mb-20 scroll-mt-32 last:mb-0">
          <FAQAccordion
            title={section.title}
            description={section.description}
            items={section.items}
            actionButton={section.actionButton}
            showContactSection={key === "contact-us"}
          />
        </section>
      ))}
    </FAQLayout>
  );
}