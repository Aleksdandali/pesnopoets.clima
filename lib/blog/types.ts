import type { ReactNode } from "react";

export type Locale = "bg" | "en" | "ru" | "ua";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  date: string; // ISO date string
  readingTime: Record<Locale, string>;
  image: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  keywords: Record<Locale, string[]>;
  content: Record<Locale, () => ReactNode>;
  /** Optional FAQ items per locale — used for FAQ structured data (JSON-LD). */
  faq?: Partial<Record<Locale, FaqItem[]>>;
}
