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
  const t = dictionary.privacy;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: `${t.title} | ${dictionary.common.siteName}`,
    description: t.intro,
    alternates: {
      canonical: `${siteUrl}/${locale}/privacy`,
      languages: {
        bg: `${siteUrl}/bg/privacy`,
        en: `${siteUrl}/en/privacy`,
        ru: `${siteUrl}/ru/privacy`,
        uk: `${siteUrl}/ua/privacy`,
        "x-default": `${siteUrl}/bg/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const t = dictionary.privacy;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t.title}</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>{t.intro}</p>
        <h2 className="text-lg font-semibold text-foreground">{t.dataTitle}</h2>
        <p>{t.dataText}</p>
      </div>
    </div>
  );
}
