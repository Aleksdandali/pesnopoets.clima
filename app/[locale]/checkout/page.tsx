import type { Metadata } from "next";
import CheckoutView from "@/components/cart/CheckoutView";

interface PageProps {
  params: Promise<{ locale: string }>;
}

async function getDictionary(locale: string) {
  try {
    return (await import(`@/dictionaries/${locale}.json`)).default;
  } catch {
    return (await import(`@/dictionaries/bg.json`)).default;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: `${dict.checkout.pageTitle} | ${dict.common.siteName}`,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {dict.checkout.pageTitle}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {dict.checkout.pageSubtitle}
        </p>
      </div>
      <CheckoutView locale={locale} dictionary={dict} />
    </div>
  );
}
