"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  IndianRupee,
  ReceiptText,
  TrendingUp,
  Download,
} from "lucide-react";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import { adminRequest } from "@/lib/api";

export default function QuotationRevenuePage() {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await adminRequest("/api/component-requests/admin");

      const filtered = (data.requests || []).filter(
        (item) => item.status === "quoted" || item.status === "closed",
      );

      setRequests(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = requests.reduce(
    (acc, item) => acc + Number(item.adminPrice || 0),
    0,
  );

  const downloadRevenuePdf = () => {
    const doc = new jsPDF();

    // HEADER

    doc.setFillColor(15, 76, 129);

    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(22);

    doc.setFont("helvetica", "bold");

    doc.text("ROYAL TRADING COMPONENT", 14, 16);

    doc.setFontSize(11);

    doc.setFont("helvetica", "normal");

    doc.text("Quotation Revenue Report", 14, 24);

    // DATE

    doc.setTextColor(80);

    doc.setFontSize(10);

    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 45);

    // TOTAL REVENUE

    doc.setFillColor(240, 253, 244);

    doc.roundedRect(14, 55, 182, 24, 4, 4, "F");

    doc.setTextColor(22, 101, 52);

    doc.setFontSize(12);

    doc.setFont("helvetica", "bold");

    doc.text("TOTAL REVENUE", 20, 66);

    doc.setFontSize(20);

    doc.text(`Rs. ${totalRevenue.toLocaleString("en-IN")}`, 20, 75);

    // TABLE

    autoTable(doc, {
      startY: 90,

      head: [["Quotation No", "Customer", "Component", "Status", "Revenue"]],

      body: requests.map((item) => [
        item.quotationNumber || "-",

        item.customerName || "-",

        item.items?.[0]?.componentName || "-",

        item.status?.toUpperCase() || "-",

        `Rs. ${Number(item.adminPrice || 0).toLocaleString("en-IN")}`,
      ]),

      styles: {
        fontSize: 10,

        cellPadding: 5,
      },

      headStyles: {
        fillColor: [37, 99, 235],

        textColor: [255, 255, 255],

        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      bodyStyles: {
        textColor: [30, 41, 59],
      },
    });

    doc.save("quotation-revenue-report.pdf");
  };

  if (loading) {
    return (
      <div
        className="
          flex
          h-[70vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-blue-200
            border-t-blue-700
          "
        />
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#f4f8fc]
        p-6
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-7
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <button
          onClick={downloadRevenuePdf}
          className="
    flex
    items-center
    gap-2
    rounded-2xl
    bg-[#0f172a]
    px-5
    py-3
    text-sm
    font-semibold
    text-white
    shadow-lg
    transition-all
    duration-300
    hover:scale-105
  "
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>

        <div>
          <div
            className="
              mb-3
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-blue-100
              px-3
              py-1
              text-[11px]
              font-semibold
              uppercase
              tracking-[2px]
              text-blue-700
            "
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Revenue Analytics
          </div>

          <h1
            className="
              text-4xl
              font-black
              tracking-[-1px]
              text-[#0f172a]
            "
          >
            Quotation Revenue
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Revenue from quoted and closed requests
          </p>
        </div>

        {/* TOTAL CARD */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            bg-gradient-to-br
            from-emerald-500
            to-green-600
            px-7
            py-5
            text-white
            shadow-lg
          "
        >
          <div
            className="
              absolute
              -right-6
              -top-6
              h-24
              w-24
              rounded-full
              bg-white/10
            "
          />

          <div className="relative z-10">
            <div
              className="
                mb-3
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  rounded-xl
                  bg-white/15
                  p-2
                "
              >
                <IndianRupee className="h-4 w-4" />
              </div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[1px]
                  text-white/80
                "
              >
                Total Revenue
              </p>
            </div>

            <h2
              className="
                text-4xl
                font-black
                tracking-tight
              "
            >
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-white/80
              "
            >
              {requests.length} quotations
            </p>
          </div>
        </div>
      </div>

      {/* REQUEST LIST */}

      <div className="space-y-5">
        {requests.map((request) => (
          <Link
            key={request._id}
            href={`/admin/component-requests/${request._id}`}
          >
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                cursor-pointer
              "
            >
              <div
                className="
                  absolute
                  right-0
                  top-0
                  h-32
                  w-32
                  rounded-full
                  bg-blue-50
                "
              />

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                {/* LEFT */}

                <div className="flex items-start gap-4">
                  <div
                    className="
                      rounded-2xl
                      bg-gradient-to-br
                      from-blue-600
                      to-indigo-700
                      p-4
                      shadow-md
                    "
                  >
                    <ReceiptText className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <div
                      className="
                        mb-2
                        inline-flex
                        rounded-full
                        bg-blue-100
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[2px]
                        text-blue-700
                      "
                    >
                      Revenue Request
                    </div>

                    <h2
                      className="
                        text-3xl
                        font-black
                        tracking-[-0.5px]
                        text-[#0f172a]
                      "
                    >
                      {request.items?.[0]?.componentName}
                    </h2>

                    <p
                      className="
                        mt-1
                        text-base
                        font-medium
                        text-slate-500
                      "
                    >
                      {request.customerName}
                    </p>

                    <p
                      className="
                        mt-2
                        text-xs
                        text-slate-400
                      "
                    >
                      Quotation No : {request.quotationNumber}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}

                <div className="text-right">
                  <h3
                    className="
                      text-5xl
                      font-black
                      tracking-tight
                      text-emerald-600
                    "
                  >
                    ₹{Number(request.adminPrice || 0).toLocaleString("en-IN")}
                  </h3>

                  <div
                    className={`
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      px-5
                      py-2
                      text-xs
                      font-bold
                      uppercase
                      tracking-[2px]
                      ${
                        request.status === "closed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />

                    {request.status}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
