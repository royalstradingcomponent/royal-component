"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { adminRequest } from "@/lib/api";

function StatCard({ title, value, icon: Icon, note }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#102033]">
            {value}
          </h3>
          {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2454b5]">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    recentProducts: [],
    lowStock: [],
  });

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminRequest("/api/admin/stats/counts");
      setStats(data);
    } catch (error) {
      console.error("Dashboard stats error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <div className="rounded-2xl bg-white p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#102033]">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete control center for Royal Components.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={`₹ ${Number(stats.totalSales || 0).toLocaleString("en-IN")}`}
          icon={IndianRupee}
          note="All order revenue"
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={ShoppingCart}
          note="Customer orders"
        />

        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon={Package}
          note="Active products"
        />

        <StatCard
          title="Total Customers"
          value={stats.totalCustomers || 0}
          icon={Users}
          note="Registered users"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-[#102033]">
            Recent Orders
          </h2>

          <div className="space-y-3">
            {stats.recentOrders?.length ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-bold text-[#102033]">
                      {order.orderNumber || order.id}
                    </p>
                    <p className="text-sm text-slate-500">
                      {order.customer}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₹ {Number(order.amount || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-500">{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent orders found.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
            <Boxes size={20} />
            Low Stock
          </h2>

          <div className="space-y-3">
            {stats.lowStock?.length ? (
              stats.lowStock.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border bg-red-50 p-4"
                >
                  <p className="font-bold text-[#102033]">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    SKU: {item.sku || "N/A"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-red-600">
                    Stock: {item.totalStock}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No low stock products.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}