"use client";

import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  ChevronRight,
  ChevronDown,
  Package,
  RotateCcw,
  Heart,
  TicketPercent,
  Phone,
  Info,
  CircleHelp,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import LoginModal from "@/app/authPage/LoginModel";
import RegisterModal from "@/app/authPage/RegisterModel";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { name: "Semiconductors", href: "/products?category=semiconductors" },
  { name: "Automation", href: "/products?category=automation" },
  { name: "Switchgear", href: "/products?category=switchgear" },
  { name: "Sensors", href: "/products?category=sensors" },
  { name: "PLC", href: "/products?category=plc" },
  { name: "Cables", href: "/products?category=cables" },
  { name: "Tools", href: "/products?category=tools" },
];

const accountMenuItems = [
  {
    label: "My Orders",
    href: "/orders",
    icon: Package,
  },
  {
    label: "Buy Again",
    href: "/buy-again",
    icon: RotateCcw,
  },
  {
    label: "My Account",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "My Coupons",
    href: "/coupons",
    icon: TicketPercent,
  },
  {
    label: "Contact Us",
    href: "/contact",
    icon: Phone,
  },
  {
    label: "About Us",
    href: "/about",
    icon: Info,
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: CircleHelp,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const accountMenuRef = useRef(null);

  const userName = useMemo(() => {
    const rawName = user?.name || user?.email || "My Account";
    return String(rawName).trim();
  }, [user]);

  const userEmail = useMemo(() => {
    return user?.email ? String(user.email).trim() : "";
  }, [user]);

  const shortUserName = useMemo(() => {
    if (!user?.name) return "My Account";
    const name = String(user.name).trim();
    return name.length > 18 ? `${name.slice(0, 18)}...` : name;
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    setMobileOpen(false);
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#d6e8f5] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <div className="bg-gradient-to-r from-[#0f6cbd] via-[#1792e8] to-[#38bdf8] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
          Trusted Industrial Components • Fast Procurement • Bulk Order Support
        </div>

        <div className="container-royal">
          <div className="flex items-center justify-between gap-3 py-4 lg:py-5">
            <div className="flex items-center gap-3">
              <button
                className="rounded-md p-2 text-[#0f3d67] transition hover:bg-[#eaf6ff] lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                type="button"
              >
                <Menu size={24} />
              </button>

              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1792e8] to-[#0f6cbd] text-xl font-extrabold text-white shadow-sm">
                  RC
                </div>

                <div>
                  <p className="text-lg font-extrabold leading-none text-[#0f172a] sm:text-[1.75rem]">
                    Royal Component
                  </p>
                  <p className="mt-1 text-[11px] font-medium tracking-[0.02em] text-[#5f7d95] sm:text-xs">
                    Industrial Solutions Store
                  </p>
                </div>
              </Link>
            </div>

            <div className="hidden max-w-3xl flex-1 px-4 lg:flex">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search product, part number or brand"
                  className="h-[58px] w-full rounded-full border border-[#cfe5f5] bg-[#f8fcff] py-3 pl-14 pr-5 text-[16px] text-[#0f172a] outline-none transition placeholder:text-[#8aa5b9] focus:border-[#38bdf8] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                />
                <Search
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5f7d95]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#0f172a] sm:gap-3">
              {!user?.token ? (
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden h-[46px] items-center gap-2 rounded-full border border-[#cfe5f5] bg-white px-4 text-sm font-semibold text-[#0f3d67] transition hover:border-[#38bdf8] hover:bg-[#f2fbff] sm:flex"
                >
                  <User size={18} />
                  Sign in
                </button>
              ) : (
                <div className="relative hidden sm:block" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                    className="flex h-[46px] items-center gap-2 rounded-full border border-[#cfe5f5] bg-white px-4 text-sm font-semibold text-[#0f3d67] transition hover:border-[#38bdf8] hover:bg-[#f2fbff]"
                  >
                    <User size={18} />
                    <span>{shortUserName}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isAccountMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isAccountMenuOpen ? (
                    <div className="absolute right-0 top-[58px] z-[80] w-[320px] overflow-hidden rounded-[22px] border border-[#d7e7f4] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                      <div className="border-b border-[#e8f1f8] bg-gradient-to-r from-[#f8fcff] to-[#eef7ff] px-6 py-5">
                        <p className="text-[16px] font-bold text-[#0f172a]">
                          Hi, {userName}
                        </p>
                        {userEmail ? (
                          <p className="mt-1 text-sm text-[#5f7d95]">
                            {userEmail}
                          </p>
                        ) : null}
                      </div>

                      <div className="max-h-[420px] overflow-y-auto py-2">
                        {accountMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center gap-3 px-6 py-3 text-[15px] font-medium text-[#23435b] transition hover:bg-[#f3f9ff] hover:text-[#0f6cbd]"
                            >
                              <Icon size={18} />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="border-t border-[#e8f1f8] px-4 py-3">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-[#d14c5e] transition hover:bg-[#fff3f5]"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <Link
                href="/cart"
                className="flex h-[46px] items-center gap-2 rounded-full border border-[#cfe5f5] bg-white px-4 text-sm font-semibold text-[#0f3d67] transition hover:border-[#38bdf8] hover:bg-[#f2fbff]"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Cart</span>
              </Link>
            </div>
          </div>

          <nav className="hidden items-center gap-2 border-t border-[#e6f1f8] py-3 lg:flex xl:gap-3">
            {categories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative inline-flex items-center rounded-full px-4 py-2.5 text-[15px] font-semibold text-[#33546d] transition-all duration-200 hover:bg-[#eaf7ff] hover:text-[#0f6cbd]"
              >
                <span>{item.name}</span>
                <span className="absolute inset-x-4 bottom-[4px] h-[2px] scale-x-0 rounded-full bg-[#38bdf8] transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
        </div>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-[60] bg-[#0f172a]/40 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="h-full w-[86%] max-w-[360px] overflow-y-auto bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-[#e6f1f8] bg-gradient-to-r from-[#eaf7ff] to-[#f8fcff] px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-[#0f172a]">Menu</p>
                    <p className="mt-1 text-xs text-[#6b879b]">
                      Browse categories and account options
                    </p>
                  </div>

                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    type="button"
                    className="rounded-md p-2 text-[#0f3d67] transition hover:bg-[#dff2ff]"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="relative mb-5">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="h-[50px] w-full rounded-full border border-[#cfe5f5] bg-[#f8fcff] py-3 pl-12 pr-4 text-sm text-[#0f172a] outline-none placeholder:text-[#8aa5b9] focus:border-[#38bdf8]"
                  />
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f7d95]"
                  />
                </div>

                {!user?.token ? (
                  <button
                    type="button"
                    className="mb-5 flex w-full items-center justify-between rounded-xl border border-[#e6f1f8] bg-white px-4 py-3 text-left text-sm font-semibold text-[#23435b] transition hover:border-[#b9e6fb] hover:bg-[#f2fbff] hover:text-[#0f6cbd]"
                    onClick={() => {
                      setMobileOpen(false);
                      setIsLoginOpen(true);
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <User size={18} />
                      Sign in
                    </span>
                    <ChevronRight size={17} />
                  </button>
                ) : (
                  <div className="mb-5 overflow-hidden rounded-[18px] border border-[#dbe8f5] bg-white">
                    <div className="border-b border-[#e8f1f8] bg-gradient-to-r from-[#f8fcff] to-[#eef7ff] px-4 py-4">
                      <p className="text-[17px] font-bold text-[#0f172a]">
                        Hi, {userName}
                      </p>
                      {userEmail ? (
                        <p className="mt-1 text-sm text-[#5f7d95]">
                          {userEmail}
                        </p>
                      ) : null}
                    </div>

                    <div className="py-2">
                      {accountMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#23435b] transition hover:bg-[#f2fbff] hover:text-[#0f6cbd]"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="flex items-center gap-3">
                              <Icon size={17} />
                              {item.label}
                            </span>
                            <ChevronRight size={16} />
                          </Link>
                        );
                      })}

                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#d14c5e] transition hover:bg-[#fff3f5]"
                        onClick={handleLogout}
                      >
                        <span className="flex items-center gap-3">
                          <LogOut size={17} />
                          Logout
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {categories.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl border border-[#e6f1f8] bg-white px-4 py-3 text-sm font-semibold text-[#23435b] transition hover:border-[#b9e6fb] hover:bg-[#f2fbff] hover:text-[#0f6cbd]"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{item.name}</span>
                      <ChevronRight size={17} />
                    </Link>
                  ))}

                  <Link
                    href="/cart"
                    className="flex items-center justify-between rounded-xl border border-[#e6f1f8] bg-white px-4 py-3 text-sm font-semibold text-[#23435b] transition hover:border-[#b9e6fb] hover:bg-[#f2fbff] hover:text-[#0f6cbd]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>Cart</span>
                    <ChevronRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        openLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}