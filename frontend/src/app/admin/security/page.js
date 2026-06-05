"use client";

import { useEffect, useState } from "react";

export default function SecurityPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/security-alerts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setAlerts(data.alerts || []);
    }
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem("adminToken");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/security-alerts/${id}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchAlerts();
  };

  return (
    <div className="space-y-5">

      <div className="bg-white border rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold">
          Security Alerts
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor suspicious admin activities
        </p>
      </div>

      {alerts.map((alert) => (
        <div
          key={alert._id}
          className={`rounded-3xl border p-5 shadow-sm ${
            alert.isRead
              ? "bg-white"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex justify-between">

            <div>
              <h3 className="font-bold text-lg">
                {alert.title}
              </h3>

              <p className="text-slate-600 mt-1">
                {alert.message}
              </p>
            </div>

            {!alert.isRead && (
              <button
                onClick={() => markAsRead(alert._id)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
              >
                Mark Read
              </button>
            )}

          </div>

          <div className="mt-4 text-sm text-slate-500">
            IP : {alert.ipAddress || "N/A"}
          </div>

          <div className="text-sm text-slate-500">
            Browser : {alert.browser || "N/A"}
          </div>

          <div className="text-sm text-slate-500">
            OS : {alert.os || "N/A"}
          </div>

          <div className="text-sm text-slate-500 mt-2">
            {new Date(alert.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}