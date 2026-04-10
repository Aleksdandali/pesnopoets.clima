import type { Metadata } from "next";
import InquiryForm from "@/components/forms/InquiryForm";
import { Phone, Mail, Clock } from "lucide-react";

interface InquiryPageProps {
  params: Promise<{ locale: string }>;
}

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

const pageContent: Record<
  string,
  {
    title: string;
    subtitle: string;
    metaTitle: string;
    metaDesc: string;
    contactTitle: string;
    workHours: string;
    workHoursValue: string;
  }
> = {
  bg: {
    title: "Запитване",
    subtitle:
      "Имате въпроси или искате оферта? Попълнете формата и ние ще се свържем с вас в рамките на 1 час.",
    metaTitle: "Запитване — Clima",
    metaDesc: "Направете запитване за климатик. Безплатна консултация и оферта.",
    contactTitle: "Свържете се с нас",
    workHours: "Работно време",
    workHoursValue: "Пон-Пет: 09:00–18:00\nСъб: 10:00–14:00",
  },
  en: {
    title: "Inquiry",
    subtitle:
      "Have questions or want a quote? Fill out the form and we'll contact you within 1 hour.",
    metaTitle: "Inquiry — Clima",
    metaDesc: "Make an inquiry about air conditioners. Free consultation and quote.",
    contactTitle: "Contact Us",
    workHours: "Working Hours",
    workHoursValue: "Mon-Fri: 09:00–18:00\nSat: 10:00–14:00",
  },
  ru: {
    title: "Запрос",
    subtitle:
      "Есть вопросы или хотите получить предложение? Заполните форму, и мы свяжемся с вами в течение 1 часа.",
    metaTitle: "Запрос — Clima",
    metaDesc: "Оставьте заявку на кондиционер. Бесплатная консультация.",
    contactTitle: "Свяжитесь с нами",
    workHours: "Рабочее время",
    workHoursValue: "Пн-Пт: 09:00–18:00\nСб: 10:00–14:00",
  },
  ua: {
    title: "Запит",
    subtitle:
      "Маєте запитання або хочете отримати пропозицію? Заповніть форму, і ми зв'яжемось з вами протягом 1 години.",
    metaTitle: "Запит — Clima",
    metaDesc: "Залиште заявку на кондиціонер. Безкоштовна консультація.",
    contactTitle: "Зв'яжіться з нами",
    workHours: "Робочий час",
    workHoursValue: "Пн-Пт: 09:00–18:00\nСб: 10:00–14:00",
  },
};

export async function generateMetadata({
  params,
}: InquiryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const content = pageContent[locale] || pageContent.bg;
  return {
    title: content.metaTitle,
    description: content.metaDesc,
  };
}

export default async function InquiryPage({ params }: InquiryPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const content = pageContent[locale] || pageContent.bg;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form */}
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {content.title}
          </h1>
          <p className="text-muted-foreground mb-8">{content.subtitle}</p>

          <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
            <InquiryForm locale={locale} dictionary={dictionary} />
          </div>
        </div>

        {/* Contact info sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div className="bg-muted rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {content.contactTitle}
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === "bg" ? "Телефон" : locale === "ru" || locale === "ua" ? "Телефон" : "Phone"}
                    </p>
                    <a
                      href="tel:+359000000000"
                      className="text-foreground font-medium hover:text-primary"
                    >
                      +359 XX XXX XXXX
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href="mailto:info@pesnopoets-clima.com"
                      className="text-foreground font-medium hover:text-primary"
                    >
                      info@pesnopoets-clima.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {content.workHours}
                    </p>
                    <p className="text-foreground font-medium whitespace-pre-line text-sm">
                      {content.workHoursValue}
                    </p>
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
