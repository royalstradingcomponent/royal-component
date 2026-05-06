"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

export default function AdminAuthPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const signin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.role !== "admin") {
        throw new Error("Only admin users can access this panel");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole", data.role);

      toast.success("Admin login successful");
      router.replace("/admin");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef3f8] px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#102033]">
            Royal Component
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Admin Panel Login
          </p>
        </div>

        <form onSubmit={signin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2454b5] focus:ring-2 focus:ring-[#2454b5]/15"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2454b5] focus:ring-2 focus:ring-[#2454b5]/15"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2454b5] py-3 text-sm font-bold text-white transition hover:bg-[#1d469b] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}