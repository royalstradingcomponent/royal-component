"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderStatusPage({
  title,
  status,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("adminToken");

   if (!token) {
  console.log("Admin token not found");
  setLoading(false);
  return;
}

    const config = {
      headers: {
       Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/orders/admin/all?status=${encodeURIComponent(
        status
      )}`,
      config
    );

    console.log("STATUS:", status);
    console.log("API DATA:", data);
    console.log("FIRST ORDER:", data.orders[0]);

    setOrders(data.orders || data || []);
  } catch (error) {
    console.log("ORDER FETCH ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-[42px] font-black text-[#0f172a]">
        {title}
      </h1>

      <p className="mb-8 text-[#64748b]">
        All {status.toLowerCase()} orders
      </p>

      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10">
          No {status} orders found
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
  <div
  key={order._id}
  onClick={() => router.push(`/admin/orders/${order._id}`)}
  className="cursor-pointer rounded-3xl bg-white p-6 shadow transition hover:scale-[1.01] hover:shadow-xl"
>
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-[#0f172a]">
          {order.orderNumber}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {order.userInfo?.name}
        </p>

        <p className="text-xs text-gray-400">
          {order.userInfo?.phone}
        </p>
      </div>

      <div className="text-right">
        <h3 className="text-2xl font-black text-blue-600">
          ₹{order.finalAmount}
        </h3>

        <p className="mt-2 font-bold text-green-600">
          {order.orderStatus}
        </p>
      </div>
    </div>
  </div>
))}
        </div>
      )}
    </div>
  );
}