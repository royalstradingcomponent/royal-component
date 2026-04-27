"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function CancelOrderItemModal({
  item,
  reasons = [],
  reason,
  setReason,
  comment,
  setComment,
  onClose,
  onSubmit,
  loading,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const oldBodyOverflow = document.body.style.overflow;
    const oldHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldBodyOverflow;
      document.documentElement.style.overflow = oldHtmlOverflow;
      setMounted(false);
    };
  }, []);

  if (!mounted || !item) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[rgba(15,23,42,0.58)] px-3 py-5 backdrop-blur-sm">
      <div className="flex h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-[#e5e7eb] bg-white px-5 py-4">
          <div className="pr-4">
            <h3 className="text-[24px] font-extrabold leading-tight text-[#102033]">
              Cancel this item?
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-[#607287]">
              {item.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#f3f7fb] p-2 text-[#102033] hover:bg-[#e8eef5]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <p className="mb-4 text-sm leading-6 text-[#607287]">
              Please select the correct reason. This helps the procurement team
              process cancellation and refund/update request faster.
            </p>

            <div className="space-y-3">
              {reasons.map((itemReason) => (
                <label
                  key={itemReason}
                  className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-4 text-sm font-bold transition ${
                    reason === itemReason
                      ? "border-[#2454b5] bg-[#eef4ff] text-[#102033]"
                      : "border-[#dbe5f0] bg-white text-[#102033] hover:bg-[#f8fafc]"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={itemReason}
                    checked={reason === itemReason}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-4 w-4 accent-[#2454b5]"
                  />
                  {itemReason}
                </label>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Add more details about cancellation request..."
              className="mt-4 w-full resize-none rounded-[14px] border border-[#dbe5f0] bg-[#f8fafc] p-4 text-sm outline-none focus:border-[#2454b5] focus:bg-white"
            />
          </div>

          <div className="shrink-0 border-t border-[#e5e7eb] bg-white px-5 py-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 rounded-[12px] border border-[#dbe5f0] py-3 text-sm font-bold text-[#102033] hover:bg-[#f8fafc]"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-1/2 rounded-[12px] bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Cancelling..." : "Cancel Item"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}