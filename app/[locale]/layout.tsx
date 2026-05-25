import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageProgress from "@/components/PageProgress";
import PromoBar from "@/components/promo/PromoBar";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import { CartProvider } from "@/contexts/CartContext";
import LazyOverlays from "@/components/layout/LazyOverlays";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

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
    bg: "Климатици във Варна 2026 — Монтаж от 190 €, гаранция 5 г. | Daikin, Mitsubishi",
    en: "Air Conditioners in Varna 2026 — Install from €190, 5-yr warranty | Daikin, Mitsubishi",
    ru: "Кондиционеры в Варне 2026 — Монтаж от 190 €, гарантия 5 лет | Daikin, Mitsubishi",
    ua: "Кондиціонери у Варні 2026 — Монтаж від 190 €, гарантія 5 років | Daikin, Mitsubishi",
  };

  const descriptions: Record<string, string> = {
    bg: "Официален дилер Daikin, Mitsubishi, Toshiba, Gree във Варна. Монтаж от 190 € с ДДС, собствена бригада, гаранция до 5 г. Същия ден, фиксирани цени, безплатна консултация.",
    en: "Authorized Daikin, Mitsubishi, Toshiba, Gree dealer in Varna. Installation from €190 incl. VAT, in-house crew, warranty up to 5 years. Same-day service, fixed prices, free advice.",
    ru: "Официальный дилер Daikin, Mitsubishi, Toshiba, Gree в Варне. Монтаж от 190 € с НДС, своя бригада, гарантия до 5 лет. В день обращения, фиксированные цены, бесплатная консультация.",
    ua: "Офіційний дилер Daikin, Mitsubishi, Toshiba, Gree у Варні. Монтаж від 190 € з ПДВ, власна бригада, гарантія до 5 років. У день звернення, фіксовані ціни, безкоштовна консультація.",
  };

  const keywords: Record<string, string[]> = {
    bg: ["климатици Варна", "монтаж климатик Варна", "Daikin Варна", "Mitsubishi Варна", "Gree Варна", "област Варна", "инверторни климатици", "тепловa помпa"],
    en: ["air conditioner Varna", "AC installation Varna", "Daikin Varna", "Mitsubishi Varna", "Gree Varna", "Varna region", "inverter AC Bulgaria", "heat pump Varna"],
    ru: ["кондиционеры Варна", "монтаж кондиционера Варна", "Daikin Варна", "Mitsubishi Варна", "Gree Варна", "область Варна", "инверторные кондиционеры", "тепловой насос Варна"],
    ua: ["кондиціонери Варна", "монтаж кондиціонера Варна", "Daikin Варна", "Mitsubishi Варна", "Gree Варна", "область Варна", "інверторні кондиціонери", "тепловий насос Варна"],
  };

  // Brand wordmark per locale — keeps title/og:site_name in the same script
  // as the surrounding copy. Root layout template "%s | Песнопоец Клима" is
  // overridden below so e.g. EN title doesn't end with a Cyrillic brand.
  const siteNames: Record<string, string> = {
    bg: "Песнопоец Клима",
    en: "Pesnopoets Clima",
    ru: "Песнопоец Клима",
    ua: "Піснопоєць Кліма",
  };

  const ogAlts: Record<string, string> = {
    bg: "Песнопоец Клима — климатици и монтаж във Варна",
    en: "Pesnopoets Clima — air conditioners and installation in Varna",
    ru: "Песнопоец Клима — кондиционеры и монтаж в Варне",
    ua: "Піснопоєць Кліма — кондиціонери та монтаж у Варні",
  };

  const siteName = siteNames[locale] || siteNames.bg;
  const title = titles[locale] || titles.bg;
  const description = descriptions[locale] || descriptions.bg;
  const ogImage = `${siteUrl}/og-image.jpg`;
  const ogAlt = ogAlts[locale] || ogAlts.bg;

  return {
    // `absolute` bypasses the root layout's "%s | Песнопоец Клима" template
    // so EN/UA homepages don't get a Cyrillic brand suffix appended. The
    // `template` here still wraps child page titles in the locale's script.
    title: { absolute: title, template: `%s | ${siteName}` },
    description,
    keywords: keywords[locale] || keywords.bg,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l === "ua" ? "uk" : l, `${siteUrl}/${l}`])
        ),
        "x-default": `${siteUrl}/bg`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName,
      locale: locale === "bg" ? "bg_BG" : locale === "ru" ? "ru_RU" : locale === "ua" ? "uk_UA" : "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface ConsultantLabels {
  triggerAria: string;
  title: string;
  subtitle: string;
  greeting: string;
  placeholder: string;
  send: string;
  close: string;
  thinking: string;
  errorGeneric: string;
  disclaimer: string;
  viewProduct: string;
  viewPrice: string;
}

function getConsultantLabels(locale: string): ConsultantLabels {
  const map: Record<string, ConsultantLabels> = {
    bg: buildLabels({
      triggerAria: "Отворете AI консултант",
      title: "AI консултант",
      subtitle: "Онлайн • Отговаря веднага",
      greeting:
        "Здравейте! Аз съм AI консултантът на Песнопоец Клима. Мога да Ви помогна да изберете климатик за Вашия дом. За каква стая търсите — спалня, хол, офис? И колко е приблизително квадратурата?",
      placeholder: "Напишете въпрос...",
      send: "Изпратете",
      close: "Затворете",
      thinking: "Мисля...",
      errorGeneric: "Възникна грешка. Опитайте пак или се обадете на телефона.",
      disclaimer: "AI съветник — може да допуска грешки. За точна информация се свържете с нас.",
      viewProduct: "Вижте продукта",
      viewPrice: "€",
    }),
    en: buildLabels({
      triggerAria: "Open AI consultant",
      title: "AI Consultant",
      subtitle: "Online • Replies instantly",
      greeting:
        "Hi!I'm the AI consultant for Pesnopoets Klima. I can help you pick the right AC for your space. What room is it for — bedroom, living room, office? And roughly what size (m²)?",
      placeholder: "Type your question...",
      send: "Send",
      close: "Close",
      thinking: "Thinking...",
      errorGeneric: "Something went wrong. Please try again or call us.",
      disclaimer: "AI assistant — may make mistakes. For accurate info, contact us directly.",
      viewProduct: "View product",
      viewPrice: "€",
    }),
    ru: buildLabels({
      triggerAria: "Открыть AI консультанта",
      title: "AI консультант",
      subtitle: "Онлайн • Отвечает мгновенно",
      greeting:
        "Здравствуйте!Я AI консультант Песнопоец Клима. Помогу подобрать климатик под вашу ситуацию. Для какой комнаты — спальня, гостиная, офис? И сколько примерно квадратов?",
      placeholder: "Напишите вопрос...",
      send: "Отправить",
      close: "Закрыть",
      thinking: "Думаю...",
      errorGeneric: "Произошла ошибка. Попробуйте снова или позвоните нам.",
      disclaimer: "AI помощник — может ошибаться. Для точной информации свяжитесь с нами.",
      viewProduct: "Смотреть товар",
      viewPrice: "€",
    }),
    ua: buildLabels({
      triggerAria: "Відкрити AI консультанта",
      title: "AI консультант",
      subtitle: "Онлайн • Відповідає миттєво",
      greeting:
        "Вітаю!Я AI консультант Песнопоец Клима. Допоможу підібрати кондиціонер під вашу ситуацію. Для якої кімнати — спальня, вітальня, офіс? І приблизно скільки квадратів?",
      placeholder: "Напишіть запитання...",
      send: "Надіслати",
      close: "Закрити",
      thinking: "Думаю...",
      errorGeneric: "Сталася помилка. Спробуйте знову або зателефонуйте нам.",
      disclaimer: "AI помічник — може помилятися. Для точної інформації зв'яжіться з нами.",
      viewProduct: "Дивитись товар",
      viewPrice: "€",
    }),
  };
  return map[locale] ?? map.bg;
}

function buildLabels(o: ConsultantLabels): ConsultantLabels {
  return o;
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
    bg: "Официален дилер Daikin, Mitsubishi, Toshiba, Gree във Варна. Професионален монтаж под ключ от собствена бригада.",
    en: "Authorized Daikin, Mitsubishi, Toshiba, Gree dealer in Varna, Bulgaria. Turnkey installation by our own crew.",
    ru: "Официальный дилер Daikin, Mitsubishi, Toshiba, Gree в Варне. Профессиональный монтаж под ключ собственной бригадой.",
    ua: "Офіційний дилер Daikin, Mitsubishi, Toshiba, Gree у Варні. Професійний монтаж під ключ власною бригадою.",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: dictionary.common.siteName,
    inLanguage: locale === "bg" ? "bg-BG" : locale === "en" ? "en-US" : locale === "ru" ? "ru-RU" : "uk-UA",
    publisher: { "@id": `${siteUrl}/#business` },
  };

  return (
    <>
      <LocalBusinessJsonLd
        locale={locale}
        siteUrl={siteUrl}
        siteName={dictionary.common.siteName}
        description={seoDescriptions[locale] || seoDescriptions.bg}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <CartProvider>
        <a href="#main" className="skip-link">
          {dictionary.common?.skipToContent || "Skip to main content"}
        </a>
        <Suspense fallback={null}>
          <PageProgress />
        </Suspense>
        <PromoBar locale={locale} />
        <Header locale={locale} dictionary={dictionary} />
        <main id="main" tabIndex={-1} className="flex-1">{children}</main>
        <Footer locale={locale} dictionary={dictionary} />
        <LazyOverlays
          locale={locale as "bg" | "en" | "ru" | "ua"}
          consultantLabels={getConsultantLabels(locale)}
          whatsappLabel={dictionary.contact?.whatsapp || "WhatsApp"}
          viberLabel={dictionary.contact?.viber || "Viber"}
          consentCopy={dictionary.cookie}
        />
        <Suspense fallback={null}>
          <AnalyticsProvider locale={locale as "bg" | "en" | "ru" | "ua"} />
        </Suspense>
      </CartProvider>
    </>
  );
}
