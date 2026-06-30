"use client";

import {
  CheckCircle2,
  Clock3,
  Truck,
  PackageCheck,
  RefreshCcw,
  IndianRupee,
} from "lucide-react";

export default function ReturnExchangeTimeline({
  type = "RETURN",

  status = "",

  requestedAt,
  approvedAt,
  pickupAt,
  completedAt,

  reason = "",
  description = "",

  adminNote = "",
history = [],

photos = [],
videos = [],
}) {
  const returnSteps = [
    {
      label: "Request Submitted",
      icon: RefreshCcw,
      active: !!requestedAt,
    },
    {
      label: "Approved",
      icon: CheckCircle2,
      active: !!approvedAt,
    },
    {
      label: "Pickup Scheduled",
      icon: Truck,
      active:
        status === "Pickup Scheduled" ||
        status === "Picked Up" ||
        status === "Completed",
    },
    {
      label: "Picked Up",
      icon: PackageCheck,
      active:
        status === "Picked Up" ||
        status === "Completed",
    },
    {
      label: "Completed",
      icon: IndianRupee,
      active: !!completedAt,
    },
  ];

  const exchangeSteps = [
    {
      label: "Request Submitted",
      icon: RefreshCcw,
      active: !!requestedAt,
    },
    {
      label: "Approved",
      icon: CheckCircle2,
      active: !!approvedAt,
    },
    {
      label: "Replacement Shipped",
      icon: Truck,
      active:
        status === "Replacement Shipped" ||
        status === "Completed",
    },
    {
      label: "Completed",
      icon: PackageCheck,
      active: !!completedAt,
    },
  ];

  const steps =
    type === "RETURN"
      ? returnSteps
      : exchangeSteps;

  return (
    <div className="rounded-[28px] border border-[#dbe5f0] bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="mb-6">

        <h3 className="text-2xl font-black text-[#102033]">
          {type === "RETURN"
            ? "Return Request"
            : "Exchange Request"}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Track the complete progress of your request.
        </p>

      </div>

      {/* STATUS */}

      <div className="mb-6 rounded-2xl bg-slate-50 p-4">

        <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
          Current Status
        </p>

        <p className="mt-1 text-xl font-black text-[#102033]">
          {status}
        </p>

      </div>

      {/* REASON */}

      {reason && (
        <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-orange-600">
            Reason
          </p>

          <p className="mt-1 font-bold text-[#102033]">
            {reason}
          </p>

          {description && (
            <p className="mt-2 text-sm text-slate-600">
              {description}
            </p>
          )}

        </div>
      )}

      {/* TIMELINE */}


{history?.length > 0 ? (
  <div className="space-y-4">
    {history.map((entry, index) => (
      <div
        key={`${entry.status}-${index}`}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <p className="font-black text-[#102033]">{entry.status}</p>
        <p className="mt-1 text-sm text-slate-600">{entry.message}</p>
        <p className="mt-2 text-xs font-bold text-slate-400">
          {entry.date ? new Date(entry.date).toLocaleString("en-IN") : ""}
        </p>
      </div>
    ))}
  </div>
) : (
      <div className="space-y-5">

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  step.active
                    ? "bg-green-100"
                    : "bg-slate-100"
                }`}
              >
                <Icon
                  size={22}
                  className={
                    step.active
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                />
              </div>

              <div>

                <p className="font-bold text-[#102033]">
                  {step.label}
                </p>

                <p className="text-xs text-slate-500">
                  {step.active
                    ? "Completed"
                    : "Pending"}
                </p>

              </div>

            </div>
          );
        })}
      </div>
      )}

      {/* EVIDENCE */}

      {(photos?.length > 0 ||
        videos?.length > 0) && (
        <div className="mt-8">

          <h4 className="mb-3 font-black text-[#102033]">
            Uploaded Evidence
          </h4>

          {photos?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

              {photos.map(
                (photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt=""
                    className="h-28 w-full rounded-xl border object-cover"
                  />
                )
              )}

            </div>
          )}

          {videos?.length > 0 && (
            <div className="mt-4 space-y-3">

              {videos.map(
                (video, index) => (
                  <video
                    key={index}
                    controls
                    className="w-full rounded-xl border"
                  >
                    <source
                      src={video}
                    />
                  </video>
                )
              )}

            </div>
          )}

        </div>
      )}

      {/* ADMIN NOTE */}

      {adminNote && (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">
            Admin Review
          </p>

          <p className="mt-2 text-sm text-slate-700">
            {adminNote}
          </p>

        </div>
      )}

    </div>
  );
}