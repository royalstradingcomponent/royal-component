"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, Copy, Check } from "lucide-react";

export default function LoginHistoryPage() {
    const [history, setHistory] = useState([]);

    const [copied, setCopied] = useState("");

    const copyIP = async (ip) => {
        try {
            await navigator.clipboard.writeText(ip);
            setCopied(ip);

            setTimeout(() => {
                setCopied("");
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login-history`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const data = await res.json();

        if (data.success) {
            setHistory(data.history);
        }
    };

    return (
        <div className="space-y-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Login History</h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Track administrator login activity
                        </p>
                    </div>

                    <div className="rounded-full bg-[#2454b5]/10 px-4 py-2 text-sm font-semibold text-[#2454b5]">
                        {history.length} Records
                    </div>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="rounded-3xl bg-white border border-slate-200 p-20 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
                        🔒
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900">
                        No Login History Found
                    </h3>

                    <p className="mt-2 text-slate-500">Login records will appear here.</p>
                </div>
            ) : (
                history.map((item, index) => (
                    <div
                        key={index}
                        className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#2454b5]/30"
                    >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2454b5]/10">
                                    {item.deviceType?.toLowerCase()?.includes("mobile") ? (
                                        <Smartphone size={24} className="text-[#2454b5]" />
                                    ) : (
                                        <Monitor size={24} className="text-[#2454b5]" />
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {item.deviceName || item.deviceType || "Unknown Device"}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {item.platform || "Web"}
                                    </p>
                                </div>
                            </div>

                            {index === 0 && (
                                <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
                                    Current Session
                                </span>
                            )}
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Browser
                                </p>

                                <span className="mt-2 inline-block rounded-full bg-[#2454b5]/10 px-3 py-1 text-xs font-semibold text-[#2454b5]">
                                    {item.browser || "-"}
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Operating System
                                </p>

                                <span className="mt-2 inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {item.os || "-"}
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Device
                                </p>

                                <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    {item.deviceName || item.deviceType || "-"}
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    IP Address
                                </p>

                                <div className="mt-2 flex items-center justify-between gap-2">
                                    <span className="font-mono text-sm text-slate-800">
                                        {item.ipAddress || "-"}
                                    </span>

                                    <button
                                        onClick={() => copyIP(item.ipAddress)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-[#2454b5] hover:text-white transition"
                                    >
                                        {copied === item.ipAddress ? (
                                            <Check size={15} />
                                        ) : (
                                            <Copy size={15} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Login Time
                                </p>

                                <div className="mt-2">
                                    <div className="font-medium text-slate-900">
                                        {new Date(item.loginAt).toLocaleDateString()}
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        {new Date(item.loginAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
