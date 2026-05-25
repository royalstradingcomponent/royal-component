"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function SupplierDetailsPage() {
  const params = useParams();

  const [source, setSource] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

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

      <div className="rounded-[35px] bg-white p-8 shadow-xl">

        <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] break-words">
          {source.componentName}
        </h1>

<p className="mt-2 text-base md:text-lg font-bold text-slate-500 break-words">
          {source.supplierCompany}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">

          <div className="rounded-[24px] bg-[#f8fbff] p-6">
            <p className="text-lg font-bold text-slate-500">
              Part Number
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {source.partNumber}
            </h2>
          </div>

          <div className="rounded-[24px] bg-[#f8fbff] p-6">
            <p className="text-lg font-bold text-slate-500">
              Brand
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {source.brand}
            </h2>
          </div>

          <div className="rounded-[24px] bg-[#f8fbff] p-6">
            <p className="text-lg font-bold text-slate-500">
              Purchase Price
            </p>

            <h2 className="mt-2 text-4xl font-black text-green-600">
              ₹
              {Number(
                source.purchasePrice || 0
              ).toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="rounded-[24px] bg-[#f8fbff] p-6">
            <p className="text-lg font-bold text-slate-500">
              Availability
            </p>

            <h2 className="mt-2 text-3xl font-black text-blue-600">
              {source.availabilityStatus}
            </h2>
          </div>

        </div>

      </div>
    </main>
  );
}