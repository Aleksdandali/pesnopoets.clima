import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Truck,
  Wrench,
  Snowflake,
  Zap,
  ThermometerSun,
  Wind,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";

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
      "Daikin, Mitsubishi Electric, Toshiba, Nippon -- с доставка и професионален монтаж в цяла България. Безплатна консултация.",
    cta: "Разгледай каталога",
    ctaSecondary: "Безплатна консултация",
  },
  en: {
    title: "Air Conditioners from World-Leading Brands",
    subtitle:
      "Daikin, Mitsubishi Electric, Toshiba, Nippon -- with delivery and professional installation across Bulgaria. Free consultation.",
    cta: "Browse Catalog",
    ctaSecondary: "Free Consultation",
  },
  ru: {
    title: "Кондиционеры ведущих мировых брендов",
    subtitle:
      "Daikin, Mitsubishi Electric, Toshiba, Nippon -- с доставкой и профессиональным монтажом по всей Болгарии. Бесплатная консультация.",
    cta: "Смотреть каталог",
    ctaSecondary: "Бесплатная консультация",
  },
  ua: {
    title: "Кондиціонери провідних світових брендів",
    subtitle:
      "Daikin, Mitsubishi Electric, Toshiba, Nippon -- з доставкою та професійним монтажем по всій Болгарії. Безкоштовна консультація.",
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
  Array<{ slug: string; name: string; desc: string; icon: string }>
> = {
  bg: [
    { slug: "invertorni-klimatici", name: "Инверторни климатици", desc: "Енергийно ефективни решения за дома", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Мулти сплит системи", desc: "Едно външно тяло, множество вътрешни", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Професионални системи", desc: "За търговски и индустриални обекти", icon: "thermometer" },
    { slug: "ventilaciya", name: "Вентилация", desc: "Системи за пресен въздух и рекуперация", icon: "wind" },
  ],
  en: [
    { slug: "invertorni-klimatici", name: "Inverter Air Conditioners", desc: "Energy-efficient solutions for home", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Multi Split Systems", desc: "One outdoor unit, multiple indoor units", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Professional Systems", desc: "For commercial and industrial spaces", icon: "thermometer" },
    { slug: "ventilaciya", name: "Ventilation", desc: "Fresh air and heat recovery systems", icon: "wind" },
  ],
  ru: [
    { slug: "invertorni-klimatici", name: "Инверторные кондиционеры", desc: "Энергоэффективные решения для дома", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Мульти сплит системы", desc: "Один наружный блок, несколько внутренних", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Профессиональные системы", desc: "Для коммерческих и промышленных объектов", icon: "thermometer" },
    { slug: "ventilaciya", name: "Вентиляция", desc: "Системы подачи свежего воздуха и рекуперации", icon: "wind" },
  ],
  ua: [
    { slug: "invertorni-klimatici", name: "Інверторні кондиціонери", desc: "Енергоефективні рішення для дому", icon: "snowflake" },
    { slug: "multi-split-sistemi", name: "Мульті спліт системи", desc: "Один зовнішній блок, кілька внутрішніх", icon: "zap" },
    { slug: "profesionalni-sistemi", name: "Професійні системи", desc: "Для комерційних та промислових об'єктів", icon: "thermometer" },
    { slug: "ventilaciya", name: "Вентиляція", desc: "Системи подачі свіжого повітря та рекуперації", icon: "wind" },
  ],
};

const catIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  snowflake: Snowflake,
  zap: Zap,
  thermometer: ThermometerSun,
  wind: Wind,
};

// Section headings per locale
const sectionLabels: Record<string, { categories: string; brands: string; popular: string; viewAll: string }> = {
  bg: { categories: "Категории", brands: "Работим с водещи марки", popular: "Популярни продукти", viewAll: "Виж всички" },
  en: { categories: "Categories", brands: "We work with leading brands", popular: "Popular Products", viewAll: "View all" },
  ru: { categories: "Категории", brands: "Работаем с ведущими брендами", popular: "Популярные продукты", viewAll: "Смотреть все" },
  ua: { categories: "Категорії", brands: "Працюємо з провідними брендами", popular: "Популярні продукти", viewAll: "Дивитись всі" },
};

async function getFeaturedProducts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("slug, title, title_override, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, energy_class, area_m2, noise_db_indoor")
      .eq("is_active", true)
      .eq("availability", "Наличен")
      .not("btu", "is", null)
      .order("price_client", { ascending: false })
      .limit(4);
    return data || [];
  } catch {
    return [];
  }
}

async function getBrands() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("manufacturer")
      .eq("is_active", true)
      .not("manufacturer", "is", null);
    if (!data) return [];
    const counts: Record<string, number> = {};
    for (const row of data) {
      counts[row.manufacturer] = (counts[row.manufacturer] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const hero = heroContent[locale] || heroContent.bg;
  const feats = features[locale] || features.bg;
  const cats = categories[locale] || categories.bg;
  const labels = sectionLabels[locale] || sectionLabels.bg;

  const featuredProducts = await getFeaturedProducts();
  const brands = await getBrands();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9ff] via-white to-[#f0fdfa]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Decorative blobs */}
        <div className="absolute -right-32 -top-32 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light/60 border border-primary/10 rounded-full mb-6">
              <Snowflake className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary-dark tracking-wide">
                {locale === "bg"
                  ? "Официален дилър"
                  : locale === "ru"
                    ? "Официальный дилер"
                    : locale === "ua"
                      ? "Офіційний дилер"
                      : "Authorized Dealer"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold text-foreground leading-[1.1]">
              {hero.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              {hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3.5">
              <Link
                href={`/${locale}/klimatici`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-[0_4px_14px_0_rgb(2_132_199/0.25)] hover:shadow-[0_6px_20px_0_rgb(2_132_199/0.35)] hover:-translate-y-0.5"
              >
                {hero.cta}
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link
                href={`/${locale}/inquiry`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-foreground font-semibold rounded-xl border border-border hover:border-primary/30 hover:bg-primary-light/30 transition-all duration-200"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {labels.categories}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.map((cat) => {
            const IconComp = catIconMap[cat.icon] || Snowflake;
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/klimatici?category=${cat.slug}`}
                className="group relative p-6 bg-white border border-border/80 rounded-2xl hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0_0_0/0.04)] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-light group-hover:scale-105 transition-all duration-300">
                  <IconComp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.desc}
                </p>
                <ChevronRight className="absolute top-6 right-5 w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {labels.popular}
              </h2>
              <Link
                href={`/${locale}/klimatici`}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {labels.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  locale={locale}
                  currency="BGN"
                />
              ))}
            </div>
            <div className="sm:hidden mt-8 text-center">
              <Link
                href={`/${locale}/klimatici`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {labels.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features / Why Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feats.map((feat, index) => {
            const IconComp = iconMap[feat.icon] || Shield;
            return (
              <div
                key={feat.title}
                className="relative p-8 bg-white border border-border/60 rounded-2xl"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
                {/* Subtle number */}
                <span className="absolute top-5 right-6 text-6xl font-bold text-primary/[0.04] select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brands */}
      <section className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-sm font-medium text-muted-foreground text-center mb-10 tracking-wide uppercase">
            {labels.brands}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/${locale}/klimatici?brand=${encodeURIComponent(brand.name)}`}
                className="flex items-center gap-2.5 px-5 py-3 bg-white border border-border/80 rounded-xl hover:text-primary hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-sm font-semibold text-foreground/80">{brand.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{brand.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
