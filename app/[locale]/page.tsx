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
  Wind,
  ChevronRight,
  Phone,
  Maximize,
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
const sectionLabels: Record<string, {
  categories: string;
  brands: string;
  popular: string;
  viewAll: string;
  whyUs: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}> = {
  bg: {
    categories: "Категории",
    brands: "Работим с водещи марки",
    popular: "Популярни продукти",
    viewAll: "Виж всички",
    whyUs: "Защо да изберете нас",
    ctaTitle: "Нуждаете се от помощ при избора?",
    ctaSubtitle: "Нашите специалисти ще ви помогнат да изберете перфектния климатик за вашия дом или офис. Безплатна консултация и професионално обслужване.",
    ctaButton: "Свържете се с нас",
  },
  en: {
    categories: "Categories",
    brands: "We work with leading brands",
    popular: "Popular Products",
    viewAll: "View all",
    whyUs: "Why choose us",
    ctaTitle: "Need help choosing?",
    ctaSubtitle: "Our specialists will help you choose the perfect air conditioner for your home or office. Free consultation and professional service.",
    ctaButton: "Contact us",
  },
  ru: {
    categories: "Категории",
    brands: "Работаем с ведущими брендами",
    popular: "Популярные продукты",
    viewAll: "Смотреть все",
    whyUs: "Почему выбирают нас",
    ctaTitle: "Нужна помощь с выбором?",
    ctaSubtitle: "Наши специалисты помогут вам выбрать идеальный кондиционер для дома или офиса. Бесплатная консультация и профессиональное обслуживание.",
    ctaButton: "Свяжитесь с нами",
  },
  ua: {
    categories: "Категорії",
    brands: "Працюємо з провідними брендами",
    popular: "Популярні продукти",
    viewAll: "Дивитись всі",
    whyUs: "Чому обирають нас",
    ctaTitle: "Потрібна допомога з вибором?",
    ctaSubtitle: "Наші спеціалісти допоможуть вам обрати ідеальний кондиціонер для дому чи офісу. Безкоштовна консультація та професійне обслуговування.",
    ctaButton: "Зв'яжіться з нами",
  },
};

const EUR_TO_BGN = 1.95583;

async function getFeaturedProducts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("id, slug, title, title_override, manufacturer, price_client, price_override, price_promo, is_promo, availability, gallery, btu, energy_class, area_m2, noise_db_indoor")
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

async function getHeroProduct() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("slug, title, title_override, manufacturer, gallery, btu, energy_class, area_m2, price_client, price_override")
      .eq("is_active", true)
      .eq("availability", "Наличен")
      .not("gallery", "is", null)
      .not("btu", "is", null)
      .order("price_client", { ascending: false })
      .limit(1)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getBrandsWithImages() {
  try {
    const supabase = await createClient();
    // Get all active products with manufacturer and gallery
    const { data } = await supabase
      .from("products")
      .select("manufacturer, gallery")
      .eq("is_active", true)
      .not("manufacturer", "is", null);
    if (!data) return [];

    const brandMap: Record<string, { count: number; image: string | null }> = {};
    for (const row of data) {
      if (!brandMap[row.manufacturer]) {
        brandMap[row.manufacturer] = {
          count: 0,
          image: row.gallery?.[0] || null,
        };
      }
      brandMap[row.manufacturer].count += 1;
      // If we don't have an image yet, try this product
      if (!brandMap[row.manufacturer].image && row.gallery?.[0]) {
        brandMap[row.manufacturer].image = row.gallery[0];
      }
    }

    return Object.entries(brandMap)
      .map(([name, info]) => ({ name, count: info.count, image: info.image }))
      .sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

async function getCategoryImages() {
  try {
    const supabase = await createClient();
    // Get one product per category slug pattern
    const categorySlugs = ["invertorni-klimatici", "multi-split-sistemi", "profesionalni-sistemi", "ventilaciya"];
    const images: Record<string, string | null> = {};

    for (const slug of categorySlugs) {
      const { data } = await supabase
        .from("products")
        .select("gallery")
        .eq("is_active", true)
        .not("gallery", "is", null)
        .limit(1);
      if (data?.[0]?.gallery?.[0]) {
        images[slug] = data[0].gallery[0];
      }
    }
    return images;
  } catch {
    return {};
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const hero = heroContent[locale] || heroContent.bg;
  const feats = features[locale] || features.bg;
  const cats = categories[locale] || categories.bg;
  const labels = sectionLabels[locale] || sectionLabels.bg;

  const [featuredProducts, brands, heroProduct, categoryImages] = await Promise.all([
    getFeaturedProducts(),
    getBrandsWithImages(),
    getHeroProduct(),
    getCategoryImages(),
  ]);

  const heroImageUrl = heroProduct?.gallery?.[0];
  const heroPriceBGN = heroProduct
    ? ((heroProduct.price_override || heroProduct.price_client) * EUR_TO_BGN).toFixed(0)
    : null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[560px] sm:min-h-[640px] lg:min-h-[740px]">
        {/* Background image */}
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          className="object-cover object-bottom"
          sizes="100vw"
          priority
          quality={85}
        />
        {/* Dark overlay — stronger left for text, transparent right for AC */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/70 to-[#0a1628]/5" />
        {/* Bottom fade — only subtle, don't cover brand logos */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            {/* Logo + badge */}
            <div className="flex items-center gap-3 mb-8">
              <Image
                src="/logo.png"
                alt="Песнопоец Клима"
                width={56}
                height={56}
                className="rounded-xl shadow-lg"
              />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Snowflake className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  {locale === "bg"
                    ? "Официален дилър"
                    : locale === "ru"
                      ? "Официальный дилер"
                      : locale === "ua"
                        ? "Офіційний дилер"
                        : "Authorized Dealer"}
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[3.5rem] font-bold text-white leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              {hero.title}
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-white/70 leading-relaxed max-w-lg">
              {hero.subtitle}
            </p>

            {/* Service pills */}
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              {(locale === "bg"
                ? ["Продажба", "Професионален монтаж", "Сервиз и поддръжка"]
                : locale === "en"
                  ? ["Sales", "Professional installation", "Service & maintenance"]
                  : locale === "ru"
                    ? ["Продажа", "Профессиональный монтаж", "Сервис и обслуживание"]
                    : ["Продаж", "Професійний монтаж", "Сервіс та обслуговування"]
              ).map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg text-xs sm:text-sm font-medium text-white/90"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {service}
                </span>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5">
              <Link
                href={`/${locale}/klimatici`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-[0_4px_20px_0_rgb(2_132_199/0.4)] hover:shadow-[0_6px_24px_0_rgb(2_132_199/0.5)] hover:-translate-y-0.5"
              >
                {hero.cta}
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link
                href={`/${locale}/inquiry`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-200"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Suppress unused vars */}
          {(() => { void heroImageUrl; void heroProduct; void heroPriceBGN; return null; })()}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cats.map((cat) => {
            const IconComp = catIconMap[cat.icon] || Snowflake;
            const catImage = categoryImages[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/klimatici?category=${cat.slug}`}
                className="group relative p-4 sm:p-6 bg-white border border-border/80 rounded-2xl hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0_0_0/0.04)] transition-all duration-300 overflow-hidden"
              >
                {/* Category representative image */}
                {catImage && (
                  <div className="relative w-full h-28 mb-4 rounded-xl bg-[#fafbfc] overflow-hidden">
                    <Image
                      src={catImage}
                      alt={cat.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}
                {!catImage && (
                  <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-light group-hover:scale-105 transition-all duration-300">
                    <IconComp className="w-6 h-6 text-primary" />
                  </div>
                )}
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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
      <section className="bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {labels.whyUs}
            </h2>
            <div className="mt-3 mx-auto w-12 h-1 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feats.map((feat, index) => {
              const IconComp = iconMap[feat.icon] || Shield;
              return (
                <div
                  key={feat.title}
                  className="relative p-6 sm:p-10 bg-white border border-border/60 rounded-2xl shadow-[0_4px_20px_rgb(0_0_0/0.03)] hover:shadow-[0_8px_30px_rgb(0_0_0/0.06)] transition-shadow duration-300"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-primary-light/60 rounded-2xl flex items-center justify-center shrink-0">
                      <IconComp className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                  {/* Subtle number */}
                  <span className="absolute top-5 right-6 text-7xl font-bold text-primary/[0.04] select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0369a1] to-[#0284c7]" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-5">
                <Phone className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  {locale === "bg" ? "Безплатна консултация" : locale === "en" ? "Free consultation" : locale === "ru" ? "Бесплатная консультация" : "Безкоштовна консультація"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {labels.ctaTitle}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {labels.ctaSubtitle}
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href={`/${locale}/inquiry`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#0369a1] font-semibold rounded-xl hover:bg-white/90 transition-all duration-200 shadow-[0_4px_14px_0_rgb(0_0_0/0.15)] hover:shadow-[0_6px_20px_0_rgb(0_0_0/0.2)] hover:-translate-y-0.5"
              >
                {labels.ctaButton}
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-sm font-medium text-muted-foreground text-center mb-12 tracking-wide uppercase">
            {labels.brands}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/${locale}/klimatici?brand=${encodeURIComponent(brand.name)}`}
                className="group relative flex flex-col items-center gap-3 p-5 bg-white border border-border/80 rounded-2xl hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0_0_0/0.04)] transition-all duration-300"
              >
                {/* Brand representative image */}
                {brand.image ? (
                  <div className="relative w-full h-20 rounded-xl bg-[#fafbfc] overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-20 rounded-xl bg-[#fafbfc] flex items-center justify-center">
                    <Snowflake className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                )}
                <div className="text-center">
                  <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors duration-200">
                    {brand.name}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {brand.count} {locale === "bg" ? "продукта" : locale === "en" ? "products" : locale === "ru" ? "товаров" : "товарів"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
