"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { adminRequest } from "@/lib/api";

import RequestHeader from "@/components/admin/request-details/RequestHeader";

import CustomerInfoCard from "@/components/admin/request-details/CustomerInfoCard";

import QuotationSummaryCard from "@/components/admin/request-details/QuotationSummaryCard";

import StatusTracker from "@/components/admin/request-details/StatusTracker";

import QuickActions from "@/components/admin/request-details/QuickActions";

import SupplierHistory from "@/components/admin/request-details/SupplierHistory";

import ActivityLogs from "@/components/admin/request-details/ActivityLogs";

import TimelineCard from "@/components/admin/request-details/TimelineCard";

import PdfPreviewCard from "@/components/admin/request-details/PdfPreviewCard";

import AdminNotes from "@/components/admin/request-details/AdminNotes";

import { Download } from "lucide-react";


export default function RequestDetailsPage() {

  const params = useParams();

  const [request, setRequest] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadRequest = async () => {

    try {

      const data =
        await adminRequest(
          `/api/component-requests/admin/request/${params.id}`
        );

      setRequest(data.request);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (params.id) {

      loadRequest();

    }

  }, [params.id]);

  if (loading) {

    return (
      <div className="p-10 text-xl font-bold">
        Loading request details...
      </div>
    );

  }

  if (!request) {

    return (
      <div className="p-10 text-xl font-bold text-red-500">
        Request not found
      </div>
    );

  }

  return (

    <div className="space-y-6 p-6">

      <RequestHeader request={request} />
      <div className="flex justify-end">

        <button
          onClick={async () => {

            try {

              const token =
                localStorage.getItem("adminToken");

              const response =
                await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/component-requests/admin/download-full-pdf/${request._id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

              const blob =
                await response.blob();

              const url =
                window.URL.createObjectURL(blob);

              const link =
                document.createElement("a");

              link.href = url;

              link.download =
                `${request.quotationNumber}.pdf`;

              document.body.appendChild(link);

              link.click();

              link.remove();

            } catch (error) {

              console.log(error);

            }

          }}
          className="
    inline-flex
    items-center
    gap-2
    rounded-2xl
    bg-blue-600
    px-5
    py-3
    text-sm
    font-semibold
    text-white
    shadow-lg
    transition-all
    hover:bg-blue-700
  "
        >

          <Download size={18} />

          Download Full PDF

        </button>

      </div>

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="space-y-6 xl:col-span-2">

          <CustomerInfoCard request={request} />

          <QuotationSummaryCard request={request} />

          <SupplierHistory request={request} />

          <ActivityLogs request={request} />

        </div>

        <div className="space-y-6">

          <StatusTracker request={request} />

          <TimelineCard request={request} />

          <PdfPreviewCard request={request} />

          <QuickActions request={request} />

          <AdminNotes request={request} />

        </div>

      </div>

    </div>

  );

}