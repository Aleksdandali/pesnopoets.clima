const titles: Record<string, string> = { bg: "Политика за поверителност", en: "Privacy Policy", ru: "Политика конфиденциальности", ua: "Політика конфіденційності" };

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">{titles[locale] || titles.bg}</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>{locale === "bg" ? "Тази страница описва как събираме и използваме вашите лични данни при използване на нашия уебсайт." : locale === "ru" ? "Эта страница описывает, как мы собираем и используем ваши персональные данные при использовании нашего сайта." : locale === "ua" ? "Ця сторінка описує, як ми збираємо та використовуємо ваші персональні дані при використанні нашого сайту." : "This page describes how we collect and use your personal data when using our website."}</p>
        <h2 className="text-lg font-semibold text-foreground">{locale === "bg" ? "Какви данни събираме" : locale === "ru" ? "Какие данные мы собираем" : locale === "ua" ? "Які дані ми збираємо" : "What data we collect"}</h2>
        <p>{locale === "bg" ? "При попълване на формата за запитване събираме: име, телефонен номер, имейл адрес (по избор) и съобщение. Тези данни се използват единствено за обработка на вашето запитване." : locale === "ru" ? "При заполнении формы заявки мы собираем: имя, номер телефона, email (необязательно) и сообщение. Эти данные используются исключительно для обработки вашей заявки." : locale === "ua" ? "При заповненні форми заявки ми збираємо: ім'я, номер телефону, email (необов'язково) та повідомлення. Ці дані використовуються виключно для обробки вашої заявки." : "When filling out the inquiry form, we collect: name, phone number, email (optional), and message. This data is used solely to process your inquiry."}</p>
      </div>
    </div>
  );
}
