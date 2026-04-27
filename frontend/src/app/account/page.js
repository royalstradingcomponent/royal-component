"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  ShoppingCart,
  TicketPercent,
  ShieldCheck,
  LogOut,
  ChevronRight,
  RotateCcw,
  HelpCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

function getUserName(user) {
  return user?.name || user?.fullName || user?.email || "Customer";
}

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { orders, fetchMyOrders } = useOrders();
  const { wishlistItems } = useWishlist();
  const { cartSummary, cartItems } = useCart();

  useEffect(() => {
    if (user?.token) {
      fetchMyOrders();
    }
  }, [user?.token, fetchMyOrders]);

  const recentOrders = useMemo(() => {
    return (orders || []).slice(0, 3);
  }, [orders]);

  const cartCount =
    Number(cartSummary?.itemCount || 0) ||
    (cartItems || []).reduce(
      (sum, item) => sum + Number(item.quantity || item.qty || 1),
      0
    );

  if (!user?.token) {
    return (
      <div className="min-h-screen bg-[#f3f7fb]">
        <Navbar />

        <main className="mx-auto max-w-[900px] px-4 py-16">
          <div className="rounded-[24px] border border-[#dbe5f0] bg-white p-10 text-center shadow-sm">
            <User size={58} className="mx-auto mb-4 text-[#2454b5]" />
            <h1 className="text-3xl font-black text-[#102033]">
              Please login to view your account
            </h1>
            <p className="mt-3 text-[#607287]">
              Login ke baad aap orders, wishlist, address aur profile details
              manage kar sakte hain.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7fb]">
      <Navbar />

      <main className="mx-auto max-w-[1280px] px-4 py-8">
        <section className="mb-6 overflow-hidden rounded-[26px] border border-[#dbe5f0] bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#102033_0%,#2454b5_100%)] p-7 text-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-black text-[#2454b5]">
                  {String(getUserName(user)).charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-bold text-white/75">
                    Welcome back
                  </p>
                  <h1 className="text-[34px] font-black leading-tight">
                    Hi, {getUserName(user)}
                  </h1>
                  <p className="mt-1 text-sm text-white/80">
                    Manage your Royal Component account
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-4">
            <DashboardCard
              icon={<Package size={22} />}
              label="Total Orders"
              value={(orders || []).length}
              href="/orders"
            />
            <DashboardCard
              icon={<Heart size={22} />}
              label="Wishlist"
              value={(wishlistItems || []).length}
              href="/wishlist"
            />
            <DashboardCard
              icon={<ShoppingCart size={22} />}
              label="Cart Items"
              value={cartCount}
              href="/checkout/cart"
            />
            <DashboardCard
              icon={<TicketPercent size={22} />}
              label="Coupons"
              value="View"
              href="/account/coupons"
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <AccountMenuItem icon={<User size={19} />} label="Profile" />
            <AccountMenuItem icon={<Package size={19} />} label="My Orders" href="/orders" />
            <AccountMenuItem icon={<RotateCcw size={19} />} label="Buy Again" href="/buy-again" />
            <AccountMenuItem icon={<Heart size={19} />} label="Wishlist" href="/wishlist" />
            <AccountMenuItem icon={<TicketPercent size={19} />} label="My Coupons" href="/account/coupons" />
            <AccountMenuItem icon={<HelpCircle size={19} />} label="Help & Support" href="/contact" />
          </aside>

          <section className="space-y-6">
            <div className="rounded-[24px] border border-[#dbe5f0] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-black text-[#102033]">
                Profile Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoBox icon={<User size={20} />} label="Name" value={getUserName(user)} />
                <InfoBox icon={<Mail size={20} />} label="Email" value={user?.email || "N/A"} />
                <InfoBox icon={<Phone size={20} />} label="Phone" value={user?.phone || "N/A"} />
                <InfoBox icon={<ShieldCheck size={20} />} label="Account Type" value={user?.role || "Customer"} />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#dbe5f0] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-[#102033]">
                  Recent Orders
                </h2>

                <Link
                  href="/orders"
                  className="text-sm font-black text-[#2454b5] hover:underline"
                >
                  View All
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <EmptyState
                  icon={<Package size={40} />}
                  title="No orders yet"
                  text="Aapne abhi tak koi order place nahi kiya."
                  href="/products"
                  button="Start Shopping"
                />
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <Link
                      key={order._id}
                      href={`/orders/${order._id}`}
                      className="flex flex-col gap-3 rounded-[18px] border border-[#e5edf6] p-4 hover:bg-[#f8fafc] md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-black text-[#102033]">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-sm text-[#607287]">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="text-sm font-bold text-[#2454b5]">
                        View Details →
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#dbe5f0] bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                  <MapPin size={22} />
                  Address Book
                </h2>
                <p className="text-sm leading-6 text-[#607287]">
                  Delivery address checkout ke time save/update hoga. Yahan se
                  aap future me address management page connect kar sakte ho.
                </p>
                <Link
                  href="/checkout"
                  className="mt-5 inline-flex rounded-[12px] bg-[#2454b5] px-5 py-3 text-sm font-black text-white"
                >
                  Manage Address
                </Link>
              </div>

              <div className="rounded-[24px] border border-[#dbe5f0] bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#102033]">
                  <ShieldCheck size={22} />
                  Security
                </h2>
                <p className="text-sm leading-6 text-[#607287]">
                  Password, Google login aur account security settings yahan
                  manage hongi.
                </p>
                <button className="mt-5 rounded-[12px] border border-[#dbe5f0] px-5 py-3 text-sm font-black text-[#102033]">
                  Coming Soon
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DashboardCard({ icon, label, value, href }) {
  return (
    <Link
      href={href}
      className="rounded-[20px] border border-[#dbe5f0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4ff] text-[#2454b5]">
        {icon}
      </div>
      <p className="text-sm text-[#607287]">{label}</p>
      <h3 className="mt-1 text-2xl font-black text-[#102033]">{value}</h3>
    </Link>
  );
}

function AccountMenuItem({ icon, label, href }) {
  const content = (
    <div className="flex items-center justify-between rounded-[18px] border border-[#dbe5f0] bg-white p-4 font-black text-[#102033] shadow-sm transition hover:bg-[#eef4ff]">
      <span className="flex items-center gap-3">
        <span className="text-[#2454b5]">{icon}</span>
        {label}
      </span>
      <ChevronRight size={18} />
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-[18px] border border-[#e5edf6] bg-[#f8fafc] p-4">
      <div className="mb-2 flex items-center gap-2 text-[#2454b5]">
        {icon}
        <span className="text-sm font-black">{label}</span>
      </div>
      <p className="break-all font-bold text-[#102033]">{value}</p>
    </div>
  );
}

function EmptyState({ icon, title, text, href, button }) {
  return (
    <div className="rounded-[20px] border border-dashed border-[#cfe0f1] bg-[#f8fafc] p-8 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4ff] text-[#2454b5]">
        {icon}
      </div>
      <h3 className="text-xl font-black text-[#102033]">{title}</h3>
      <p className="mt-2 text-sm text-[#607287]">{text}</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-[12px] bg-[#2454b5] px-5 py-3 text-sm font-black text-white"
      >
        {button}
      </Link>
    </div>
  );
}