"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Landmark,
    Wallet,
    BadgeIndianRupee,
    ShieldCheck,
    Clock3,
    CheckCircle2,
    ArrowRight,
    Info,
} from "lucide-react";

export default function RefundDetailsStep({
    item,
    paymentMethod = "",
    refundData,
    setRefundData,
    previousStep,
    nextStep,
}) {
    const totalRefund = useMemo(() => {
        return (
            item?.refundAmount ||
            item?.totalPrice ||
            item?.price ||
            item?.lineTotal ||
            0
        );
    }, [item]);

    const isCOD = paymentMethod?.toLowerCase() === "cod";

    const isOnline = !isCOD;

    const selectedMethod = refundData?.refundMethod || "";
    const [errors, setErrors] = useState({});

    const selectMethod = (method) => {
        setRefundData((prev) => ({
            ...prev,
            refundMethod: method,
        }));
    };

    const updateRefundField = (field, value) => {
        setRefundData((prev) => ({
            ...prev,
            [field]: field === "ifsc" ? value.toUpperCase() : value,
        }));
    };

    const formatTimelineDate = (value) => {
        const date = value ? new Date(value) : new Date();

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const refundTimelineSteps = [
        {
            title: "Request Submitted",
            message: "Your return request will be submitted to admin.",
            date: refundData?.requestedAt || new Date(),
            active: true,
        },
        {
            title: "Admin Review",
            message: "Admin will verify your reason, images and refund details.",
            date: refundData?.adminReviewedAt,
            active: false,
        },
        {
            title: "Pickup",
            message: "Pickup will be scheduled after approval.",
            date: refundData?.pickupScheduledAt,
            active: false,
        },
        {
            title: "Quality Check",
            message: "Returned item will be inspected by support team.",
            date: refundData?.qualityCheckedAt,
            active: false,
        },
        {
            title: selectedMethod === "WALLET" ? "Wallet Credit" : "Bank Transfer",
            message:
                selectedMethod === "WALLET"
                    ? "Refund will be credited to Royal Trading Wallet."
                    : "Refund will be transferred to your bank account.",
            date: refundData?.refundCompletedAt,
            active: false,
        },
    ];

    const validateRefund = () => {
        const newErrors = {};

        if (!selectedMethod) {
            toast.error("Please select refund method");
            return;
        }

        if (selectedMethod === "WALLET") {
            setErrors({});
            nextStep();
            return;
        }

        if (!refundData.accountHolder?.trim()) {
            newErrors.accountHolder = "Account Holder Name is required";
        } else if (refundData.accountHolder.trim().length < 3) {
            newErrors.accountHolder = "Minimum 3 characters required";
        }

        if (!refundData.bankName?.trim()) {
            newErrors.bankName = "Bank Name is required";
        }

        if (!refundData.accountNumber?.trim()) {
            newErrors.accountNumber = "Account Number is required";
        } else if (!/^[0-9]{9,18}$/.test(refundData.accountNumber)) {
            newErrors.accountNumber = "Enter 9 to 18 digit account number";
        }

        if (!refundData.confirmAccountNumber?.trim()) {
            newErrors.confirmAccountNumber = "Confirm Account Number";
        } else if (refundData.accountNumber !== refundData.confirmAccountNumber) {
            newErrors.confirmAccountNumber = "Account Number does not match";
        }

        if (refundData.upi?.trim() && !/^[\w.-]+@[\w.-]+$/.test(refundData.upi.trim())) {
            newErrors.upi = "Enter valid UPI ID, example name@upi";
        }

        if (!refundData.ifsc?.trim()) {
            newErrors.ifsc = "IFSC Code is required";
        } else {
            const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

            if (!ifscRegex.test(refundData.ifsc)) {
                newErrors.ifsc = "Invalid IFSC Code";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please correct highlighted fields");

            return;
        }

        nextStep();
    };

    const isBankValid =
        selectedMethod === "BANK" &&
        refundData.accountHolder?.trim().length >= 3 &&
        refundData.bankName?.trim().length >= 3 &&
        /^[0-9]{9,18}$/.test(refundData.accountNumber || "") &&
        refundData.accountNumber === refundData.confirmAccountNumber &&
        /^[A-Z]{4}0[A-Z0-9]{6}$/.test(refundData.ifsc || "") &&
        (!refundData.upi?.trim() || /^[\w.-]+@[\w.-]+$/.test(refundData.upi.trim()));

    const canContinue = selectedMethod === "WALLET" || isBankValid;

    return (
        <div className="space-y-8">
            {/* Header */}

            {/* Refund Instruction Header */}

            <div className="overflow-hidden rounded-[34px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 shadow-xl">
                <div className="p-8">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        {/* Left */}

                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                                ✅ Refund Process
                            </div>

                            <h2 className="mt-5 text-4xl font-black text-slate-900">
                                Choose Your Refund Method
                            </h2>

                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                Your return request has been received successfully. Now simply
                                choose how you would like to receive your refund. After our
                                Quality Team approves your returned product, your refund will
                                automatically be processed using the option you select below.
                            </p>
                        </div>

                        {/* Right */}

                        <div className="flex flex-col gap-3">
                            <div className="rounded-2xl bg-white border border-green-200 px-6 py-4 shadow">
                                <p className="text-sm text-slate-500">Refund Amount</p>

                                <h2 className="mt-1 text-4xl font-black text-green-700">
                                    ₹{totalRefund}
                                </h2>
                            </div>

                            <div>
                                {isCOD ? (
                                    <span className="rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white">
                                        Cash On Delivery Order
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white">
                                        Online Payment Order
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Information */}

                <div className="grid border-t bg-white lg:grid-cols-3">
                    <div className="flex items-start gap-4 border-r p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
                            💳
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900">Bank Account</h4>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Refund directly to your bank account. Processing takes
                                approximately
                                <b> 2–5 business days.</b>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 border-r p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl">
                            ⚡
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900">Wallet Refund</h4>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Get your refund instantly in
                                <b> Royal Trading Wallet</b>
                                after approval.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                            🔒
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900">Safe & Secure</h4>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Your refund details are securely encrypted. Only authorized
                                finance team members can access them.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Amount */}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border bg-white p-7 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-green-100 p-4">
                            <BadgeIndianRupee className="text-green-700" size={30} />
                        </div>

                        <div>
                            <p className="text-slate-500">Estimated Refund</p>

                            <h2 className="text-3xl font-black text-green-700">
                                ₹{totalRefund}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border bg-white p-7 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-100 p-4">
                            <Clock3 className="text-blue-700" size={28} />
                        </div>

                        <div>
                            <p className="text-slate-500">Processing Time</p>

                            <h2 className="text-xl font-black text-blue-700">
                                2-5 Business Days
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border bg-white p-7 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-emerald-100 p-4">
                            <ShieldCheck className="text-emerald-700" size={28} />
                        </div>

                        <div>
                            <p className="text-slate-500">Security</p>

                            <h2 className="text-xl font-black text-emerald-700">
                                RBI Secure
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Method */}

            <div>
                <h2 className="text-3xl font-black text-[#102033]">
                    Choose Refund Method
                </h2>

                <p className="mt-2 text-slate-500">
                    Select your preferred refund option.
                </p>
            </div>

            <div className="grid gap-7 lg:grid-cols-2">
                {/* Bank Card */}

                {/* Premium Bank Card */}

                <button
                    type="button"
                    onClick={() => selectMethod("BANK")}
                    className={`
group
relative
overflow-hidden
rounded-[32px]
border
text-left
transition-all
duration-500
transform
hover:-translate-y-1
hover:shadow-2xl

${selectedMethod === "BANK"
                            ? "border-blue-600 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-[0_20px_60px_rgba(37,99,235,.22)] scale-[1.01]"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }
`}
                >
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl" />

                    <div className="relative p-8">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-5">
                                <div
                                    className="
flex
h-20
w-20
items-center
justify-center
rounded-3xl
bg-gradient-to-br
from-blue-600
to-sky-500
shadow-lg
"
                                >
                                    <Landmark size={42} className="text-white" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-3xl font-black text-slate-900">
                                            Bank Account
                                        </h3>

                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                            RBI VERIFIED
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <p className="max-w-md text-[15px] leading-7 text-slate-600">
                                            Refund will be securely transferred to your registered
                                            bank account after your return is approved.
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                                🔒 RBI Secure
                                            </span>

                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                ✓ Verified
                                            </span>

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                Bank Transfer
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {selectedMethod === "BANK" ? (
                                    <div
                                        className="
flex
h-12
w-12
items-center
justify-center
rounded-full
bg-blue-600
shadow-lg
"
                                    >
                                        <CheckCircle2 size={26} className="text-white" />
                                    </div>
                                ) : (
                                    <div
                                        className="
h-12
w-12
rounded-full
border-2
border-slate-300
group-hover:border-blue-500
"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Refund Speed
                                </p>

                                <p className="mt-2 text-lg font-black text-blue-700">
                                    2–5 Business Days
                                </p>
                            </div>

                            <div className="rounded-2xl bg-blue-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Transfer
                                </p>

                                <p className="mt-2 text-lg font-black text-slate-900">
                                    Direct To Bank
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-600" />

                                <span className="text-[15px] text-slate-700">
                                    Refund goes directly to your bank account
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-600" />

                                <span className="text-[15px] text-slate-700">
                                    100% Secure & RBI compliant
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-600" />

                                <span className="text-[15px] text-slate-700">
                                    Track refund status anytime
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Processing Time</p>

                                    <h4 className="mt-1 text-xl font-black">2–5 Business Days</h4>
                                </div>

                                <div className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold">
                                    Select Bank →
                                </div>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Wallet Card */}

                {/* Premium Wallet Card */}

                <button
                    type="button"
                    onClick={() => selectMethod("WALLET")}
                    className={`
group
relative
overflow-hidden
rounded-[32px]
border
text-left
transition-all
duration-500
transform
hover:-translate-y-1
hover:shadow-2xl

${selectedMethod === "WALLET"
                            ? "border-emerald-600 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-[0_20px_60px_rgba(16,185,129,.25)] scale-[1.01]"
                            : "border-slate-200 bg-white hover:border-emerald-300"
                        }
`}
                >
                    <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />

                    <div className="relative p-8">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-5">
                                <div
                                    className="
flex
h-20
w-20
items-center
justify-center
rounded-3xl
bg-gradient-to-br
from-blue-600
to-sky-500
shadow-lg
"
                                >
                                    <Wallet size={42} className="text-white" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-3xl font-black text-slate-900">
                                            Royal Trading Wallet
                                        </h3>

                                        <span className="rounded-full bg-green-600 px-4 py-1 text-xs font-bold text-white">
                                            ⭐ FASTEST
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <p className="max-w-md text-[15px] leading-7 text-slate-600">
                                            Receive your refund instantly after approval. Your refund
                                            will remain safely stored in your Royal Trading Wallet for
                                            1 Year. You can use this wallet balance anytime while
                                            shopping on Royal Trading.
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                                                ⚡ Instant
                                            </span>

                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                1 Year Valid
                                            </span>

                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                                Future Shopping
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {selectedMethod === "WALLET" ? (
                                    <div
                                        className="
flex
h-12
w-12
items-center
justify-center
rounded-full
bg-emerald-600
shadow-lg
"
                                    >
                                        <CheckCircle2 size={26} className="text-white" />
                                    </div>
                                ) : (
                                    <div
                                        className="
h-12
w-12
rounded-full
border-2
border-slate-300
group-hover:border-emerald-500
"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-green-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Refund Speed
                                </p>

                                <p className="mt-2 text-lg font-black text-emerald-700">
                                    Instant
                                </p>
                            </div>

                            <div className="rounded-2xl bg-emerald-100 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Wallet Status
                                </p>

                                <p className="mt-2 text-lg font-black text-slate-900">Active</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-600" />

                                <span className="text-[15px] text-slate-700">
                                    Instant refund after approval
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-600" />

                                <span className="text-[15px] text-slate-700">
                                    No bank verification required
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-600" />

                                <span className="text-[15px] text-slate-700">
                                    Use wallet balance for future shopping
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Processing Time</p>

                                    <h4 className="mt-1 text-xl font-black">
                                        Instant After Approval
                                    </h4>
                                </div>

                                <div className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold">
                                    Use Wallet →
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
            {/* Dynamic Refund Section */}

            {selectedMethod === "BANK" && (
                <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                    <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
                                    <ShieldCheck size={15} />
                                    Secure Bank Transfer
                                </div>

                                <h2 className="mt-3 text-2xl font-black text-slate-950">
                                    Bank Account Details
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-slate-600">
                                    Refund will be processed only after admin verifies these details.
                                </p>
                            </div>

                            <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                                <p className="text-xs font-black uppercase text-emerald-700">
                                    Refund Amount
                                </p>
                                <p className="mt-1 text-2xl font-black text-emerald-700">
                                    Rs {Number(totalRefund || 0).toLocaleString("en-IN")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 rounded-b-[24px] bg-gradient-to-br from-sky-50 via-sky-100 to-blue-50 p-8 lg:grid-cols-2">            <div className="lg:col-span-2 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 shadow-sm">
                        <div className="flex gap-3">
                            <Info className="mt-0.5 shrink-0 text-amber-700" size={18} />
                            <p className="text-sm font-semibold leading-6 text-amber-800">
                                Please enter details exactly as per bank records. Wrong account number,
                                IFSC or account holder name can delay/reject your refund.
                            </p>
                        </div>
                    </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-800">
                                Account Holder Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                value={refundData.accountHolder || ""}
                                onChange={(e) =>
                                    updateRefundField(
                                        "accountHolder",
                                        e.target.value.replace(/[^a-zA-Z\s.]/g, "")
                                    )
                                }
                                className={`h-16 w-full rounded-xl border bg-white px-4 text-sm font-bold outline-none transition focus:ring-4 ${errors.accountHolder
                                        ? "border-red-500 bg-red-50 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                                    }`}
                                placeholder="As per bank passbook"
                                autoComplete="name"
                            />
                            {errors.accountHolder ? (
                                <p className="mt-2 text-xs font-bold text-red-600">
                                    {errors.accountHolder}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Only letters are allowed.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-800">
                                Bank Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                value={refundData.bankName || ""}
                                onChange={(e) =>
                                    updateRefundField(
                                        "bankName",
                                        e.target.value.replace(/[^a-zA-Z\s.]/g, "")
                                    )
                                }
                                className={`h-16 w-full rounded-xl border bg-white px-4 text-sm font-bold outline-none transition focus:ring-4 ${errors.bankName
                                        ? "border-red-500 bg-red-50 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                                    }`}
                                placeholder="Example: State Bank of India"
                                autoComplete="organization"
                            />
                            {errors.bankName ? (
                                <p className="mt-2 text-xs font-bold text-red-600">
                                    {errors.bankName}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Enter full bank name, not short form.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-800">
                                Account Number <span className="text-red-600">*</span>
                            </label>
                            <input
                                value={refundData.accountNumber || ""}
                                onChange={(e) =>
                                    updateRefundField(
                                        "accountNumber",
                                        e.target.value.replace(/\D/g, "").slice(0, 18)
                                    )
                                }
                                className={`h-16 w-full rounded-xl border bg-white px-4 text-sm font-bold tracking-wide outline-none transition focus:ring-4 ${errors.accountNumber
                                        ? "border-red-500 bg-red-50 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                                    }`}
                                placeholder="9 to 18 digit account number"
                                inputMode="numeric"
                                autoComplete="off"
                            />
                            {errors.accountNumber ? (
                                <p className="mt-2 text-xs font-bold text-red-600">
                                    {errors.accountNumber}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Numbers only. Do not add spaces or hyphen.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-800">
                                Confirm Account Number <span className="text-red-600">*</span>
                            </label>
                            <input
                                value={refundData.confirmAccountNumber || ""}
                                onChange={(e) =>
                                    updateRefundField(
                                        "confirmAccountNumber",
                                        e.target.value.replace(/\D/g, "").slice(0, 18)
                                    )
                                }
                                className={`h-16 w-full rounded-xl border bg-white px-4 text-sm font-bold tracking-wide outline-none transition focus:ring-4 ${errors.confirmAccountNumber
                                        ? "border-red-500 bg-red-50 focus:ring-red-100"
                                        : refundData.confirmAccountNumber &&
                                            refundData.accountNumber === refundData.confirmAccountNumber
                                            ? "border-emerald-500 focus:border-emerald-600 focus:ring-emerald-100"
                                            : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                                    }`}
                                placeholder="Re-enter account number"
                                inputMode="numeric"
                                autoComplete="off"
                            />
                            {errors.confirmAccountNumber ? (
                                <p className="mt-2 text-xs font-bold text-red-600">
                                    {errors.confirmAccountNumber}
                                </p>
                            ) : refundData.confirmAccountNumber &&
                                refundData.accountNumber === refundData.confirmAccountNumber ? (
                                <p className="mt-2 text-xs font-bold text-emerald-700">
                                    Account number matched.
                                </p>
                            ) : (
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Must match account number exactly.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-800">
                                IFSC Code <span className="text-red-600">*</span>
                            </label>
                            <input
                                value={refundData.ifsc || ""}
                                onChange={(e) =>
                                    updateRefundField(
                                        "ifsc",
                                        e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11)
                                    )
                                }
                                className={`h-16 w-full rounded-xl border bg-white px-4 text-sm font-bold uppercase tracking-wide outline-none transition focus:ring-4 ${errors.ifsc
                                        ? "border-red-500 bg-red-50 focus:ring-red-100"
                                        : /^[A-Z]{4}0[A-Z0-9]{6}$/.test(refundData.ifsc || "")
                                            ? "border-emerald-500 focus:border-emerald-600 focus:ring-emerald-100"
                                            : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                                    }`}
                                placeholder="SBIN0001234"
                                maxLength={11}
                                autoComplete="off"
                            />
                            {errors.ifsc ? (
                                <p className="mt-2 text-xs font-bold text-red-600">
                                    {errors.ifsc}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Format: 4 letters + 0 + 6 letters/numbers.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-800">
                                UPI ID <span className="text-slate-400">(Optional)</span>
                            </label>
                            <input
                                value={refundData.upi || ""}
                                onChange={(e) => updateRefundField("upi", e.target.value.trim())}
                                className={`h-16 w-full rounded-2xl border bg-white px-4 text-sm font-bold outline-none transition focus:ring-4 ${errors.upi
                                        ? "border-red-500 bg-red-50 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                                    }`}
                                placeholder="example@upi"
                                autoComplete="off"
                            />
                            {errors.upi ? (
                                <p className="mt-2 text-xs font-bold text-red-600">
                                    {errors.upi}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                    Optional. Add only if admin needs alternate verification.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {selectedMethod === "WALLET" && (
                <div className="rounded-[34px] overflow-hidden border border-green-200 bg-white shadow-xl">
                    <div className="bg-white border-b border-green-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start p-6">
                            {/* LEFT */}

                            <div className="min-w-0 lg:self-start">
                                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                                    ⚡ Instant Wallet Refund
                                </span>

                                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900">
                                    Royal Trading Wallet
                                </h2>

                                <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600">
                                    Get your refund instantly after approval. Your wallet balance
                                    remains valid for{" "}
                                    <span className="font-bold text-green-700">1 Year</span>. Use
                                    it anytime for future shopping without waiting for bank
                                    processing.
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                                        ⚡ Instant Credit
                                    </span>

                                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                        🛡 Secure
                                    </span>

                                    <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                                        ⏳ 1 Year Valid
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs text-slate-500">Credit Time</p>
                                        <h4 className="mt-1 text-lg font-black text-green-700">
                                            Instant
                                        </h4>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs text-slate-500">Validity</p>
                                        <h4 className="mt-1 text-lg font-black text-slate-900">
                                            1 Year
                                        </h4>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs text-slate-500">Security</p>
                                        <h4 className="mt-1 text-lg font-black text-blue-700">
                                            100% Safe
                                        </h4>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs text-slate-500">Usage</p>
                                        <h4 className="mt-1 text-lg font-black text-orange-600">
                                            Future Orders
                                        </h4>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5">
                                    <h3 className="text-lg font-black text-slate-900">
                                        Wallet Benefits
                                    </h3>

                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3">
                                            <span className="text-slate-600">Instant Refund</span>

                                            <span className="font-bold text-green-700">Yes</span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3">
                                            <span className="text-slate-600">Bank Verification</span>

                                            <span className="font-bold text-red-500">
                                                Not Required
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3">
                                            <span className="text-slate-600">Wallet Validity</span>

                                            <span className="font-bold text-orange-600">1 Year</span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3">
                                            <span className="text-slate-600">Refund Security</span>

                                            <span className="font-bold text-blue-700">
                                                100% Secure
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}



                            <div className="min-w-0">

                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                                        <Wallet size={34} className="text-green-700" />
                                    </div>

                                    <h3 className="mt-4 text-center text-2xl font-black text-slate-900">
                                        Wallet Balance
                                    </h3>

                                    <p className="mt-2 text-center text-sm text-slate-500">
                                        Refund credited immediately after approval.
                                    </p>

                                    <div className="mt-5 rounded-2xl bg-green-600 px-5 py-5 text-center text-white">
                                        <p className="text-sm opacity-90">Available Refund</p>

                                        <h2 className="mt-1 text-5xl font-black">₹{totalRefund}</h2>
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-3">

                                        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center">

                                            <p className="text-xs font-semibold uppercase text-green-600">
                                                Refund Speed
                                            </p>

                                            <h4 className="mt-2 text-lg font-black text-green-700">
                                                Instant
                                            </h4>

                                        </div>

                                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">

                                            <p className="text-xs font-semibold uppercase text-blue-600">
                                                Wallet Status
                                            </p>

                                            <h4 className="mt-2 text-lg font-black text-blue-700">
                                                Active
                                            </h4>

                                        </div>

                                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center">

                                            <p className="text-xs font-semibold uppercase text-orange-600">
                                                Validity
                                            </p>

                                            <h4 className="mt-2 text-lg font-black text-orange-600">
                                                1 Year
                                            </h4>

                                        </div>

                                    </div>

                                    <div className="mt-6 rounded-3xl border border-green-200 bg-white p-5 shadow-sm">

                                        <div className="mb-4 flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100">
                                                <CheckCircle2 className="text-green-700" size={20} />
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-black text-slate-900">
                                                    Wallet Benefits
                                                </h4>

                                                <p className="text-xs text-slate-500">
                                                    Why Wallet Refund is the Best Choice
                                                </p>
                                            </div>

                                        </div>

                                        <div className="grid grid-cols-2 gap-3">

                                            <div className="rounded-2xl border border-green-100 bg-green-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Refund
                                                </p>

                                                <p className="mt-1 font-bold text-green-700">
                                                    ⚡ Instant
                                                </p>

                                            </div>

                                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Verification
                                                </p>

                                                <p className="mt-1 font-bold text-blue-700">
                                                    Not Required
                                                </p>

                                            </div>

                                            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Validity
                                                </p>

                                                <p className="mt-1 font-bold text-orange-600">
                                                    1 Year
                                                </p>

                                            </div>

                                            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Shopping
                                                </p>

                                                <p className="mt-1 font-bold text-purple-700">
                                                    Future Orders
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-8 lg:grid-cols-4">
                        <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Refund Amount
                            </p>

                            <h2 className="mt-3 text-4xl font-black text-green-700">
                                ₹{totalRefund}
                            </h2>
                        </div>

                        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Credit Speed
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-blue-700">
                                Instant
                            </h2>
                        </div>

                        <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Wallet Validity
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-orange-600">
                                1 Year
                            </h2>
                        </div>

                        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Wallet Status
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-emerald-700">
                                Active
                            </h2>
                        </div>
                    </div>

                    <div className="border-t bg-gradient-to-r from-green-50 via-white to-green-50 p-8">
                        <div className="rounded-3xl border border-green-200 bg-white p-7 shadow-sm">
                            <h3 className="text-2xl font-black text-green-700">
                                Why choose Royal Trading Wallet?
                            </h3>

                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-1 text-green-600" size={20} />

                                    <p>Refund credited instantly after approval.</p>
                                </div>

                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-1 text-green-600" size={20} />

                                    <p>Wallet balance remains valid for 1 year.</p>
                                </div>

                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-1 text-green-600" size={20} />

                                    <p>Use wallet balance anytime on future purchases.</p>
                                </div>

                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-1 text-green-600" size={20} />

                                    <p>No bank verification or waiting period.</p>
                                </div>

                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-1 text-green-600" size={20} />

                                    <p>100% secure wallet protected by Royal Trading.</p>
                                </div>

                                <div className="flex gap-3">
                                    <CheckCircle2 className="mt-1 text-green-600" size={20} />

                                    <p>Use your wallet amount whenever you want within 1 year.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t bg-green-50 px-8 py-6">
                        <div className="flex gap-3">
                            <CheckCircle2 className="mt-1 text-green-700" size={22} />

                            <p className="leading-8 text-slate-700">
                                Wallet refund is the fastest option. Once your return is
                                approved, the refund will be added instantly to your Royal
                                Trading Wallet. You can use this balance for future purchases.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Timeline */}

            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
                                Refund Journey
                            </span>
                            <h2 className="mt-3 text-2xl font-black text-slate-950">
                                Refund Process Timeline
                            </h2>
                            <p className="mt-1 text-sm font-semibold text-slate-600">
                                Real progress will update from admin panel after request submission.
                            </p>
                        </div>

                        <div className="rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-right">
                            <p className="text-xs font-black uppercase text-slate-500">
                                Request Time
                            </p>
                            <p className="mt-1 text-sm font-black text-slate-900">
                                {formatTimelineDate(refundData?.requestedAt || new Date())}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="relative">
                        <div className="absolute left-[19px] top-2 h-[calc(100%-20px)] w-[2px] bg-slate-200" />

                        <div className="space-y-5">
                            {refundTimelineSteps.map((step, index) => {
                                const completed = step.active || Boolean(step.date);
                                const current = index === 0;

                                return (
                                    <div key={step.title} className="relative flex gap-4">
                                        <div
                                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${completed
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "border-slate-300 bg-white text-slate-400"
                                                }`}
                                        >
                                            {completed ? <CheckCircle2 size={18} /> : index + 1}
                                        </div>

                                        <div
                                            className={`min-w-0 flex-1 rounded-[16px] border p-4 ${current
                                                    ? "border-blue-200 bg-blue-50"
                                                    : "border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="text-base font-black text-slate-950">
                                                        {step.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                                                        {step.message}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${completed
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-100 text-slate-500"
                                                        }`}
                                                >
                                                    {completed ? "Current" : "Pending"}
                                                </span>
                                            </div>

                                            <div className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700">
                                                {completed
                                                    ? formatTimelineDate(step.date || new Date())
                                                    : "Will update from Royal panel"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Summary */}

            {/* Security Notice */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex gap-5">
                    <ShieldCheck className="mt-1 text-green-700" size={28} />

                    <div>
                        <h3 className="text-xl font-black text-green-700">
                            Secure Refund Processing
                        </h3>

                        <p className="mt-3 leading-8 text-slate-700">
                            Your refund information is securely encrypted. Only authorized
                            Royal Trading finance executives can access these details. Refund
                            processing begins only after return approval and quality
                            inspection.
                        </p>
                    </div>
                </div>
            </div>

            {/* Buttons */}

            <div className="flex items-center justify-between pt-6">
                <button
                    type="button"
                    onClick={previousStep}
                    className="rounded-2xl border border-slate-300 bg-white px-8 py-4 font-bold hover:bg-slate-100"
                >
                    ← Back
                </button>

                <button
                    type="button"
                    disabled={!canContinue}
                    onClick={validateRefund}
                    className={`
flex items-center
gap-3
rounded-2xl
px-10
py-4
text-lg
font-black
shadow-xl
transition-all

${canContinue
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                        }
`}
                >
                    Continue
                    <ArrowRight size={22} />
                </button>
            </div>
        </div>
    );
}
