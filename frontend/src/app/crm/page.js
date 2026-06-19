"use client";

import { useEffect, useState } from "react";

import {
  MessageSquare,
  Users,
  MessageCircle,
} from "lucide-react";

import { getDashboard } from "@/lib/crmApi";

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#102033]">
            {value}
          </h2>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

export default function CrmDashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalContacts: 0,
      totalConversations: 0,
      totalMessages: 0,
    });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {
      try {
        const data =
          await getDashboard();

        setStats(
          data.stats || {}
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="p-8">
        Loading CRM Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-black text-[#102033]">
          RoyalSMD CRM
        </h1>

        <p className="mt-2 text-slate-500">
          WhatsApp Business Dashboard
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <StatCard
          title="Total Contacts"
          value={
            stats.totalContacts || 0
          }
          icon={Users}
        />

        <StatCard
          title="Conversations"
          value={
            stats.totalConversations ||
            0
          }
          icon={MessageSquare}
        />

        <StatCard
          title="Messages"
          value={
            stats.totalMessages || 0
          }
          icon={MessageCircle}
        />

      </div>

    </div>
  );
}