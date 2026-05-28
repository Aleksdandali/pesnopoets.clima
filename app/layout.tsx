import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TrackingPixels from "@/components/seo/TrackingPixels";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

// Pin server rendering to fra1 (Frankfurt). Supabase project lives in
// eu-central-1, so this collapses the previous FRA edge -> IAD function
// -> FRA db round-trip into a single-region path.
export const preferredRegion = "fra1";

export const metadata: Metadata = {
  title: {
    default: "Песнопоец Клима — Климатици с монтаж в България",
    template: "%s | Песнопоец Клима",
  },
  description:
    "Климатици Daikin, Mitsubishi, Toshiba, Gree — продажба, доставка и монтаж във Варна.",
  openGraph: {
    images: ["/hero-bg.jpg"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // <html lang> is statically "bg" here so the root layout stays fully
  // static — using `headers()` to set the locale forced every downstream
  // route into Dynamic SSR (cache-control: no-store), defeating Vercel CDN
  // caching. The locale layout (`app/[locale]/layout.tsx`) updates this
  // attribute on the client from `params.locale` before any content paints.
  // Trade-off: hreflang + URL structure remain the primary locale signals
  // for search engines; <html lang> is a secondary a11y/SEO hint that
  // Googlebot still sees correctly thanks to that inline script.
  return (
    <html
      lang="bg"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://gzdcbkrtpbqcugqgrqut.supabase.co" />
        <link rel="dns-prefetch" href="https://gzdcbkrtpbqcugqgrqut.supabase.co" />
        <link rel="preconnect" href="https://www.bittel.bg" />
        <link rel="dns-prefetch" href="https://www.bittel.bg" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* TrackingPixels was previously inside <head> via Suspense, but
            Next.js 16 App Router does not execute `next/script` rendered
            into <head> through a suspended async client component — all
            tracker scripts (gtag, Meta Pixel, Clarity) were silently
            dropped from the DOM. Moving it inside <body> lets next/script
            inject after hydration as documented. */}
        <Suspense fallback={null}>
          <TrackingPixels />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
