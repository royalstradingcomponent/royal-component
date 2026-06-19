"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Megaphone,
  Bot,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/crm",
    icon: LayoutDashboard,
  },
  {
    name: "Inbox",
    href: "/crm/inbox",
    icon: MessageSquare,
  },
  {
    name: "Contacts",
    href: "/crm/contacts",
    icon: Users,
  },
  {
    name: "Campaigns",
    href: "/crm/campaigns",
    icon: Megaphone,
  },
  {
    name: "Automations",
    href: "/crm/automations",
    icon: Bot,
  },
  {
    name: "Templates",
    href: "/crm/templates",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/crm/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/crm/settings",
    icon: Settings,
  },
];

export default function CrmLayout({
  children,
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      <aside className="w-[260px] border-r bg-white">

        <div className="border-b p-6">
          <h1 className="text-2xl font-black text-[#0f172a]">
            RoyalSMD CRM
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            AI Sensy Platform
          </p>
        </div>

        <div className="p-4">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>

      </aside>

      <div className="flex-1">

        <header className="flex h-16 items-center justify-between border-b bg-white px-6">

          <div>
            <h2 className="text-lg font-bold">
              WhatsApp Business CRM
            </h2>
          </div>

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Connected
            </div>

          </div>

        </header>

        <main>
          {children}
        </main>

      </div>

    </div>
  );
}