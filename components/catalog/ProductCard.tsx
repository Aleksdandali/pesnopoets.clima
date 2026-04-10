"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import { Zap, Thermometer, Volume2, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
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
    title_en?: string | null;
    title_ru?: string | null;
    title_ua?: string | null;
  };
  locale: string;
  currency: "EUR" | "BGN";
  dictionary?: {
    common: {
      currency: { bgn: string; eur: string };
      upTo: string;
      sqm: string;
      promoBadge: string;
    };
    product: {
      availability: {
        inStock: string;
        limited: string;
        outOfStock: string;
      };
    };
  };
}

const EUR_TO_BGN = 1.95583;

function formatPrice(price: number, currency: "EUR" | "BGN", currencyLabel?: string): string {
  if (currency === "BGN") {
    const bgn = price * EUR_TO_BGN;
    return `${bgn.toFixed(0)} ${currencyLabel || "лв."}`;
  }
  return `${price.toFixed(2)} \u20AC`;
}

const availabilityStyles: Record<string, { bg: string; text: string; dictKey: "inStock" | "limited" | "outOfStock" }> = {
  Наличен: {
    bg: "bg-success-light",
    text: "text-success",
    dictKey: "inStock",
  },
  "Ограничена наличност": {
    bg: "bg-warning-light",
    text: "text-warning",
    dictKey: "limited",
  },
  Неналичен: {
    bg: "bg-danger-light",
    text: "text-danger",
    dictKey: "outOfStock",
  },
};

const SWIPE_THRESHOLD = 50;

export default function ProductCard({
  product,
  locale,
  currency,
  dictionary,
}: ProductCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const localeTitle = locale === "en" ? product.title_en : locale === "ru" ? product.title_ru : locale === "ua" ? product.title_ua : null;
  const displayTitle = product.title_override || localeTitle || product.title;
  const displayPrice = product.price_override || product.price_client;
  const gallery = product.gallery || [];
  const hasMultipleImages = gallery.length > 1;
  const imageUrl = gallery[currentIndex] || gallery[0];
  const avail = availabilityStyles[product.availability] || availabilityStyles["Неналичен"];

  const availLabel = dictionary
    ? dictionary.product.availability[avail.dictKey]
    : product.availability;

  const upToLabel = dictionary?.common.upTo || (locale === "en" ? "up to" : "до");
  const sqmLabel = dictionary?.common.sqm || (locale === "en" ? "sq.m" : "кв.м");
  const promoBadge = dictionary?.common.promoBadge || "PROMO";
  const currencyLabel = dictionary?.common.currency.bgn;

  const goToPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((i) => (i === 0 ? gallery.length - 1 : i - 1));
    },
    [gallery.length]
  );

  const goToNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((i) => (i === gallery.length - 1 ? 0 : i + 1));
    },
    [gallery.length]
  );

  const handleDotClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex(index);
    },
    []
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        e.preventDefault();
        if (deltaX < 0) {
          // Swiped left — next image
          setCurrentIndex((i) => (i === gallery.length - 1 ? 0 : i + 1));
        } else {
          // Swiped right — prev image
          setCurrentIndex((i) => (i === 0 ? gallery.length - 1 : i - 1));
        }
      }
      touchStartX.current = null;
    },
    [gallery.length]
  );

  // Preload next image
  const nextIndex = gallery.length > 1 ? (currentIndex + 1) % gallery.length : -1;

  return (
    <div className="relative group block bg-white rounded-2xl border border-border shadow-[0_2px_8px_rgb(0_0_0/0.04)] hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0_0_0/0.08)] transition-all duration-300 overflow-hidden">
      <Link
        href={`/${locale}/klimatici/${product.slug}`}
        className="block"
      >
        {/* Image area with carousel */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-[#fafbfc]"
          onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
          onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              className="object-contain p-3 sm:p-6 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground/20">
              <Thermometer className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true" />
            </div>
          )}

          {/* Preload next image (hidden) */}
          {nextIndex >= 0 && gallery[nextIndex] && (
            <Image
              src={gallery[nextIndex]}
              alt=""
              fill
              className="sr-only"
              sizes="1px"
              aria-hidden="true"
            />
          )}

          {/* Promo badge */}
          {product.is_promo && product.price_promo && product.price_promo > 0 && (
            <div className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-lg z-[2]">
              {promoBadge}
            </div>
          )}

          {/* Availability badge */}
          <div
            className={`absolute top-3 right-3 ${avail.bg} ${avail.text} text-xs font-medium px-2.5 py-1 rounded-lg z-[2]`}
          >
            {availLabel}
          </div>

          {/* Arrow buttons — visible on desktop hover only */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-border/60 flex items-center justify-center text-foreground hover:bg-white hover:shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[3] hidden sm:flex"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-border/60 flex items-center justify-center text-foreground hover:bg-white hover:shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[3] hidden sm:flex"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-[3]">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => handleDotClick(e, i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentIndex
                      ? "w-2 h-2 bg-primary"
                      : "w-1.5 h-1.5 bg-foreground/25 hover:bg-foreground/40"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5">
          {/* Manufacturer */}
          <p className="text-[11px] sm:text-[11px] font-semibold text-primary uppercase tracking-widest mb-1 sm:mb-1.5">
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
                  {upToLabel}{" "}
                  {product.area_m2}{" "}
                  {sqmLabel}
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
              <span className="text-base sm:text-xl font-extrabold text-foreground">
                {formatPrice(displayPrice, currency, currencyLabel)}
              </span>
              {product.is_promo && product.price_promo && product.price_promo > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price_client, currency, currencyLabel)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* 1-Click phone button — positioned absolutely at bottom-right, 44px tap target */}
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
