import type { Metadata } from "next";

async function getDictionary(locale: string) {
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
  const dictionary = await getDictionary(locale);
  const t = dictionary.terms;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: `${t.title} | ${dictionary.common.siteName}`,
    description: t.intro,
    alternates: {
      canonical: `${siteUrl}/${locale}/terms`,
      languages: {
        bg: `${siteUrl}/bg/terms`,
        en: `${siteUrl}/en/terms`,
        ru: `${siteUrl}/ru/terms`,
        uk: `${siteUrl}/ua/terms`,
        "x-default": `${siteUrl}/bg/terms`,
      },
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const t = dictionary.terms;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t.title}</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>{t.intro}</p>
        <h2 className="text-lg font-semibold text-foreground">{t.pricesTitle}</h2>
        <p>{t.pricesText}</p>
      </div>
    </div>
  );
}
