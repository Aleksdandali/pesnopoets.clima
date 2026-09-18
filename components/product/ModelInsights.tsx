import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ModelInsights } from "@/lib/product/insights";

interface ModelInsightsProps {
  locale: string;
  insights: ModelInsights;
  links: Array<{ href: string; label: string }>;
}

const TITLES: Record<string, string> = {
  bg: "Оценка на Песнопоец Клима",
  en: "Pesnopoets Clima verdict",
  ru: "Оценка Песнопоец Клима",
  ua: "Оцінка Песнопоец Клима",
};

/**
 * Spec-derived, model-specific copy + contextual links to the category,
 * brand, installation and maintenance pages. Server component, no data
 * fetching — everything comes from the product row already loaded.
 */
export default function ModelInsights({ locale, insights, links }: ModelInsightsProps) {
  if (insights.paragraphs.length === 0) return null;
  return (
    <section className="mt-10 sm:mt-12">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
        {TITLES[locale] || TITLES.bg}
      </h2>
      <div className="space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
        {insights.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {links.length > 0 && (
        <ul role="list" className="mt-5 flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted text-xs sm:text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {l.label}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
