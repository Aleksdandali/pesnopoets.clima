import Image from "next/image";

type Locale = "bg" | "en" | "ru" | "ua";
type PhotoTag = "install" | "outdoor" | "maintenance" | "detail" | "brand";

interface Photo {
  src: string;
  width: number;
  height: number;
  tags: PhotoTag[];
  alt: Record<Locale, string>;
}

const PHOTOS: Photo[] = [
  {
    src: "/portfolio/01-hero-install-wood-wall.jpg",
    width: 1200, height: 1600, tags: ["install", "detail"],
    alt: {
      bg: "Завършен монтаж на климатик на стена с дървени ламели във Варна",
      en: "Finished AC installation on slatted wood wall in Varna",
      ru: "Завершённый монтаж кондиционера на стене с деревянными рейками во Варне",
      ua: "Завершений монтаж кондиціонера на стіні з дерев'яними рейками у Варні",
    },
  },
  {
    src: "/portfolio/02-branded-sticker.jpg",
    width: 1200, height: 1600, tags: ["brand", "detail"],
    alt: {
      bg: "Брандиран стикер Песнопоец Клима върху монтиран климатик с телефон за сервиз",
      en: "Branded Pesnopoets Clima sticker on installed AC with service phone",
      ru: "Брендированная наклейка Песнопоец Клима на установленном кондиционере с телефоном сервиса",
      ua: "Брендований стікер Песнопоец Клима на встановленому кондиціонері з телефоном сервісу",
    },
  },
  {
    src: "/portfolio/03-master-orange-install.jpg",
    width: 1200, height: 1600, tags: ["install", "maintenance"],
    alt: {
      bg: "Майстор от Песнопоец Клима в брандирана униформа монтира климатик",
      en: "Pesnopoets Clima technician in branded uniform installing an air conditioner",
      ru: "Мастер Песнопоец Клима в брендированной форме устанавливает кондиционер",
      ua: "Майстер Песнопоец Клима у брендованій формі встановлює кондиціонер",
    },
  },
  {
    src: "/portfolio/04-outdoor-mountain-view.jpg",
    width: 1200, height: 1600, tags: ["outdoor", "maintenance"],
    alt: {
      bg: "Монтаж на външно тяло на балкон с гледка във Варненска област",
      en: "Outdoor AC unit installation on a balcony overlooking Varna region",
      ru: "Монтаж внешнего блока на балконе с видом во Варненской области",
      ua: "Монтаж зовнішнього блоку на балконі з видом у Варненській області",
    },
  },
  {
    src: "/portfolio/05-maintenance-inside.jpg",
    width: 1200, height: 1600, tags: ["maintenance", "detail"],
    alt: {
      bg: "Профилактика на климатик — почистване на вътрешен блок",
      en: "AC maintenance — cleaning the indoor unit",
      ru: "Профилактика кондиционера — чистка внутреннего блока",
      ua: "Профілактика кондиціонера — чищення внутрішнього блоку",
    },
  },
  {
    src: "/portfolio/06-bracket-level-precision.jpg",
    width: 1200, height: 1600, tags: ["install", "detail"],
    alt: {
      bg: "Точно нивелиране на конзолата за монтаж на климатик с уред за нивелиране",
      en: "Precise bracket alignment for AC installation using a spirit level",
      ru: "Точное выравнивание кронштейна для монтажа кондиционера с уровнем",
      ua: "Точне вирівнювання кронштейна для монтажу кондиціонера з рівнем",
    },
  },
  {
    src: "/portfolio/07-gree-outdoor-balcony.jpg",
    width: 1200, height: 1600, tags: ["outdoor", "brand"],
    alt: {
      bg: "Външно тяло Gree, монтирано на балкон с панорамна гледка",
      en: "Gree outdoor unit installed on a balcony with panoramic view",
      ru: "Внешний блок Gree, установленный на балконе с панорамным видом",
      ua: "Зовнішній блок Gree, встановлений на балконі з панорамним видом",
    },
  },
  {
    src: "/portfolio/08-ac-internals-service.jpg",
    width: 1200, height: 1600, tags: ["maintenance", "detail"],
    alt: {
      bg: "Разглобяване и сервиз на вътрешен блок климатик при профилактика",
      en: "Indoor AC unit disassembly during scheduled maintenance",
      ru: "Разборка и сервис внутреннего блока кондиционера при профилактике",
      ua: "Розбирання та сервіс внутрішнього блоку кондиціонера при профілактиці",
    },
  },
  {
    src: "/portfolio/09-master-from-behind.jpg",
    width: 1200, height: 1600, tags: ["install", "maintenance"],
    alt: {
      bg: "Майстор завършва монтажа на климатика — преглед на готовия монтаж",
      en: "Technician finishing AC installation — final inspection",
      ru: "Мастер завершает монтаж кондиционера — проверка готового монтажа",
      ua: "Майстер завершує монтаж кондиціонера — перевірка готового монтажу",
    },
  },
  {
    src: "/portfolio/10-pipe-flaring-tool.jpg",
    width: 1200, height: 1600, tags: ["install", "detail"],
    alt: {
      bg: "Развалцоване на медни тръби с професионален инструмент при монтаж на климатик",
      en: "Flaring copper pipes with a professional tool during AC installation",
      ru: "Развальцовка медных труб профессиональным инструментом при монтаже кондиционера",
      ua: "Розвальцовування мідних труб професійним інструментом при монтажі кондиціонера",
    },
  },
  {
    src: "/portfolio/11-bracket-mounted-level.jpg",
    width: 1200, height: 1600, tags: ["install", "detail"],
    alt: {
      bg: "Монтирана конзола за вътрешен блок климатик — нивото е проверено",
      en: "Installed indoor AC bracket — level verified",
      ru: "Установленный кронштейн для внутреннего блока — уровень проверен",
      ua: "Встановлений кронштейн для внутрішнього блоку — рівень перевірено",
    },
  },
  {
    src: "/portfolio/12-gree-outdoor-service.jpg",
    width: 1200, height: 1600, tags: ["outdoor", "maintenance", "brand"],
    alt: {
      bg: "Сервиз на външно тяло Gree във Варненския район",
      en: "Servicing a Gree outdoor unit in the Varna region",
      ru: "Сервис внешнего блока Gree в Варненской области",
      ua: "Сервіс зовнішнього блоку Gree у Варненській області",
    },
  },
];

const HEADINGS: Record<Locale, { title: string; subtitle: string }> = {
  bg: {
    title: "Наши работи във Варна",
    subtitle: "Реални монтажи и профилактики, изпълнени от собствения ни екип",
  },
  en: {
    title: "Our work in Varna",
    subtitle: "Real installations and maintenance jobs done by our own team",
  },
  ru: {
    title: "Наши работы во Варне",
    subtitle: "Реальные монтажи и профилактика, выполненные нашей бригадой",
  },
  ua: {
    title: "Наші роботи у Варні",
    subtitle: "Реальні монтажі та профілактика, виконані нашою бригадою",
  },
};

interface Props {
  locale: string;
  /** Filter photos by tag(s). When omitted, all photos shown. */
  tags?: PhotoTag[];
  /** Cap number of photos shown (after tag filter). */
  limit?: number;
  /** Custom heading override; if not given uses default per-locale heading. */
  heading?: { title: string; subtitle?: string };
}

export default function PortfolioGallery({ locale, tags, limit, heading }: Props) {
  const loc: Locale = (["bg", "en", "ru", "ua"] as const).includes(locale as Locale)
    ? (locale as Locale)
    : "bg";
  const h = heading ?? HEADINGS[loc];

  const filtered = tags
    ? PHOTOS.filter((p) => tags.some((t) => p.tags.includes(t)))
    : PHOTOS;
  const items = limit ? filtered.slice(0, limit) : filtered;

  // ImageObject JSON-LD for AIO citation value — declares each image with caption + locale
  const imageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: h.title,
    image: items.map((p) => ({
      "@type": "ImageObject",
      contentUrl: p.src,
      caption: p.alt[loc],
      creditText: "Песнопоец Клима",
      copyrightNotice: "Pesnopoets Clima",
    })),
  };

  return (
    <section className="border-t border-border/40 bg-gradient-to-b from-white to-[#fafbfc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{h.title}</h2>
          {h.subtitle && (
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {h.subtitle}
            </p>
          )}
          <div className="mt-3 mx-auto w-10 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((photo) => (
            <figure
              key={photo.src}
              className="group relative rounded-2xl overflow-hidden bg-muted/40 border border-border/40 shadow-[0_2px_12px_rgb(0_0_0/0.03)] hover:shadow-[0_12px_32px_rgb(0_0_0/0.08)] transition-shadow duration-300"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={photo.src}
                  alt={photo.alt[loc]}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
              <figcaption className="sr-only">{photo.alt[loc]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageJsonLd) }}
      />
    </section>
  );
}
