import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog/posts";
import type { Locale } from "@/lib/blog/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const meta: Record<string, { title: string; description: string }> = {
  bg: {
    title: "Блог за климатици във Варна | Песнопоец Клима",
    description:
      "Полезни статии за климатици и отопление: как се избира уред, цени за монтаж и профилактика, BTU калкулатор и сметка за ток. Експертен опит от Варна.",
  },
  en: {
    title: "AC Blog — Varna | Pesnopoets Clima",
    description:
      "Useful articles about air conditioners and heating: how to pick a unit, installation and maintenance prices, BTU calculator, real electricity bills. Varna expertise.",
  },
  ru: {
    title: "Блог о кондиционерах в Варне | Песнопоец Клима",
    description:
      "Полезные статьи о кондиционерах и отоплении: как выбрать модель, цены на монтаж и обслуживание, BTU-калькулятор, реальный счёт за свет. Экспертиза Варны.",
  },
  ua: {
    title: "Блог про кондиціонери у Варні | Піснопоєць Кліма",
    description:
      "Корисні статті про кондиціонери та опалення: як обрати модель, ціни на монтаж і профілактику, BTU-калькулятор, реальний рахунок за світло. Експертиза Варни.",
  },
};

const labels: Record<string, { heading: string; breadcrumbHome: string; readMore: string }> = {
  bg: { heading: "Блог за климатици", breadcrumbHome: "Начало", readMore: "Прочетете повече" },
  en: { heading: "Air Conditioning Blog", breadcrumbHome: "Home", readMore: "Read more" },
  ru: { heading: "Блог о кондиционерах", breadcrumbHome: "Главная", readMore: "Читать далее" },
  ua: { heading: "Блог про кондиціонери", breadcrumbHome: "Головна", readMore: "Читати далі" },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale] || meta.bg;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: {
        bg: `${siteUrl}/bg/blog`,
        en: `${siteUrl}/en/blog`,
        ru: `${siteUrl}/ru/blog`,
        uk: `${siteUrl}/ua/blog`,
      },
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = (["bg", "en", "ru", "ua"].includes(locale) ? locale : "bg") as Locale;
  const posts = getAllPosts();
  const t = labels[loc] || labels.bg;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="text-xs text-white/50 mb-5 flex items-center gap-1.5" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">
              {t.breadcrumbHome}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{t.heading}</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            {t.heading}
          </h1>
        </div>
      </section>

      {/* Post grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group flex flex-col bg-white border border-border/60 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title[loc]}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    {new Date(post.date).toLocaleDateString(
                      loc === "ua" ? "uk-UA" : loc === "bg" ? "bg-BG" : loc === "ru" ? "ru-RU" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {post.readingTime[loc]}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200 leading-snug">
                  {post.title[loc]}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {post.excerpt[loc]}
                </p>

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t.readMore}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
