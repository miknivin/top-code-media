import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { LenisProvider } from "@/lib/lenis-provider";
import "./globals.css";

// opsz keeps the display cuts crisp at headline sizes. The wdth axis is left out on
// purpose: it would add ~53KB to the font that paints the LCP headline.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

// Only the display face is preloaded: it sets the hero headline (the LCP element),
// and preloading the accent faces would compete with it for bandwidth.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Top Code Media | Digital Marketing Agency in the UAE",
  description: site.description,
  openGraph: {
    title: "Top Code Media | Connect. Convert. Grow.",
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Code Media | Connect. Convert. Grow.",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <LenisProvider>{children}</LenisProvider>
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-70 opacity-[0.07]" />
      </body>
    </html>
  );
}
