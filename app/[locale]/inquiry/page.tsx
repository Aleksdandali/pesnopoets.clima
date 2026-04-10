import type { Metadata } from "next";
import InquiryForm from "@/components/forms/InquiryForm";
import { Phone, Mail, Clock } from "lucide-react";

interface InquiryPageProps {
  params: Promise<{ locale: string }>;
}

const PHONE_NUMBER = "+359 888 123 456";

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

const metaContent: Record<string, { metaTitle: string; metaDesc: string }> = {
  bg: {
    metaTitle: "Запитване — Clima",
    metaDesc: "Направете запитване за климатик. Безплатна консултация и оферта.",
  },
  en: {
    metaTitle: "Inquiry — Clima",
    metaDesc: "Make an inquiry about air conditioners. Free consultation and quote.",
  },
  ru: {
    metaTitle: "Запрос — Clima",
    metaDesc: "Оставьте заявку на кондиционер. Бесплатная консультация.",
  },
  ua: {
    metaTitle: "Запит — Clima",
    metaDesc: "Залиште заявку на кондиціонер. Безкоштовна консультація.",
  },
};

export async function generateMetadata({
  params,
}: InquiryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaContent[locale] || metaContent.bg;
  return {
    title: meta.metaTitle,
    description: meta.metaDesc,
  };
}

export default async function InquiryPage({ params }: InquiryPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const t = dictionary.inquiry;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form */}
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground mb-8">{t.pageSubtitle}</p>

          <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
            <InquiryForm locale={locale} dictionary={dictionary} />
          </div>
        </div>

        {/* Contact info sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div className="bg-muted rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                {t.contactTitle}
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t.phone}
                    </p>
                    <a
                      href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                      className="text-foreground font-medium hover:text-primary"
                    >
                      {PHONE_NUMBER}
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
                      {t.workHours}
                    </p>
                    <p className="text-foreground font-medium whitespace-pre-line text-sm">
                      {t.workHoursValue}
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
