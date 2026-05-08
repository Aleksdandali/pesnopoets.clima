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
  Headphones,
  Sparkles,
  Star,
  Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/catalog/ProductCard";
import SeasonalBanner from "@/components/home/SeasonalBanner";
import AiConsultantSection from "@/components/home/AiConsultantSection";
import HeroCarousel from "@/components/home/HeroCarousel";

// Revalidate homepage every 5 minutes for fresh product data
export const revalidate = 300;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const locales = ["bg", "en", "ru", "ua"] as const;

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

// Features section per locale — now uses trust.originalTitle from dictionary
const features: Record<
  string,
  Array<{ icon: string; title: string; desc: string }>
> = {
  bg: [
    {
      icon: "shield",
      title: "Официален дилър във Варна",
      desc: "Оторизиран партньор на Daikin, Mitsubishi, Gree. Пълна гаранция до 5 години и оригинални резервни части.",
    },
    {
      icon: "truck",
      title: "Посещение в същия ден",
      desc: "Собствена монтажна бригада във Варна. При заявка до обяд — идваме в същия ден.",
    },
    {
      icon: "wrench",
      title: "Чист монтаж, фиксирана цена",
      desc: "Работим с прахосмукачка — без прах и мръсотия. Цената е фиксирана, без скрити разходи.",
    },
  ],
  en: [
    {
      icon: "shield",
      title: "Authorized dealer in Varna",
      desc: "Authorized partner for Daikin, Mitsubishi, Gree. Full warranty up to 5 years and original spare parts.",
    },
    {
      icon: "truck",
      title: "Same-day dispatch",
      desc: "Our own installation crew in Varna. Request before noon — we come the same day.",
    },
    {
      icon: "wrench",
      title: "Clean install, fixed price",
      desc: "We work with a vacuum — no dust or mess. Price is fixed, no hidden extras.",
    },
  ],
  ru: [
    {
      icon: "shield",
      title: "Официальный дилер в Варне",
      desc: "Авторизованный партнёр Daikin, Mitsubishi, Gree. Полная гарантия до 5 лет и оригинальные запчасти.",
    },
    {
      icon: "truck",
      title: "Выезд в день обращения",
      desc: "Собственная монтажная бригада в Варне. Заявка до обеда — приезжаем в тот же день.",
    },
    {
      icon: "wrench",
      title: "Чистый монтаж, фиксированная цена",
      desc: "Работаем с пылесосом — без пыли и грязи. Цена фиксированная, без скрытых доплат.",
    },
  ],
  ua: [
    {
      icon: "shield",
      title: "Офіційний дилер у Варні",
      desc: "Авторизований партнер Daikin, Mitsubishi, Gree. Повна гарантія до 5 років та оригінальні запчастини.",
    },
    {
      icon: "truck",
      title: "Виїзд у день звернення",
      desc: "Власна монтажна бригада у Варні. Заявка до обіду — приїжджаємо того ж дня.",
    },
    {
      icon: "wrench",
      title: "Чистий монтаж, фіксована ціна",
      desc: "Працюємо з пилососом — без пилу й бруду. Ціна фіксована, без прихованих доплат.",
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
  freeConsultation: string;
}> = {
  bg: {
    categories: "Категории",
    brands: "Работим с водещи марки",
    popular: "Популярни продукти",
    viewAll: "Виж всички",
    whyUs: "Защо да изберете нас",
    ctaTitle: "Нуждаете се от помощ при избора?",
    ctaSubtitle: "Обадете ни се или оставете запитване — наш специалист ще ви помогне да изберете най-подходящия климатик за вашето помещение и бюджет. Без ангажимент.",
    ctaButton: "Безплатна консултация",
    freeConsultation: "Безплатна консултация",
  },
  en: {
    categories: "Categories",
    brands: "We work with leading brands",
    popular: "Popular Products",
    viewAll: "View all",
    whyUs: "Why choose us",
    ctaTitle: "Need help choosing?",
    ctaSubtitle: "Call us or leave an inquiry — our specialist will help you choose the best air conditioner for your space and budget. No commitment.",
    ctaButton: "Free consultation",
    freeConsultation: "Free consultation",
  },
  ru: {
    categories: "Категории",
    brands: "Работаем с ведущими брендами",
    popular: "Популярные продукты",
    viewAll: "Смотреть все",
    whyUs: "Почему выбирают нас",
    ctaTitle: "Нужна помощь с выбором?",
    ctaSubtitle: "Позвоните нам или оставьте заявку — наш специалист поможет подобрать оптимальный кондиционер для вашего помещения и бюджета. Без обязательств.",
    ctaButton: "Бесплатная консультация",
    freeConsultation: "Бесплатная консультация",
  },
  ua: {
    categories: "Категорії",
    brands: "Працюємо з провідними брендами",
    popular: "Популярні продукти",
    viewAll: "Дивитись всі",
    whyUs: "Чому обирають нас",
    ctaTitle: "Потрібна допомога з вибором?",
    ctaSubtitle: "Зателефонуйте або залиште заявку — наш спеціаліст допоможе обрати найкращий кондиціонер для вашого приміщення та бюджету. Без зобов'язань.",
    ctaButton: "Безкоштовна консультація",
    freeConsultation: "Безкоштовна консультація",
  },
};

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

async function getBrandsWithImages() {
  try {
    const supabase = await createClient();
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
    const categorySlugs = ["invertorni-klimatici", "multi-split-sistemi", "profesionalni-sistemi", "ventilaciya"];

    // Single query instead of 4 sequential ones
    const { data } = await supabase
      .from("products")
      .select("gallery")
      .eq("is_active", true)
      .not("gallery", "is", null)
      .limit(4);

    const images: Record<string, string | null> = {};
    for (let i = 0; i < categorySlugs.length; i++) {
      if (data?.[i]?.gallery?.[0]) {
        images[categorySlugs[i]] = data[i].gallery[0];
      }
    }
    return images;
  } catch {
    return {};
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const hero = dictionary.hero;
  const trust = dictionary.trust;
  const trustNumbers = dictionary.trustNumbers;
  const seasonal = dictionary.seasonal;
  const aiConsultant = dictionary.aiConsultant;
  const feats = features[locale] || features.bg;
  const cats = categories[locale] || categories.bg;
  const labels = sectionLabels[locale] || sectionLabels.bg;

  // Fetch hero banners from Supabase
  async function getHeroBanners() {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("banners")
        .select("id, title, subtitle, image_desktop, image_mobile, link")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(8);
      return data || [];
    } catch {
      return [];
    }
  }

  const [featuredProducts, brands, categoryImages, heroBanners] = await Promise.all([
    getFeaturedProducts(),
    getBrandsWithImages(),
    getCategoryImages(),
    getHeroBanners(),
  ]);

  return (
    <>
      {/* Hero Carousel — managed via /admin/banners */}
      <HeroCarousel
        banners={heroBanners}
        locale={locale}
        fallbackTitle={hero.title}
        fallbackSubtitle={hero.subtitle}
        ctaLabel={hero.cta}
        ctaSecondaryLabel={hero.ctaSecondary}
        ctaLink="/klimatici"
        ctaSecondaryLink="/inquiry"
      />

      {/* Seasonal Urgency Banner */}
      {seasonal && <SeasonalBanner locale={locale} labels={seasonal} />}

      {/* Trust Strip — numbers + social proof */}
      <section className="border-b border-border/60 bg-gradient-to-b from-white to-[#fafbfc]">
        <h2 className="sr-only">Trust indicators</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="region" aria-label="Trust indicators" tabIndex={0} className="flex gap-3 sm:gap-4 lg:gap-6 py-4 sm:py-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
            {(trustNumbers || []).map((item: { value: string; label: string; icon: string }, i: number) => {
              const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                shield: Shield, star: Star, award: Award, sparkles: Sparkles, truck: Truck,
              };
              const Icon = iconMap[item.icon] || Shield;
              return (
                <div key={i} className="flex items-center gap-2.5 shrink-0 snap-start px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-border/60 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.03)]">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/[0.08] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-bold text-foreground whitespace-nowrap leading-tight">{item.value}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap leading-tight">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
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
                className="group relative p-3 sm:p-6 bg-white border border-border/60 rounded-2xl hover:border-primary/30 hover:shadow-[0_12px_40px_rgb(2_132_199/0.08)] transition-all duration-300 overflow-hidden"
              >
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                {/* Category representative image */}
                {catImage && (
                  <div className="relative w-full h-20 sm:h-28 mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-[#f0f9ff] to-[#f8fafc] overflow-hidden">
                    <Image
                      src={catImage}
                      alt={cat.name}
                      fill
                      className="object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                )}
                {!catImage && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-light to-[#e0f2fe] rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-all duration-300 shadow-[0_2px_8px_rgb(2_132_199/0.1)]">
                    <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                  </div>
                )}
                <h3 className="text-xs sm:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200 leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">
                  {cat.desc}
                </p>
                <div className="absolute top-4 sm:top-6 right-3 sm:right-5 w-7 h-7 rounded-full bg-transparent group-hover:bg-primary/[0.08] flex items-center justify-center transition-all duration-200">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Products — above banners for faster access to prices (PPC optimization) */}
      {featuredProducts.length > 0 && (
        <section className="bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {labels.popular}
              </h2>
              <Link
                href={`/${locale}/klimatici`}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {labels.viewAll}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  locale={locale}
                  currency="EUR"
                  dictionary={dictionary}
                />
              ))}
            </div>
            <div className="sm:hidden mt-8 text-center">
              <Link
                href={`/${locale}/klimatici`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors py-2"
              >
                {labels.viewAll}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features / Why Us */}
      <section className="bg-gradient-to-b from-white via-[#f8fafc] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {labels.whyUs}
            </h2>
            <div className="mt-3 mx-auto w-10 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {feats.map((feat, index) => {
              const IconComp = iconMap[feat.icon] || Shield;
              return (
                <div
                  key={feat.title}
                  className="group relative p-5 sm:p-7 bg-white border border-border/60 rounded-2xl shadow-[0_2px_12px_rgb(0_0_0/0.03)] hover:shadow-[0_12px_40px_rgb(0_0_0/0.07)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Left accent stripe */}
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/[0.08] to-accent/[0.05] rounded-2xl flex items-center justify-center shrink-0 group-hover:from-primary/[0.12] group-hover:to-accent/[0.08] transition-all duration-300">
                      <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                  {/* Subtle number -- slightly more visible */}
                  <span className="absolute top-3 sm:top-4 right-4 sm:right-6 text-5xl sm:text-7xl font-bold text-primary/[0.06] select-none" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Consultant Section */}
      {aiConsultant && <AiConsultantSection labels={aiConsultant} />}

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#053b5e] via-[var(--primary-dark)] to-[var(--primary)]" />
        {/* Decorative radial glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-20"
          style={{
            background: "radial-gradient(circle at center, rgba(14,165,233,0.4) 0%, transparent 60%)",
          }}
        />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-10"
          style={{
            background: "radial-gradient(circle at center, rgba(13,148,136,0.5) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.08] border border-white/15 rounded-full mb-5 sm:mb-6 backdrop-blur-sm">
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                  <Phone className="w-3 h-3 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  {labels.freeConsultation}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                {labels.ctaTitle}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/70 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {labels.ctaSubtitle}
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <Link
                href={`/${locale}/inquiry`}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[var(--primary-dark)] font-semibold rounded-xl hover:bg-white/95 transition-all duration-200 shadow-[0_4px_20px_0_rgb(0_0_0/0.2)] hover:shadow-[0_8px_30px_0_rgb(0_0_0/0.25)] hover:-translate-y-0.5 min-h-[48px]"
              >
                {labels.ctaButton}
                <ArrowRight className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="border-t border-border/40 bg-gradient-to-b from-[#fafbfc] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground text-center mb-8 sm:mb-12 tracking-widest uppercase">
            {labels.brands}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/${locale}/klimatici?brand=${encodeURIComponent(brand.name)}`}
                className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-white border border-border/60 rounded-2xl hover:border-primary/30 hover:shadow-[0_12px_40px_rgb(2_132_199/0.08)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Brand representative image */}
                {brand.image ? (
                  <div className="relative w-full h-16 sm:h-20 rounded-xl bg-gradient-to-br from-[#f0f9ff]/50 to-[#f8fafc] overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={`${brand.name} air conditioner`}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-16 sm:h-20 rounded-xl bg-gradient-to-br from-[#f0f9ff]/50 to-[#f8fafc] flex items-center justify-center">
                    <Snowflake className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground/20" aria-hidden="true" />
                  </div>
                )}
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors duration-200">
                    {brand.name}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {brand.count} {dictionary.common.productsCount}
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
