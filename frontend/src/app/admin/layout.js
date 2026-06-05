"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImagePlus, PackageSearch } from "lucide-react";
import { ListTree, GitBranch, Navigation } from "lucide-react";
import {
  BarChart3,
  Boxes,
  AlertTriangle,
  ChevronRight,
  Contact,
  Building2,
  Gift,
  Home,
  BookOpen,
  Layers,
  LogOut,
  Menu,
  MessageSquareText,
  LayoutPanelTop,
  PanelBottom,
  Package,
  Settings,
  ShoppingCart,
  FileText,
  CreditCard,
  Users,
  Truck,
  X,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Categories", href: "/admin/categories", icon: Layers },
  { title: "Main Categories", href: "/admin/categories/main", icon: Layers },
  { title: "Sub Categories", href: "/admin/categories/sub", icon: ListTree },
  {
    title: "Child Categories",
    href: "/admin/categories/child",
    icon: GitBranch,
  },
  {
    title: "Navbar Categories",
    href: "/admin/navbar-categories",
    icon: Navigation,
  },
  {
    title: "BOM Requests",
    href: "/admin/component-requests",
    icon: PackageSearch,
  },
  { title: "Supplier Sources", href: "/admin/supplier-sources", icon: Truck },
  { title: "Policy Pages", href: "/admin/policies", icon: FileText },
  { title: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { title: "Blog Categories", href: "/admin/blog-categories", icon: BookOpen },
  {
    title: "Blog Settings",
    href: "/admin/blog-settings",
    icon: Settings,
  },
  { title: "About Page", href: "/admin/about", icon: Building2 },
  { title: "Contact Page", href: "/admin/contact-page", icon: Contact },
  {
    title: "Home Sections",
    href: "/admin/home-sections",
    icon: LayoutPanelTop,
  },
  {
    title: "SEO Loader",
    href: "/admin/seo-loader",
    icon: LayoutPanelTop,
  },
  { title: "Footer Management", href: "/admin/footer", icon: PanelBottom },
  {
    title: "Hero Banners",
    href: "/admin/hero-banners",
    icon: ImagePlus,
  },

  { title: "Inventory", href: "/admin/inventory", icon: Boxes },
  {
    title: "Out Of Stock",
    href: "/admin/inventory/out-of-stock",
    icon: AlertTriangle,
  },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  {
    title: "Payment Settings",
    href: "/admin/payment-settings",
    icon: CreditCard,
  },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Coupons", href: "/admin/coupons", icon: Gift },
  { title: "Support Chats", href: "/admin/chats", icon: MessageSquareText },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
  {
    title: "Login History",
    href: "/admin/login-history",
    icon: ShieldCheck,
  },
  {
    title: "Activity Logs",
    href: "/admin/activity-logs",
    icon: ShieldCheck,
  },
  {
    title: "Active Sessions",
    href: "/admin/active-sessions",
    icon: ShieldCheck,
  },

  {
    title: "Security Alerts",
    href: "/admin/security",
    icon: ShieldCheck,
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const isAuthPage = pathname?.startsWith("/admin/auth");

  useEffect(() => {
    if (isAuthPage) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/auth");
      return;
    }

    const verifyAdmin = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/admin/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Invalid token");
        }
        const data = await res.json();

        setAdminName(data.user?.name || "");
        setAdminEmail(data.user?.email || "");
      } catch (error) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");

        router.replace("/admin/auth");
      }
    };

    verifyAdmin();
  }, [pathname, router, isAuthPage]);

  useEffect(() => {
    if (isAuthPage) return;

    const token = localStorage.getItem("adminToken");

    if (!token) return;

    const sessionId =
      localStorage.getItem("adminSessionId") || "";

    const browserInfo = navigator.userAgent;

    const platformInfo = navigator.platform;

    const adminEmail =
      localStorage.getItem("adminEmail") || "";

    const trackPageView = async () => {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/page-view`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
           
            body: JSON.stringify({
              page: pathname,
              sessionId,
              browser: browserInfo,
              os: platformInfo,
              adminEmail,
            }),
          }
        );
      } catch (error) {
        console.log("PAGE TRACK ERROR", error);
      }
    };

    trackPageView();
  }, [pathname, isAuthPage]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");

    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");

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
            <h1 className="text-lg font-bold">Royal Trading Component</h1>
            <p className="text-xs text-slate-300">Rohit Control Panel</p>
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
            <h2 className="text-base font-bold lg:text-xl">Admin Dashboard</h2>
            <p className="hidden text-xs text-slate-500 sm:block">
              Manage products, orders, customers and inventory
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-[#eef4ff] px-4 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2454b5] text-sm font-bold text-white">
              {adminName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-[#102033]">
                {adminName || "Admin"}
              </p>

              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
