import Image from "next/image";
import Link from "next/link";
import { Zap, Thermometer, Volume2, Maximize } from "lucide-react";
import OneClickCardButton from "@/components/catalog/OneClickCardButton";

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    title: string;
    title_override?: string | null;
    manufacturer: string;
    price_client: number;
    price_override?: number | null;
    price_promo?: number | null;
    is_promo: boolean;
    availability: string;
    gallery: string[];
    btu?: number | null;
    energy_class?: string | null;
    area_m2?: number | null;
    noise_db_indoor?: number | null;
  };
  locale: string;
  currency: "EUR" | "BGN";
}

const EUR_TO_BGN = 1.95583;

function formatPrice(price: number, currency: "EUR" | "BGN"): string {
  if (currency === "BGN") {
    const bgn = price * EUR_TO_BGN;
    return `${bgn.toFixed(0)} лв.`;
  }
  return `${price.toFixed(2)} \u20AC`;
}

const availabilityStyles: Record<string, { bg: string; text: string; label: Record<string, string> }> = {
  Наличен: {
    bg: "bg-success-light",
    text: "text-success",
    label: { bg: "Наличен", en: "In Stock", ru: "В наличии", ua: "В наявності" },
  },
  "Ограничена наличност": {
    bg: "bg-warning-light",
    text: "text-warning",
    label: { bg: "Ограничено", en: "Limited", ru: "Ограничено", ua: "Обмежено" },
  },
  Неналичен: {
    bg: "bg-danger-light",
    text: "text-danger",
    label: { bg: "Неналичен", en: "Out of Stock", ru: "Нет в наличии", ua: "Немає" },
  },
};

export default function ProductCard({
  product,
  locale,
  currency,
}: ProductCardProps) {
  const displayTitle = product.title_override || product.title;
  const displayPrice = product.price_override || product.price_client;
  const imageUrl = product.gallery?.[0];
  const avail = availabilityStyles[product.availability] || availabilityStyles["Неналичен"];

  return (
    <div className="relative group block bg-white rounded-2xl border border-border shadow-[0_2px_8px_rgb(0_0_0/0.04)] hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0_0_0/0.08)] transition-all duration-300">
      <Link
        href={`/${locale}/klimatici/${product.slug}`}
        className="block"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-[#fafbfc]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              className="object-contain p-3 sm:p-6 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 gap-2">
              <Thermometer className="w-10 h-10 sm:w-12 sm:h-12" />
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground/40 uppercase tracking-wider">No image</span>
            </div>
          )}

          {/* Promo badge */}
          {product.is_promo && product.price_promo && product.price_promo > 0 && (
            <div className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              PROMO
            </div>
          )}

          {/* Availability badge */}
          <div
            className={`absolute top-3 right-3 ${avail.bg} ${avail.text} text-[11px] font-medium px-2.5 py-1 rounded-lg`}
          >
            {avail.label[locale] || avail.label.bg}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5">
          {/* Manufacturer */}
          <p className="text-[10px] sm:text-[11px] font-semibold text-primary uppercase tracking-widest mb-1 sm:mb-1.5">
            {product.manufacturer}
          </p>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 mb-2 sm:mb-4 group-hover:text-primary transition-colors duration-200 leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
            {displayTitle}
          </h3>

          {/* Key specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-4">
            {product.btu && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-primary/60" />
                <span>{product.btu.toLocaleString()} BTU</span>
              </div>
            )}
            {product.area_m2 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Maximize className="w-3.5 h-3.5 text-primary/60" />
                <span>
                  {locale === "bg" ? "до" : locale === "ru" || locale === "ua" ? "до" : "up to"}{" "}
                  {product.area_m2}{" "}
                  {locale === "en" ? "sq.m" : "кв.м"}
                </span>
              </div>
            )}
            {product.energy_class && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-success/60" />
                <span>{product.energy_class.split("/")[0]?.trim()}</span>
              </div>
            )}
            {product.noise_db_indoor && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Volume2 className="w-3.5 h-3.5 text-accent/60" />
                <span>{product.noise_db_indoor} dB</span>
              </div>
            )}
          </div>

          {/* Price + 1-click button */}
          <div className="flex items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-border">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-foreground">
                {formatPrice(displayPrice, currency)}
              </span>
              {product.is_promo && product.price_promo && product.price_promo > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price_client, currency)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* 1-Click phone button — positioned absolutely at bottom-right */}
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-[5]">
        <OneClickCardButton
          locale={locale}
          productId={product.id}
          productTitle={displayTitle}
        />
      </div>
    </div>
  );
}
