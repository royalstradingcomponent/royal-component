"use client";

import Link from "next/link";
import {
  Menu,
  ShoppingCart,
  User,
  X,
  ChevronRight,
  ChevronDown,
  Package,
  PackageSearch,
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
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchBar from "@/components/SearchBar";
import { API_BASE } from "@/lib/api";

const fallbackCategories = [
  { name: "Amplifiers & Comparators", slug: "amplifierscomparators" },
  { name: "Audio & Video ICs", slug: "audiovideoics" },
  { name: "Chip Programmers & Debuggers", slug: "chipprogrammersdebuggers" },
  { name: "Clock, Timing & Frequency ICs", slug: "clocktimingfrequencyics" },
  {
    name: "Communication & Wireless Module ICs",
    slug: "communicationwirelessmoduleics",
  },
];

const accountMenuItems = [
  { label: "My Orders", href: "/checkout/order", icon: Package },
  { label: "Request Component", href: "/request-component", icon: PackageSearch },
  { label: "Track Request", href: "/request-component/my-requests", icon: PackageSearch },
  { label: "Buy Again", href: "/checkout/order", icon: RotateCcw },
  { label: "My Account", href: "/account", icon: LayoutDashboard },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "My Coupons", href: "/account/coupons", icon: TicketPercent },
  { label: "Contact Us", href: "/contact", icon: Phone },
  { label: "About Us", href: "/about", icon: Info },
  { label: "FAQ", href: "/contact#faq", icon: CircleHelp },
];

function getCategoryHref(item) {
  if (item?.href) return item.href;

  return `/products?category=semiconductors&subCategory=${encodeURIComponent(
    item?.slug || ""
  )}`;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [categories, setCategories] = useState(fallbackCategories);
  const [isSemiconductorMenuOpen, setIsSemiconductorMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartSummary, cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const accountMenuRef = useRef(null);

  const visibleCategories = categories.slice(0, 5);
  const allSemiconductorCategories = categories;

  const wishlistCount = (wishlistItems || []).length;

  const cartCount =
    Number(cartSummary?.itemCount || 0) ||
    (cartItems || []).reduce(
      (total, item) => total + Number(item.quantity || item.qty || 1),
      0
    );

  const userName = useMemo(() => {
    return String(
      user?.name || user?.fullName || user?.email || "My Account"
    ).trim();
  }, [user]);

  const userEmail = useMemo(() => {
    return user?.email ? String(user.email).trim() : "";
  }, [user]);

  const shortUserName = useMemo(() => {
    const name = String(user?.name || user?.fullName || "My Account").trim();
    return name.length > 18 ? `${name.slice(0, 18)}...` : name;
  }, [user]);

  useEffect(() => {
    const fetchNavbarCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!data?.success) return;

        const semiconductorSubCategories = (data.categories || [])
          .filter((cat) => cat.isActive !== false)
          .filter((cat) => cat.showInNavbar !== false)
          .filter((cat) => cat.parentSlug === "semiconductors")
          .sort(
            (a, b) =>
              Number(a.navbarOrder || 0) - Number(b.navbarOrder || 0) ||
              Number(a.order || 0) - Number(b.order || 0)
          )
          .map((cat) => ({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            href: `/products?category=semiconductors&subCategory=${encodeURIComponent(
              cat.slug
            )}`,
          }))
          .filter((cat) => cat.name && cat.slug);

        if (semiconductorSubCategories.length > 0) {
          setCategories(semiconductorSubCategories);
        }
      } catch (error) {
        console.error("Navbar category fetch error:", error);
      }
    };

    fetchNavbarCategories();
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    setMobileOpen(false);
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#d6e8f5] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <div className="bg-gradient-to-r from-[#0f6cbd] via-[#1792e8] to-[#38bdf8] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white sm:text-sm">
          Trusted Industrial Components • Fast Procurement • Bulk Order Support
        </div>

        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-4 lg:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="rounded-md p-2 text-[#0f3d67] transition hover:bg-[#eaf6ff] lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                type="button"
              >
                <Menu size={24} />
              </button>

              <Link href="/" className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1792e8] to-[#0f6cbd] text-xl font-extrabold text-white shadow-sm">
                  RC
                </div>

                <div className="min-w-0">
                  <p className="truncate text-lg font-extrabold leading-none text-[#0f172a] sm:text-[1.75rem]">
                    Royal Component
                  </p>
                  <p className="mt-1 hidden text-[11px] font-medium tracking-[0.02em] text-[#5f7d95] sm:block sm:text-xs">
                    Industrial Solutions Store
                  </p>
                </div>
              </Link>
            </div>

            <div className="hidden max-w-3xl flex-1 px-4 lg:flex">
              <SearchBar />
            </div>

            <div className="flex shrink-0 items-center gap-2 text-[#0f172a] sm:gap-3">
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
                      className={`transition-transform duration-200 ${isAccountMenuOpen ? "rotate-180" : ""
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
                href="/request-component"
                className="hidden h-[46px] items-center gap-2 rounded-full border border-[#b9e6fb] bg-[#eaf7ff] px-5 text-sm font-extrabold text-[#0f6cbd] shadow-sm transition hover:border-[#38bdf8] hover:bg-[#dff2ff] md:flex"
                >
                <PackageSearch size={18} />
                Request Component
              </Link>

              <Link
                href="/request-component/my-requests"
                className="hidden h-[46px] items-center gap-2 rounded-full border border-[#b9e6fb] bg-[#eaf7ff] px-5 text-sm font-extrabold text-[#0f6cbd] shadow-sm transition hover:border-[#38bdf8] hover:bg-[#dff2ff] md:flex"
                >
                <PackageSearch size={18} />
                Track Request
              </Link>

              <Link
                href="/wishlist"
                className="relative flex h-[46px] items-center justify-center rounded-full border border-[#cfe5f5] bg-white px-4 text-sm font-semibold text-[#0f3d67] transition hover:border-[#38bdf8] hover:bg-[#f2fbff]"
              >
                <span className="relative inline-flex">
                  <Heart size={18} />
                  {wishlistCount > 0 ? (
                    <span className="absolute -right-3 -top-3 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1.5 text-[10px] font-bold text-white shadow">
                      {wishlistCount}
                    </span>
                  ) : null}
                </span>
              </Link>

              <Link
                href="/checkout/cart"
                className="relative flex h-[46px] items-center gap-2 rounded-full border border-[#cfe5f5] bg-white px-4 text-sm font-semibold text-[#0f3d67] transition hover:border-[#38bdf8] hover:bg-[#f2fbff]"
              >
                <span className="relative inline-flex">
                  <ShoppingCart size={18} />
                  {cartCount > 0 ? (
                    <span className="absolute -right-3 -top-3 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1.5 text-[10px] font-bold leading-none text-white shadow">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                <span className="hidden sm:inline">Cart</span>
              </Link>
            </div>
          </div>

          <nav className="hidden border-t border-[#e6f1f8] py-3 lg:block">
            <div className="flex items-center gap-2 whitespace-nowrap xl:gap-3">
              {/* ALL SEMICONDUCTORS - FIRST */}
              <div
                className="relative shrink-0"
                onMouseEnter={() => setIsSemiconductorMenuOpen(true)}
                onMouseLeave={() => setIsSemiconductorMenuOpen(false)}
              >
                <Link
                  href="/products?category=semiconductors"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0f6cbd]/25 bg-[#eaf7ff] px-5 py-2.5 text-[15px] font-extrabold text-[#0f3d67] transition hover:border-[#38bdf8] hover:bg-[#dff2ff]"
                >
                  All Semiconductors
                  <ChevronDown size={16} />
                </Link>

                <div
                  className={`absolute left-0 top-full z-[90] mt-3 w-[980px] max-w-[calc(100vw-48px)] rounded-[24px] border border-[#d7e7f4] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.18)] transition-all duration-200 ${isSemiconductorMenuOpen
                    ? "visible opacity-100"
                    : "invisible opacity-0"
                    }`}
                >                  <div className="mb-4 flex items-center justify-between border-b border-[#e8f1f8] pb-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#0f172a]">
                        All Semiconductor Categories
                      </h3>
                      <p className="text-sm text-[#5f7d95]">
                        Browse ICs, modules, controllers, sensors and electronic components.
                      </p>
                    </div>

                    <Link
                      href="/products?category=semiconductors"
                      className="rounded-full bg-[#eaf7ff] px-4 py-2 text-sm font-bold text-[#0f6cbd] hover:bg-[#dff2ff]"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto pr-1 xl:grid-cols-4">
                    {allSemiconductorCategories.map((item) => (
                      <Link
                        key={item._id || item.slug}
                        href={getCategoryHref(item)}
                        onClick={() => setIsSemiconductorMenuOpen(false)}
                        className="flex min-h-[48px] items-center justify-between rounded-xl border border-[#e6f1f8] bg-[#f8fcff] px-4 py-3 text-sm font-bold text-[#23435b] transition hover:border-[#38bdf8] hover:bg-[#eaf7ff] hover:text-[#0f6cbd]"
                      >
                        <span className="whitespace-normal leading-snug">{item.name}</span>
                        <ChevronRight size={16} className="shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOP 5 CATEGORIES AFTER ALL SEMICONDUCTORS */}
              {visibleCategories.map((item) => (
                <Link
                  key={item._id || item.slug}
                  href={getCategoryHref(item)}
                  className="group relative inline-flex shrink-0 items-center rounded-full px-4 py-2.5 text-[15px] font-semibold text-[#33546d] transition-all duration-200 hover:bg-[#eaf7ff] hover:text-[#0f6cbd]"
                >
                  <span>{item.name}</span>
                  <span className="absolute inset-x-4 bottom-[4px] h-[2px] scale-x-0 rounded-full bg-[#38bdf8] transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {mobileOpen ? (
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
                    <p className="text-lg font-extrabold text-[#0f172a]">
                      Menu
                    </p>
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
                <div className="mb-5">
                  <SearchBar mobile onSearchDone={() => setMobileOpen(false)} />
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
                      key={item._id || item.slug}
                      href={getCategoryHref(item)}
                      className="flex items-center justify-between rounded-xl border border-[#e6f1f8] bg-white px-4 py-3 text-sm font-semibold text-[#23435b] transition hover:border-[#b9e6fb] hover:bg-[#f2fbff] hover:text-[#0f6cbd]"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{item.name}</span>
                      <ChevronRight size={17} />
                    </Link>
                  ))}

                  <Link
                    href="/request-component"
                    className="flex items-center justify-between rounded-xl border border-[#b9e6fb] bg-[#eaf7ff] px-4 py-3 text-sm font-extrabold text-[#0f6cbd] transition hover:border-[#38bdf8] hover:bg-[#dff2ff]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <PackageSearch size={17} />
                      Request Component
                    </span>
                    <ChevronRight size={17} />
                  </Link>

                  <Link
                    href="/request-component/my-requests"
                    className="flex items-center justify-between rounded-xl border border-[#b9e6fb] bg-[#eaf7ff] px-4 py-3 text-sm font-extrabold text-[#0f6cbd] transition hover:border-[#38bdf8] hover:bg-[#dff2ff]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <PackageSearch size={17} />
                      Track Request
                    </span>
                    <ChevronRight size={17} />
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between rounded-xl border border-[#e6f1f8] bg-white px-4 py-3 text-sm font-semibold text-[#23435b] transition hover:border-[#b9e6fb] hover:bg-[#f2fbff] hover:text-[#0f6cbd]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>
                      Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
                    </span>
                    <ChevronRight size={17} />
                  </Link>

                  <Link
                    href="/checkout/cart"
                    className="flex items-center justify-between rounded-xl border border-[#e6f1f8] bg-white px-4 py-3 text-sm font-semibold text-[#23435b] transition hover:border-[#b9e6fb] hover:bg-[#f2fbff] hover:text-[#0f6cbd]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
                    <ChevronRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
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
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
    </>
  );
}