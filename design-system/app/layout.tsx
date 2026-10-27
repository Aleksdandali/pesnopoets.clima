import type { Metadata } from "next";
import "../ui/tokens.css";
import "../ui/components.css";
import "./showcase.css";

export const metadata: Metadata = {
  title: "Песнопоец Клима | Дизайн-система 0.1",
  description:
    "Визуальная система магазина климатической техники. Рабочая версия для обсуждения.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="pc-theme">{children}</body>
    </html>
  );
}
