"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

export default function SupplierHistoryPage() {
    const [sources, setSources] = useState([]);

    useEffect(() => {
        fetchSources();
    }, []);

    const fetchSources = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await fetch(
                `${API_BASE}/api/supplier-sources`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                setSources(data.sources || []);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const totalValue = sources.reduce(
        (acc, item) =>
            acc + Number(item.purchasePrice || 0),
        0
    );

    return (
        <main className="min-h-screen bg-[#eef5ff] p-6">

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-[#0f172a]">
                        Supplier History
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Track all supplier purchase history
                    </p>
                </div>
            </div>

            <div className="mb-8 grid gap-5 md:grid-cols-3">

                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                    <p className="text-2xl font-bold text-slate-500">
                        Total Suppliers
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-[#0f172a]">
                        {sources.length}
                    </h2>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                    <p className="text-2xl font-bold text-slate-500">
                        Active Sources
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-green-600">
                        {
                            sources.filter((x) => x.isActive)
                                .length
                        }
                    </h2>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        Total Purchase
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-blue-600 break-words">
                        ₹{totalValue.toLocaleString("en-IN")}
                    </h2>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#0f172a]">
                            Total Supplier Sources
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Complete supplier purchase records
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {sources.map((source) => (
                        <Link
                            key={source._id}
                            href={`/admin/supplier-sources/${source._id}`}
                            className="block rounded-2xl border border-slate-200 bg-[#f8fbff] p-4 transition-all hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-2xl font-black text-[#0f172a] leading-tight">
                                        {source.componentName}
                                    </h2>

                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                        {source.supplierCompany}
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-slate-400">
                                        {source.partNumber}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <h2 className="text-3xl font-black text-green-600">
                                        ₹
                                        {Number(
                                            source.purchasePrice || 0
                                        ).toLocaleString("en-IN")}
                                    </h2>

                                    <p className="mt-1 text-sm font-bold uppercase text-blue-600">
                                        {source.availabilityStatus}
                                    </p>
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </main>
    );
}