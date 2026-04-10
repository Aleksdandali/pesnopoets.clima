async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
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
