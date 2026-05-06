"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import {
    Search,
    RefreshCcw,
    FileText,
    ImageIcon,
    Save,
    PackageSearch,
    User,
    Phone,
    Mail,
    Clock,
    IndianRupee,
    MessageSquareText,
    Truck,
    MessageCircle,
    Star,
} from "lucide-react";

const statusOptions = [
    "new",
    "checking",
    "available",
    "quoted",
    "unavailable",
    "closed",
];

const statusStyles = {
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

export default function AdminComponentRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const stats = useMemo(() => {
        return {
            total: requests.length,
            newCount: requests.filter((r) => r.status === "new").length,
            checking: requests.filter((r) => r.status === "checking").length,
            available: requests.filter((r) => r.status === "available").length,
            quoted: requests.filter((r) => r.status === "quoted").length,
        };
    }, [requests]);

    const fetchRequests = async () => {
        try {
            setLoading(true);

            const adminToken = localStorage.getItem("adminToken");
            if (!adminToken) {
                toast.error("Admin login required");
                setLoading(false);
                return;
            }

            const params = new URLSearchParams();
            params.set("status", status);
            if (search.trim()) params.set("search", search.trim());

            const res = await fetch(
                `${API_BASE}/api/component-requests/admin?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                    cache: "no-store",
                }
            );

            const data = await res.json();

            if (data.success) {
                setRequests(data.requests || []);
            } else {
                toast.error(data.message || "Failed to fetch requests");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const updateRequest = async (id, payload) => {
        try {
            const adminToken = localStorage.getItem("adminToken");
            if (!adminToken) {
                toast.error("Admin login required");
                return;
            }

            const res = await fetch(`${API_BASE}/api/component-requests/admin/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Update failed");
                return;
            }

            toast.success("Request updated successfully");
            fetchRequests();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [status]);

    return (
        <main className="min-h-screen bg-[#eef6ff] p-4 lg:p-8">
            <div className="mb-6 rounded-[30px] bg-gradient-to-r from-[#0f4c81] via-[#0f6cbd] to-[#38bdf8] p-6 text-white shadow-xl">
                <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                            <PackageSearch size={18} />
                            RFQ / Missing Component Requests
                        </div>

                        <h1 className="text-3xl font-black lg:text-4xl">
                            Component Requests
                        </h1>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-50">
                            Manage missing components, availability, pricing, lead time,
                            customer message and call instructions from admin panel.
                        </p>
                    </div>

                    <button
                        onClick={fetchRequests}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-[#0f4c81] shadow-lg transition hover:bg-blue-50"
                    >
                        <RefreshCcw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-5">
                <StatCard title="Total Requests" value={stats.total} />
                <StatCard title="New" value={stats.newCount} />
                <StatCard title="Checking" value={stats.checking} />
                <StatCard title="Available" value={stats.available} />
                <StatCard title="Quoted" value={stats.quoted} />
            </div>

            <div className="mb-6 grid gap-4 rounded-[26px] border border-blue-100 bg-white p-5 shadow-lg lg:grid-cols-[1fr_240px_160px]">
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search component, part number, brand, email, phone..."
                        className="h-[54px] w-full rounded-2xl border border-slate-200 bg-[#f8fbff] py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-[54px] rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 text-sm font-bold outline-none transition focus:border-blue-500 focus:bg-white"
                >
                    <option value="all">All Status</option>
                    {statusOptions.map((item) => (
                        <option key={item} value={item}>
                            {item.toUpperCase()}
                        </option>
                    ))}
                </select>

                <button
                    onClick={fetchRequests}
                    className="h-[54px] rounded-2xl bg-[#102033] px-6 font-black text-white shadow transition hover:bg-[#0f4c81]"
                >
                    Search
                </button>
            </div>

            <div className="space-y-5">
                {loading ? (
                    <div className="rounded-[28px] bg-white p-10 text-center font-black shadow">
                        Loading requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="rounded-[28px] bg-white p-10 text-center font-black shadow">
                        No component requests found
                    </div>
                ) : (
                    requests.map((req) => (
                        <RequestCard
                            key={req._id}
                            req={req}
                            updateRequest={updateRequest}
                        />
                    ))
                )}
            </div>
        </main>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-md">
            <p className="text-sm font-bold text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-black text-[#0f4c81]">{value}</p>
        </div>
    );
}

function RequestCard({ req, updateRequest }) {
    const [local, setLocal] = useState({
        status: req.status || "new",
        adminPrice: req.adminPrice || "",
        adminLeadTime: req.adminLeadTime || "",
        adminNote: req.adminNote || "",
        customerMessage: req.customerMessage || "",
        adminContactNumber: req.adminContactNumber || "",
        availableItemsNote: req.availableItemsNote || "",
    });

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

    const totalQty =
        items.reduce((total, item) => total + Number(item.quantity || 0), 0) || 1;

    const [supplierMatches, setSupplierMatches] = useState(
        req.matchedSupplierSources || []
    );
    const [matchingLoading, setMatchingLoading] = useState(false);

    const findSupplierMatches = async () => {
        try {
            setMatchingLoading(true);

            const adminToken = localStorage.getItem("adminToken");

            const res = await fetch(`${API_BASE}/api/supplier-sources/match`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({ items }),
            });

            const data = await res.json();

            if (data.success) {
                setSupplierMatches(data.matches || []);

                if (!data.matches?.length) {
                    toast.info("No matching supplier found");
                }
            } else {
                toast.error(data.message || "Supplier match failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while matching suppliers");
        } finally {
            setMatchingLoading(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-lg">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-[#f8fbff] p-5 xl:flex-row xl:items-center">
                <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusStyles[req.status] || statusStyles.new
                                }`}
                        >
                            {req.status || "new"}
                        </span>

                        <span className="text-sm font-bold text-slate-500">
                            Request Date: {formatDate(req.createdAt)}
                        </span>
                    </div>

                    <h2 className="break-words text-2xl font-black text-slate-900">
                        {items[0]?.componentName || "Component Request"}
                    </h2>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-500">
                        MPN: {items[0]?.partNumber || "N/A"} • Brand:{" "}
                        {items[0]?.brand || "N/A"} • Items: {items.length}
                    </p>
                </div>

                <div className="rounded-2xl bg-[#0f4c81] px-6 py-4 text-white">
                    <p className="text-xs font-bold uppercase text-blue-100">Total Qty</p>
                    <p className="text-3xl font-black">{totalQty}</p>
                </div>
            </div>

            <div className="grid gap-6 p-5 xl:grid-cols-[1.25fr_0.85fr_1.1fr]">
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
                        Component Requirement
                    </h3>

                    <p className="mb-5 text-sm leading-7 text-slate-600">
                        {req.description || "No additional requirement details provided."}
                    </p>

                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-100 bg-[#f8fbff] p-4"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#0f4c81]">
                                        Item #{index + 1}
                                    </p>
                                    <p className="rounded-full bg-[#0f4c81] px-3 py-1 text-xs font-black text-white">
                                        Qty: {item.quantity || 1}
                                    </p>
                                </div>

                                <h4 className="break-words text-lg font-black leading-snug text-slate-900">
                                    {item.componentName || "N/A"}
                                </h4>

                                <div className="mt-3 grid gap-3 md:grid-cols-2">
                                    <InfoBox label="MPN / Part No." value={item.partNumber || "N/A"} />
                                    <InfoBox label="Brand" value={item.brand || "N/A"} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        {(req.imageUrls?.length || req.imageUrl) ? (
                            <a
                                href={`${API_BASE}${req.imageUrls?.[0] || req.imageUrl}`}
                                target="_blank"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 hover:bg-blue-100"
                            >
                                <ImageIcon size={17} />
                                View Image
                            </a>
                        ) : null}

                        {(req.datasheetUrls?.length || req.datasheetUrl) ? (
                            <a
                                href={`${API_BASE}${req.datasheetUrls?.[0] || req.datasheetUrl}`}
                                target="_blank"
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 hover:bg-emerald-100"
                            >
                                <FileText size={17} />
                                View Datasheet
                            </a>
                        ) : null}

                        {!(
                            req.imageUrls?.length ||
                            req.datasheetUrls?.length ||
                            req.imageUrl ||
                            req.datasheetUrl
                        ) ? (
                            <span className="text-sm font-bold text-slate-400">
                                No files uploaded
                            </span>
                        ) : null}
                    </div>

                    <div className="mt-5 rounded-2xl border border-blue-100 bg-[#f8fbff] p-4">
                        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">
                                    Matching Supplier Sources
                                </h3>
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                    Check if this component was purchased earlier from any saved supplier.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={findSupplierMatches}
                                disabled={matchingLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
                            >
                                <Truck size={17} />
                                {matchingLoading ? "Checking..." : "Find Suppliers"}
                            </button>
                        </div>

                        {supplierMatches.length > 0 ? (
                            <div className="space-y-3">
                                {supplierMatches.map((source) => (
                                    <div
                                        key={source._id}
                                        className="rounded-2xl border border-slate-100 bg-white p-4"
                                    >
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            {source.isPreferred ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                                                    <Star size={13} />
                                                    Preferred
                                                </span>
                                            ) : null}

                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                                                {source.availabilityStatus || "available"}
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-black text-slate-900">
                                            {source.supplierCompany}
                                        </h4>

                                        <p className="mt-1 text-sm font-semibold text-slate-500">
                                            {source.componentName} • MPN: {source.partNumber || "N/A"} • Brand:{" "}
                                            {source.brand || "N/A"}
                                        </p>

                                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                                            <InfoBox label="Last Price" value={`₹ ${source.purchasePrice || 0}`} />
                                            <InfoBox label="MOQ" value={source.moq || 1} />
                                            <InfoBox label="Lead Time" value={source.leadTime || "N/A"} />
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {source.phone ? (
                                                <a
                                                    href={`tel:${source.phone}`}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0f4c81] px-4 py-2 text-sm font-black text-white"
                                                >
                                                    <Phone size={16} />
                                                    Call
                                                </a>
                                            ) : null}

                                            {source.whatsapp || source.phone ? (
                                                <a
                                                    href={`https://wa.me/${normalizePhone(
                                                        source.whatsapp || source.phone
                                                    )}?text=${encodeURIComponent(
                                                        `Hello, we want to discuss availability for ${source.partNumber || source.componentName
                                                        }.`
                                                    )}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white"
                                                >
                                                    <MessageCircle size={16} />
                                                    WhatsApp
                                                </a>
                                            ) : null}

                                            {source.email ? (
                                                <a
                                                    href={`mailto:${source.email}`}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-black text-white hover:bg-sky-600"
                                                    >
                                                    <Mail size={16} />
                                                    Email
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-[#f8fbff] p-4">
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
                        Customer Details
                    </h3>

                    <InfoLine icon={User} label="Name" value={req.customerName} />
                    <InfoLine icon={Mail} label="Email" value={req.customerEmail} />
                    <InfoLine icon={Phone} label="Phone" value={req.customerPhone || "N/A"} />

                </div>



                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">
                        Admin Action
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                                Status
                            </label>
                            <select
                                value={local.status}
                                onChange={(e) =>
                                    setLocal((prev) => ({ ...prev, status: e.target.value }))
                                }
                                className="h-12 w-full rounded-xl border border-slate-200 px-3 font-bold outline-none focus:border-blue-500"
                            >
                                {statusOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                                Price
                            </label>
                            <div className="relative">
                                <IndianRupee
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="number"
                                    value={local.adminPrice}
                                    onChange={(e) =>
                                        setLocal((prev) => ({
                                            ...prev,
                                            adminPrice: e.target.value,
                                        }))
                                    }
                                    placeholder="Price"
                                    className="h-12 w-full rounded-xl border border-slate-200 pl-9 pr-3 font-bold outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                                Lead Time
                            </label>
                            <div className="relative">
                                <Clock
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    value={local.adminLeadTime}
                                    onChange={(e) =>
                                        setLocal((prev) => ({
                                            ...prev,
                                            adminLeadTime: e.target.value,
                                        }))
                                    }
                                    placeholder="Example: 2-5 business days"
                                    className="h-12 w-full rounded-xl border border-slate-200 pl-9 pr-3 font-bold outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                                Admin Internal Note
                            </label>
                            <textarea
                                value={local.adminNote}
                                onChange={(e) =>
                                    setLocal((prev) => ({ ...prev, adminNote: e.target.value }))
                                }
                                placeholder="Internal supplier response, quotation note, purchase follow-up..."
                                className="h-24 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                                Customer Message
                            </label>
                            <div className="relative">
                                <MessageSquareText
                                    size={16}
                                    className="absolute left-3 top-4 text-slate-400"
                                />
                                <textarea
                                    value={local.customerMessage}
                                    onChange={(e) =>
                                        setLocal((prev) => ({
                                            ...prev,
                                            customerMessage: e.target.value,
                                        }))
                                    }
                                    placeholder="Example: Your requested component is available. Please call us for price confirmation and order processing."
                                    className="h-28 w-full rounded-xl border border-slate-200 px-3 py-3 pl-9 text-sm font-semibold outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                                Call Number
                            </label>
                            <input
                                value={local.adminContactNumber}
                                onChange={(e) =>
                                    setLocal((prev) => ({
                                        ...prev,
                                        adminContactNumber: e.target.value,
                                    }))
                                }
                                placeholder="09334966286"
                                className="h-12 w-full rounded-xl border border-slate-200 px-3 font-bold outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                                Availability Note
                            </label>
                            <input
                                value={local.availableItemsNote}
                                onChange={(e) =>
                                    setLocal((prev) => ({
                                        ...prev,
                                        availableItemsNote: e.target.value,
                                    }))
                                }
                                placeholder="All items available / partial available"
                                className="h-12 w-full rounded-xl border border-slate-200 px-3 font-bold outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => updateRequest(req._id, local)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-5 py-3 font-black text-white shadow transition hover:bg-[#0b3b66]"
                    >
                        <Save size={18} />
                        Save Request
                    </button>
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

function InfoLine({ icon: Icon, label, value }) {
    return (
        <div className="mb-3 rounded-xl bg-white p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase text-slate-400">
                <Icon size={15} />
                {label}
            </p>
            <p className="break-words text-sm font-bold text-slate-700">
                {value || "N/A"}
            </p>
        </div>
    );
}

function normalizePhone(value) {
    const clean = String(value || "").replace(/\D/g, "");
    if (!clean) return "";
    return clean.startsWith("91") ? clean : `91${clean}`;
}