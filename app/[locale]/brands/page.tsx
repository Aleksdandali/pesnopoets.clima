import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

// Revalidate brands page every 10 minutes
export const revalidate = 600;

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("manufacturer, gallery")
    .eq("is_active", true)
    .not("manufacturer", "is", null);

  const brandMap: Record<string, { count: number; image: string | null }> = {};
  for (const row of data || []) {
    if (!brandMap[row.manufacturer]) brandMap[row.manufacturer] = { count: 0, image: row.gallery?.[0] || null };
    brandMap[row.manufacturer].count++;
    if (!brandMap[row.manufacturer].image && row.gallery?.[0]) brandMap[row.manufacturer].image = row.gallery[0];
  }

  const brands = Object.entries(brandMap).map(([name, info]) => ({ name, ...info })).sort((a, b) => b.count - a.count);
  const t = dictionary.brands;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-3">{t.title}</h1>
      <p className="text-muted-foreground mb-10">{t.subtitle}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/${locale}/klimatici?brand=${encodeURIComponent(brand.name)}`}
            className="group flex flex-col items-center gap-4 p-6 bg-white border border-border/80 rounded-2xl hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0_0_0/0.04)] transition-all duration-300"
          >
            {brand.image ? (
              <div className="relative w-full h-24 rounded-xl bg-[#fafbfc] overflow-hidden">
                <Image src={brand.image} alt={brand.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-500" sizes="25vw" loading="lazy" />
              </div>
            ) : (
              <div className="w-full h-24 rounded-xl bg-[#fafbfc] flex items-center justify-center text-2xl font-bold text-muted-foreground/20">{brand.name[0]}</div>
            )}
            <div className="text-center">
              <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{brand.name}</span>
              <span className="block text-xs text-muted-foreground mt-1">{brand.count} {t.productsCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
