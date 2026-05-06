"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImagePlus, PackageSearch } from "lucide-react";
import { ListTree, GitBranch, Navigation } from "lucide-react";
import {
  BarChart3,
  Boxes,
  ChevronRight,
  Contact,
  Building2,
  Gift,
  Home,
  Layers,
  LogOut,
  Menu,
  MessageSquareText,
  LayoutPanelTop,
  Package,
  Settings,
  ShoppingCart,
  FileText,
  CreditCard,
  Users,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Categories", href: "/admin/categories", icon: Layers },
  { title: "Main Categories", href: "/admin/categories/main", icon: Layers },
  { title: "Sub Categories", href: "/admin/categories/sub", icon: ListTree },
  { title: "Child Categories", href: "/admin/categories/child", icon: GitBranch },
  { title: "Navbar Categories", href: "/admin/navbar-categories", icon: Navigation },
  {
    title: "Component Requests",
    href: "/admin/component-requests",
    icon: PackageSearch,
  },
  { title: "Supplier Sources", href: "/admin/supplier-sources", icon: Truck },
  { title: "Policy Pages", href: "/admin/policies", icon: FileText },
  { title: "About Page", href: "/admin/about", icon: Building2 },
  { title: "Contact Page", href: "/admin/contact-page", icon: Contact },
  { title: "Home Sections", href: "/admin/home-sections", icon: LayoutPanelTop },
  {
    title: "Hero Banners",
    href: "/admin/hero-banners",
    icon: ImagePlus,
  },

  { title: "Inventory", href: "/admin/inventory", icon: Boxes },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Coupons", href: "/admin/coupons", icon: Gift },
  { title: "Support Chats", href: "/admin/chats", icon: MessageSquareText },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = pathname?.startsWith("/admin/auth");

  useEffect(() => {
    if (isAuthPage) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/auth");
    }
  }, [pathname, router, isAuthPage]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    router.replace("/admin/auth");
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f3f7fb] text-[#102033]">
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-[#102033] text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <h1 className="text-lg font-bold">Royal Component</h1>
            <p className="text-xs text-slate-300">Admin Control Panel</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="h-[calc(100vh-128px)] overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                  ? "bg-[#2454b5] text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.title}
                </span>
                {active && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border p-2 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <h2 className="text-base font-bold lg:text-xl">
              Admin Dashboard
            </h2>
            <p className="hidden text-xs text-slate-500 sm:block">
              Manage products, orders, customers and inventory
            </p>
          </div>

          <div className="rounded-full bg-[#eef4ff] px-4 py-2 text-xs font-bold text-[#2454b5]">
            ADMIN
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}