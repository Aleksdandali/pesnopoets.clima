import Image from "next/image";
import Link from "next/link";
import { Zap, Thermometer, Volume2, Maximize } from "lucide-react";

interface ProductCardProps {
  product: {
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
  return `${price.toFixed(2)} €`;
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
    <Link
      href={`/${locale}/klimatici/${product.slug}`}
      className="group block bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Thermometer className="w-12 h-12" />
          </div>
        )}

        {/* Promo badge */}
        {product.is_promo && product.price_promo && product.price_promo > 0 && (
          <div className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-full">
            PROMO
          </div>
        )}

        {/* Availability badge */}
        <div
          className={`absolute top-3 right-3 ${avail.bg} ${avail.text} text-xs font-medium px-2.5 py-1 rounded-full`}
        >
          {avail.label[locale] || avail.label.bg}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Manufacturer */}
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
          {product.manufacturer}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug min-h-[2.5rem]">
          {displayTitle}
        </h3>

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {product.btu && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>{product.btu.toLocaleString()} BTU</span>
            </div>
          )}
          {product.area_m2 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Maximize className="w-3.5 h-3.5 text-primary" />
              <span>
                {locale === "bg" ? "до" : locale === "ru" || locale === "ua" ? "до" : "up to"}{" "}
                {product.area_m2}{" "}
                {locale === "en" ? "sq.m" : "кв.м"}
              </span>
            </div>
          )}
          {product.energy_class && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-success" />
              <span>{product.energy_class.split("/")[0]?.trim()}</span>
            </div>
          )}
          {product.noise_db_indoor && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Volume2 className="w-3.5 h-3.5 text-accent" />
              <span>{product.noise_db_indoor} dB</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-3 border-t border-border">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(displayPrice, currency)}
          </span>
          {product.is_promo && product.price_promo && product.price_promo > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price_client, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
