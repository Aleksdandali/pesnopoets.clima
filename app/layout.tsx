import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const resolvedParams = await params.catch(() => ({ locale: "bg" }));
  const locale = resolvedParams?.locale || "bg";
  const langMap: Record<string, string> = { bg: "bg", en: "en", ru: "ru", ua: "uk" };
  const htmlLang = langMap[locale] || "bg";

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
