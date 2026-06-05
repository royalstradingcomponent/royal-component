"use client";

import { useEffect, useState } from "react";

export default function ActivityLogsPage() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/activities`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        if (data.success) {
            setActivities(data.activities || []);
        }
    };

    return (
        <div className="space-y-5">

            <div className="rounded-3xl bg-white p-6 shadow-sm border">
                <h1 className="text-3xl font-bold">
                    Activity Logs
                </h1>

                <p className="text-slate-500 mt-2">
                    Track every admin action
                </p>
            </div>

            {activities.map((item) => (
                <div
                    key={item._id}
                    className="bg-white border rounded-3xl p-5 shadow-sm"
                >
                    <div className="flex justify-between">

                        <div>
                            <h3 className="font-bold text-lg">
                                {item.action}
                            </h3>

                            <p className="text-slate-500">
                                {item.module}
                            </p>
                        </div>

                        <div className="text-right">
                            <div>
                                {new Date(
                                    item.createdAt
                                ).toLocaleDateString()}
                            </div>

                            <div className="text-slate-500">
                                {new Date(
                                    item.createdAt
                                ).toLocaleTimeString()}
                            </div>
                        </div>

                    </div>

                    <div className="mt-4">
                        <div>
                            Admin :
                            <b> {item.adminName}</b>
                        </div>

                        <div>
                            Browser :
                            <b> {item.browser}</b>
                        </div>

                        <div>
                            OS :
                            <b> {item.os}</b>
                        </div>

                        <div>
                            IP :
                            <b> {item.ipAddress}</b>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}