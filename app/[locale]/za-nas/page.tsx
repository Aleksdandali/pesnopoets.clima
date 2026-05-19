import Image from "next/image";
import type { Metadata } from "next";
import { Shield, Truck, Wrench, Award, Sparkles } from "lucide-react";

const eyebrowLabel: Record<string, string> = {
  bg: "Нашата компания",
  en: "Our company",
  ru: "Наша компания",
  ua: "Наша компанія",
};

const teamLabels: Record<string, { heading: string; sub: string; ownerCap: string; gearCap: string; vanCap: string }> = {
  bg: {
    heading: "Екипът, който ще монтира вашия климатик",
    sub: "Собствена бригада, брандиран сервизен бус, оригинална техника — без подизпълнители.",
    ownerCap: "Управителят на Песнопоец Клима — на всеки обект лично",
    gearCap: "Работим само с оригинална техника Daikin, Gree, Mitsubishi",
    vanCap: "Брандираният ни сервизен бус — идваме навреме във Варна",
  },
  en: {
    heading: "The team that will install your AC",
    sub: "Our own crew, branded service van, original equipment — no subcontractors.",
    ownerCap: "Founder of Pesnopoets Clima — on every site personally",
    gearCap: "We work only with original Daikin, Gree, Mitsubishi equipment",
    vanCap: "Our branded service van — we arrive on time across Varna",
  },
  ru: {
    heading: "Команда, которая установит ваш кондиционер",
    sub: "Своя бригада, брендированный сервисный фургон, оригинальная техника — без подрядчиков.",
    ownerCap: "Руководитель Песнопоец Клима — на каждом объекте лично",
    gearCap: "Работаем только с оригинальной техникой Daikin, Gree, Mitsubishi",
    vanCap: "Наш брендированный сервисный фургон — приезжаем вовремя по Варне",
  },
  ua: {
    heading: "Команда, яка встановить ваш кондиціонер",
    sub: "Власна бригада, брендований сервісний фургон, оригінальна техніка — без підрядників.",
    ownerCap: "Керівник Песнопоец Клима — на кожному об'єкті особисто",
    gearCap: "Працюємо лише з оригінальною технікою Daikin, Gree, Mitsubishi",
    vanCap: "Наш брендований сервісний фургон — приїжджаємо вчасно по Варні",
  },
};

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const c = dictionary.about;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: `${c.title} | ${dictionary.common.siteName}`,
    description: c.subtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/za-nas`,
      languages: {
        bg: `${siteUrl}/bg/za-nas`,
        en: `${siteUrl}/en/za-nas`,
        ru: `${siteUrl}/ru/za-nas`,
        uk: `${siteUrl}/ua/za-nas`,
        "x-default": `${siteUrl}/bg/za-nas`,
      },
    },
  };
}

const icons = [Shield, Truck, Wrench, Award];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const c = dictionary.about;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero */}
      <div className="mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/[0.08] border border-primary/15 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">
            {eyebrowLabel[locale] || eyebrowLabel.bg}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
          {c.title}
        </h1>
        <div className="mt-4 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
        <p className="mt-5 sm:mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
          {c.subtitle}
        </p>
      </div>

      {/* Team — real photos */}
      {(() => {
        const tl = teamLabels[locale] || teamLabels.bg;
        return (
          <section className="mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{tl.heading}</h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">{tl.sub}</p>
              <div className="mt-3 mx-auto w-10 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <figure className="relative rounded-2xl overflow-hidden bg-muted/40 border border-border/40 shadow-[0_2px_12px_rgb(0_0_0/0.04)]">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/team/owner-portrait.jpg"
                    alt={tl.ownerCap}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    priority
                  />
                </div>
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs sm:text-sm">
                  {tl.ownerCap}
                </figcaption>
              </figure>
              <figure className="relative rounded-2xl overflow-hidden bg-muted/40 border border-border/40 shadow-[0_2px_12px_rgb(0_0_0/0.04)]">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/team/owner-with-gree.jpg"
                    alt={tl.gearCap}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs sm:text-sm">
                  {tl.gearCap}
                </figcaption>
              </figure>
              <figure className="relative rounded-2xl overflow-hidden bg-muted/40 border border-border/40 shadow-[0_2px_12px_rgb(0_0_0/0.04)]">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/team/branded-van.jpg"
                    alt={tl.vanCap}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs sm:text-sm">
                  {tl.vanCap}
                </figcaption>
              </figure>
            </div>
          </section>
        );
      })()}

      {/* Team paragraph */}
      <p className="text-base text-muted-foreground leading-relaxed mb-10">{c.teamParagraph}</p>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {c.stats.map((stat: { value: string; label: string }) => (
          <div key={stat.label} className="text-center p-5 bg-white border border-border/80 rounded-2xl">
            <p className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {c.values.map((val: { title: string; desc: string }, i: number) => {
          const Icon = icons[i];
          return (
            <div key={val.title} className="p-6 bg-white border border-border/80 rounded-2xl">
              <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{val.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
