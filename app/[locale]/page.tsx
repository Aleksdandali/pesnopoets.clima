import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Truck,
  Wrench,
  Snowflake,
  Zap,
  ThermometerSun,
} from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Hero content per locale
const heroContent: Record<
  string,
  { title: string; subtitle: string; cta: string; ctaSecondary: string }
> = {
  bg: {
    title: "Климатици от водещи световни марки",
    subtitle:
      "Daikin, Mitsubishi Electric, Toshiba, Nippon — с доставка и професионален монтаж в цяла България. Безплатна консултация.",
    cta: "Разгледай каталога",
    ctaSecondary: "Безплатна консултация",
  },
  en: {
    title: "Air Conditioners from World-Leading Brands",
    subtitle:
      "Daikin, Mitsubishi Electric, Toshiba, Nippon — with delivery and professional installation across Bulgaria. Free consultation.",
    cta: "Browse Catalog",
    ctaSecondary: "Free Consultation",
  },
  ru: {
    title: "Кондиционеры ведущих мировых брендов",
    subtitle:
      "Daikin, Mitsubishi Electric, Toshiba, Nippon — с доставкой и профессиональным монтажом по всей Болгарии. Бесплатная консультация.",
    cta: "Смотреть каталог",
    ctaSecondary: "Бесплатная консультация",
  },
  ua: {
    title: "Кондиціонери провідних світових брендів",
    subtitle:
      "Daikin, Mitsubishi Electric, Toshiba, Nippon — з доставкою та професійним монтажем по всій Болгарії. Безкоштовна консультація.",
    cta: "Переглянути каталог",
    ctaSecondary: "Безкоштовна консультація",
  },
};

// Features section per locale
const features: Record<
  string,
  Array<{ icon: string; title: string; desc: string }>
> = {
  bg: [
    {
      icon: "shield",
      title: "Оригинални продукти",
      desc: "Официален вносител. Пълна гаранция от производителя до 36 месеца.",
    },
    {
      icon: "truck",
      title: "Бърза доставка",
      desc: "Доставка до вашия адрес в цяла България. Наличност в реално време.",
    },
    {
      icon: "wrench",
      title: "Професионален монтаж",
      desc: "Монтаж от сертифицирани специалисти. Пускане в експлоатация и настройка.",
    },
  ],
  en: [
    {
      icon: "shield",
      title: "Original Products",
      desc: "Authorized dealer. Full manufacturer warranty up to 36 months.",
    },
    {
      icon: "truck",
      title: "Fast Delivery",
      desc: "Delivery to your address across Bulgaria. Real-time availability.",
    },
    {
      icon: "wrench",
      title: "Professional Installation",
      desc: "Installation by certified specialists. Commissioning and setup included.",
    },
  ],
  ru: [
    {
      icon: "shield",
      title: "Оригинальная продукция",
      desc: "Официальный дилер. Полная гарантия производителя до 36 месяцев.",
    },
    {
      icon: "truck",
      title: "Быстрая доставка",
      desc: "Доставка по всей Болгарии. Наличие в реальном времени.",
    },
    {
      icon: "wrench",
      title: "Профессиональный монтаж",
      desc: "Монтаж сертифицированными специалистами. Пуск и настройка.",
    },
  ],
  ua: [
    {
      icon: "shield",
      title: "Оригінальна продукція",
      desc: "Офіційний дилер. Повна гарантія виробника до 36 місяців.",
    },
    {
      icon: "truck",
      title: "Швидка доставка",
      desc: "Доставка по всій Болгарії. Наявність у реальному часі.",
    },
    {
      icon: "wrench",
      title: "Професійний монтаж",
      desc: "Монтаж сертифікованими фахівцями. Пуск та налаштування.",
    },
  ],
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  truck: Truck,
  wrench: Wrench,
};

// Popular categories
const categories: Record<
  string,
  Array<{ slug: string; name: string; icon: string }>
> = {
  bg: [
    { slug: "invertorni-klimatici", name: "Инверторни климатици", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Мулти сплит системи", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Професионални системи", icon: "thermometer" },
    { slug: "ventilaciya", name: "Вентилация", icon: "wind" },
  ],
  en: [
    { slug: "invertorni-klimatici", name: "Inverter Air Conditioners", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Multi Split Systems", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Professional Systems", icon: "thermometer" },
    { slug: "ventilaciya", name: "Ventilation", icon: "wind" },
  ],
  ru: [
    { slug: "invertorni-klimatici", name: "Инверторные кондиционеры", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Мульти сплит системы", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Профессиональные системы", icon: "thermometer" },
    { slug: "ventilaciya", name: "Вентиляция", icon: "wind" },
  ],
  ua: [
    { slug: "invertorni-klimatici", name: "Інверторні кондиціонери", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Мульти спліт системи", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Професійні системи", icon: "thermometer" },
    { slug: "ventilaciya", name: "Вентиляція", icon: "wind" },
  ],
};

const catIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  snowflake: Snowflake,
  zap: Zap,
  thermometer: ThermometerSun,
  wind: Snowflake,
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const hero = heroContent[locale] || heroContent.bg;
  const feats = features[locale] || features.bg;
  const cats = categories[locale] || categories.bg;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-light via-white to-accent-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
              {hero.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/klimatici`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
              >
                {hero.cta}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/inquiry`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-foreground font-semibold rounded-xl border border-border hover:bg-muted transition-colors"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {locale === "bg"
            ? "Категории"
            : locale === "ru"
              ? "Категории"
              : locale === "ua"
                ? "Категорії"
                : "Categories"}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.map((cat) => {
            const IconComp = catIconMap[cat.icon] || Snowflake;
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/klimatici?category=${cat.slug}`}
                className="group p-6 bg-white border border-border rounded-xl hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <IconComp className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features / Why Us */}
      <section className="bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feats.map((feat) => {
              const IconComp = iconMap[feat.icon] || Shield;
              return (
                <div
                  key={feat.title}
                  className="text-center p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComp className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          {locale === "bg"
            ? "Нашите марки"
            : locale === "ru"
              ? "Наши бренды"
              : locale === "ua"
                ? "Наші бренди"
                : "Our Brands"}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          {["Daikin", "Mitsubishi", "Toshiba", "Nippon", "Carmen", "Panasonic"].map(
            (brand) => (
              <Link
                key={brand}
                href={`/${locale}/brands/${brand.toLowerCase()}`}
                className="text-xl font-bold text-foreground hover:text-primary transition-colors"
              >
                {brand}
              </Link>
            )
          )}
        </div>
      </section>
    </>
  );
}
