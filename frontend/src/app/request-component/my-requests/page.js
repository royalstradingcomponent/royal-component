"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Package, IndianRupee, Receipt, Boxes, BadgeCheck } from "lucide-react";
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

    useEffect(() => {
        fetchAllRequests();
    }, []);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllRequests = async () => {
        try {
            setLoading(true);

            const storedUser = JSON.parse(localStorage.getItem("user"));

            const token = storedUser?.token;

            const res = await fetch(`${API_BASE}/api/component-requests/my`, {
                cache: "no-store",

                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            const data = await res.json();

            if (data.success) {
                setRequests(data.requests || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        if (!search.trim()) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${API_BASE}/api/component-requests/lookup?search=${encodeURIComponent(
                    search.trim(),
                )}`,
                { cache: "no-store" },
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
                                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0f4c81] px-6 py-3 font-black text-white shadow-lg transition-all duration-200 hover:bg-[#0b3b66] hover:text-white"
                            >
                                <span className="text-white">Submit New Request</span>
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
                            {req.status === "quoted"
                                ? "Quotation Ready"
                                : "Product Available"}
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="grid gap-6 p-5 xl:grid-cols-[60%_40%]">
                <div>
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
                        Requested Components
                    </h3>

                    {req.datasheetUrls.map((file, index) => (
                        <div key={index} className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="font-semibold text-slate-700">
                                PDF #{index + 1}
                            </span>

                            <a
                                href={`${API_BASE}${file.replace(
                                    "/uploads/request-files/",
                                    "/uploads/requests/",
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-6 py-3 shadow-md transition hover:bg-sky-600"
                            >
                                <span className="font-bold text-white">👁 Preview PDF</span>
                            </a>

                            <a
                                href={`${API_BASE}${file.replace(
                                    "/uploads/request-files/",
                                    "/uploads/requests/",
                                )}`}
                                download
                                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 shadow-md transition hover:bg-emerald-600"
                            >
                                <span className="font-bold text-white">⬇ Download PDF</span>
                            </a>
                        </div>
                    ))}

                    {req.imageUrls?.length > 0 && (
                        <div className="mb-4">
                            <p className="mb-2 text-sm font-black text-slate-700">
                                Uploaded Images
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {req.imageUrls.map((img, index) => (
                                    <a
                                        key={index}
                                        href={`${API_BASE}${img}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            src={`${API_BASE}${img}`}
                                            alt=""
                                            className="h-24 w-24 rounded-xl border object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 space-y-4">
                       {items.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-100 bg-[#f8fbff] p-4"
                            >
                                <p className="mb-2 text-xs font-black text-[#0f4c81]">
                                    Item #{index + 1}
                                </p>

                                <h4 className="text-lg font-black text-slate-900">
                                    {item.componentName ||
                                        (req.datasheetUrls?.length > 0 ? "📄 BOM Uploaded" : "N/A")}
                                </h4>

                                <div className="mt-3 grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    <InfoBox
                                        label="MPN"
                                        value={
                                            item.partNumber ||
                                            (req.datasheetUrls?.length > 0
                                                ? "Uploaded In BOM"
                                                : "N/A")
                                        }
                                    />
                                    <InfoBox
                                        label="Brand"
                                        value={
                                            item.brand ||
                                            (req.datasheetUrls?.length > 0
                                                ? "Uploaded In BOM"
                                                : "N/A")
                                        }
                                    />
                                    <InfoBox label="Quantity" value={item.quantity || 1} />

                                    <InfoBox
                                        label="Status"
                                        value={item.availabilityStatus || "Checking"}
                                    />

                                    <InfoBox
                                        label="Unit Price"
                                        value={
                                            item.unitPrice
                                                ? `₹${Number(item.unitPrice).toLocaleString("en-IN")}`
                                                : "Pending"
                                        }
                                    />
                                    <InfoBox
                                        label="GST Per Unit (18%)"
                                        value={
                                            item.unitPrice
                                                ? `₹${(Number(item.unitPrice) * 0.18).toFixed(2)}`
                                                : "Pending"
                                        }
                                    />

                                    <InfoBox
                                        label="GST Amount (18%)"
                                        value={
                                            item.gstAmount
                                                ? `₹${Number(item.gstAmount).toLocaleString("en-IN")}`
                                                : "Pending"
                                        }
                                    />

                                    <InfoBox
                                        label="Amount Before GST"
                                        value={
                                            item.lineTotal
                                                ? `₹${Number(
                                                    (item.lineTotal || 0) - (item.gstAmount || 0),
                                                ).toLocaleString("en-IN")}`
                                                : "Pending"
                                        }
                                    />

                                    <InfoBox
                                        label="Final Amount"
                                        value={
                                            item.lineTotal
                                                ? `₹${Number(item.lineTotal).toLocaleString("en-IN")}`
                                                : "Pending"
                                        }
                                    />
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
                                Final Quotation
                            </p>

                            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-black uppercase text-slate-400">
                                            Quotation Number
                                        </p>

                                        <p className="mt-1 text-sm font-black text-slate-800">
                                            {req.quotationNumber || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-black uppercase text-slate-400">
                                            Validity
                                        </p>

                                        <p className="mt-1 text-sm font-black text-slate-800">
                                            {req.quotationValidity || "7 Days"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="
                       group
                     rounded-3xl
                      border
                          border-slate-200
                               bg-white
                                   p-5
                                    shadow-sm
                                      transition-all
                                        duration-300
                                          hover:shadow-xl
                                       hover:-translate-y-1
                                              "
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900">
                                                    {item.componentName}
                                                </h4>

                                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                                    {item.partNumber || "No Part Number"}
                                                </p>
                                            </div>

                                            <span className="rounded-full  bg-emerald-100  px-3 py-1 text-xs font-black text-emerald-700 ">
                                                Available
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="font-medium text-slate-600">Brand</span>

                                            <span className="font-black">{item.brand || "N/A"}</span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Boxes size={16} className="text-blue-600" />

                                                <span className="font-medium">Quantity</span>
                                            </div>

                                            <span className="font-black">{item.quantity}</span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IndianRupee size={16} className="text-green-600" />

                                                <span className="font-medium">Unit Price</span>
                                            </div>

                                            <span className="font-black text-green-700">
                                                ₹{Number(item.unitPrice || 0).toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Receipt size={16} className="text-amber-600" />

                                                <span className="font-medium text-slate-600">
                                                    GST Per Unit (18%)
                                                </span>
                                            </div>

                                            <span className="font-black text-amber-700">
                                                ₹{((Number(item.unitPrice || 0) * 18) / 100).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Receipt size={16} className="text-orange-600" />

                                                <span className="font-medium">GST (18%)</span>
                                            </div>

                                            <span className="font-black text-orange-700">
                                                ₹{Number(item.gstAmount || 0).toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <div
                                            className="
    mt-5
    rounded-2xl
    border
    border-green-200
    bg-green-50
    p-4
    "
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-green-800">
                                                    Amount (Without GST)
                                                </span>

                                                <span className="text-xl font-black text-green-700">
                                                    ₹
                                                    {Number(
                                                        (item.lineTotal || 0) - (item.gstAmount || 0),
                                                    ).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className="
    mt-5
    rounded-2xl
    bg-gradient-to-r
    from-blue-600
    to-indigo-600
    p-4
    text-white
    "
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold">Final Amount</span>

                                                <span className="text-xl font-black">
                                                    ₹{Number(item.lineTotal || 0).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center  shadow-sm">
                                        <p className="text-xs font-bold uppercase text-slate-500">
                                            Sub Total
                                        </p>

                                        <p className="mt-2 text-2xl font-black text-slate-900">
                                            ₹{Number(req.subTotal || 0).toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    <div
                                        className="
        rounded-2xl
        bg-orange-50
        border
        border-orange-200
        p-4
        text-center
        shadow-sm
        "
                                    >
                                        <p className="text-xs font-bold uppercase text-orange-600">
                                            SGST
                                        </p>

                                        <p className="mt-2 text-2xl font-black text-orange-700">
                                            ₹{Number(req.sgstAmount || 0).toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    <div
                                        className="
        rounded-2xl
        bg-orange-50
        border
        border-orange-200
        p-4
        text-center
        shadow-sm
        "
                                    >
                                        <p className="text-xs font-bold uppercase text-orange-600">
                                            CGST
                                        </p>

                                        <p className="mt-2 text-2xl font-black text-orange-700">
                                            ₹{Number(req.cgstAmount || 0).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {(req.status === "available" || req.status === "quoted") && (
                        <a
                            href={`${API_BASE}/api/component-requests/download-pdf/${req._id}`}
                            target="_blank"
                            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] px-5 py-3 text-sm font-black text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-[#1d4ed8] hover:to-[#6d28d9]"
                        >
                            <span className="text-white">Download Quotation PDF</span>
                        </a>
                    )}

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
                                <span className="text-white">Call Now: {phone}</span>
                            </a>

                            <a
                                href={`https://wa.me/919871444105?text=${encodeURIComponent(`

                             Hello Royal Trading Co,

                     I want to confirm this quotation.

                    Component:
              ${items[0]?.componentName}

                    Part Number:
                 ${items[0]?.partNumber}

                    Brand:
               ${items[0]?.brand}

                     Quantity:
                      ${items[0]?.quantity}

                       Unit Price:
                       ₹${Math.round(
                                    Number(req.adminPrice || 0) /
                                    (items[0]?.quantity || 1),
                                )}

                        Total Amount:
                  ₹${Number(req.adminPrice || 0).toLocaleString("en-IN")}

                         Lead Time:
                           ${req.adminLeadTime || "2-5 business days"}

                          Please share payment details and dispatch process.

                           Thank you.
                             `)}`}
                                target="_blank"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-black text-white shadow transition hover:bg-emerald-700"
                            >
                                <MessageCircle size={18} className="text-white" />
                                <span className="text-white">WhatsApp Now</span>
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

function InfoBox({ label, value }) {
    const colors = {
        MPN: "bg-blue-50 border-blue-300",

        Brand: "bg-purple-50 border-purple-300",

        Quantity: "bg-cyan-50 border-cyan-300",

        Status: "bg-emerald-50 border-emerald-300",

        "Unit Price":
            "bg-green-50 border-green-300",

        "GST Per Unit (18%)":
            "bg-amber-50 border-amber-300",

        "GST Amount (18%)":
            "bg-orange-50 border-orange-300",

        "Amount Before GST":
            "bg-teal-50 border-teal-300",

        "Final Amount":
            "bg-indigo-50 border-indigo-300",
    };

    const valueColors = {
        MPN: "text-blue-700",
        Brand: "text-purple-700",
        Quantity: "text-cyan-700",
        Status: "text-emerald-700",
        "Unit Price": "text-green-700",
        "GST Per Unit (18%)": "text-amber-700",
        "GST Amount (18%)": "text-orange-700",
        "Amount Before GST": "text-teal-700",
        "Final Amount": "text-indigo-700",
    };

    return (
        <div
            className={`
    rounded-3xl
    border
    p-4
    sm:p-5
    min-h-[90px]
    sm:min-h-[100px]
    md:min-h-[110px]
    shadow-md
    flex
    flex-col
    justify-between
    transition-all
    duration-300
    hover:shadow-lg
    ${colors[label] || "bg-white border-slate-200"}
  `}
        >
            <p
                className="
    text-[11px]
    sm:text-xs
    md:text-sm
    font-black
    uppercase
    tracking-[2.5px]
    text-[#1e293b]
  "
            >
                {label}
            </p>

            <p
                className={`
    text-xs
    sm:text-sm
    md:text-base
    font-semibold
    break-words
    leading-tight
    ${valueColors[label] || "text-slate-900"}
  `}
            >
                {value || "N/A"}
            </p>
        </div>
    );
}
