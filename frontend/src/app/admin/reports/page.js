"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  IndianRupee,
  Package,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

function money(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState("7days");
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);

      const [counts, graph] = await Promise.all([
        adminRequest("/api/admin/stats/counts"),
        adminRequest(`/api/admin/sales-graph?period=${period}`),
      ]);

      setStats(counts);
      setSalesData(graph.data || []);
    } catch (error) {
      toast.error(error.message || "Reports load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [period]);

  const maxSales = useMemo(() => {
    return Math.max(...salesData.map((item) => Number(item.sales || 0)), 1);
  }, [salesData]);

  if (loading && !stats) {
    return <div className="rounded-2xl bg-white p-6">Loading reports...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Sales, orders, customers, products and stock overview.
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#2454b5]"
          >
            <option value="7days">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>

          <button
            onClick={loadReports}
            className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold hover:bg-slate-50"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={money(stats?.totalSales)}
          icon={IndianRupee}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#102033]">
                <BarChart3 size={20} />
                Sales Graph
              </h2>
              <p className="text-sm text-slate-500">
                Revenue summary for selected period.
              </p>
            </div>
          </div>

          {salesData.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
              No sales data found.
            </div>
          ) : (
            <div className="space-y-4">
              {salesData.map((item, index) => {
                const width = Math.max(
                  8,
                  (Number(item.sales || 0) / maxSales) * 100
                );

                return (
                  <div key={index}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-bold text-[#102033]">
                        {item.date}
                      </span>
                      <span className="text-slate-500">
                        {money(item.sales)} • {item.orders} orders
                      </span>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#2454b5]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
            <AlertTriangle size={20} />
            Low Stock Alert
          </h2>

          <div className="space-y-3">
            {stats?.lowStock?.length ? (
              stats.lowStock.map((item) => (
                <div key={item._id} className="rounded-2xl border bg-red-50 p-4">
                  <p className="font-bold text-[#102033]">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    SKU: {item.sku || "N/A"}
                  </p>
                  <p className="mt-2 text-sm font-bold text-red-600">
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

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#102033]">
              <ShoppingCart size={20} />
              Recent Orders
            </h2>
          </div>

          <div className="divide-y">
            {stats?.recentOrders?.length ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-bold text-[#102033]">
                      {order.orderNumber || order.id}
                    </p>
                    <p className="text-sm text-slate-500">{order.customer}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{money(order.amount)}</p>
                    <p className="text-xs text-slate-500">{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No recent orders.
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#102033]">
              <Boxes size={20} />
              Recent Products
            </h2>
          </div>

          <div className="divide-y">
            {stats?.recentProducts?.length ? (
              stats.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-bold text-[#102033]">{product.name}</p>
                    <p className="text-sm text-slate-500">
                      SKU: {product.sku || "N/A"} • {product.category || "-"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{money(product.price)}</p>
                    <p className="text-xs text-slate-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No recent products.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#102033]">
          <TrendingUp size={20} />
          Business Summary
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryBox
            label="Average Order Value"
            value={money(
              Number(stats?.totalSales || 0) / Math.max(Number(stats?.totalOrders || 0), 1)
            )}
          />
          <SummaryBox
            label="Products per Customer"
            value={(
              Number(stats?.totalProducts || 0) /
              Math.max(Number(stats?.totalCustomers || 0), 1)
            ).toFixed(1)}
          />
          <SummaryBox
            label="Orders per Customer"
            value={(
              Number(stats?.totalOrders || 0) /
              Math.max(Number(stats?.totalCustomers || 0), 1)
            ).toFixed(1)}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#102033]">{value}</h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2454b5]">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#f3f7fb] p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#102033]">{value}</p>
    </div>
  );
}