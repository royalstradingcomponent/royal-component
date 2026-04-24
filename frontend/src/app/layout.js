import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "Royal Component | Industrial Components Store",
  description:
    "Buy industrial, electrical and electronic components online with technical specifications, trusted brands and fast delivery.",
};

export default function RootLayout({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // optional safety check
  if (!googleClientId) {
    console.error("❌ GOOGLE CLIENT ID missing");
  }

  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <Toaster position="top-right" richColors />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}