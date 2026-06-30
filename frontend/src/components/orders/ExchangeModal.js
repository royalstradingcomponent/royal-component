"use client";

import {
  AlertCircle,
  ArrowLeft,
  Box,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  HelpCircle,
  ImageIcon,
  PackageCheck,
  Palette,
  RefreshCcw,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  Video,
  X,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

const fallbackReasons = [
  {
    _id: "spec",
    title: "Specification Issue",
    subtitle: "Value, size, rating or variant mismatch",
    color: "#2563eb",
    icon: Box,
  },
  {
    _id: "design",
    title: "Color/Design Issue",
    subtitle: "Product is different from expectation",
    color: "#f97316",
    icon: Palette,
  },
  {
    _id: "wrong",
    title: "Wrong Item Delivered",
    subtitle: "Received a different item",
    color: "#16a34a",
    icon: Tag,
  },
  {
    _id: "quality",
    title: "Quality Issue",
    subtitle: "Product quality is not good",
    color: "#7c3aed",
    icon: ShieldCheck,
  },
  {
    _id: "damaged",
    title: "Damaged Product",
    subtitle: "Received a damaged item",
    color: "#f59e0b",
    icon: Box,
  },
  {
    _id: "other",
    title: "Other Reason",
    subtitle: "Any other reason",
    color: "#64748b",
    icon: HelpCircle,
  },
];

const flowSteps = [
  {
    title: "Select Reason",
    subtitle: "Why do you want to exchange?",
  },
  {
    title: "Pickup Details",
    subtitle: "Select pickup address & time",
  },
  {
    title: "Review & Confirm",
    subtitle: "Review your exchange request",
  },
  {
    title: "Exchange Processing",
    subtitle: "We will pick up and ship new item",
  },
];

const processSteps = [
  {
    title: "Request Exchange",
    subtitle: "Submit your exchange request",
    icon: RefreshCcw,
    color: "#16a34a",
  },
  {
    title: "Pickup",
    subtitle: "We'll pick up the item from your address",
    icon: Truck,
    color: "#2563eb",
  },
  {
    title: "Quality Check",
    subtitle: "Item will be quality checked at our facility",
    icon: ShieldCheck,
    color: "#f59e0b",
  },
  {
    title: "New Item Shipped",
    subtitle: "New item will be shipped to you",
    icon: Box,
    color: "#7c3aed",
  },
  {
    title: "Exchange Complete",
    subtitle: "You will receive the new item",
    icon: Check,
    color: "#16a34a",
  },
];

function getItemImage(item) {
  const image =
    item?.thumbnail ||
    item?.image ||
    item?.img ||
    item?.images?.[0] ||
    item?.product?.thumbnail ||
    item?.product?.image ||
    item?.product?.images?.[0] ||
    "";

  if (!image) return "";

  if (image.startsWith("http")) return image;

  return `${API_BASE}${image}`;
}

function getItemName(item) {
  return item?.name || item?.productName || item?.title || item?.product?.name || "Industrial Component";
}

export default function ExchangeModal({
  open,
  onClose,
  item,
  order,
  exchangeReason,
  setExchangeReason,
  exchangeComment,
  setExchangeComment,
  exchangeImages,
  setExchangeImages,
  exchangeVideo,
  setExchangeVideo,
  exchangeLoading,
  handleExchangeRequest,
  reasons = [],
}) {
  if (!open) return null;

  const exchangeReasons = reasons
    .filter((reason) => reason.type === "EXCHANGE" || reason.type === "BOTH")
    .map((reason, index) => ({
      ...reason,
      subtitle: reason.subtitle || reason.description || "Select this reason",
      color: reason.color || fallbackReasons[index % fallbackReasons.length].color,
      icon: fallbackReasons[index % fallbackReasons.length].icon,
    }));

  const visibleReasons = exchangeReasons.length ? exchangeReasons : fallbackReasons;
  const itemImage = getItemImage(item);
  const selectedReason = visibleReasons.find((reason) => reason.title === exchangeReason);

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    setExchangeImages(files);
  };

  const handleVideo = (event) => {
    const file = event.target.files?.[0];
    if (file) setExchangeVideo(file);
  };

  const removeImage = (index) => {
    setExchangeImages(exchangeImages.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <div className="fixed inset-0 z-[999999] h-screen overflow-y-auto bg-[#eef4fb] px-3 py-4 pb-40 text-[#0f172a] sm:px-5 sm:py-6 sm:pb-48">
      <div className="mx-auto w-full max-w-[1440px] overflow-hidden rounded-[8px] border border-[#d6e0ec] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
        <header className="bg-white">
          <div className="flex flex-col gap-4 border-b border-[#e5edf6] px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0f172a] transition hover:bg-[#eff6ff]"
                aria-label="Close exchange request"
              >
                <ArrowLeft size={23} />
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[22px] font-black leading-tight text-[#0f172a] sm:text-[28px]">
                    Exchange Request
                  </h2>
                  <span className="rounded-full bg-[#fff3e8] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#f97316]">
                    Easy Exchange
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#58708f]">
                  Choose your issue, upload proof, and submit your exchange request.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[#dbeafe] bg-[#eff6ff] px-3 text-xs font-black text-[#1d4ed8]">
                <CheckCircle2 size={16} />
                Verified
              </span>
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[#dcfce7] bg-[#f0fdf4] px-3 text-xs font-black text-[#15803d]">
                <Truck size={16} />
                Pickup
              </span>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[#fee2e2] bg-[#fff7ed] px-3 text-xs font-black text-[#ea580c] transition hover:bg-[#ffedd5]"
              >
                <HelpCircle size={16} />
                Help
              </button>
            </div>
          </div>

          <div className="border-b border-[#e5edf6] bg-[#fbfdff] px-4 py-4 sm:px-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {flowSteps.map((step, index) => {
                const active = index === 0;

                return (
                  <div
                    key={step.title}
                    className={`relative flex items-center gap-3 rounded-[8px] border p-3 ${active
                      ? "border-[#bfdbfe] bg-white shadow-[0_10px_26px_rgba(37,99,235,0.10)]"
                      : "border-[#e2e8f0] bg-white"
                      }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${active
                        ? "bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white shadow-[0_8px_20px_rgba(37,99,235,0.30)]"
                        : "bg-[#eef2f7] text-[#64748b]"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-black ${active ? "text-[#1d4ed8]" : "text-[#334155]"}`}>
                        {step.title}
                      </p>
                      <p className="truncate text-xs font-semibold text-[#64748b]">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <div className="grid gap-5 bg-[#eef6ff] p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-5">
            <section className="rounded-[8px] border border-[#d5e2f0] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#f97316]">
                    Exchange Item
                  </p>
                  <h3 className="mt-1 text-xl font-black text-[#0f172a]">
                    Product to be Exchanged
                  </h3>
                </div>
                <span className="hidden rounded-full bg-[#ecfdf5] px-4 py-2 text-sm font-black text-[#047857] sm:inline-flex">
                  Delivered
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div>

                  {/* Left */}

                  <div className="flex flex-col lg:flex-row gap-6 p-6">

                    <div className="flex h-28 w-28 shrink-0 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={getItemName(item)}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Box size={60} className="text-slate-400" />
                      )}
                    </div>

<div className="flex min-w-0 flex-1 flex-col">

                      <h2 className="text-3xl font-black text-slate-900 leading-tight">
                        {getItemName(item)}
                      </h2>

                      <div className="mt-4 flex flex-wrap gap-2">

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">
                          SKU : {item?.sku || item?.mpn || "N/A"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">
                          Qty : {item?.quantity || 1}
                        </span>

                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                          ✓ Exchange Eligible
                        </span>

                      </div>

                     <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[520px]">

                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">

                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Order ID
                          </p>

                          <p className="mt-2 text-lg font-black text-slate-900">
                            {order?.orderNumber || order?._id}
                          </p>

                        </div>

                        <div className="min-w-[220px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Paid Amount
                          </p>

                          <p className="mt-2 text-3xl font-black text-[#16a34a]">
                            ₹{Number(item?.lineTotal || item?.price || 0).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Right */}



                </div>

              </div>
            </section>

            <section className="rounded-[8px] border border-[#d5e2f0] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-black uppercase tracking-wide text-[#2563eb]">
                  Select Reason
                </p>
                <h3 className="text-xl font-black text-[#0f172a]">
                  Why do you want to exchange this item?
                </h3>
                <p className="text-sm font-medium text-[#64748b]">
                  Select the closest reason so our team can process it faster.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleReasons.map((reason) => {
                  const selected = exchangeReason === reason.title;
                  const Icon = reason.icon || RefreshCcw;

                  return (
                    <button
                      type="button"
                      key={reason._id || reason.title}
                      onClick={() => setExchangeReason(reason.title)}
                      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-300
  ${selected
                          ? "border-[#16a34a] shadow-lg ring-2 ring-green-100"
                          : "border-slate-200 hover:border-sky-300 hover:shadow-md"
                        }`}
                    >

                      {/* left accent */}

                      <div
                        className={`absolute left-0 top-0 h-full w-1 ${selected ? "bg-[#16a34a]" : "bg-transparent"
                          }`}
                      />

                      <div className="flex items-start justify-between">

                        <div className="flex gap-4">

                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{
                              background: `${reason.color}15`,
                              color: reason.color,
                            }}
                          >
                            <Icon size={28} />
                          </div>

                          <div>

                            <h4 className="text-lg font-bold text-slate-900">
                              {reason.title}
                            </h4>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {reason.subtitle}
                            </p>

                          </div>

                        </div>

                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${selected
                            ? "border-green-600 bg-green-600"
                            : "border-slate-300"
                            }`}
                        >
                          {selected && <Check size={14} className="text-white" />}
                        </div>

                      </div>

                      <div className="mt-5 flex gap-2">

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                          Exchange
                        </span>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Fast Review
                        </span>

                      </div>

                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[8px] border border-[#d5e2f0] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-wide text-[#f97316]">
                  Proof Upload
                </p>
                <h3 className="mt-1 text-xl font-black text-[#0f172a]">
                  Upload Evidence
                  <span className="ml-2 text-sm font-semibold text-[#64748b]">(Optional)</span>
                </h3>
                <p className="mt-1 text-sm text-[#64748b]">
                  Upload clear photos or a short video to help us verify your exchange faster.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                <label className="group flex aspect-square min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] text-center transition hover:border-[#2563eb] hover:bg-[#eff6ff]">
                  <Camera size={32} className="text-[#64748b] group-hover:text-[#2563eb]" />
                  <p className="mt-3 text-sm font-black text-[#0f172a]">Upload Photos</p>
                  <span className="text-xs font-medium text-[#64748b]">Max 5 images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImages}
                    className="hidden"
                  />
                </label>

                {[0, 1, 2, 3].map((slot) => {
                  const file = exchangeImages?.[slot];

                  return (
                    <div
                      key={slot}
                      className="relative aspect-square min-h-[130px] overflow-hidden rounded-[8px] border border-[#dbe3ee] bg-[#f8fafc]"
                    >
                      {file ? (
                        <>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Exchange evidence ${slot + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(slot)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-md"
                            aria-label="Remove image"
                          >
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon size={34} className="text-[#cbd5e1]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-[8px] border border-[#dbe3ee] bg-[#fffafa] p-4 transition hover:border-[#ef4444] hover:bg-[#fff1f2]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-[#fee2e2]">
                  <Video size={28} className="text-[#ef4444]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-[#0f172a]">Upload Video</h4>
                  <p className="truncate text-sm text-[#64748b]">
                    {exchangeVideo ? exchangeVideo.name : "Optional issue video"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideo}
                  className="hidden"
                />
              </label>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-black text-[#0f172a]">Additional Note</h3>
                  <span className="text-xs font-semibold text-[#64748b]">
                    {exchangeComment.length}/500
                  </span>
                </div>

                <textarea
                  rows={5}
                  maxLength={500}
                  value={exchangeComment}
                  onChange={(e) => setExchangeComment(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full resize-none rounded-[8px] border border-[#dbe3ee] bg-white p-4 text-sm outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-4 focus:ring-[#dbeafe]"
                />
              </div>
            </section>
          </main>

          <aside className="min-w-0 space-y-5 xl:sticky xl:top-5 xl:self-start">
            {selectedReason ? (
              <section className="rounded-[8px] border border-[#bfdbfe] bg-[#eff6ff] p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-[#2563eb]">
                  Selected Reason
                </p>
                <p className="mt-2 text-lg font-black text-[#0f172a]">{selectedReason.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#475569]">{selectedReason.subtitle}</p>
              </section>
            ) : (
              <section className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-[#ea580c]">
                  Pending
                </p>
                <p className="mt-2 text-lg font-black text-[#0f172a]">Select a reason</p>
                <p className="mt-1 text-sm leading-6 text-[#475569]">
                  Please choose one exchange reason to continue.
                </p>
              </section>
            )}

            <section className="rounded-[8px] border border-[#dbe3ee] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black text-[#0f172a]">Exchange Process</h3>

              <div className="mt-5 space-y-5">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div key={step.title} className="relative flex gap-4">
                      {index < processSteps.length - 1 ? (
                        <div className="absolute left-6 top-12 h-7 w-px border-l border-dashed border-[#cbd5e1]" />
                      ) : null}
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${step.color}1f`, color: step.color }}
                      >
                        <Icon size={22} />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-[#0f172a]">{step.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-[#475569]">{step.subtitle}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[8px] border border-[#dbe3ee] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black text-[#0f172a]">Exchange Policy</h3>

              <div className="mt-4 space-y-4 text-sm leading-6 text-[#475569]">
                <p className="flex gap-3">
                  <Clock3 size={20} className="shrink-0 text-[#64748b]" />
                  Exchange available within 7 days of delivery
                </p>
                <p className="flex gap-3">
                  <PackageCheck size={20} className="shrink-0 text-[#64748b]" />
                  Item should be unused with original tag and packaging
                </p>
                <p className="flex gap-3">
                  <RefreshCcw size={20} className="shrink-0 text-[#64748b]" />
                  Only one exchange allowed per product
                </p>
                <p className="flex gap-3">
                  <AlertCircle size={20} className="shrink-0 text-[#64748b]" />
                  No exchange on personalized or clearance items
                </p>
              </div>

              <button type="button" className="mt-5 text-sm font-black text-[#2563eb]">
                Read full policy
              </button>
            </section>
          </aside>
        </div>

        <div className="border-t border-[#dbeafe] bg-white">

          <div className="flex items-center justify-between gap-8 px-8 py-6">

            {/* Left */}

            <div className="flex items-center gap-5">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ecfdf5]">

                <ShieldCheck
                  size={34}
                  className="text-[#16a34a]"
                />

              </div>

              <div>

                <h3 className="text-2xl font-black text-[#0f172a]">
                  Ready to Submit Exchange Request
                </h3>

                <p className="mt-2 max-w-[700px] text-[15px] leading-7 text-[#64748b]">
                  Your exchange request will be reviewed within
                  <span className="font-bold text-[#0f172a]"> 24 hours.</span>
                  After approval, pickup will be scheduled automatically and a replacement item will be shipped.
                </p>

                {!exchangeReason && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                    <AlertCircle size={16} />
                    Please select an exchange reason before continuing.
                  </div>
                )}

              </div>

            </div>

            {/* Right */}

            <div className="flex shrink-0 items-center gap-4">

              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-xl border border-slate-300 bg-white px-8 text-[15px] font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExchangeRequest}
                disabled={exchangeLoading || !exchangeReason}
                className="flex h-12 min-w-[260px] items-center justify-center gap-3 rounded-xl bg-[#16a34a] px-8 text-[15px] font-bold text-white shadow-lg transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {exchangeLoading ? "Submitting..." : "Continue Exchange"}

                <ArrowLeft
                  size={18}
                  className="rotate-180"
                />
              </button>

            </div>

          </div>

        </div>
      </div>
    </div >
  );
}
