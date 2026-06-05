"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, LogOut, Shield } from "lucide-react";

export default function ActiveSessionsPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/active-sessions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const data = await res.json();

        if (data.success) {
            setSessions(data.sessions);
        }

        setLoading(false);
    };

    const logoutSession = async (id) => {
        const token = localStorage.getItem("adminToken");

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/session/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        fetchSessions();
    };

    const logoutAllDevices = async () => {
        const token = localStorage.getItem("adminToken");

        const confirmLogout = window.confirm(
            "Logout from all devices?"
        );

        if (!confirmLogout) return;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/security/logout-all`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        if (data.success) {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/auth";
        }
    };

    if (loading) {
        return (
            <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
                Loading Sessions...
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm border">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Active Sessions
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Currently logged in admins
                        </p>
                    </div>

                    <button
                        onClick={logoutAllDevices}
                        className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                        Logout All Devices
                    </button>

                </div>

            </div>

            {sessions.map((item, index) => (
                <div
                    key={item._id}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition"
                >
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-6">

                        <div className="flex items-center gap-4">

                            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                                {item.deviceType?.toLowerCase().includes("mobile") ? (
                                    <Smartphone
                                        size={24}
                                        className="text-blue-600"
                                    />
                                ) : (
                                    <Monitor
                                        size={24}
                                        className="text-blue-600"
                                    />
                                )}

                            </div>

                            <div>

                                <h3 className="text-xl font-bold text-slate-900">

                                    <p className="text-sm text-slate-500">
                                        {item.adminId?.name}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {item.adminId?.email}
                                    </p>

                                    {item.deviceName ||
                                        item.deviceType ||
                                        "Unknown Device"}
                                </h3>

                                <p className="text-slate-500">
                                    {item.platform || "Web"}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            {index === 0 && (
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold">
                                    Current Session
                                </span>
                            )}

                            <button
                                onClick={() => logoutSession(item._id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

                        <div className="bg-slate-50 rounded-2xl p-4 border">
                            <p className="text-xs uppercase text-slate-500">
                                Browser
                            </p>

                            <p className="font-semibold mt-2">
                                {item.browser}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border">
                            <p className="text-xs uppercase text-slate-500">
                                Operating System
                            </p>

                            <p className="font-semibold mt-2">
                                {item.os}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border">
                            <p className="text-xs uppercase text-slate-500">
                                IP Address
                            </p>

                            <p className="font-semibold mt-2">
                                {item.ipAddress}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border">
                            <p className="text-xs uppercase text-slate-500">
                                Last Seen
                            </p>

                            <p className="font-semibold mt-2">
                                {new Date(
                                    item.lastSeenAt || item.loginAt
                                ).toLocaleString()}
                            </p>
                        </div>

                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                        <Shield size={16} />
                        Login Time :
                        {new Date(item.loginAt).toLocaleString()}
                    </div>

                </div>
            ))}
        </div>
    );
}
