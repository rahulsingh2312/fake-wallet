import type { Metadata, Viewport } from "next";
import { Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Phantom on Android renders in Roboto. Inter sits ~10% wider at the same cap
// height, which reads as "too bold" next to the real app.
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// Landing-only display face. The wallet itself stays on Roboto so it keeps
// matching the real app.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fakewallet.fun"),
  title: "fakewallet — fake crypto wallet screenshot generator",
  description:
    "your portfolio, exactly as big as you say it is. type any balance into a pixel-matched wallet ui, with live jupiter prices. no signup, no keys, no wallet connection.",
  manifest: "/manifest.webmanifest",
  applicationName: "fakewallet",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "fakewallet",
  },
  openGraph: {
    type: "website",
    url: "https://fakewallet.fun",
    siteName: "fakewallet",
    title: "fakewallet",
    description: "your portfolio, exactly as big as you say it is.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "fakewallet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "fakewallet",
    description: "your portfolio, exactly as big as you say it is.",
    images: ["/brand/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${roboto.variable} ${display.variable}`}>
      <body className="bg-ph-bg text-ph-text antialiased no-select">
        {children}
      </body>
    </html>
  );
}
