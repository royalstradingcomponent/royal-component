"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Send,
  FileText,
  Bot,
  BarChart3,
  Settings,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/crm",
    icon: LayoutDashboard,
  },
  {
    title: "Inbox",
    href: "/crm/inbox",
    icon: MessageSquare,
  },
  {
    title: "Contacts",
    href: "/crm/contacts",
    icon: Users,
  },
  {
    title: "Campaigns",
    href: "/crm/campaigns",
    icon: Send,
  },
  {
    title: "Templates",
    href: "/crm/templates",
    icon: FileText,
  },
  {
    title: "AI Bot",
    href: "/crm/bot",
    icon: Bot,
  },
  {
    title: "Analytics",
    href: "/crm/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/crm/settings",
    icon: Settings,
  },
];

export default function CrmSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#075E54] text-white">
      <div className="border-b border-white/10 p-5">
        <h1 className="text-2xl font-black">
          RoyalSMD CRM
        </h1>

        <p className="text-sm text-green-100">
          WhatsApp Business Suite
        </p>
      </div>

      <nav className="p-4">
        {menus.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition
              ${
                active
                  ? "bg-[#25D366] text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon size={20} />

              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}