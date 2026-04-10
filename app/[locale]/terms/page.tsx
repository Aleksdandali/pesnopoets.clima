const titles: Record<string, string> = { bg: "Условия за ползване", en: "Terms of Service", ru: "Условия использования", ua: "Умови використання" };

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">{titles[locale] || titles.bg}</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>{locale === "bg" ? "С използването на този уебсайт вие приемате настоящите условия за ползване." : locale === "ru" ? "Используя данный веб-сайт, вы принимаете настоящие условия использования." : locale === "ua" ? "Використовуючи цей веб-сайт, ви приймаєте дані умови використання." : "By using this website, you accept these terms of service."}</p>
        <h2 className="text-lg font-semibold text-foreground">{locale === "bg" ? "Цени и наличност" : locale === "ru" ? "Цены и наличие" : locale === "ua" ? "Ціни та наявність" : "Prices and availability"}</h2>
        <p>{locale === "bg" ? "Всички цени са в български лева с включен ДДС. Цените и наличността се актуализират автоматично от нашия доставчик на всеки 2 часа. Възможни са разлики между показаната и реалната наличност." : locale === "ru" ? "Все цены указаны в болгарских левах с НДС. Цены и наличие обновляются автоматически каждые 2 часа. Возможны расхождения между отображаемой и реальной доступностью." : locale === "ua" ? "Усі ціни вказані в болгарських левах з ПДВ. Ціни та наявність оновлюються автоматично кожні 2 години. Можливі розбіжності між відображеною та реальною наявністю." : "All prices are in Bulgarian Lev including VAT. Prices and availability are updated automatically every 2 hours. Discrepancies between displayed and actual availability may occur."}</p>
      </div>
    </div>
  );
}
