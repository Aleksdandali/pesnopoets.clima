import { Mail, MapPin, Clock } from "lucide-react";
import InquiryForm from "@/components/forms/InquiryForm";

const content: Record<string, { title: string; subtitle: string; phone: string; email: string; address: string; hours: string; hoursValue: string }> = {
  bg: { title: "Контакти", subtitle: "Свържете се с нас за консултация, оферта или въпроси.", phone: "Телефон", email: "Имейл", address: "Адрес", hours: "Работно време", hoursValue: "Пон-Пет: 09:00-18:00\nСъб: 10:00-14:00" },
  en: { title: "Contact", subtitle: "Get in touch for consultation, quotes or questions.", phone: "Phone", email: "Email", address: "Address", hours: "Working Hours", hoursValue: "Mon-Fri: 09:00-18:00\nSat: 10:00-14:00" },
  ru: { title: "Контакты", subtitle: "Свяжитесь с нами для консультации, предложений или вопросов.", phone: "Телефон", email: "Email", address: "Адрес", hours: "Рабочее время", hoursValue: "Пн-Пт: 09:00-18:00\nСб: 10:00-14:00" },
  ua: { title: "Контакти", subtitle: "Зв'яжіться з нами для консультації, пропозицій або запитань.", phone: "Телефон", email: "Email", address: "Адреса", hours: "Робочий час", hoursValue: "Пн-Пт: 09:00-18:00\nСб: 10:00-14:00" },
};

async function getDictionary(locale: string) {
  try { return (await import(`@/dictionaries/${locale}.json`)).default; } catch { return (await import(`@/dictionaries/bg.json`)).default; }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = content[locale] || content.bg;
  const dictionary = await getDictionary(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-foreground mb-3">{c.title}</h1>
          <p className="text-muted-foreground mb-8">{c.subtitle}</p>
          <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
            <InquiryForm locale={locale} dictionary={dictionary} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div className="bg-muted rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">{c.title}</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                    <a href="mailto:info@pesnopoets-clima.com" className="text-foreground font-medium hover:text-primary">info@pesnopoets-clima.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.address}</p>
                    <p className="text-foreground font-medium">{locale === "bg" ? "България" : locale === "ru" ? "Болгария" : locale === "ua" ? "Болгарія" : "Bulgaria"}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.hours}</p>
                    <p className="text-foreground font-medium whitespace-pre-line text-sm">{c.hoursValue}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
