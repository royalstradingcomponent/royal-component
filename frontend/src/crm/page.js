"use client";

import {
  MessageSquare,
  Users,
  Send,
  Bot,
  TrendingUp,
  Activity,
} from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black">
            {value}
          </h2>
        </div>

        <div
          className={`h-16 w-16 rounded-2xl flex items-center justify-center ${color}`}
        >
          <Icon size={30} />
        </div>
      </div>
    </div>
  );
}

export default function CrmDashboard() {
  return (
    <div className="p-8 space-y-8">

      <div>
        <h1 className="text-4xl font-black text-[#102033]">
          WhatsApp CRM Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          AI Sensy Style CRM Dashboard
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Conversations"
          value="1,245"
          icon={MessageSquare}
          color="bg-green-100 text-green-700"
        />

        <StatCard
          title="Total Contacts"
          value="8,542"
          icon={Users}
          color="bg-blue-100 text-blue-700"
        />

        <StatCard
          title="Campaign Sent"
          value="2,318"
          icon={Send}
          color="bg-purple-100 text-purple-700"
        />

        <StatCard
          title="AI Responses"
          value="6,521"
          icon={Bot}
          color="bg-orange-100 text-orange-700"
        />

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <div className="rounded-3xl bg-white p-6 border shadow-sm">

          <div className="flex items-center gap-3 mb-4">
            <TrendingUp />
            <h2 className="font-bold text-xl">
              Campaign Performance
            </h2>
          </div>

          <div className="h-[300px] flex items-center justify-center text-slate-400">
            Chart Coming Next
          </div>

        </div>

        <div className="rounded-3xl bg-white p-6 border shadow-sm">

          <div className="flex items-center gap-3 mb-4">
            <Activity />
            <h2 className="font-bold text-xl">
              Live Activity
            </h2>
          </div>

          <div className="space-y-4">

            <div className="border rounded-2xl p-4">
              Customer sent new RFQ
            </div>

            <div className="border rounded-2xl p-4">
              BOM uploaded
            </div>

            <div className="border rounded-2xl p-4">
              Campaign delivered
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}