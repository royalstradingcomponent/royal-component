import "./globals.css";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { AddressProvider } from "@/context/AddressContext";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChatProvider } from "@/context/ChatContext";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  metadataBase: new URL("https://www.royalsmd.com"),

  title: {
    default:
      "Royal Trading Component | Electronic Components Supplier India",
    template: "%s | Royal Trading Component",
  },

  description:
    "Royal Trading Component is a leading electronic components supplier in India offering ICs, LCD displays, voltage regulators, sensors, modules, industrial electronics and wholesale electronic spare parts online.",

  keywords: [
  "Electronics Components Supplier India",
  "Electronic Parts Wholesale",
  "IC Components Supplier",
  "Electronic Components Store",
  "Industrial Electronics",
  "Voltage Regulator IC",
  "LCD Display Supplier",
  "Arduino Components",
  "PCB Components",
  "Sensors Modules",
  "Electronic Spare Parts",
  "Buy Electronic Components Online",
  "Semiconductor Supplier India",
  "Wholesale Electronics India",

  "Electronic Components Delhi",
  "Electronics Parts Delhi",
  "IC Supplier Delhi",
  "Electronics Market Delhi",
  "Electronic Components Uttam Nagar",
  "Electronic Components Janakpuri",
  "Electronic Components Nehru Place",
  "Electronic Components Lajpat Rai Market",
  "Wholesale Electronics Delhi",
  "Industrial Electronics Delhi",
  "PCB Components Delhi",
  "Arduino Components Delhi",
  "LCD Display Supplier Delhi",
  "Electronics Shop Delhi",
  "Semiconductor Supplier Delhi",

  "Royal Trading Component",
],

  authors: [{ name: "Royal Trading Component" }],

  creator: "Royal Trading Component",

  publisher: "Royal Trading Component",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://www.royalsmd.com",
  },

  openGraph: {
    title:
      "Royal Trading Component | Electronic Components Supplier India",

    description:
      "Buy ICs, LCD displays, voltage regulators, sensors, modules and industrial electronic components online in India.",

    url: "https://www.royalsmd.com",

    siteName: "Royal Trading Component",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Royal Trading Component",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Royal Trading Component | Electronic Components Supplier India",

    description:
      "Buy electronic components, ICs, LCD displays, sensors and industrial electronics online.",

    images: ["/og-image.jpg"],
  },

  category: "Electronics",
};

export default function RootLayout({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">

  <Script
    id="facebook-pixel"
    strategy="afterInteractive"
  >
    {`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}
      (window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '1287323066454073');
      fbq('track', 'PageView');
    `}
  </Script>

  <noscript>
    <img
      height="1"
      width="1"
      style={{ display: "none" }}
      src="https://www.facebook.com/tr?id=1287323066454073&ev=PageView&noscript=1"
      alt=""
    />
  </noscript>

  
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
        <GoogleAnalytics gaId="G-8JQQ1462E2" />
      </body>
    </html>
  );
}