"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import {
    Search,
    Phone,
    MessageCircle,
    PackageSearch,
    Clock,
    CheckCircle2,
} from "lucide-react";

const statusLabel = {
    new: "Request Submitted",
    checking: "Checking Availability",
    available: "Available",
    quoted: "Quotation Ready",
    unavailable: "Unavailable",
    closed: "Closed",
};

const statusClass = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    checking: "bg-yellow-50 text-yellow-700 border-yellow-200",
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    quoted: "bg-green-50 text-green-700 border-green-200",
    unavailable: "bg-red-50 text-red-700 border-red-200",
    closed: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function MyComponentRequestsPage() {
    const [search, setSearch] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        if (!search.trim()) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${API_BASE}/api/component-requests/lookup?search=${encodeURIComponent(
  search.trim()
)}`,
                { cache: "no-store" }
            );

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Request not found");
                return;
            }

            setRequests(data.requests || []);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#eef6ff]">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 py-12">
                <div className="mb-8 rounded-[32px] bg-gradient-to-r from-[#0f4c81] to-[#0ea5e9] p-8 text-white shadow-xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                        <PackageSearch size={18} />
                        Track Component Request
                    </div>

                    <h1 className="text-3xl font-black md:text-5xl">
                        My Component Requests
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">
                        Apni email enter karke dekho ki aapne kaunsi component request ki
                        thi aur admin ne availability, price, lead time ya call instruction
                        kya update kiya hai.
                    </p>
                </div>

                <div className="mb-8 rounded-[28px] border border-blue-100 bg-white p-5 shadow-lg">
                    <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by email, phone number, component name or part number"
                                className="h-[56px] w-full rounded-2xl border border-slate-200 bg-[#f8fbff] pl-12 pr-4 font-semibold outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={fetchRequests}
                            disabled={loading}
                            className="h-[56px] rounded-2xl bg-[#0f4c81] font-black text-white shadow transition hover:bg-[#0b3b66] disabled:opacity-60"
                        >
                            {loading ? "Checking..." : "Check Status"}
                        </button>
                    </div>
                </div>

                <div className="space-y-5">
                    {requests.length === 0 ? (
                        <div className="rounded-[28px] bg-white p-10 text-center shadow">
                            <PackageSearch size={52} className="mx-auto text-slate-300" />
                            <h2 className="mt-4 text-xl font-black text-slate-900">
                                No request loaded
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Email enter karke apni component request status check karo.
                            </p>

                            <Link
                                href="/request-component"
                                className="mt-5 inline-flex rounded-xl bg-[#0f4c81] px-6 py-3 font-black text-white"
                            >
                                Submit New Request
                            </Link>
                        </div>
                    ) : (
                        requests.map((req) => <RequestCard key={req._id} req={req} />)
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function RequestCard({ req }) {
    const items = req.items?.length
        ? req.items
        : [
            {
                componentName: req.componentName,
                partNumber: req.partNumber,
                brand: req.brand,
                quantity: req.quantity,
            },
        ];

    const phone = req.adminContactNumber || "09334966286";
    const cleanPhone = String(phone).replace(/\D/g, "");
    const whatsappNumber = cleanPhone.startsWith("91")
        ? cleanPhone
        : `91${cleanPhone}`;

    const totalQty =
        items.reduce((total, item) => total + Number(item.quantity || 0), 0) || 1;

    return (
        <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-lg">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-[#f8fbff] p-5 md:flex-row md:items-center">
                <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span
                            className={`rounded-full border px-4 py-1.5 text-xs font-black uppercase ${statusClass[req.status] || statusClass.new
                                }`}
                        >
                            {statusLabel[req.status] || req.status || "Request Submitted"}
                        </span>

                        <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
                            <Clock size={16} />
                            {formatDate(req.createdAt)}
                        </span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900">
                        {items[0]?.componentName || "Component Request"}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                        Total Items: {items.length} • Total Quantity: {totalQty}
                    </p>
                </div>

                {req.status === "available" || req.status === "quoted" ? (
                    <div className="rounded-2xl bg-emerald-600 px-5 py-4 text-white">
                        <div className="flex items-center gap-2 text-sm font-black">
                            <CheckCircle2 size={18} />
                            Product Available
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
                        Requested Components
                    </h3>

                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-100 bg-[#f8fbff] p-4"
                            >
                                <p className="mb-2 text-xs font-black text-[#0f4c81]">
                                    Item #{index + 1}
                                </p>

                                <h4 className="text-lg font-black text-slate-900">
                                    {item.componentName || "N/A"}
                                </h4>

                                <div className="mt-3 grid gap-3 md:grid-cols-3">
                                    <InfoBox label="MPN" value={item.partNumber || "N/A"} />
                                    <InfoBox label="Brand" value={item.brand || "N/A"} />
                                    <InfoBox label="Quantity" value={item.quantity || 1} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
                        Admin Response
                    </h3>

                    <p className="rounded-2xl bg-[#f8fbff] p-4 text-sm font-semibold leading-7 text-slate-700">
                        {req.customerMessage ||
                            "Your request is submitted. Our team is checking availability and will update here soon."}
                    </p>

                    {req.availableItemsNote ? (
                        <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
                            <p className="text-xs font-black uppercase text-emerald-700">
                                Availability Note
                            </p>
                            <p className="mt-1 text-sm font-bold text-emerald-900">
                                {req.availableItemsNote}
                            </p>
                        </div>
                    ) : null}

                    {req.adminPrice ? (
                        <div className="mt-4 rounded-2xl bg-blue-50 p-4">
                            <p className="text-xs font-black uppercase text-blue-700">
                                Admin Price
                            </p>
                            <p className="mt-1 text-xl font-black text-blue-900">
                                ₹ {Number(req.adminPrice).toLocaleString("en-IN")}
                            </p>
                        </div>
                    ) : null}

                    {req.adminLeadTime ? (
                        <div className="mt-4 rounded-2xl bg-yellow-50 p-4">
                            <p className="text-xs font-black uppercase text-yellow-700">
                                Lead Time
                            </p>
                            <p className="mt-1 text-sm font-bold text-yellow-900">
                                {req.adminLeadTime}
                            </p>
                        </div>
                    ) : null}

                    {(req.status === "available" || req.status === "quoted") && phone ? (
                        <div className="mt-5 grid gap-3">
                            <a
                                href={`tel:${phone}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-5 py-3 font-black text-white shadow transition hover:bg-[#0b3b66]"
                            >
                                <Phone size={18} className="text-white" />
                                <span className="text-white">
                                    Call Now: {phone}
                                </span>
                            </a>

                            <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                    "Hello Royal Component, I want to discuss my component request."
                                )}`}
                                target="_blank"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-black text-white shadow transition hover:bg-emerald-700"
                            >
                                <MessageCircle size={18} className="text-white" />
                                <span className="text-white">
                                    WhatsApp Now
                                </span>
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

function InfoBox({ label, value }) {
    return (
        <div className="rounded-xl bg-white p-3">
            <p className="text-xs font-black uppercase text-slate-400">{label}</p>
            <p className="mt-1 break-words text-sm font-bold text-slate-700">
                {value || "N/A"}
            </p>
        </div>
    );
}