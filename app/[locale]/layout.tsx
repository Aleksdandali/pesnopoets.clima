import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import CookieConsent from "@/components/CookieConsent";
import PageProgress from "@/components/PageProgress";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import { CartProvider } from "@/contexts/CartContext";

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
    bg: "Климатици във Варна — Продажба и монтаж | Daikin, Mitsubishi, Gree",
    en: "Air Conditioners in Varna — Sales & Installation | Daikin, Mitsubishi, Gree",
    ru: "Кондиционеры в Варне — Продажа и монтаж | Daikin, Mitsubishi, Gree",
    ua: "Кондиціонери у Варні — Продаж та монтаж | Daikin, Mitsubishi, Gree",
  };

  const descriptions: Record<string, string> = {
    bg: "Официален дилер Daikin, Mitsubishi, Gree във Варна. Професионален монтаж под ключ от собствена бригада — област Варна. Фиксирани цени, гаранция до 5 години.",
    en: "Authorized Daikin, Mitsubishi, Gree dealer in Varna, Bulgaria. Turnkey installation by our own crew across Varna region. Fixed prices, up to 5-year warranty.",
    ru: "Официальный дилер Daikin, Mitsubishi, Gree в Варне. Профессиональный монтаж под ключ собственной бригадой — Варна и область. Фиксированные цены, гарантия до 5 лет.",
    ua: "Офіційний дилер Daikin, Mitsubishi, Gree у Варні. Професійний монтаж під ключ власною бригадою — Варна і область. Фіксовані ціни, гарантія до 5 років.",
  };

  const keywords: Record<string, string[]> = {
    bg: ["климатици Варна", "монтаж климатик Варна", "Daikin Варна", "Mitsubishi Варна", "Gree Варна", "област Варна", "инверторни климатици", "тепловa помпa"],
    en: ["air conditioner Varna", "AC installation Varna", "Daikin Varna", "Mitsubishi Varna", "Gree Varna", "Varna region", "inverter AC Bulgaria", "heat pump Varna"],
    ru: ["кондиционеры Варна", "монтаж кондиционера Варна", "Daikin Варна", "Mitsubishi Варна", "Gree Варна", "область Варна", "инверторные кондиционеры", "тепловой насос Варна"],
    ua: ["кондиціонери Варна", "монтаж кондиціонера Варна", "Daikin Варна", "Mitsubishi Варна", "Gree Варна", "область Варна", "інверторні кондиціонери", "тепловий насос Варна"],
  };

  return {
    title: titles[locale] || titles.bg,
    description: descriptions[locale] || descriptions.bg,
    keywords: keywords[locale] || keywords.bg,
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  const seoDescriptions: Record<string, string> = {
    bg: "Официален дилер Daikin, Mitsubishi, Gree във Варна. Професионален монтаж под ключ от собствена бригада.",
    en: "Authorized Daikin, Mitsubishi, Gree dealer in Varna, Bulgaria. Turnkey installation by our own crew.",
    ru: "Официальный дилер Daikin, Mitsubishi, Gree в Варне. Профессиональный монтаж под ключ собственной бригадой.",
    ua: "Офіційний дилер Daikin, Mitsubishi, Gree у Варні. Професійний монтаж під ключ власною бригадою.",
  };

  return (
    <>
      <LocalBusinessJsonLd
        locale={locale}
        siteUrl={siteUrl}
        siteName={dictionary.common.siteName}
        description={seoDescriptions[locale] || seoDescriptions.bg}
      />
      <CartProvider>
        <Suspense fallback={null}>
          <PageProgress />
        </Suspense>
        <Header locale={locale} dictionary={dictionary} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dictionary={dictionary} />
        <FloatingContactButtons
          whatsappLabel={dictionary.contact?.whatsapp || "WhatsApp"}
          viberLabel={dictionary.contact?.viber || "Viber"}
        />
        <CookieConsent locale={locale} dictionary={dictionary} />
      </CartProvider>
    </>
  );
}
