"use client";

import { useState, useEffect } from "react";
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

  const [step, setStep] = useState("login");
  const [otp, setOtp] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);

  const [timer, setTimer] = useState(60);

  const signin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/admin/send-otp`, {
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

      setAdminEmail(data.email);
      setStep("otp");
      setTimer(60);

      toast.success("OTP sent to admin email");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyAdminOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/admin/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminEmail,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      localStorage.setItem("adminToken", data.token);

      localStorage.setItem("adminRole", data.role);

      localStorage.setItem("adminName", data.name);

      localStorage.setItem("adminEmail", data.email);

      const sessionId = crypto.randomUUID();

      localStorage.setItem("adminSessionId", sessionId);

      toast.success("Admin login successful");

      router.replace("/admin");
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/admin/resend-otp`, {
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
        throw new Error(data.message);
      }

      setTimer(60);

      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step !== "otp") return;

    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg">
            R
          </div>

          <h1 className="text-lg font-bold">
            {adminName || "Royal Trading Component"}
          </h1>

          <p className="text-xs text-slate-300">
            {adminEmail || "Admin Control Panel"}
          </p>
        </div>

        <form
          onSubmit={step === "login" ? signin : verifyAdminOtp}
          className="space-y-4"
        >
          {step === "login" ? (
            <>
              <div>
                <label className="mb-3 block text-base font-bold text-slate-800">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700 transition-all duration-200 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    setForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2454b5] focus:ring-2 focus:ring-[#2454b5]/15"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Enter OTP
                </label>

                <div className="flex justify-center gap-3">
                  {otpArray.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        const newOtp = [...otpArray];
                        newOtp[index] = value;
                        setOtpArray(newOtp);
                        setOtp(newOtp.join(""));

                        if (value && e.target.nextSibling) {
                          e.target.nextSibling.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !otpArray[index] &&
                          e.target.previousSibling
                        ) {
                          e.target.previousSibling.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();

                        const pasted = e.clipboardData
                          .getData("text")
                          .slice(0, 6)
                          .split("");

                        const newOtp = [...otpArray];

                        pasted.forEach((char, i) => {
                          if (i < 6) {
                            newOtp[i] = char;
                          }
                        });

                        setOtpArray(newOtp);
                        setOtp(newOtp.join(""));
                      }}
                      className="h-14 w-12 rounded-xl border-2 border-slate-200 bg-white text-center text-2xl font-bold outline-none focus:border-[#2874f0] focus:ring-4 focus:ring-blue-100"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  setOtp("");
                  setTimer(60);
                  setOtpArray(["", "", "", "", "", ""]);
                }}
                className="w-full rounded-2xl bg-gradient-to-r from-slate-400 to-slate-500 py-4 text-sm font-bold text-white shadow-md transition-all duration-200 hover:from-slate-500 hover:to-slate-600"
              >
                Back
              </button>

              <button
                type="button"
                disabled={timer > 0}
                onClick={resendOtp}
                className={`w-full rounded-2xl py-4 text-sm font-bold ${
                  timer > 0
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                }`}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
