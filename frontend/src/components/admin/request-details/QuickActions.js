"use client";

import {
  Phone,
  MessageCircle,
  FileText,
  Download,
} from "lucide-react";

export default function QuickActions({ request }) {

  const quotationPdf =
    request?.quotationPdf;

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="mb-5 text-lg font-bold text-[#102033]">
        Quick Actions
      </h2>

      <div className="space-y-3">

        <a
          href={`tel:${request?.phone || ""}`}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
        >
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <Phone size={18} />
          </div>

          <div>
            <p className="font-semibold text-[#102033]">
              Call Customer
            </p>

            <p className="text-sm text-slate-500">
              Direct phone support
            </p>
          </div>
        </a>

        <a
          target="_blank"
          href={`https://wa.me/${request?.phone || ""}`}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-green-300 hover:bg-green-50"
        >
          <div className="rounded-xl bg-green-100 p-3 text-green-700">
            <MessageCircle size={18} />
          </div>

          <div>
            <p className="font-semibold text-[#102033]">
              WhatsApp Customer
            </p>

            <p className="text-sm text-slate-500">
              Quick quotation follow-up
            </p>
          </div>
        </a>

        <a
          href={`mailto:${request?.email || ""}`}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
        >
          <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
            <FileText size={18} />
          </div>

          <div>
            <p className="font-semibold text-[#102033]">
              Send Email
            </p>

            <p className="text-sm text-slate-500">
              Send quotation email
            </p>
          </div>
        </a>

        {quotationPdf && (

          <a
            target="_blank"
            href={quotationPdf}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
          >
            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
              <Download size={18} />
            </div>

            <div>
              <p className="font-semibold text-[#102033]">
                Download PDF
              </p>

              <p className="text-sm text-slate-500">
                Open quotation PDF
              </p>
            </div>
          </a>

        )}

      </div>

    </div>

  );

}