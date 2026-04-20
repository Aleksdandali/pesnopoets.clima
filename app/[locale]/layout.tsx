import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import ConsultantChat from "@/components/consultant/ConsultantChat";
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
      triggerAria: "Отвори AI консултант",
      title: "AI консултант",
      subtitle: "Онлайн • Отговаря веднага",
      greeting:
        "Здравейте! 👋 Аз съм AI консултантът на Песнопоец Клима. Мога да Ви помогна да изберете климатик за Вашия дом. За каква стая търсите — спалня, хол, офис? И колко е приблизително квадратурата?",
      placeholder: "Напишете въпрос...",
      send: "Изпрати",
      close: "Затвори",
      thinking: "Мисля...",
      errorGeneric: "Възникна грешка. Опитайте пак или се обадете на телефона.",
      disclaimer: "AI съветник — може да допуска грешки. За точна информация се свържете с нас.",
      viewProduct: "Виж продукта",
      viewPrice: "лв",
    }),
    en: buildLabels({
      triggerAria: "Open AI consultant",
      title: "AI Consultant",
      subtitle: "Online • Replies instantly",
      greeting:
        "Hi! 👋 I'm the AI consultant for Pesnopoets Klima. I can help you pick the right AC for your space. What room is it for — bedroom, living room, office? And roughly what size (m²)?",
      placeholder: "Type your question...",
      send: "Send",
      close: "Close",
      thinking: "Thinking...",
      errorGeneric: "Something went wrong. Please try again or call us.",
      disclaimer: "AI assistant — may make mistakes. For accurate info, contact us directly.",
      viewProduct: "View product",
      viewPrice: "BGN",
    }),
    ru: buildLabels({
      triggerAria: "Открыть AI консультанта",
      title: "AI консультант",
      subtitle: "Онлайн • Отвечает мгновенно",
      greeting:
        "Здравствуйте! 👋 Я AI консультант Песнопоец Клима. Помогу подобрать климатик под вашу ситуацию. Для какой комнаты — спальня, гостиная, офис? И сколько примерно квадратов?",
      placeholder: "Напишите вопрос...",
      send: "Отправить",
      close: "Закрыть",
      thinking: "Думаю...",
      errorGeneric: "Произошла ошибка. Попробуйте снова или позвоните нам.",
      disclaimer: "AI помощник — может ошибаться. Для точной информации свяжитесь с нами.",
      viewProduct: "Смотреть товар",
      viewPrice: "лв",
    }),
    ua: buildLabels({
      triggerAria: "Відкрити AI консультанта",
      title: "AI консультант",
      subtitle: "Онлайн • Відповідає миттєво",
      greeting:
        "Вітаю! 👋 Я AI консультант Песнопоец Клима. Допоможу підібрати кондиціонер під вашу ситуацію. Для якої кімнати — спальня, вітальня, офіс? І приблизно скільки квадратів?",
      placeholder: "Напишіть запитання...",
      send: "Надіслати",
      close: "Закрити",
      thinking: "Думаю...",
      errorGeneric: "Сталася помилка. Спробуйте знову або зателефонуйте нам.",
      disclaimer: "AI помічник — може помилятися. Для точної інформації зв'яжіться з нами.",
      viewProduct: "Дивитись товар",
      viewPrice: "лв",
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
        <a href="#main" className="skip-link">
          {dictionary.common?.skipToContent || "Skip to main content"}
        </a>
        <Suspense fallback={null}>
          <PageProgress />
        </Suspense>
        <Header locale={locale} dictionary={dictionary} />
        <main id="main" tabIndex={-1} className="flex-1">{children}</main>
        <Footer locale={locale} dictionary={dictionary} />
        <FloatingContactButtons
          whatsappLabel={dictionary.contact?.whatsapp || "WhatsApp"}
          viberLabel={dictionary.contact?.viber || "Viber"}
        />
        <ConsultantChat
          locale={locale as "bg" | "en" | "ru" | "ua"}
          labels={getConsultantLabels(locale)}
        />
        <CookieConsent locale={locale} dictionary={dictionary} />
      </CartProvider>
    </>
  );
}
