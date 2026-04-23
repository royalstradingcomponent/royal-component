"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function AuthModel({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-md">
      <div
        className="relative w-full max-w-[460px] overflow-hidden rounded-[28px] border border-[#d8e8f8] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_30px_80px_rgba(36,84,181,0.18)] sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#d7ecff]/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-[#eaf5ff]/70 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7e7f4] bg-white/90 text-[#4b6580] transition hover:border-[#2454b5] hover:text-[#2454b5]"
        >
          <X size={24} />
        </button>

        <div className="relative z-[1]">{children}</div>
      </div>
    </div>
  );
}