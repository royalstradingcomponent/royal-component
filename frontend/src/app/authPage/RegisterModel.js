"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AuthModel from "./AuthModel";
import { useAuth } from "@/context/AuthContext";
import {
  AuthButton,
  AuthDivider,
  AuthInput,
  AuthPasswordInput,
  GoogleLoginButton,
} from "./LoginModel";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const toOtpDigits = (value = "") => value.replace(/\D/g, "").slice(0, 6);

export default function RegisterModal({ isOpen, onClose, openLogin }) {
  const { login, startAuthTransition, stopAuthTransition } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setStep(1);
    setLoading(false);
    setActiveAction(null);
    setShowPassword(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      otp: "",
    });
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const completeAuth = (res) => {
    const token = res.data.token;
    const userData = {
      _id: res.data._id || res.data.user?._id,
      name: res.data.name || res.data.user?.name || formData.name.trim(),
      email:
        res.data.email ||
        res.data.user?.email ||
        formData.email.toLowerCase().trim(),
      role: res.data.role || res.data.user?.role,
      phone: res.data.phone || res.data.user?.phone || formData.phone.trim(),
    };

    login(userData, token, {
      successMessage: "Account created successfully",
      pendingLabel: "Creating your account...",
    });
    onClose();
  };

  const handleGoogleSuccess = async (res) => {
    completeAuth(res);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setActiveAction("sendOtp");
    startAuthTransition("Sending OTP...");

    if (!formData.email.trim() && !formData.phone.trim()) {
      toast.error("Email or phone number is required");
      setLoading(false);
      setActiveAction(null);
      stopAuthTransition();
      return;
    }

    try {
      const payload = formData.email.trim()
        ? { email: formData.email.toLowerCase().trim() }
        : { phone: formData.phone.trim() };

      await axios.post(`${API_BASE}/api/otp/send`, payload);
      setStep(2);
      toast.success("OTP sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
      setActiveAction(null);
      stopAuthTransition();
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setActiveAction("resendOtp");

    try {
      const payload = formData.email.trim()
        ? { email: formData.email.toLowerCase().trim() }
        : { phone: formData.phone.trim() };

      await axios.post(`${API_BASE}/api/otp/send`, payload);
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setActiveAction("completeRegister");
    startAuthTransition("Creating your account...");
    let didCompleteAuth = false;

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        otp: formData.otp.trim(),
      });

      completeAuth(res);
      didCompleteAuth = true;
    } catch (err) {
      stopAuthTransition();
      toast.error(
        err.response?.data?.message || "Invalid OTP or registration failed"
      );
    } finally {
      if (!didCompleteAuth) {
        setLoading(false);
        setActiveAction(null);
      }
    }
  };

  return (
    <AuthModel isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-[#d8e8f8] bg-[#f8fbff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2454b5]">
            Join Royal Component
          </span>

          <div className="space-y-1">
            <h2
              className="text-[32px] leading-none text-[#102033]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Create Account
            </h2>
            <p className="text-sm text-[#5f7891]">
              Save your wishlist, track your orders, and enjoy a smoother checkout.
            </p>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <AuthInput
              placeholder="Full Name"
              value={formData.name}
              autoComplete="name"
              onChange={(e) => setField("name", e.target.value)}
            />

            <AuthInput
              type="email"
              placeholder="Email Address"
              value={formData.email}
              autoComplete="email"
              onChange={(e) => setField("email", e.target.value)}
            />

            <AuthInput
              placeholder="Phone Number"
              value={formData.phone}
              inputMode="tel"
              autoComplete="tel"
              onChange={(e) => setField("phone", e.target.value)}
            />

            <AuthPasswordInput
              placeholder="Create Password"
              value={formData.password}
              autoComplete="new-password"
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              onChange={(e) => setField("password", e.target.value)}
            />

            <AuthButton
              type="submit"
              loading={loading && activeAction === "sendOtp"}
              loadingLabel="Sending OTP..."
            >
              Send OTP
            </AuthButton>

            <AuthDivider />

            <GoogleLoginButton mode="register" onSuccess={handleGoogleSuccess} />
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="rounded-2xl border border-[#dbe8f5] bg-[#f4f9ff] px-4 py-3 text-sm text-[#5f7891]">
              OTP sent to{" "}
              <span className="font-semibold text-[#16324f]">
                {formData.email || formData.phone}
              </span>
            </div>

            <AuthInput
              placeholder="Enter OTP"
              value={formData.otp}
              inputMode="numeric"
              onChange={(e) => setField("otp", toOtpDigits(e.target.value))}
            />

            <AuthButton
              type="submit"
              loading={loading && activeAction === "completeRegister"}
              loadingLabel="Creating account..."
            >
              Complete Registration
            </AuthButton>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[#2454b5] transition hover:text-[#1d4698]"
              >
                Edit details
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm font-medium text-[#2454b5] transition hover:text-[#1d4698] disabled:opacity-60"
              >
                {loading && activeAction === "resendOtp"
                  ? "Resending OTP..."
                  : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-6 text-sm text-[#6c849a]">
        Already have an account?{" "}
        <span
          onClick={openLogin}
          className="cursor-pointer font-semibold text-[#2454b5] transition hover:text-[#1d4698]"
        >
          Login
        </span>
      </p>
    </AuthModel>
  );
}