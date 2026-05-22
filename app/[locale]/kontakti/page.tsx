import type { Metadata } from "next";
import { Mail, MapPin, Clock, MessageCircle, Phone } from "lucide-react";
import InquiryForm from "@/components/forms/InquiryForm";
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  VIBER_URL,
  WHATSAPP_URL,
} from "@/lib/constants";

async function getDictionary(locale: string) {
  try { return (await import(`@/dictionaries/${locale}.json`)).default; } catch { return (await import(`@/dictionaries/bg.json`)).default; }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const c = dictionary.contact;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
  return {
    title: `${c.title} | ${dictionary.common.siteName}`,
    description: c.subtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/kontakti`,
      languages: {
        bg: `${siteUrl}/bg/kontakti`,
        en: `${siteUrl}/en/kontakti`,
        ru: `${siteUrl}/ru/kontakti`,
        uk: `${siteUrl}/ua/kontakti`,
        "x-default": `${siteUrl}/bg/kontakti`,
      },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const c = dictionary.contact;

  // Inline locale labels for the click-to-call hero (added 2026-05-22 — Clarity showed
  // mobile users spending 16s reading the contacts column with 0 clicks: phone/WA
  // links were visually too small. These big thumb-friendly CTAs sit above the
  // form so the conversion path is obvious from the first viewport.)
  const callNowLabel =
    locale === "en" ? "Call now" :
    locale === "ru" ? "Позвонить сейчас" :
    locale === "ua" ? "Зателефонувати" :
    "Обадете се сега";
  const writeOnWhatsApp =
    locale === "en" ? "Write on WhatsApp" :
    locale === "ru" ? "Написать в WhatsApp" :
    locale === "ua" ? "Написати в WhatsApp" :
    "Пишете в WhatsApp";
  const fastestWay =
    locale === "en" ? "Fastest way to reach us" :
    locale === "ru" ? "Самый быстрый способ связаться" :
    locale === "ua" ? "Найшвидший спосіб зв'язатися" :
    "Най-бързият начин да ни намерите";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-foreground mb-3">{c.title}</h1>
          <p className="text-muted-foreground mb-6">{c.subtitle}</p>

          {/* Click-to-call hero — primary conversion path on mobile */}
          <div className="mb-6 rounded-2xl border border-primary/15 bg-primary-light/30 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide mb-3">
              {fastestWay}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${BUSINESS_PHONE_TEL}`}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-4 bg-primary text-white text-base sm:text-lg font-bold rounded-xl shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.99] transition-all min-h-[56px]"
                aria-label={`${callNowLabel} ${BUSINESS_PHONE_DISPLAY}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span className="whitespace-nowrap">{callNowLabel}</span>
                <span className="hidden sm:inline opacity-80 text-sm font-medium">·</span>
                <span className="hidden sm:inline tabular-nums opacity-90 text-sm font-semibold">
                  {BUSINESS_PHONE_DISPLAY}
                </span>
              </a>
              <a
                href={WHATSAPP_URL}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-4 bg-[#25D366] text-white text-base sm:text-lg font-bold rounded-xl shadow-sm hover:bg-[#20bd5a] hover:shadow-md active:scale-[0.99] transition-all min-h-[56px]"
                aria-label={writeOnWhatsApp}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="whitespace-nowrap">{writeOnWhatsApp}</span>
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground text-center sm:hidden tabular-nums">
              {BUSINESS_PHONE_DISPLAY}
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
            <InquiryForm locale={locale} dictionary={dictionary} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            {/* Response time badge */}
            <div className="flex items-center gap-2.5 bg-success-light/40 border border-success/20 rounded-xl px-4 py-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <span className="text-sm font-semibold text-success-foreground">{c.responseTime}</span>
            </div>

            <div className="bg-muted rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">{c.title}</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.phone || "Phone"}</p>
                    <a
                      href={`tel:${BUSINESS_PHONE_TEL}`}
                      className="text-foreground font-medium hover:text-primary"
                    >
                      {BUSINESS_PHONE_DISPLAY}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                    <a
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="text-foreground font-medium hover:text-primary break-all"
                    >
                      {BUSINESS_EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.address}</p>
                    <p className="text-foreground font-medium">{dictionary.common.country}</p>
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

            {/* Viber & WhatsApp */}
            <div className="bg-muted rounded-xl p-6">
              <p className="text-sm font-medium text-muted-foreground mb-3">{c.messengers}</p>
              <div className="flex gap-3">
                <a
                  href={VIBER_URL}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7360f2] text-white text-sm font-medium rounded-lg hover:bg-[#6350e0] transition-colors"
                  aria-label={c.viber}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  {c.viber}
                </a>
                <a
                  href={WHATSAPP_URL}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#20bd5a] transition-colors"
                  aria-label={c.whatsapp}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {c.whatsapp}
                </a>
              </div>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-opacity hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                }}
                aria-label={`Instagram: ${INSTAGRAM_HANDLE}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{c.mapTitle}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{c.mapSubtitle}</p>
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl border border-border shadow-[0_2px_8px_rgb(0_0_0/0.04)] aspect-[16/9] bg-muted">
          <iframe
            title={c.mapTitle}
            src="https://www.google.com/maps?q=Varna,+Bulgaria&output=embed"
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}
