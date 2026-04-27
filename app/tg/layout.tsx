import type { Metadata } from "next";
import Script from "next/script";
import TgShell from "./TgShell";

export const metadata: Metadata = {
  title: "CRM Pesnopoets",
  robots: { index: false, follow: false },
};

export default function TgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Inter font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <TgShell>{children}</TgShell>
    </>
  );
}
