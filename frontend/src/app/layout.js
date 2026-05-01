import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { AddressProvider } from "@/context/AddressContext";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChatProvider } from "@/context/ChatContext";

export const metadata = {
  title: "Royal Component | Industrial Components Store",
  description:
    "Buy industrial, electrical and electronic components online with technical specifications, trusted brands and fast delivery.",
};

export default function RootLayout({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <OrderProvider>
                  <AddressProvider>
                    <ChatProvider>

                    {children}
                    <Toaster position="top-right" richColors />
                        </ChatProvider>

                  </AddressProvider>
                </OrderProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}