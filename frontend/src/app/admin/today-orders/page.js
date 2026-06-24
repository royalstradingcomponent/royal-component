"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminRequest } from "@/lib/api";

export default function TodayOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const data = await adminRequest(
                "/api/orders/admin/all"
            );

            const today = new Date();

            const todayOrders =
                data.orders?.filter((order) => {
                    const created = new Date(order.createdAt);

                    return (
                        created.getDate() === today.getDate() &&
                        created.getMonth() === today.getMonth() &&
                        created.getFullYear() === today.getFullYear()
                    );
                }) || [];

            setOrders(todayOrders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) {
        return (
            <div className="p-10 text-xl font-bold">
                Loading today's orders...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-[#102033]">
                    Today's Orders
                </h1>

                <p className="mt-2 text-slate-500">
                    All orders received today
                </p>
            </div>

           <div className="space-y-5">
    {orders.length ? (
        orders.map((order) => (
            <Link
                key={order._id}
                href={`/admin/orders/${order._id}?itemId=${order.products?.[0]?._id}`}
                className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-[#102033]">
                            {order.orderNumber}
                        </h2>

                        <p className="mt-2 text-lg text-slate-500">
                            {order.products?.[0]?.name || "Product"}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            {order.userInfo?.name}
                        </p>
                    </div>

                    <div className="text-right">
                        <h2 className="text-4xl font-black text-green-600">
                            ₹{Number(
                                order.products?.[0]?.lineTotal ||
                                order.finalAmount ||
                                0
                            ).toLocaleString("en-IN")}
                        </h2>
                    </div>
                </div>
            </Link>
        ))
    ) : (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No orders found for today.
        </div>
    )}
</div>
        </div>
    );
}