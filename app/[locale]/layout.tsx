import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/CookieConsent";

const locales = ["bg", "en", "ru", "ua"] as const;
type Locale = (typeof locales)[number];

// Dynamic imports for dictionaries
async function getDictionary(locale: Locale) {
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  const titles: Record<string, string> = {
    bg: "Песнопоец Клима — Климатици с монтаж | Daikin, Mitsubishi, Gree",
    en: "Pesnopoets Clima — Air Conditioners | Daikin, Mitsubishi, Gree",
    ru: "Песнопоец Клима — Кондиционеры с монтажом | Daikin, Mitsubishi, Gree",
    ua: "Піснопоєць Кліма — Кондиціонери з монтажем | Daikin, Mitsubishi, Gree",
  };

  const descriptions: Record<string, string> = {
    bg: "Климатици от водещи марки — Daikin, Mitsubishi, Toshiba. Доставка и монтаж в цяла България.",
    en: "Air conditioners from leading brands — Daikin, Mitsubishi, Toshiba. Delivery and installation across Bulgaria.",
    ru: "Кондиционеры ведущих брендов — Daikin, Mitsubishi, Toshiba. Доставка и монтаж по всей Болгарии.",
    ua: "Кондиціонери провідних брендів — Daikin, Mitsubishi, Toshiba. Доставка та монтаж по всій Болгарії.",
  };

  return {
    title: titles[locale] || titles.bg,
    description: descriptions[locale] || descriptions.bg,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l === "ua" ? "uk" : l, `${siteUrl}/${l}`])
      ),
    },
    openGraph: {
      locale: locale === "bg" ? "bg_BG" : locale === "ru" ? "ru_RU" : locale === "ua" ? "uk_UA" : "en_US",
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <>
      <Header locale={locale} dictionary={dictionary} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
      <CookieConsent locale={locale} dictionary={dictionary} />
    </>
  );
}
