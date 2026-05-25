"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE } from "@/lib/api";
import Link from "next/link";

export default function SupplierDetailsPage() {
    const params = useParams();

    const [source, setSource] = useState(null);

    useEffect(() => {
        if (params?.id) {
            fetchData();
        }
    }, [params?.id]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await fetch(
                `${API_BASE}/api/supplier-sources/${params.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                setSource(data.source);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (!source) {
        return (
            <div className="p-10 text-3xl font-black">
                Loading...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#eef5ff] p-6">

            <div className="mx-auto max-w-7xl rounded-[32px] bg-white p-8 shadow-xl">

                <div className="mb-8 border-b border-slate-200 pb-6">

                    <div className="flex flex-wrap items-center gap-3">

                        <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-bold text-green-700">
                            {source.availabilityStatus}
                        </span>

                        {source.isPreferred && (
                            <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold text-yellow-700">
                                preferred
                            </span>
                        )}

                    </div>

                    <h1 className="mt-4 break-words text-4xl font-black text-[#0f172a]">
                        {source.componentName}
                    </h1>

                    <p className="mt-2 text-lg font-bold text-slate-500">
                        {source.supplierCompany}
                    </p>

                    <div className="mt-5 flex gap-3">

                        <Link
                            href="/admin/supplier-sources"
                            className="rounded-2xl bg-[#0f4c81] px-6 py-3 text-sm font-black text-white hover:bg-[#0c3d68] transition-all duration-200"
                        >
                            <span className="text-white">back</span>
                        </Link>

                        <button
                            onClick={() => {
                                localStorage.setItem(
                                    "editSupplierId",
                                    source._id
                                );

                                window.location.href =
                                    "/admin/supplier-sources";
                            }}
                            className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-black text-white"
                        >
                            edit supplier
                        </button>

                    </div>

                </div>


                <div className="grid gap-6 xl:grid-cols-3">

                    <div className="rounded-[24px] bg-[#f8fbff] p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-black text-[#0f172a]">
                            supplier details
                        </h2>

                        <div className="space-y-5">

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    contact person
                                </p>

                                <h3 className="mt-1 text-xl font-black text-[#0f172a]">
                                    {source.contactPerson || "n/a"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    phone
                                </p>

                                <h3 className="mt-1 text-lg font-black text-[#0f172a]">
                                    {source.phone || "n/a"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    whatsapp
                                </p>

                                <h3 className="mt-1 text-lg font-black text-[#0f172a]">
                                    {source.whatsapp || "n/a"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    email
                                </p>

                                <h3 className="mt-1 break-all text-lg font-black text-[#0f172a]">
                                    {source.email || "n/a"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    address
                                </p>

                                <h3 className="mt-1 text-base font-black text-[#0f172a]">
                                    {source.address || "n/a"}
                                </h3>
                            </div>

                        </div>

                    </div>

                    <div className="rounded-[24px] bg-[#f8fbff] p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-black text-[#0f172a]">
                            purchase info
                        </h2>

                        <div className="grid gap-4">

                            <div className="rounded-2xl bg-white p-4">
                                <p className="text-sm font-bold text-slate-400">
                                    purchase price
                                </p>

                                <h2 className="mt-2 text-3xl font-black text-green-600">
                                    ₹
                                    {Number(
                                        source.purchasePrice || 0
                                    ).toLocaleString("en-IN")}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="rounded-2xl bg-white p-4">
                                    <p className="text-sm font-bold text-slate-400">
                                        gst %
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black">
                                        {source.gstPercent || 0}%
                                    </h2>
                                </div>

                                <div className="rounded-2xl bg-white p-4">
                                    <p className="text-sm font-bold text-slate-400">
                                        profit %
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black">
                                        {source.profitPercent || 0}%
                                    </h2>
                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="rounded-2xl bg-white p-4">
                                    <p className="text-sm font-bold text-slate-400">
                                        moq
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black">
                                        {source.moq || 0}
                                    </h2>
                                </div>

                                <div className="rounded-2xl bg-white p-4">
                                    <p className="text-sm font-bold text-slate-400">
                                        lead time
                                    </p>

                                    <h2 className="mt-2 text-xl font-black">
                                        {source.leadTime || "n/a"}
                                    </h2>
                                </div>

                            </div>

                            <div className="rounded-2xl bg-white p-4">
                                <p className="text-sm font-bold text-slate-400">
                                    extra charge
                                </p>

                                <h2 className="mt-2 text-2xl font-black">
                                    ₹{source.extraCharge || 0}
                                </h2>
                            </div>

                        </div>

                    </div>

                    <div className="rounded-[24px] bg-[#f8fbff] p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-black text-[#0f172a]">
                            component info
                        </h2>

                        <div className="space-y-5">

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    part number
                                </p>

                                <h3 className="mt-1 text-2xl font-black text-[#0f172a]">
                                    {source.partNumber || "n/a"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    brand
                                </p>

                                <h3 className="mt-1 text-2xl font-black text-[#0f172a]">
                                    {source.brand || "n/a"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    quality note
                                </p>

                                <h3 className="mt-1 text-base font-black text-[#0f172a]">
                                    {source.qualityNote || "n/a"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    admin note
                                </p>

                                <h3 className="mt-1 text-base font-black text-[#0f172a]">
                                    {source.adminNote || "n/a"}
                                </h3>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-8 flex flex-col gap-8">

                    <div className="w-full rounded-[24px] bg-[#f8fbff] p-6 shadow-sm">

                        <h2 className="mb-6 text-3xl font-black text-[#0f172a]">
                            quotation summary
                        </h2>

                        <div className="overflow-x-auto rounded-2xl border border-slate-200">

                            <table className="min-w-full">

                                <thead className="bg-[#2563eb] text-white">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-black uppercase">
                                            component
                                        </th>

                                        <th className="px-6 py-4 text-center text-sm font-black uppercase">
                                            qty
                                        </th>

                                        <th className="px-6 py-4 text-center text-sm font-black uppercase">
                                            unit price
                                        </th>

                                        <th className="px-6 py-4 text-center text-sm font-black uppercase">
                                            total
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    <tr className="bg-white">

                                        <td className="px-6 py-5 text-lg font-black text-[#0f172a]">
                                            {source.partNumber}
                                        </td>

                                        <td className="px-6 py-5 text-center text-lg font-black">
                                            {source.moq || 1}
                                        </td>

                                        <td className="px-6 py-5 text-center text-lg font-black">
                                            ₹{Number(source.sellingPrice || 0).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-5 text-center text-lg font-black text-green-700">
                                            ₹
                                            {(
                                                Number(source.sellingPrice || 0) *
                                                Number(source.moq || 1)
                                            ).toFixed(2)}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                    <div className="rounded-[24px] bg-[#f8fbff] p-8 shadow-sm xl:mt-0">

                        <h2 className="mb-6 text-3xl font-black text-[#0f172a]">
                            pricing summary
                        </h2>

                        <div className="overflow-hidden rounded-2xl border border-slate-200">

                           <table className="w-full">

                                <thead className="bg-[#0f4c81] text-white">

                                    <tr>

                                        <th className="px-6 py-4 text-center text-sm font-black uppercase whitespace-nowrap">
                                            subtotal
                                        </th>

                                        <th className="px-6 py-4 text-center text-sm font-black uppercase whitespace-nowrap">
                                            sgst
                                        </th>

                                        <th className="px-6 py-4 text-center text-sm font-black uppercase whitespace-nowrap">
                                            cgst
                                        </th>

                                        <th className="px-6 py-4 text-center text-sm font-black uppercase whitespace-nowrap">
                                            grand total
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    <tr className="bg-white">

                                        <td className="px-6 py-5 text-center text-2xl font-black whitespace-nowrap">
                                            {Number(source.subtotal || 0).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-5 text-center text-2xl font-black whitespace-nowrap">
                                           {Number(source.sgstAmount || 0).toFixed(2)}
                                        </td>

                                       <td className="px-6 py-5 text-center text-2xl font-black whitespace-nowrap">
                                            {Number(source.cgstAmount || 0).toFixed(2)}
                                        </td>

                                      <td className="px-4 py-5 text-center text-2xl font-black text-green-700 whitespace-nowrap">
                                            {Number(source.grandTotal || 0).toFixed(2)}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}