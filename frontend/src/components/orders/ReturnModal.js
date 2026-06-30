"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  X,
  UploadCloud,
  Video,
  CheckCircle2,
  ShieldAlert,
  PackageX,
  AlertTriangle,
  RefreshCcw,
  Circle,
  Wrench,
  Cpu,
  Box,
  ShieldCheck,
  FileWarning,
  PackageMinus,
  CircleHelp,
} from "lucide-react";

import ReturnStepper from "../return/ReturnStepper";
import RefundDetailsStep from "@/components/orders/RefundDetailsStep";

export default function ReturnModal({
  open,
  onClose,

  item,
  order,
  paymentMethod = "",

  returnReason,
  setReturnReason,

  selectedReasonObj,
  setSelectedReasonObj,

  returnSubReason,
  setReturnSubReason,

  returnComment,
  setReturnComment,

  returnImages,
  setReturnImages,

  returnVideo,
  setReturnVideo,

  returnLoading,

  handleReturnRequest,

  reasons = [],
}) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const [currentStep, setCurrentStep] = useState(0);

  const [refundData, setRefundData] = useState({
  refundMethod: "",
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifsc: "",
  upi: "",
});

  const validators = [
  () => {
    if (!returnReason) {
      toast.error("Please select return reason");
      return false;
    }
    return true;
  },
  () => {
    if (!returnSubReason) {
      toast.error("Please select issue");
      return false;
    }
    return true;
  },
  () => {
    if (!returnImages.length) {
      toast.error("Please upload at least one product image");
      return false;
    }
    return true;
  },
  () => {
    if (returnComment.trim().length < 15) {
      toast.error("Please write at least 15 characters in issue description");
      return false;
    }
    return true;
  },
  () => true,
  () => {
    if (!refundData.refundMethod) {
      toast.error("Please select refund method");
      return false;
    }
    return true;
  },
];

const isCurrentStepComplete = () => {
  if (currentStep === 0) return Boolean(returnReason);
  if (currentStep === 1) return Boolean(returnSubReason);
  if (currentStep === 2) return returnImages.length > 0;
  if (currentStep === 3) return returnComment.trim().length >= 15;
  if (currentStep === 4) return true;
  if (currentStep === 5) return Boolean(refundData.refundMethod);
  return true;
};

const canAccessStep = (targetStep) => {
  if (targetStep <= currentStep) return true;

  for (let step = 0; step < targetStep; step += 1) {
    if (!validators[step]?.()) return false;
  }

  return true;
};



const nextStep = () => {
  const validate = validators[currentStep];

  if (validate && !validate()) {
    return;
  }

  setCurrentStep((prev) => Math.min(prev + 1, 6));
};

const previousStep = () => {
  setCurrentStep((prev) => Math.max(prev - 1, 0));
};

const goToStep = (step) => {
  if (canAccessStep(step)) {
    setCurrentStep(step);
  }
};

  const validateReason = () => {
    if (!returnReason) return false;

    setCurrentStep(1);

    document
      .getElementById("issueSection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    return true;
  };

  const validateIssue = () => {
    if (!returnSubReason) return false;

    setCurrentStep(2);

    document
      .getElementById("uploadSection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    return true;
  };

  const validateUpload = () => {
    if (returnImages.length === 0) return false;

    setCurrentStep(3);

    document
      .getElementById("detailsSection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    return true;
  };

  const validateDetails = () => {
    if (returnComment.trim().length < 15) return false;

    setCurrentStep(4);

    document
      .getElementById("reviewSection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    return true;
  };

  if (!open) return null;

  const getImage = () => {
    return (
      item?.image ||
      item?.img ||
      item?.thumbnail ||
      item?.product?.thumbnail ||
      item?.product?.image ||
      item?.images?.[0] ||
      ""
    );
  };

  const getImageUrl = (url) => {
    if (!url) return "/placeholder-product.png";

    if (url.startsWith("http")) return url;

    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const iconBgColors = [
    "bg-orange-300",
    "bg-red-300",
    "bg-blue-300",
    "bg-purple-300",
    "bg-cyan-300",
    "bg-green-300",
    "bg-pink-300",
    "bg-yellow-300",
  ];

  const cardBgColors = [
    {
      bg: "linear-gradient(135deg,#fff8f1 0%,#ffe8d2 100%)",
      border: "#fb923c",
    },
    {
      bg: "linear-gradient(135deg,#fff5f5 0%,#ffd9d9 100%)",
      border: "#ef4444",
    },
    {
      bg: "linear-gradient(135deg,#f8fbff 0%,#dbeafe 100%)",
      border: "#3b82f6",
    },
    {
      bg: "linear-gradient(135deg,#fcf8ff 0%,#eadcff 100%)",
      border: "#a855f7",
    },
    {
      bg: "linear-gradient(135deg,#f5fdff 0%,#d2f5fb 100%)",
      border: "#06b6d4",
    },
    {
      bg: "linear-gradient(135deg,#f8fff9 0%,#daf8df 100%)",
      border: "#22c55e",
    },
    {
      bg: "linear-gradient(135deg,#fff8fc 0%,#fbdceb 100%)",
      border: "#ec4899",
    },
    {
      bg: "linear-gradient(135deg,#fffdf4 0%,#fef2bf 100%)",
      border: "#eab308",
    },
  ];

  const reasonIcons = {
    "Damaged Product": AlertTriangle,
    "Wrong Product": PackageX,
    "Missing Parts": PackageMinus,
    "Quality Issue": ShieldCheck,
    "Not Working": Cpu,
    "Fake Product": ShieldAlert,
    "Different From Description": FileWarning,
    "Other": CircleHelp,
  };

  const subReasonIcons = [
    ShieldCheck,
    AlertTriangle,
    Wrench,
    Cpu,
    Box,
    PackageMinus,
    FileWarning,
    CircleHelp,
  ];

  const subCardColors = [
    {
      bg: "linear-gradient(135deg,#fff8f3 0%,#ffe9d2 100%)",
      border: "#ff8a00",
      icon: "#ff6b00",
    },
    {
      bg: "linear-gradient(135deg,#fff6f6 0%,#ffe0e0 100%)",
      border: "#ef4444",
      icon: "#ef4444",
    },
    {
      bg: "linear-gradient(135deg,#f5fbff 0%,#dbeafe 100%)",
      border: "#3b82f6",
      icon: "#2563eb",
    },
    {
      bg: "linear-gradient(135deg,#fcf8ff 0%,#eadcff 100%)",
      border: "#a855f7",
      icon: "#9333ea",
    },
    {
      bg: "linear-gradient(135deg,#f5ffff 0%,#d6f8ff 100%)",
      border: "#06b6d4",
      icon: "#0891b2",
    },
    {
      bg: "linear-gradient(135deg,#f6fff8 0%,#daf8df 100%)",
      border: "#22c55e",
      icon: "#16a34a",
    },
    {
      bg: "linear-gradient(135deg,#fff8fc 0%,#fbdceb 100%)",
      border: "#ec4899",
      icon: "#db2777",
    },
    {
      bg: "linear-gradient(135deg,#fffdf4 0%,#fef3c7 100%)",
      border: "#eab308",
      icon: "#ca8a04",
    },
  ];




  return (
    <div className="fixed inset-0 z-[999999] bg-[#f6f7fb] overflow-y-auto">
      <div className="mx-auto min-h-screen w-full max-w-[1200px] bg-white">
        {/* HEADER */}

        <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-8 py-6">
          <div>
            <h2 className="text-3xl font-black text-[#102033]">
              Return Product
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select reason and upload product evidence
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X />
          </button>
        </div>


        <div
          className="flex-1 overflow-y-auto px-8 py-6"
          style={{
            scrollBehavior: "smooth",
          }}
        >



          {/* RETURN STEPPER */}

          <div className="mb-8">
         <ReturnStepper
  currentStep={currentStep}
  onStepClick={goToStep}
  canAccessStep={canAccessStep}
  steps={[
    "Reason",
    "Issue",
    "Upload",
    "Details",
    "Review",
    "Bank",
    "Submit",
  ]}
/>
          </div>

          <div className="mb-8">
            <div className="rounded-[30px] border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-50 p-6 shadow-lg">

              <div className="flex items-center gap-6">

                <div className="relative">

                  <div className="h-28 w-28 overflow-hidden rounded-3xl border bg-white shadow-md">
                    <img
                      src={
                        getImage()
                          ? getImageUrl(getImage())
                          : "/placeholder-product.png"
                      }
                      alt={item?.name || ""}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <span className="absolute -top-2 -right-2 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">
                    Return Eligible
                  </span>

                </div>

                <div className="flex-1">

                  <h2 className="text-3xl font-extrabold text-[#102033]">
                    {item?.name}
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Brand : <span className="font-semibold">{item?.brand}</span>
                  </p>

                  <p className="mt-2 font-bold text-slate-700">
                    Qty : 1
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-5xl font-black text-[#102033]">
                    ₹{" "}
                    {Number(
                      item?.lineTotal ||
                      item?.total ||
                      item?.price ||
                      0
                    ).toFixed(2)}
                  </p>

                </div>

              </div>

            </div>
          </div>
          {/* REASON */}

          {currentStep === 0 && (

            <div>

              <div className="mb-10 text-center">
                <h3 className="text-[42px] font-extrabold tracking-tight text-[#102033]">
                  {selectedReasonObj?.ui?.subHeading ||
                    "Please select the most appropriate reason"}
                </h3>



                <p className="mx-auto mt-3 max-w-xl text-lg text-slate-500">
                  Please select the most appropriate reason
                </p>

                <div className="mt-6 flex gap-4 overflow-x-auto pb-3">



                  {reasons.map((reason, index) => (
                    <button
                      key={reason._id}
                      onClick={() => {
                        setReturnReason(reason.title);
                        setSelectedReasonObj(reason);
                        setReturnSubReason("");

                        setTimeout(() => {
                          validateReason();
                        }, 150);
                      }}
                      style={{
                        background:
                          returnReason === reason.title
                            ? "linear-gradient(135deg,#fff7ed 0%,#fed7aa 45%,#fdba74 100%)"
                            : cardBgColors[index % cardBgColors.length].bg,

                        border: `2px solid ${returnReason === reason.title
                          ? "#ff6b00"
                          : cardBgColors[index % cardBgColors.length].border
                          }`,
                      }}
                      className="relative flex min-w-[180px] flex-col items-center rounded-[18px] p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl">

                      {returnReason === reason.title && (
                        <div className="absolute right-3 top-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b00] text-white">
                            <CheckCircle2 size={14} />
                          </div>
                        </div>
                      )}

                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconBgColors[index % iconBgColors.length]
                          }`}
                      >
                        {(() => {
                          const Icon =
                            reasonIcons[reason.title] || PackageX;

                          return (
                            <Icon
                              size={30}
                              className="text-[#ff6b00]"
                            />
                          );
                        })()}
                      </div>

                      <h4 className="text-[17px] font-bold text-[#102033]">
                        {reason.title}
                      </h4>

                      <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                        {reason.description ||
                          "Select this reason to continue"}
                      </p>

                    </button>
                  ))}

                </div>
              </div>
            </div>
          )}


          {/* ISSUE + DETAILS */}

          {currentStep === 1 && (

            <div
              id="issueSection"
              className="mt-8 grid gap-6 lg:grid-cols-2"
            >

              {/* LEFT */}

              <div>

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 shadow-sm">
                      <ShieldAlert className="h-6 w-6 text-orange-500" />
                    </div>

                    <div>
                      <h3 className="text-[22px] font-extrabold text-[#102033]">
                        Select specific issue
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Choose the exact issue that best matches your problem.
                      </p>
                    </div>

                  </div>

                  <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
                    Required
                  </div>

                </div>

                <div className="grid grid-cols-3 gap-5">
                  {selectedReasonObj?.subReasons?.map(
                    (sub, index) => (
                      <label
                        key={index}
                        style={{
                          background:
                            returnSubReason === sub.title
                              ? "linear-gradient(135deg,#fff8f2 0%,#ffe6d1 100%)"
                              : subCardColors[index % subCardColors.length].bg,

                          borderColor:
                            returnSubReason === sub.title
                              ? "#ff7a00"
                              : subCardColors[index % subCardColors.length].border,

                          borderColor:
                            returnSubReason === sub.title
                              ? "#ff7a00"
                              : "#5aa217",
                        }}
                        className={`relative flex flex-col justify-between cursor-pointer
min-h-[220px]
rounded-[24px]
border-2
p-6
transition-all
duration-300

  ${returnSubReason === sub.title
                            ? "shadow-xl scale-[1.02]"
                            : "hover:shadow-lg hover:-translate-y-1"
                          }`}
                      >

                        <input
                          type="radio"
                          checked={returnSubReason === sub.title}
                          onChange={() => {
                            setReturnSubReason(sub.title);

                            setTimeout(() => {
                              validateIssue();
                            }, 200);
                          }}
                          className="absolute right-4 top-4 h-5 w-5 accent-orange-500"
                        />

                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl

${returnSubReason === sub.title
                              ? "bg-orange-100"
                              : "bg-slate-100"
                            }`}
                        >

                          {(() => {
                            const Icon = subReasonIcons[index % subReasonIcons.length];

                            return <Icon size={26}
                              className={
                                returnSubReason === sub.title
                                  ? "text-orange-600"
                                  : "text-slate-500"
                              }
                            />

                          })()}

                        </div>

                        <h4 className="mt-5 text-xl font-extrabold leading-7 text-[#102033]">

                          {sub.title}

                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-500">

                          {sub.description ||

                            "Please select this issue if it best matches your problem."}

                        </p>

                      </label>
                    )
                  )}

                </div>

              </div>



              {/* RIGHT */}

              <div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                      <RefreshCcw
                        className="text-blue-600"
                        size={18}
                      />

                    </div>

                    <div>

                      <h3 className="text-[22px] font-extrabold text-[#102033]">
                        Additional Details
                      </h3>

                      <p className="text-sm text-slate-500">
                        Please provide more details about the issue you are facing.
                      </p>

                      <p className="text-sm text-slate-500">
                        This will help us process your request faster.
                      </p>

                    </div>

                  </div>

                  <div
                    id="detailsSection"
                    className="mt-5"
                  >

                    <textarea

                      rows={3}

                      value={returnComment}

                      onChange={(e) => {
                        setReturnComment(e.target.value);

                        if (e.target.value.trim().length >= 15) {
                          setTimeout(() => {
                            validateDetails();
                          }, 200);
                        }
                      }}

                      maxLength={500}

                      placeholder="Describe the issue in detail..."

                      className="w-full rounded-2xl border-2 border-blue-300 p-5 outline-none transition focus:border-blue-500"

                    />

                    <div className="mt-2 text-right text-xs text-slate-400">

                      {returnComment.length}/500

                    </div>

                  </div>

                  <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50 to-slate-50 p-5">

                    <h4 className="font-bold text-blue-700">

                      💡 What to include?

                    </h4>

                    <ul className="mt-3 space-y-2 text-sm text-slate-600">

                      <li>✔ When did you find the issue?</li>

                      <li>✔ What exactly is the problem?</li>

                      <li>✔ Any error message or code?</li>

                      <li>✔ How often does this happen?</li>

                    </ul>

                  </div>

                  <div className="mt-4 rounded-2xl bg-orange-50 p-4">

                    <p className="text-sm text-orange-700">

                      🛡️ Your information is secure and will only be used for processing your return request.

                    </p>

                  </div>

                </div>



              </div>

            </div>
          )}

          {/* HELP STRIP */}

          <div className="mt-8 rounded-[24px] border border-slate-200 bg-white shadow-sm">

            <div className="grid grid-cols-1 divide-y md:grid-cols-4 md:divide-x md:divide-y-0">

              {/* CARD 1 */}

              <div className="flex items-center gap-4 p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <ShieldCheck className="h-7 w-7 text-green-600" />
                </div>

                <div>
                  <h4 className="font-bold text-[#102033]">
                    We're here to help
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Our support team usually responds within 24 hours
                  </p>
                </div>

              </div>

              {/* CARD 2 */}

              <div className="flex items-center gap-4 p-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <ShieldCheck className="h-7 w-7 text-blue-600" />
                </div>

                <div>
                  <h4 className="font-bold text-[#102033]">
                    Secure & Safe
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    100% protected
                  </p>
                </div>

              </div>

              {/* CARD 3 */}

              <div className="flex items-center gap-4 p-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                  <RefreshCcw className="h-7 w-7 text-purple-600" />
                </div>

                <div>
                  <h4 className="font-bold text-[#102033]">
                    Quick Response
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Within 24 hours
                  </p>
                </div>

              </div>

              {/* CARD 4 */}

              <div className="flex items-center gap-4 p-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <RefreshCcw className="h-7 w-7 text-green-600" />
                </div>

                <div>
                  <h4 className="font-bold text-[#102033]">
                    Hassle Free
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Easy Returns
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* IMAGE VIDEO POLICY */}

          {/* IMAGE VIDEO POLICY */}

          {currentStep === 2 && (

            <div
              id="uploadSection"
              className="mt-8 grid grid-cols-3 gap-5 items-stretch"
            >
              {/* IMAGE */}

              <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-lg h-[330px]">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                    <UploadCloud className="text-orange-500" size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#102033]">
                      Upload Images <span className="text-red-500">*</span>
                    </h3>

                    <p className="text-xs text-slate-500">
                      Upload clear photos of the product and issue
                    </p>
                  </div>

                </div>

                <label className="flex h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 transition hover:scale-[1.01]">

                  <UploadCloud
                    size={55}
                    className="text-orange-500"
                  />

                  <p className="mt-4 font-bold text-orange-600">
                    Click to upload
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    or drag and drop
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    JPG, PNG supported (Max 5 files)
                  </p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);

                      setReturnImages(files);

                      if (files.length > 0) {
                        setTimeout(() => {
                          validateUpload();
                        }, 200);
                      }
                    }}
                  />

                </label>

                {returnImages?.length > 0 && (
                  <div className="mt-4">

                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-green-600">
                        ✅ {returnImages.length} image{returnImages.length > 1 ? "s" : ""} selected
                      </p>

                      <button
                        type="button"
                        onClick={() => setReturnImages([])}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Remove All
                      </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto">
                      {returnImages.map((file, index) => (
                        <div
                          key={index}
                          className="relative h-20 w-20 overflow-hidden rounded-xl border bg-white shadow"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setReturnImages(returnImages.filter((_, i) => i !== index))
                            }
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>



              {/* VIDEO */}

              <div className="rounded-3xl border border-green-200 bg-white p-5 shadow-lg h-[330px]">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Video className="text-green-600" size={20} />
                  </div>

                  <div>

                    <h3 className="font-bold text-[#102033]">
                      Upload Video
                      <span className="text-slate-400">
                        {" "}
                        (Optional)
                      </span>
                    </h3>

                    <p className="text-xs text-slate-500">
                      Upload a short video showing the issue
                    </p>

                  </div>

                </div>

                <label className="flex h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 transition hover:scale-[1.01]">

                  <Video
                    size={55}
                    className="text-green-500"
                  />

                  <p className="mt-4 font-bold text-green-600">
                    Click to upload video
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    MP4, MOV supported (Max 1 file)
                  </p>

                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) =>
                      setReturnVideo(e.target.files?.[0] || null)
                    }
                  />

                </label>

                {returnVideo && (
                  <div className="mt-4">

                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-green-600">
                        ✅ 1 Video Selected
                      </p>

                      <button
                        type="button"
                        onClick={() => setReturnVideo(null)}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <video
                      controls
                      className="h-40 w-full rounded-xl border object-cover"
                      src={URL.createObjectURL(returnVideo)}
                    />

                  </div>
                )}

              </div>



              {/* POLICY */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg h-[330px]">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

                    <ShieldCheck
                      size={20}
                      className="text-blue-600"
                    />

                  </div>

                  <h3 className="font-bold text-[#102033]">
                    Return Guidelines
                  </h3>

                </div>

                <ul className="space-y-4 text-sm">

                  <li className="flex gap-2">
                    ✅
                    <span>
                      Request must be submitted within
                      <b> 24 hours </b>
                      of delivery.
                    </span>
                  </li>

                  <li className="flex gap-2">
                    ✅
                    <span>
                      Product should be
                      <b> unused.</b>
                    </span>
                  </li>

                  <li className="flex gap-2">
                    ✅
                    <span>
                      Product must be in
                      <b> original packaging.</b>
                    </span>
                  </li>

                  <li className="flex gap-2">
                    ✅
                    <span>
                      Support team will inspect uploaded evidence.
                    </span>
                  </li>

                </ul>

                <div className="mt-3 flex justify-center">

                  <div className="rounded-full bg-orange-100 p-5">

                    <ShieldCheck
                      className="text-orange-500"
                      size={42}
                    />

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* COMMENT */}

          {/* =========================
    DETAILS STEP
========================= */}

          {currentStep === 3 && (

            <div className="mt-8">

              <div className="rounded-3xl border bg-white p-8 shadow-sm">

                <div className="mb-8">

                  <h2 className="text-5xl font-black text-slate-900">

                    Describe Your Issue

                  </h2>

                  <p className="mt-3 text-lg text-slate-500">

                    Provide more details so our support team can verify your request quickly.

                  </p>

                </div>

                <div className="grid gap-8 lg:grid-cols-3">

                  <div className="lg:col-span-2">

                    <label className="mb-3 block text-lg font-bold">

                      Issue Description

                    </label>

                    <textarea

                      rows={8}

                      maxLength={500}

                      value={returnComment}

                      onChange={(e) => {

                        setReturnComment(e.target.value);

                      }}

                      placeholder="Explain the issue in detail..."

                      className="w-full rounded-2xl border-2 border-slate-200 p-5 text-lg outline-none transition focus:border-blue-500"

                    />

                    <div className="mt-3 flex justify-end">

                      <span className="text-sm text-slate-500">

                        {returnComment.length}/500

                      </span>

                    </div>

                  </div>

                  <div>

                    <div className="rounded-2xl border bg-blue-50 p-6">

                      <h3 className="mb-5 text-xl font-bold text-blue-700">

                        Helpful Tips

                      </h3>

                      <ul className="space-y-4 text-slate-700">

                        <li>✔ When did the issue occur?</li>

                        <li>✔ What exactly happened?</li>

                        <li>✔ Is product damaged?</li>

                        <li>✔ Is it usable?</li>

                        <li>✔ Mention serial number if available.</li>

                      </ul>

                    </div>

                    <div className="mt-6 rounded-2xl border bg-orange-50 p-5">

                      <p className="text-sm text-orange-700">

                        Your information will only be used to process your return request.

                      </p>

                    </div>

                  </div>

                </div>



              </div>

            </div>

          )}

          {/* REVIEW SECTION */}

          {currentStep === 4 && (

            <div
              id="reviewSection"


              className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
            >

              <div className="mb-8 rounded-3xl border border-blue-200 bg-blue-50 p-6">

                <h3 className="text-2xl font-bold text-blue-700">

                  Review Before Submit

                </h3>

                <p className="mt-3 text-slate-600 leading-8">

                  Please verify all information before submitting your return request.

                  Once submitted,

                  our Technical Support Team will inspect your uploaded evidence,

                  verify the product condition,

                  and update your return status within

                  <strong>24 Business Hours.</strong>

                </p>

              </div>
              <div className="mb-8 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">

                  <CheckCircle2
                    size={34}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <h2 className="text-4xl font-black text-[#102033]">
                    Review Your Return Request
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Please verify all details before submitting your return request.
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-3xl border bg-white p-6 shadow">

                <h3 className="text-xl font-bold">

                  Issue Description

                </h3>

                <div className="mt-4 rounded-2xl bg-slate-50 p-5 leading-8">

                  {returnComment}

                </div>

              </div>

              <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Product */}

                <div className="rounded-3xl border bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Product
                  </p>

                  <div className="mt-3 flex items-center gap-4">

                    <img
                      src={
                        getImage()
                          ? getImageUrl(getImage())
                          : "/placeholder-product.png"
                      }
                      className="h-16 w-16 rounded-xl border object-contain p-1"
                    />

                    <div>

                      <h4 className="font-bold">
                        {item?.name}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {item?.brand}
                      </p>

                    </div>

                  </div>

                </div>



                {/* Return */}

                <div className="rounded-3xl border bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Return Reason
                  </p>

                  <div className="mt-4">

                    <span className="rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-700">
                      {returnReason}
                    </span>

                  </div>

                </div>



                {/* Issue */}

                <div className="rounded-3xl border bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Selected Issue
                  </p>

                  <div className="mt-4">

                    <span className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
                      {returnSubReason}
                    </span>

                  </div>

                </div>



                {/* Images */}

                <div className="rounded-3xl border bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Images
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-green-600">
                    {returnImages.length}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Uploaded
                  </p>

                </div>



                {/* Video */}

                <div className="rounded-3xl border bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Video
                  </p>

                  <h2 className="mt-3 text-xl font-bold text-blue-600">

                    {returnVideo ? "Uploaded" : "Not Uploaded"}

                  </h2>

                </div>



                {/* Status */}

                <div className="rounded-3xl border bg-gradient-to-r from-green-50 to-green-100 p-5 shadow">

                  <p className="text-sm text-green-700">
                    Verification
                  </p>

                  <h2 className="mt-3 text-xl font-black text-green-700">

                    Ready To Submit

                  </h2>

                  <p className="mt-2 text-sm text-green-700">

                    All information completed successfully.

                  </p>

                </div>

              </div>

              <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-6">

                <div className="flex items-center gap-3">

                  <CheckCircle2
                    className="text-green-600"
                    size={26}
                  />

                  <div>


                    <div className="mt-8 rounded-[28px] border border-green-300 bg-gradient-to-r from-green-50 via-white to-green-50 p-8 shadow">

                      <div className="flex items-start gap-5">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600">

                          <CheckCircle2 size={34} className="text-white" />

                        </div>

                        <div>

                          <h2 className="text-2xl font-black text-green-700">

                            Everything is Ready

                          </h2>

                          <p className="mt-3 leading-8 text-slate-600">

                            Your return request contains all required information.

                            After clicking

                            <b> Continue To Submit </b>

                            our Technical Support Team will receive your request immediately.

                            You will receive a status update within

                            <b>24 Business Hours.</b>

                          </p>

                        </div>

                      </div>

                    </div>


                    <p className="text-sm text-green-600">

                      Click Continue to proceed to the final submission step.

                    </p>

                  </div>

                </div>

              </div>

            </div>



          )}
        </div>

       {currentStep === 5 && (

 <RefundDetailsStep
  item={item}
  paymentMethod={paymentMethod || order?.payment?.method}
  refundData={refundData}
  setRefundData={setRefundData}
  previousStep={previousStep}
  nextStep={nextStep}
/>

)}

        {/* SUBMIT STEP */}

        {currentStep === 6 && (

          <div className="mt-10 rounded-3xl border bg-white p-10 shadow-lg">

            <div className="mx-auto max-w-2xl text-center">

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-100">

                <CheckCircle2
                  size={60}
                  className="text-green-600"
                />

              </div>

              <h2 className="mt-6 text-4xl font-black text-[#102033]">

                Ready To Submit

              </h2>

              <p className="mt-4 text-lg text-slate-500">

                Please verify all information before submitting your return request.

              </p>

              <div className="mt-10 rounded-2xl border bg-slate-50 p-6 text-left">

                <div className="flex justify-between py-2">

                  <span>Reason</span>

                  <b>{returnReason}</b>

                </div>

                <div className="flex justify-between py-2">

                  <span>Issue</span>

                  <b>{returnSubReason}</b>

                </div>

                <div className="flex justify-between py-2">

                  <span>Images</span>

                  <b>{returnImages.length}</b>

                </div>

                <div className="flex justify-between py-2">

                  <span>Video</span>

                  <b>{returnVideo ? "Uploaded" : "Not Uploaded"}</b>

                </div>

              </div>

              <div className="mt-10 flex justify-center gap-5">

                <button

                  onClick={previousStep}

                  className="rounded-xl border px-8 py-3 font-bold"

                >

                  Back

                </button>

<button
  type="button"
  onClick={() => handleReturnRequest(refundData, item)}
  disabled={returnLoading}
  className="rounded-xl bg-green-600 px-10 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
>

                  {returnLoading
                    ? "Submitting..."
                    : "Submit Return Request"}

                </button>

              </div>

            </div>

          </div>

        )}

       {/* FOOTER */}

{currentStep !== 5 && (
  <div className="border-t bg-white p-6">
    <div className="flex justify-between">

      <div>
        {currentStep > 0 && (
          <button
            onClick={previousStep}
            className="rounded-xl border border-slate-300 px-8 py-3 font-bold hover:bg-slate-100"
          >
            ← Back
          </button>
        )}
      </div>

      <div>
     {currentStep < 6 && (
  <button
    type="button"
    onClick={nextStep}
    disabled={!isCurrentStepComplete()}
    className={`rounded-xl px-8 py-3 font-bold text-white ${
      isCurrentStepComplete()
        ? "bg-green-600 hover:bg-green-700"
        : "cursor-not-allowed bg-slate-300"
    }`}
  >
    Continue
  </button>
)}
      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
}
