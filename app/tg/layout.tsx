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
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <TgShell>{children}</TgShell>
    </>
  );
}
