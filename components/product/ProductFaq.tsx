import { HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface ProductFaqProps {
  locale: string;
  labels: {
    title: string;
    items: FaqItem[];
  };
  productName?: string;
}

export default function ProductFaq({ locale, labels, productName }: ProductFaqProps) {
  if (!labels?.items?.length) return null;

  // FAQ JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: labels.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-foreground mb-4">
        <div className="w-8 h-8 bg-primary-light/60 rounded-lg flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-primary" aria-hidden="true" />
        </div>
        {labels.title}
      </h2>

      <div className="rounded-xl border border-border/80 overflow-hidden divide-y divide-border/40">
        {labels.items.map((item, i) => (
          <details
            key={i}
            className="group bg-white hover:bg-muted/30 transition-colors"
          >
            <summary className="flex items-start gap-3 px-4 sm:px-5 py-3.5 sm:py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-primary-light/60 flex items-center justify-center text-primary text-xs font-bold transition-transform group-open:rotate-45">
                +
              </span>
              <span className="text-sm sm:text-base font-medium text-foreground pr-4">
                {item.q}
              </span>
            </summary>
            <div className="px-4 sm:px-5 pb-4 pl-12 sm:pl-[3.25rem]">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
