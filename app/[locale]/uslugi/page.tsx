import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Wrench,
  Sparkles,
  Settings,
  ShieldCheck,
  MapPin,
  BadgeCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface ServiceEntry {
  slug: string;
  title: string;
  desc: string;
  items: string[];
  priceFrom: string;
  ctaLabel: string;
  ctaHref: string;
}

interface WhyItem {
  title: string;
  desc: string;
}

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: `${dict.uslugi.pageTitle} | ${dict.common.siteName}`,
    description: dict.uslugi.pageSubtitle,
  };
}

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  montazh: Wrench,
  profilaktika: Sparkles,
  remont: Settings,
};

const whyIconMap = [MapPin, BadgeCheck, ShieldCheck];

export default async function UslugiPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.uslugi;
  const common = dict.common;
  const services: ServiceEntry[] = t.services;
  const whyItems: WhyItem[] = t.whyItems;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="text-xs text-white/50 mb-5" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">
              {t.breadcrumbHome}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{t.breadcrumbServices}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full mb-5">
              <Wrench className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs font-medium text-white/90 tracking-wide">
                {common.deliveryBanner}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              {t.pageTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
              {t.pageSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service) => {
            const Icon = serviceIconMap[service.slug] || Wrench;
            const href = service.ctaHref.startsWith("/")
              ? `/${locale}${service.ctaHref}`
              : service.ctaHref;
            return (
              <article
                key={service.slug}
                className="flex flex-col bg-white border border-border/60 rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_rgb(0_0_0/0.03)] hover:shadow-[0_6px_20px_rgb(0_0_0/0.06)] transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {service.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {service.desc}
                </p>

                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {t.included}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-4 h-4 text-primary shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-foreground leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
                  <span className="inline-flex items-center px-3 py-1.5 bg-primary-light/60 text-primary text-xs font-bold rounded-full whitespace-nowrap">
                    {service.priceFrom}
                  </span>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    {service.ctaLabel}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8 sm:mb-10">
            {t.whyTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {whyItems.map((item, i) => {
              const Icon = whyIconMap[i] || ShieldCheck;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-border/60 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  {common.authorizedDealer}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t.ctaTitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
                {t.ctaDesc}
              </p>
            </div>
            <Link
              href={`/${locale}/inquiry`}
              className="shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[var(--primary-dark)] font-semibold rounded-xl hover:bg-white/90 transition-all duration-200 shadow-[0_4px_14px_0_rgb(0_0_0/0.15)] min-h-[48px]"
            >
              {t.ctaButton}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
