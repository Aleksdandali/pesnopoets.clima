import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
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
    "Климатици от водещи марки — Daikin, Mitsubishi, Toshiba, Gree. Продажба, доставка и монтаж в цяла България.",
  openGraph: {
    images: ["/hero-bg.jpg"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com"
  ),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Locale comes from middleware via the `x-locale` request header.
  // Root layout does NOT receive `params.locale` — that segment belongs
  // to the child `[locale]/...` layout. Reading params here always
  // resolved to undefined, which is why every locale rendered <html lang="bg">.
  const headerStore = await headers();
  const locale = headerStore.get("x-locale") || "bg";
  const langMap: Record<string, string> = { bg: "bg", en: "en", ru: "ru", ua: "uk" };
  const htmlLang = langMap[locale] || "bg";

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://gzdcbkrtpbqcugqgrqut.supabase.co" />
        <link rel="dns-prefetch" href="https://gzdcbkrtpbqcugqgrqut.supabase.co" />
        <link rel="preconnect" href="https://www.bittel.bg" />
        <link rel="dns-prefetch" href="https://www.bittel.bg" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <Suspense fallback={null}>
          <TrackingPixels />
        </Suspense>
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
