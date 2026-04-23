"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import AuthModel from "./AuthModel";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const toOtpDigits = (value = "") => value.replace(/\D/g, "").slice(0, 6);

/* ================= REUSABLE INPUT ================= */
export function AuthInput({
  type = "text",
  placeholder,
  value,
  onChange,
  inputMode,
  autoComplete,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputMode={inputMode}
      autoComplete={autoComplete}
      required
      className="w-full rounded-[18px] border border-[#d8e8f8] bg-white px-4 py-3.5 text-[15px] text-[#16324f] placeholder:text-[#7e97ad] outline-none transition focus:border-[#2454b5] focus:ring-4 focus:ring-[#e7f1ff]"
    />
  );
}

/* ================= PASSWORD INPUT ================= */
export function AuthPasswordInput({
  placeholder,
  value,
  onChange,
  autoComplete,
  visible,
  onToggle,
}) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        className="w-full rounded-[18px] border border-[#d8e8f8] bg-white px-4 py-3.5 pr-12 text-[15px] text-[#16324f] placeholder:text-[#7e97ad] outline-none transition focus:border-[#2454b5] focus:ring-4 focus:ring-[#e7f1ff]"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f88a0] transition hover:text-[#2454b5]"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

/* ================= REUSABLE BUTTON ================= */
export function AuthButton({
  children,
  type = "button",
  onClick,
  loading,
  loadingLabel = "Please wait...",
  variant = "primary",
}) {
  const base =
    "flex w-full items-center justify-center rounded-[18px] px-4 py-3.5 text-[15px] font-semibold tracking-[0.02em] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75";

  const styles = {
    primary:
      "bg-[linear-gradient(135deg,#2454b5_0%,#3a86e9_100%)] text-white shadow-[0_16px_32px_rgba(36,84,181,0.24)] hover:brightness-[1.03]",
    outline:
      "border border-[#d7e7f4] bg-white text-[#2454b5] hover:border-[#2454b5] hover:bg-[#f3f8ff]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${base} ${styles[variant]}`}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}

/* ================= DIVIDER ================= */
export function AuthDivider() {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#dbe8f5]" />
      <span className="text-xs font-medium uppercase tracking-[0.32em] text-[#7f96ac]">
        Or
      </span>
      <div className="h-px flex-1 bg-[#dbe8f5]" />
    </div>
  );
}

/* ================= GOOGLE LOGIN BUTTON ================= */
export function GoogleLoginButton({ onSuccess }) {
  const { startAuthTransition, stopAuthTransition } = useAuth();
  const wrapperRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const updateWidth = () => {
      setButtonWidth(Math.max(Math.floor(element.getBoundingClientRect().width), 0));
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full rounded-[18px] border border-[#d8e8f8] bg-white p-[1px] shadow-[0_8px_20px_rgba(36,84,181,0.08)]"
      >
      <div className="w-full overflow-hidden rounded-[17px]">
        {buttonWidth > 0 ? (
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              startAuthTransition("Signing you in...");

              try {
                const res = await axios.post(`${API_BASE}/api/auth/google`, {
                  credential: credentialResponse.credential,
                });
                onSuccess(res);
              } catch (error) {
                stopAuthTransition();
                toast.error(error.response?.data?.message || "Google login failed");
              }
            }}
            onError={() => {
              stopAuthTransition();
              toast.error("Google Login Failed");
            }}
            width={String(buttonWidth - 2)}
            size="large"
            shape="rectangular"
            theme="outline"
          />
        ) : null}
      </div>
    </div>
  );
}

/* ================= MAIN LOGIN MODAL ================= */
export default function LoginModal({ isOpen, onClose, openRegister }) {
  const { login, startAuthTransition, stopAuthTransition } = useAuth();

  const [step, setStep] = useState(1);
  const [view, setView] = useState("password");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const cleanIdentifier = useMemo(() => identifier.trim(), [identifier]);

  const resetForm = () => {
    setStep(1);
    setView("password");
    setIdentifier("");
    setPassword("");
    setOtp("");
    setConfirm("");
    setShowPassword(false);
    setShowResetPassword(false);
    setShowResetConfirm(false);
    setLoading(false);
    setActiveAction(null);
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const handleAuthSuccess = (res) => {
    const token = res.data.token;

    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    };

    login(userData, token, {
      successMessage: "Successfully logged in",
      pendingLabel: "Signing you in...",
    });
    onClose();
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setActiveAction("passwordLogin");
    setLoading(true);
    startAuthTransition("Signing you in...");
    let didCompleteAuth = false;

    try {
      const payload = cleanIdentifier.includes("@")
        ? { email: cleanIdentifier.toLowerCase(), password }
        : { phone: cleanIdentifier, password };

      const res = await axios.post(`${API_BASE}/api/auth/login`, payload);
      handleAuthSuccess(res);
      didCompleteAuth = true;
    } catch (err) {
      stopAuthTransition();
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      if (!didCompleteAuth) {
        setLoading(false);
        setActiveAction(null);
      }
    }
  };

  const sendLoginOtp = async () => {
    setActiveAction("sendLoginOtp");
    setLoading(true);
    startAuthTransition("Sending OTP...");

    try {
      const payload = cleanIdentifier.includes("@")
        ? { email: cleanIdentifier.toLowerCase() }
        : { phone: cleanIdentifier };

      await axios.post(`${API_BASE}/api/auth/login/send-otp`, payload);
      setView("verifyOtp");
      toast.success("OTP sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
      setActiveAction(null);
      stopAuthTransition();
    }
  };

  const resendLoginOtp = async () => {
    setActiveAction("resendLoginOtp");
    setLoading(true);

    try {
      const payload = cleanIdentifier.includes("@")
        ? { email: cleanIdentifier.toLowerCase() }
        : { phone: cleanIdentifier };

      await axios.post(`${API_BASE}/api/auth/login/send-otp`, payload);
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const verifyLoginOtp = async () => {
    setActiveAction("verifyLoginOtp");
    setLoading(true);
    startAuthTransition("Signing you in...");
    let didCompleteAuth = false;

    try {
      const payload = cleanIdentifier.includes("@")
        ? { email: cleanIdentifier.toLowerCase(), otp: otp.trim() }
        : { phone: cleanIdentifier, otp: otp.trim() };

      const res = await axios.post(`${API_BASE}/api/auth/login/verify-otp`, payload);
      handleAuthSuccess(res);
      didCompleteAuth = true;
    } catch (err) {
      stopAuthTransition();
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      if (!didCompleteAuth) {
        setLoading(false);
        setActiveAction(null);
      }
    }
  };

  const forgotPassword = async () => {
    setActiveAction("forgotPassword");
    setLoading(true);
    startAuthTransition("Verifying your account...");

    try {
      const payload = cleanIdentifier.includes("@")
        ? { email: cleanIdentifier.toLowerCase() }
        : { phone: cleanIdentifier };

      await axios.post(`${API_BASE}/api/auth/password/forgot`, payload);
      setView("verifyForgotOtp");
      toast.success("OTP sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
      setActiveAction(null);
      stopAuthTransition();
    }
  };

  const resendForgotOtp = async () => {
    setActiveAction("resendForgotOtp");
    setLoading(true);

    try {
      const payload = cleanIdentifier.includes("@")
        ? { email: cleanIdentifier.toLowerCase() }
        : { phone: cleanIdentifier };

      await axios.post(`${API_BASE}/api/auth/password/forgot`, payload);
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const verifyForgotOtp = async () => {
    setActiveAction("verifyForgotOtp");
    setLoading(true);
    startAuthTransition("Verifying your account...");

    try {
      const payload = cleanIdentifier.includes("@")
        ? { email: cleanIdentifier.toLowerCase(), otp: otp.trim() }
        : { phone: cleanIdentifier, otp: otp.trim() };

      const res = await axios.post(`${API_BASE}/api/auth/password/verify-otp`, payload);

      localStorage.setItem("resetToken", res.data.resetToken);
      setView("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
      setActiveAction(null);
      stopAuthTransition();
    }
  };

  const resetPassword = async () => {
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setActiveAction("resetPassword");
    setLoading(true);
    startAuthTransition("Updating your password...");
    let didCompleteAuth = false;

    try {
      const resetToken = localStorage.getItem("resetToken");

      const res = await axios.post(`${API_BASE}/api/auth/password/reset`, {
        resetToken,
        newPassword: password,
      });

      localStorage.removeItem("resetToken");
      handleAuthSuccess(res);
      didCompleteAuth = true;
    } catch (err) {
      stopAuthTransition();
      toast.error(err.response?.data?.message || "Reset failed");
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
          <div className="space-y-1">
            <h2
              className="text-[34px] leading-none text-[#102033]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Login
            </h2>
            <p className="text-sm text-[#5f7891]">
              Access your wishlist, saved bag, orders, and exclusive offers.
            </p>

          </div>
        </div>

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!cleanIdentifier) return;
              setStep(2);
            }}
            className="space-y-4"
          >
            <AuthInput
              placeholder="Email or Mobile Number"
              value={identifier}
              inputMode="email"
              autoComplete="username"
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <AuthButton type="submit">Continue</AuthButton>

            <AuthDivider />

            <GoogleLoginButton onSuccess={handleAuthSuccess} />
          </form>
        )}

        {step === 2 && view === "password" && (
          <>
            <p className="rounded-2xl border border-[#dbe8f5] bg-[#f4f9ff] px-4 py-3 text-sm text-[#5f7891]">
              Signing in as{" "}
              <span className="font-semibold text-[#16324f]">{identifier}</span>
            </p>

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <AuthPasswordInput
                placeholder="Password"
                value={password}
                autoComplete="current-password"
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                onChange={(e) => setPassword(e.target.value)}
              />

              <AuthButton
                type="submit"
                loading={loading && activeAction === "passwordLogin"}
                loadingLabel="Signing in..."
              >
                Login
              </AuthButton>
            </form>

            <div className="text-right">
              <button
                type="button"
                onClick={forgotPassword}
                className="text-sm font-medium text-[#2454b5] transition hover:text-[#1d4698]"
              >
                Forgot Password?
              </button>
            </div>

            <AuthDivider />

            <AuthButton
              variant="outline"
              onClick={sendLoginOtp}
              loading={loading && activeAction === "sendLoginOtp"}
              loadingLabel="Sending OTP..."
            >
              Login via OTP
            </AuthButton>
          </>
        )}

        {view === "verifyOtp" && (
          <div className="space-y-4">
            <p className="rounded-2xl border border-[#f0e1e6] bg-[#fff7f9] px-4 py-3 text-sm text-[#7f666d]">
              Enter the OTP sent to{" "}
              <span className="font-semibold text-[#4a2e35]">{identifier}</span>
            </p>

            <AuthInput
              placeholder="Enter OTP"
              value={otp}
              inputMode="numeric"
              onChange={(e) => setOtp(toOtpDigits(e.target.value))}
            />

            <AuthButton
              onClick={verifyLoginOtp}
              loading={loading && activeAction === "verifyLoginOtp"}
              loadingLabel="Verifying OTP..."
            >
              Verify OTP
            </AuthButton>

            <button
              type="button"
              onClick={resendLoginOtp}
              disabled={loading}
              >
              {loading && activeAction === "resendLoginOtp"
                ? "Resending OTP..."
                : "Resend OTP"}
            </button>
          </div>
        )}

        {view === "verifyForgotOtp" && (
          <div className="space-y-4">
            <p className="rounded-2xl border border-[#f0e1e6] bg-[#fff7f9] px-4 py-3 text-sm text-[#7f666d]">
              Verify the OTP to reset your password for{" "}
              <span className="font-semibold text-[#4a2e35]">{identifier}</span>
            </p>

            <AuthInput
              placeholder="Enter OTP"
              value={otp}
              inputMode="numeric"
              onChange={(e) => setOtp(toOtpDigits(e.target.value))}
            />

            <AuthButton
              onClick={verifyForgotOtp}
              loading={loading && activeAction === "verifyForgotOtp"}
              loadingLabel="Verifying OTP..."
            >
              Verify OTP
            </AuthButton>

            <button
              type="button"
              onClick={resendForgotOtp}
              disabled={loading}
              className="text-sm font-medium text-[#2454b5] transition hover:text-[#1d4698] disabled:opacity-60"
              >
              {loading && activeAction === "resendForgotOtp"
                ? "Resending OTP..."
                : "Resend OTP"}
            </button>
          </div>
        )}

        {view === "reset" && (
          <div className="space-y-4">
            <AuthPasswordInput
              placeholder="New Password"
              value={password}
              autoComplete="new-password"
              visible={showResetPassword}
              onToggle={() => setShowResetPassword((prev) => !prev)}
              onChange={(e) => setPassword(e.target.value)}
            />

            <AuthPasswordInput
              placeholder="Confirm Password"
              value={confirm}
              autoComplete="new-password"
              visible={showResetConfirm}
              onToggle={() => setShowResetConfirm((prev) => !prev)}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <AuthButton
              onClick={resetPassword}
              loading={loading && activeAction === "resetPassword"}
              loadingLabel="Updating password..."
            >
              Change Password
            </AuthButton>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-[#6c849a]">
        New user?{" "}
        <span
          onClick={openRegister}
          className="cursor-pointer font-semibold text-[#2454b5] transition hover:text-[#1d4698]"
        >
          Register
        </span>
      </p>
    </AuthModel>
  );
}