"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://royal-component-backend.onrender.com";

export function GoogleLoginButton({ onSuccess, mode = "login" }) {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const credential = credentialResponse?.credential;

          if (!credential) {
            toast.error("Google credential not received");
            return;
          }

          const res = await axios.post(`${API_BASE}/api/auth/google`, {
            credential,
            mode, // ✅ ye important hai
          });

          onSuccess(res);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Google login failed"
          );
        }
      }}
      onError={() => {
        toast.error("Google login failed");
      }}
    />
  );
}