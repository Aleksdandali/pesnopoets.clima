interface ProductForSchema {
  title: string;
  title_override?: string | null;
  description?: string | null;
  description_override?: string | null;
  slug: string;
  manufacturer: string;
  price_client: number;
  price_override?: number | null;
  price_promo?: number | null;
  is_promo: boolean;
  availability: string;
  gallery: string[];
  btu?: number | null;
  energy_class?: string | null;
  barcode?: string | null;
}

export function generateProductJsonLd(
  product: ProductForSchema,
  locale: string,
  siteUrl: string
) {
  const name = product.title_override || product.title;
  const description = product.description_override || product.description || name;
  const price = product.price_override || product.price_client;
  const priceEUR = price.toFixed(2);
  const url = `${siteUrl}/${locale}/klimatici/${product.slug}`;

  const availabilityMap: Record<string, string> = {
    Наличен: "https://schema.org/InStock",
    "Ограничена наличност": "https://schema.org/LimitedAvailability",
    Неналичен: "https://schema.org/OutOfStock",
  };

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.replace(/<[^>]*>/g, "").slice(0, 500),
    url,
    brand: {
      "@type": "Brand",
      name: product.manufacturer,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EUR",
      price: priceEUR,
      availability: availabilityMap[product.availability] || availabilityMap["Неналичен"],
      seller: {
        "@type": "Organization",
        name: "Песнопоец Клима",
      },
    },
  };

  if (product.gallery.length > 0) {
    jsonLd.image = product.gallery;
  }

  if (product.barcode) {
    const firstBarcode = product.barcode.split(",")[0]?.trim();
    if (firstBarcode && /^\d{8,14}$/.test(firstBarcode)) {
      jsonLd.gtin13 = firstBarcode;
    }
  }

  // Add promo price
  if (product.is_promo && product.price_promo && product.price_promo > 0) {
    const promoEUR = product.price_promo.toFixed(2);
    (jsonLd.offers as Record<string, unknown>).price = promoEUR;
    (jsonLd.offers as Record<string, unknown>).priceSpecification = {
      "@type": "PriceSpecification",
      price: promoEUR,
      priceCurrency: "EUR",
    };
  }

  return jsonLd;
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function generateOrganizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Песнопоец Клима",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "BG",
      availableLanguage: ["Bulgarian", "English", "Russian", "Ukrainian"],
    },
  };
}
