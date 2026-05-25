"use client";

import { useEffect, useMemo, useState } from "react";
import { adminRequest } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
    AreaChart,
    Area,
} from "recharts";

export default function RevenuePage() {

    const [orders, setOrders] = useState({});

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {

        try {

            const data = await adminRequest(
                "/api/orders/admin/revenue-analytics"
            );

            setOrders(data.analytics || {});

        } catch (error) {

            console.log(error);

        }

    };

    const totalRevenue =
        orders.totalRevenue || 0;

    const deliveredRevenue =
        orders.deliveredRevenue || 0;

    const processingRevenue =
        orders.processingRevenue || 0;

    const cancelledRevenue =
        orders.cancelledRevenue || 0;

    const gstAmount = useMemo(() => {

        return totalRevenue * 0.18;

    }, [totalRevenue]);

    const refundAmount = useMemo(() => {

        return cancelledRevenue;

    }, [cancelledRevenue]);

    const averageCustomerValue = useMemo(() => {

        const totalOrders =
            orders.orderAnalytics?.reduce(
                (acc, item) =>
                    acc + item.total,
                0
            ) || 0;

        if (!totalOrders) return 0;

        return totalRevenue / totalOrders;

    }, [orders, totalRevenue]);

    const monthlyRevenueData =
        orders.monthlyRevenue || [];

    const statusData =
        (orders.orderAnalytics || []).map(
            (item) => ({
                name: item._id,
                value: item.total,
            })
        );

    const paymentData =
        (orders.paymentAnalytics || []).map(
            (item) => ({
                method: item._id,
                total: item.total,
            })
        );


    const yearlyRevenue =
        orders.yearlyRevenue || 0;

    const currentMonthRevenue =
        orders.currentMonthRevenue || 0;

    const exportPDF = async () => {

        const doc = new jsPDF("p", "mm", "a4");

        // HEADER
        doc.setFillColor(109, 40, 217);

        doc.rect(0, 0, 210, 35, "F");

        doc.setTextColor(255, 255, 255);

        doc.setFontSize(24);

        doc.setFont("helvetica", "bold");

        doc.text(
            "Royal Component Revenue Report",
            14,
            22
        );

        doc.setFontSize(10);

        doc.text(
            `Generated: ${new Date().toLocaleString()}`,
            14,
            30
        );

        // RESET COLOR
        doc.setTextColor(20, 20, 20);

        // SUMMARY TITLE
        doc.setFontSize(18);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Revenue Summary",
            14,
            50
        );

        // SUMMARY TABLE
        autoTable(doc, {

            startY: 58,

            head: [
                [
                    "Analytics",
                    "Amount",
                ],
            ],

            body: [

                [
                    "Total Revenue",
                    `Rs. ${Number(totalRevenue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "Delivered Revenue",
                    `Rs. ${Number(deliveredRevenue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "Processing Revenue",
                    `Rs. ${Number(processingRevenue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "Cancelled Revenue",
                    `Rs. ${Number(cancelledRevenue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "GST Summary",
                    `Rs. ${Number(gstAmount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "Refund Analytics",
                    `Rs. ${Number(refundAmount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "Customer Lifetime Value",
                    `Rs. ${Number(averageCustomerValue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "Monthly Revenue",
                    `Rs. ${Number(currentMonthRevenue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

                [
                    "Yearly Revenue",
                    `Rs. ${Number(yearlyRevenue).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                ],

            ],

            columnStyles: {

                0: {

                    cellWidth: 95,

                },

                1: {

                    halign: "right",

                    cellWidth: 90,

                    font: "helvetica",

                    fontStyle: "bold",

                    overflow: "linebreak",

                },

            },

            styles: {

                font: "helvetica",

                fontStyle: "normal",

                fontSize: 10,

                textColor: [30, 41, 59],

                cellPadding: 3,

                minCellHeight: 10,

                overflow: "hidden",

                halign: "left",

                valign: "middle",

                lineColor: [226, 232, 240],

                lineWidth: 0.2,

            },

            headStyles: {

                fillColor: [37, 99, 235],

                textColor: [255, 255, 255],

                fontStyle: "bold",

                fontSize: 13,

            },

            alternateRowStyles: {

                fillColor: [241, 245, 249],

            },

        });

        // TOP PRODUCTS
        doc.setFontSize(18);

        doc.setFont(
            "helvetica",
            "bold"
        );

        if (
            doc.lastAutoTable.finalY > 220
        ) {

            doc.addPage();

        }

        doc.text(
            "Top Selling Products",
            14,
            doc.lastAutoTable.finalY + 18
        );

        autoTable(doc, {

            startY:
                doc.lastAutoTable.finalY + 25,

            columnStyles: {

                0: {

                    cellWidth: 95,

                },

                1: {

                    halign: "right",

                    cellWidth: 75,

                    font: "helvetica",

                    fontStyle: "bold",

                    overflow: "linebreak",

                },

            },

            head: [
                [
                    "Product",
                    "Quantity Sold",
                ],
            ],

            body:
                (orders.topProducts || []).map(
                    (item) => [

                        item._id,

                        `Rs. ${Number(item.qty).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`

                    ]
                ),

            styles: {

                font: "helvetica",

                fontStyle: "normal",

                fontSize: 11,

                textColor: [30, 41, 59],

                cellPadding: 5,

                overflow: "linebreak",

                halign: "left",

                valign: "middle",

                lineColor: [226, 232, 240],

                lineWidth: 0.2,

            },

            headStyles: {

                fillColor: [15, 23, 42],

                textColor: [255, 255, 255],

                fontStyle: "bold",

                fontSize: 12,

            },

        });

        // CATEGORY REVENUE
        doc.setFontSize(18);

        let categoryStartY =
            doc.lastAutoTable.finalY + 18;

        if (categoryStartY > 240) {

            doc.addPage();

            categoryStartY = 25;

        }

        doc.setFontSize(18);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Category Revenue",
            14,
            categoryStartY
        );

        autoTable(doc, {

            startY: categoryStartY + 8,

            head: [
                [
                    "Category",
                    "Revenue",
                ],
            ],

            body:
                (orders.categoryRevenue || []).map(
                    (item) => [

                        item._id,

                        `Rs. ${Number(
                            item.revenue || 0
                        ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`

                    ]
                ),

            styles: {

                charSpace: 0,

                cellPadding: 4,

            },

            headStyles: {

                fillColor: [124, 58, 237],

                textColor: 255,

            },

        });

        // FOOTER
        const totalPages =
            doc.internal.getNumberOfPages();

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            doc.setPage(i);

            doc.setFontSize(10);

            doc.setTextColor(
                120
            );

            doc.text(

                `Royal Component • Page ${i} of ${totalPages}`,

                14,

                285
            );
        }

        doc.save(
            `revenue-report-${Date.now()}.pdf`
        );
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-[#eef4fb] via-[#f8fbff] to-[#edf2f7] p-6">

            {/* HEADER */}
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">

                <div>

                    <h1 className="text-5xl font-black text-[#102033]">
                        Revenue Analytics
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Business revenue overview
                    </p>

                </div>

                <button
                    onClick={exportPDF}
                    className="rounded-2xl bg-[#102033] px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#173052]">
                    Export PDF
                </button>

            </div>

            {/* STATS */}
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Total Revenue
                    </p>

                    <h2 className="mt-4 break-normal text-[18px] md:text-[22px] md:text-[30px] xl:text-[26px] leading-tight font-black text-blue-600">
                        Rs. {Number(totalRevenue).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Delivered Revenue
                    </p>

                    <h2 className="mt-4 break-normal text-[18px] md:text-[22px] md:text-[30px] xl:text-[26px] leading-tight font-black text-green-600">
                        Rs. {Number(deliveredRevenue).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Processing Revenue
                    </p>

                    <h2 className="mt-4 break-normal text-[18px] md:text-[22px] md:text-[30px] xl:text-[26px] leading-tight font-black text-yellow-500">
                        Rs. {Number(processingRevenue).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Cancelled Revenue
                    </p>

                    <h2 className="mt-4 break-normal text-[18px] md:text-[22px] md:text-[30px] xl:text-[26px] leading-tight font-black text-red-500">
                        Rs. {Number(cancelledRevenue).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

            </div>

            {/* SECOND STATS */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        GST Summary
                    </p>

                    <h2 className="mt-4 break-normal text-[18px] md:text-[24px] md:text-[22px] font-black text-purple-600">
                        Rs. {Number(gstAmount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Refund Analytics
                    </p>

                    <h2 className="mt-4 break-normal text-[24px] md:text-[22px] font-black text-red-500">
                        Rs. {Number(refundAmount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Customer Lifetime Value
                    </p>

                    <h2 className="mt-4 break-normal text-[18px] md:text-[20px] xl:text-[24px] leading-tight break-normal font-black text-pink-600">
                        Rs. {Number(averageCustomerValue).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}

                    </h2>

                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Total Invoices
                    </p>

                    <h2 className="mt-4 text-[30px] font-black text-cyan-600">
                        {
                            orders.orderAnalytics?.reduce(
                                (acc, item) =>
                                    acc + item.total,
                                0
                            ) || 0
                        }
                    </h2>

                </div>

            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Monthly Revenue
                    </p>

                    <h2 className="mt-4 text-[18px] md:text-[20px] xl:text-[24px] leading-tight break-normal font-black text-indigo-600">
                        Rs. {Number(currentMonthRevenue).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <p className="text-sm font-semibold text-slate-500">
                        Yearly Revenue
                    </p>

                    <h2 className="mt-4 text-[18px] md:text-[20px] xl:text-[24px] leading-tight break-normal font-black text-violet-600">
                        Rs. {Number(yearlyRevenue).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>

                </div>

            </div>

            {/* CHARTS */}
            <div className="mt-10 grid gap-8 xl:grid-cols-2">

                {/* SALES GRAPH */}
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-2xl font-black text-[#102033]">
                            Monthly Revenue
                        </h2>

                        <div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                            Sales Graph
                        </div>

                    </div>

                    <div className="h-[350px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart data={monthlyRevenueData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* STATUS ANALYTICS */}
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-2xl font-black text-[#102033]">
                            Order Analytics
                        </h2>

                        <div className="rounded-full bg-pink-100 px-4 py-2 text-xs font-bold text-pink-700">
                            Status Report
                        </div>

                    </div>

                    <div className="h-[350px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    outerRadius={120}
                                    label
                                >

                                    {statusData.map(
                                        (entry, index) => (

                                            <Cell
                                                key={index}
                                                fill={[
                                                    "#22c55e",
                                                    "#facc15",
                                                    "#f97316",
                                                    "#ef4444",
                                                ][index % 4]}
                                            />

                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

            {/* BOTTOM CHARTS */}
            <div className="mt-8 grid gap-6 xl:grid-cols-2">

                {/* PAYMENT ANALYTICS */}
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-2xl font-black text-[#102033]">
                            Payment Analytics
                        </h2>

                        <div className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
                            Payments
                        </div>

                    </div>

                    <div className="h-[350px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={paymentData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="method" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="total"
                                    fill="#10b981"
                                    radius={[10, 10, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* TOP PRODUCTS */}
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-2xl font-black text-[#102033]">
                            Top Selling Products
                        </h2>

                        <div className="rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700">
                            Products
                        </div>

                    </div>

                    <div className="space-y-4">

                        {(orders.topProducts || []).map(
                            (product, index) => (

                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                                >

                                    <div>

                                        <h3 className="font-bold text-[#102033]">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            Top selling product
                                        </p>

                                    </div>

                                    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
                                        {product.qty}
                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>

            <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

                <div className="mb-6">

                    <h2 className="text-2xl font-black text-[#102033]">
                        Category Revenue
                    </h2>

                </div>

                <div className="h-[350px]">

                    <ResponsiveContainer width="100%" height="100%">

                        <AreaChart data={
                            orders.categoryRevenue || []
                        }>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="category" />

                            <YAxis />

                            <Tooltip />

                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2563eb"
                                fill="#93c5fd"
                            />

                        </AreaChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

    );

}