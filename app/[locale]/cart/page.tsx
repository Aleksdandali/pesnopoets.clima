import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

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
    title: `${dict.cart.pageTitle} | ${dict.common.siteName}`,
    robots: { index: false, follow: false },
  };
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">
        {dict.cart.pageTitle}
      </h1>
      <CartView locale={locale} dictionary={dict} />
    </div>
  );
}
