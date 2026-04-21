import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { getPostBySlug, getAllSlugs } from "@/lib/blog/posts";
import type { Locale } from "@/lib/blog/types";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const locales = ["bg", "en", "ru", "ua"] as const;

const labels: Record<
  string,
  {
    breadcrumbHome: string;
    breadcrumbBlog: string;
    author: string;
    catalogCta: string;
    catalogCtaDesc: string;
    consultantCta: string;
    consultantCtaDesc: string;
    catalogButton: string;
  }
> = {
  bg: {
    breadcrumbHome: "Начало",
    breadcrumbBlog: "Блог",
    author: "Песнопоец Клима",
    catalogCta: "Разгледайте каталога",
    catalogCtaDesc: "Инверторни климатици с висок SCOP, подходящи за отопление във Варна",
    consultantCta: "Попитайте AI консултанта",
    consultantCtaDesc: "Ще подбере модел за вашата стая и бюджет",
    catalogButton: "Към каталога",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbBlog: "Blog",
    author: "Pesnopoets Clima",
    catalogCta: "Browse the Catalog",
    catalogCtaDesc: "Inverter ACs with high SCOP ratings, suitable for heating in Varna",
    consultantCta: "Ask the AI Consultant",
    consultantCtaDesc: "Get personalized recommendations for your room and budget",
    catalogButton: "Go to catalog",
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbBlog: "Блог",
    author: "Песнопоец Клима",
    catalogCta: "Смотрите каталог",
    catalogCtaDesc: "Инверторные кондиционеры с высоким SCOP, подходящие для отопления в Варне",
    consultantCta: "Спросите AI консультанта",
    consultantCtaDesc: "Подберет модель для вашей комнаты и бюджета",
    catalogButton: "В каталог",
  },
  ua: {
    breadcrumbHome: "Головна",
    breadcrumbBlog: "Блог",
    author: "Піснопоєць Кліма",
    catalogCta: "Перегляньте каталог",
    catalogCtaDesc: "Інверторні кондиціонери з високим SCOP, підходящі для опалення у Варні",
    consultantCta: "Запитайте AI консультанта",
    consultantCtaDesc: "Підбере модель для вашої кімнати та бюджету",
    catalogButton: "До каталогу",
  },
};

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const loc = (locales.includes(locale as Locale) ? locale : "bg") as Locale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  return {
    title: `${post.title[loc]} | ${loc === "en" ? "Pesnopoets Clima" : "Песнопоец Клима"}`,
    description: post.excerpt[loc],
    keywords: post.keywords[loc],
    authors: [{ name: labels[loc]?.author || "Песнопоец Клима" }],
    alternates: {
      canonical: `${siteUrl}/${locale}/blog/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l === "ua" ? "uk" : l, `${siteUrl}/${l}/blog/${slug}`])
      ),
    },
    openGraph: {
      title: post.title[loc],
      description: post.excerpt[loc],
      type: "article",
      publishedTime: post.date,
      authors: [labels[loc]?.author || "Песнопоец Клима"],
      images: [{ url: `${siteUrl}${post.image}`, width: 1200, height: 630 }],
      locale: loc === "bg" ? "bg_BG" : loc === "ru" ? "ru_RU" : loc === "ua" ? "uk_UA" : "en_US",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const loc = (locales.includes(locale as Locale) ? locale : "bg") as Locale;
  const t = labels[loc] || labels.bg;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  const ContentComponent = post.content[loc];

  const dateFormatted = new Date(post.date).toLocaleDateString(
    loc === "ua" ? "uk-UA" : loc === "bg" ? "bg-BG" : loc === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Article JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title[loc],
    description: post.excerpt[loc],
    image: `${siteUrl}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: t.author,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: t.author,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${locale}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0c1e3a] to-[#0a1628] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Breadcrumbs */}
          <nav className="text-xs text-white/50 mb-5 flex items-center gap-1.5 flex-wrap" aria-label="breadcrumb">
            <Link href={`/${locale}`} className="hover:text-white/80">
              {t.breadcrumbHome}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <Link href={`/${locale}/blog`} className="hover:text-white/80">
              {t.breadcrumbBlog}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80 line-clamp-1">{post.title[loc]}</span>
          </nav>

          <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-5">
            {post.title[loc]}
          </h1>

          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {dateFormatted}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {post.readingTime[loc]}
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline">{t.author}</span>
          </div>
        </div>
      </section>

      {/* Featured image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-xl bg-muted">
          <Image
            src={post.image}
            alt={post.title[loc]}
            width={1200}
            height={800}
            sizes="(max-width: 896px) 100vw, 896px"
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="blog-article max-w-none">
          <ContentComponent />
        </div>

        {/* CTA section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/${locale}/klimatici`}
            className="flex flex-col p-6 bg-white border border-border/60 rounded-2xl hover:shadow-lg transition-shadow duration-300 group"
          >
            <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
              {t.catalogCta}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
              {t.catalogCtaDesc}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {t.catalogButton}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
            </span>
          </Link>

          <Link
            href={`/${locale}/inquiry`}
            className="flex flex-col p-6 bg-primary/5 border border-primary/20 rounded-2xl hover:shadow-lg transition-shadow duration-300 group"
          >
            <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
              {t.consultantCta}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
              {t.consultantCtaDesc}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {t.catalogButton}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </article>
    </>
  );
}
