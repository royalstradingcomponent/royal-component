"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Clock3,
  IndianRupee,
  PackageSearch,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyQuotationsPage() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyQuotations();
  }, []);

  const fetchMyQuotations = async () => {

    try {

      const rawUser = localStorage.getItem("user");

      if (!rawUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(rawUser);

      const token = parsedUser?.token;

      const response = await fetch(
        `${API_URL}/api/component-requests/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRequests(Array.isArray(data) ? data : data.requests || []);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {

    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200";

      case "quoted":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "checking":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "unavailable":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-700">
          Loading Quotations...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-700" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                My Quotations
              </h1>

              <p className="text-slate-500 mt-1">
                View all your BOM quotations and download PDFs.
              </p>
            </div>
          </div>
        </div>

        {/* EMPTY */}

        {requests.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 text-center">

            <PackageSearch className="w-20 h-20 mx-auto text-slate-300 mb-5" />

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No Quotations Found
            </h2>

            <p className="text-slate-500">
              Your quotation requests will appear here.
            </p>
          </div>
        )}

        {/* LIST */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {requests.map((request) => (

            <div
              key={request._id}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >

              {/* TOP */}

              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div
                      className={`inline-flex px-3 py-1 rounded-full border text-sm font-semibold mb-3 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status?.toUpperCase()}
                    </div>

                    <h2 className="text-2xl font-bold leading-tight">
                      {request.items?.[0]?.componentName || "Component"}
                    </h2>

                    <p className="text-blue-100 mt-2 text-sm">
                      Quotation No: {request.quotationNumber || "N/A"}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl px-5 py-4 text-center min-w-[110px]">
                    <div className="text-xs text-blue-100 uppercase font-semibold">
                      Total Qty
                    </div>

                    <div className="text-3xl font-bold mt-1">
                      {request.items?.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* BODY */}

              <div className="p-6">

                {/* COMPONENTS */}

                <div className="space-y-4 mb-6">

                  {request.items?.map((item, index) => (

                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-4"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {item.componentName}
                          </h3>

                          <div className="text-sm text-slate-500 mt-2 space-y-1">
                            <p>
                              <span className="font-semibold">
                                Part No:
                              </span>{" "}
                              {item.partNumber}
                            </p>

                            <p>
                              <span className="font-semibold">
                                Brand:
                              </span>{" "}
                              {item.brand}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-100 rounded-xl px-4 py-3 text-center min-w-[80px]">
                          <div className="text-xs text-slate-500 font-semibold uppercase">
                            Qty
                          </div>

                          <div className="text-xl font-bold text-slate-800 mt-1">
                            {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SUMMARY */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold uppercase mb-2">
                      <IndianRupee className="w-4 h-4" />
                      Final Price
                    </div>

                    <div className="text-3xl font-bold text-green-700">
                      ₹{Number(request.adminPrice || 0).toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold uppercase mb-2">
                      <Clock3 className="w-4 h-4" />
                      Lead Time
                    </div>

                    <div className="text-lg font-bold text-slate-800">
                      {request.adminLeadTime || "Pending"}
                    </div>
                  </div>
                </div>

                {/* DATE */}

                <div className="text-sm text-slate-500 mb-6">
                  Request Date: {new Date(request.createdAt).toLocaleString("en-IN")}
                </div>

                {/* BUTTONS */}

                <div className="flex flex-col md:flex-row gap-4">

                  <button
                    onClick={() =>
                      window.open(
                        `${API_URL}/api/component-requests/download-pdf/${request._id}`,
                        "_blank"
                      )
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 transition-all text-white rounded-2xl px-5 py-4 font-bold flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>

                  <Link
                    href="/request-component"
                    className="flex-1 bg-blue-900 hover:bg-blue-950 transition-all rounded-2xl px-5 py-4 font-bold text-center"
                    style={{ color: "#ffffff" }}
                  >
                    New Request
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}