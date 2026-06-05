  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import {
    Boxes,
    IndianRupee,
    Package,
    ShoppingCart,
    Users,
    FileText,
    ClipboardCheck,
    CheckCircle,
    Clock3,
    TrendingUp,
    Activity,
    Bell,
    BarChart3,
    Users2,
    PackageSearch,
    ArrowUpRight,
    ChevronRight,
    Truck,
  } from "lucide-react";

  import CountUp from "react-countup";

  import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
  } from "recharts";

  import { adminRequest } from "@/lib/api";

  function StatCard({
    title,
    value,
    icon: Icon,
    note,
    onClick,
  }) {
    return (
      <div
        onClick={onClick}
        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      >
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50 transition-all group-hover:scale-110"></div>

        <div className="relative flex items-start justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              {title}
            </p>

            <h3 className="mt-4 text-4xl font-black text-[#102033]">

              {typeof value === "number" ? (
                <CountUp
                  end={value}
                  duration={2}
                  separator=","
                />
              ) : (
                value
              )}

            </h3>

            {note && (
              <p className="mt-3 flex items-center gap-1 text-xs font-medium text-green-600">
                <TrendingUp size={14} />
                {note}
              </p>
            )}
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-[#2454b5] shadow-inner">
            <Icon size={30} />
          </div>

        </div>

      </div>
    );
  }

  export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
      totalSales: 0,
      totalOrders: 0,
      todayOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      recentOrders: [],
      recentProducts: [],
      lowStock: [],

      orderPlacedCount: 0,
      processingCount: 0,
      packedCount: 0,
      shippedCount: 0,
      outForDeliveryCount: 0,
      deliveredCount: 0,
      cancelledCount: 0,
    });

    const [loading, setLoading] = useState(true);
    const [supplierHistory, setSupplierHistory] =
      useState([]);
    const [showAllRequests, setShowAllRequests] =
      useState(false);

    const revenueData = [
      { name: "Mon", revenue: 12000 },
      { name: "Tue", revenue: 18000 },
      { name: "Wed", revenue: 9000 },
      { name: "Thu", revenue: 24000 },
      { name: "Fri", revenue: 17000 },
      { name: "Sat", revenue: 32000 },
      { name: "Sun", revenue: 28000 },
    ];



    const COLORS = [
      "#2563eb",
      "#16a34a",
      "#f59e0b",
    ];



    const [quotationStats, setQuotationStats] =
      useState({
        totalRequests: 0,
        availableRequests: 0,
        quotedRequests: 0,
        closedRequests: 0,
        todayRequests: 0,
        totalRevenue: 0,
      });
    const requestData = [
      {
        name: "Available",
        value: quotationStats.availableRequests || 0,
      },
      {
        name: "Quoted",
        value: quotationStats.quotedRequests || 0,
      },
      {
        name: "Closed",
        value: quotationStats.closedRequests || 0,
      },
    ];

    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await adminRequest("/api/admin/stats/counts");
        const quotationData =
          await adminRequest(
            "/api/component-requests/admin/dashboard-stats"
          );

        const supplierData = await adminRequest(
          "/api/supplier-sources"
        );

        setQuotationStats({
          ...quotationData.stats,

          recentRequests:
            quotationData.recentRequests || [],

          totalQuotationRequests:
            quotationData.totalQuotationRequests || [],

          todayQuotationRequests:
            quotationData.todayQuotationRequests || [],

          latestQuotations:
            quotationData.latestQuotations || [],
        });

        setSupplierHistory(
          supplierData.sources || []
        );
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
      <div className="space-y-8 bg-gradient-to-br from-slate-100 to-blue-50 min-h-screen p-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-3xl font-black text-[#102033]">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Complete control center for Royal Components.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button className="rounded-xl bg-white px-4 py-3 shadow-sm border hover:shadow-md transition-all">
              <Bell size={18} />
            </button>

            <button className="rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#1d4697] transition-all">
              + Create Quotation
            </button>

          </div>

        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={quotationStats.totalRequests || 0}
            icon={FileText}
            note="BOM quotation requests"
            onClick={() =>
              router.push("/admin/total-requests")
            }
          />

          <StatCard
            title="Available Quotations"
            value={quotationStats.availableRequests || 0}
            icon={ClipboardCheck}
            note="Available quotations"
            onClick={() =>
              router.push("/admin/available-quotations")
            }
          />

          <StatCard
            title="Quoted Requests"
            value={quotationStats.quotedRequests || 0}
            icon={CheckCircle}
            note="Quoted BOM requests"
            onClick={() =>
              router.push("/admin/quoted-requests")
            }
          />

          <StatCard
            title="Closed Orders"
            value={quotationStats.closedRequests || 0}
            icon={Clock3}
            note="Completed requests"
            onClick={() =>
              router.push("/admin/closed-orders")
            }
          />

          <StatCard
            title="Today's Requests"
            value={quotationStats.todayRequests || 0}
            icon={FileText}
            note="Today's BOM requests"
            onClick={() =>
              router.push("/admin/today-requests")
            }
          />

          <StatCard
            title="Request Calendar"
            value="Open"
            icon={BarChart3}
            note="Month wise request tracking"
            onClick={() =>
              router.push("/admin/request-calendar")
            }
          />

          <StatCard
            title="Quotation Revenue"
            value={`₹ ${Number(
              quotationStats.totalRevenue || 0
            ).toLocaleString("en-IN")}`}
            icon={IndianRupee}
            note="Total quotation revenue"
            onClick={() =>
              router.push("/admin/quotation-revenue")
            }
          />
          <StatCard
            title="Total Sales"
            value={`₹ ${Number(stats.totalSales || 0).toLocaleString("en-IN")}`}
            icon={IndianRupee}
            note="All order revenue"
            onClick={() =>
              router.push("/admin/total-sales")
            }
          />

          <StatCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            icon={ShoppingCart}
            note="Customer orders"
            onClick={() =>
              router.push("/admin/orders")
            }
          />

          <StatCard
            title="Orders Calendar"
            value="Open"
            icon={BarChart3}
            note="Day wise order tracking"
            onClick={() =>
              router.push("/admin/orders-calendar")
            }
          />

          <StatCard
            title="Total Products"
            value={stats.totalProducts || 0}
            icon={Package}
            note="Active products"
            onClick={() =>
              router.push("/admin/products")
            }
          />

          <StatCard
            title="Total Customers"
            value={stats.totalCustomers || 0}
            icon={Users}
            note="Registered customers"
            onClick={() =>
              router.push("/admin/customers")
            }
          />

          <StatCard
            title="TODAY ORDERS"
            value={stats.todayOrders}
            icon={ShoppingCart}
            note="Today's customer orders"
          />

          <StatCard
            title="Total Supply"
            value="Open"
            icon={PackageSearch}
            note="Supplier purchase history"
            onClick={() =>
              router.push("/admin/supplier-history")
            }
          />

          <StatCard
            title="Order Placed"
            value={stats.orderPlacedCount || 0}
            icon={ShoppingCart}
            note="New placed orders"
            onClick={() =>
              router.push("/admin/order-status/placed")
            }
          />

          <StatCard
            title="Processing"
            value={stats.processingCount || 0}
            icon={Activity}
            note="Orders in processing"
            onClick={() =>
              router.push("/admin/order-status/processing")
            }
          />

          <StatCard
            title="Packed"
            value={stats.packedCount || 0}
            icon={Package}
            note="Packed orders"
            onClick={() =>
              router.push("/admin/order-status/packed")
            }
          />

          <StatCard
            title="Shipped"
            value={stats.shippedCount || 0}
            icon={Truck}
            note="Shipped orders"
            onClick={() =>
              router.push("/admin/order-status/shipped")
            }
          />

          <StatCard
            title="Out for Delivery"
            value={stats.outForDeliveryCount || 0}
            icon={PackageSearch}
            note="Out for delivery"
            onClick={() =>
              router.push("/admin/order-status/out-for-delivery")
            }
          />

          <StatCard
            title="Delivered"
            value={stats.deliveredCount || 0}
            icon={CheckCircle}
            note="Delivered orders"
            onClick={() =>
              router.push("/admin/order-status/delivered")
            }
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelledCount || 0}
            icon={Clock3}
            note="Cancelled orders"
            onClick={() =>
              router.push("/admin/order-status/cancelled")
            }
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-black text-[#102033]">
                  Total Quotation Requests
                </h2>

                <p className="text-sm text-slate-500">
                  View all customer quotation requests
                </p>

              </div>

              <button
                onClick={() =>
                  setShowAllRequests(!showAllRequests)
                }
                className="rounded-xl bg-[#2454b5] px-5 py-2 text-sm font-bold text-white hover:bg-[#1d4697] transition-all"
              >
                {showAllRequests ? "Show Less" : "More"}
              </button>

            </div>

            <div className="space-y-4">

              {quotationStats?.totalQuotationRequests?.length ? (

                (
                  showAllRequests
                    ? quotationStats.totalQuotationRequests
                    : quotationStats.totalQuotationRequests.slice(0, 5)
                ).map((request) => (

                  <Link
                    key={request._id}
                    href={`/admin/component-requests/${request._id}`}
                    className="block rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-bold text-[#102033] text-lg">
                          {request.items?.[0]?.componentName || "Component"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {request.customerName}
                        </p>

                      </div>

                      <div className="flex items-center gap-4">

                        <p className="font-bold text-green-700 text-lg">
                          ₹
                          {Number(
                            request.adminPrice || 0
                          ).toLocaleString("en-IN")}
                        </p>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                          {request.status}
                        </span>

                      </div>

                    </div>

                  </Link>

                ))

              ) : (

                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No quotation requests found.
                </div>

              )}

            </div>

          </div>

          {/* RECENT REQUESTS */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-bold text-[#102033]">
              Recent Requests
            </h2>

            <div className="space-y-3">

              {quotationStats.recentRequests?.length ? (

                quotationStats.recentRequests.map((request) => (

                  <Link
                    key={request._id}
                    href={`/admin/component-requests/${request._id}`}
                    className="block cursor-pointer rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-bold text-[#102033]">
                          {
                            request.items?.[0]
                              ?.componentName
                          }
                        </p>

                        <p className="text-sm text-slate-500">
                          {request.customerName}
                        </p>

                      </div>

                      <div className="text-right">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                          {request.status}
                        </span>

                      </div>

                    </div>

                  </Link>
                ))

              ) : (

                <p className="text-sm text-slate-500">
                  No recent requests found.
                </p>

              )}

            </div>

          </div>

          {/* TOTAL SUPPLY HISTORY */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-black text-[#102033]">
                  Total Supply History
                </h2>

                <p className="text-sm text-slate-500">
                  View all supplier purchase history
                </p>

              </div>

              <button
                onClick={() =>
                  router.push("/admin/supplier-history")
                }
                className="rounded-xl bg-[#2454b5] px-5 py-2 text-sm font-bold text-white hover:bg-[#1d4697] transition-all"
              >
                More
              </button>

            </div>

            <div className="space-y-4">

              {supplierHistory?.length ? (

                supplierHistory
                  .slice(0, 5)
                  .map((item) => (

                    <Link
                      key={item._id}
                      href={`/admin/supplier-sources/${item._id}`}
                      className="block rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="font-bold text-[#102033] text-lg">
                            {item.componentName}
                          </p>

                          <p className="text-sm text-slate-500">
                            {item.supplierCompany}
                          </p>

                        </div>

                        <div className="flex items-center gap-4">

                          <p className="font-bold text-green-700 text-lg">
                            ₹
                            {Number(
                              item.purchasePrice || 0
                            ).toLocaleString("en-IN")}
                          </p>

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                            {item.availabilityStatus}
                          </span>

                        </div>

                      </div>

                    </Link>

                  ))

              ) : (

                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No supplier history found.
                </div>

              )}

            </div>

          </div>

          {/* LATEST QUOTATIONS */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-bold text-[#102033]">
              Latest Quotations
            </h2>

            <div className="space-y-3">

              {quotationStats.latestQuotations?.length ? (

                quotationStats.latestQuotations.map((quotation) => (

                  <Link
                    key={quotation._id}
                    href={`/admin/component-requests/${quotation._id}`}
                    className="block cursor-pointer rounded-xl border bg-slate-50 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-bold text-[#102033]">
                          {
                            quotation.quotationNumber
                          }
                        </p>

                        <p className="text-sm text-slate-500">
                          {
                            quotation.customerName
                          }
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-green-700">
                          ₹
                          {Number(
                            quotation.adminPrice || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                  </Link>
                ))

              ) : (

                <p className="text-sm text-slate-500">
                  No quotations found.
                </p>

              )}

            </div>

          </div>

        </div>

        <div className="grid gap-6 xl:grid-cols-3">

          {/* REVENUE CHART */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-black text-[#102033]">
                  Revenue Analytics
                </h2>

                <p className="text-sm text-slate-500">
                  Last 7 days quotation revenue
                </p>

              </div>

              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <BarChart3 size={24} />
              </div>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={revenueData}>

                  <defs>

                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* PIE CHART */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-black text-[#102033]">
                  Request Status
                </h2>

                <p className="text-sm text-slate-500">
                  BOM quotation overview
                </p>

              </div>

              <div className="rounded-2xl bg-green-50 p-3 text-green-600">
                <Activity size={24} />
              </div>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={requestData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >

                    {requestData.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-[#102033]">
              Recent Orders
            </h2>

            <div className="space-y-3">
              {stats.recentOrders?.length ? (
                stats.recentOrders.map((order) => {

                  const orderId = order?._id || order?.id;

                  return (
                    <div
                      key={orderId}
                      onClick={() => {
                        router.push("/admin/orders");
                      }}
                      className="cursor-pointer flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
                  );
                })
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
                    onClick={() =>
                      router.push(`/admin/products/${item._id}`)
                    }
                    className="cursor-pointer rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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