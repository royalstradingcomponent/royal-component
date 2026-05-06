"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Mail, ArrowRight } from "lucide-react";

export default function FAQAccordion({
  items = [],
  title,
  description,
  actionButton,
  showContactSection = true,
}) {
  const safeItems = useMemo(
    () => (Array.isArray(items) ? items.filter(Boolean) : []),
    [items]
  );

  const [openId, setOpenId] = useState(safeItems?.[0]?.id || null);

  return (
    <div className="w-full">
      {title && (
        <div className="mb-8 flex flex-col gap-5 border-b border-sky-100 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-sky-600">
              Royal Component Help Center
            </p>

            <h2 className="text-[26px] font-black leading-tight text-slate-950 sm:text-[34px]">
              {title}
            </h2>

            {description && (
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
                {description}
              </p>
            )}
          </div>

          {actionButton && (
            <Link
              href={actionButton.link}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
            >
              {actionButton.text}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-[26px] border border-sky-100 bg-white">
        {safeItems.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className="border-b border-sky-100 last:border-b-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-sky-50/60 sm:px-6"
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className="text-[15px] font-black leading-6 text-slate-900 sm:text-[16px]">
                  {item.question}
                </span>

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                    isOpen
                      ? "border-sky-200 bg-sky-100 text-sky-700"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              {isOpen ? (
                <div className="px-5 pb-6 pt-0 sm:px-6">
                  <div className="rounded-2xl bg-slate-50 px-5 py-4 text-[15px] leading-7 text-slate-700 whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {showContactSection && (
        <div className="mt-10 rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6">
          <h3 className="text-xl font-black text-slate-950">
            Still need help?
          </h3>

          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-600">
            Bulk order, payment screenshot, GST invoice, datasheet, alternate part
            ya order tracking ke liye support team se contact karein.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-700"
          >
            <Mail size={17} />
            Contact Support
          </Link>
        </div>
      )}
    </div>
  );
}