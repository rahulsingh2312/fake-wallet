import type { Metadata, Viewport } from "next";
import { Roboto, Figtree } from "next/font/google";
import "./globals.css";

// Phantom on Android renders in Roboto. Inter sits ~10% wider at the same cap
// height, which reads as "too bold" next to the real app.
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// Landing-only display face. phantom.com sets everything in "Phantom", a
// proprietary grotesk we can't ship; Figtree is the closest thing on Google
// Fonts — same single-storey `g`, straight-tailed `y` and near-identical
// widths at the same optical size. Loaded as the variable font on purpose:
// phantom's body copy sits at weight 350, which a static set can't hit.
// The wallet itself stays on Roboto so it keeps matching the real app.
const display = Figtree({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// larpwallet.online is the intended domain but isn't pointed at this deploy yet
// (it resolves to a parked page, so /brand/og.png 404s there). metadataBase
// resolves every relative asset URL (OG image included) against this host,
// so it has to be wherever the site actually lives right now, or link
// previews on X/Discord/iMessage show no image at all.
export const metadata: Metadata = {
  metadataBase: new URL("https://fakewalletz.vercel.app"),
  title: "larp wallet: fake crypto wallet screenshot generator",
  description:
    "your portfolio, exactly as big as you say it is. type any balance into a pixel-matched wallet ui, with live jupiter prices. no signup, no keys, no wallet connection.",
  manifest: "/manifest.webmanifest",
  applicationName: "larp wallet",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "larp wallet",
  },
  openGraph: {
    type: "website",
    url: "https://fakewalletz.vercel.app",
    siteName: "larp wallet",
    title: "larp wallet",
    description: "your portfolio, exactly as big as you say it is.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "larp wallet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "larp wallet",
    description: "your portfolio, exactly as big as you say it is.",
    images: ["/brand/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
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
    // suppressHydrationWarning: the pre-paint script below stamps data-theme
    // on this element before React hydrates, so the server HTML and the client
    // DOM never match here by design.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${display.variable}`}
    >
      <body className="bg-ph-bg text-ph-text antialiased no-select">
        {/* Applies a saved dark-mode choice before paint, so the landing
            doesn't flash light then repaint dark. Only ThemeToggle writes
            this key; the wallet ignores it entirely. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('larp-phantom:theme')==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
