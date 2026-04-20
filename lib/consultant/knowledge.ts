/**
 * Static knowledge base for the AI consultant.
 * Manually curated — the model pulls from here via get_faq tool.
 * Extend freely; no redeploy of the model, only of the code.
 */

export interface FAQEntry {
  id: string;
  keywords: string[]; // used by get_faq tool for matching
  q: Record<"bg" | "en" | "ru" | "ua", string>;
  a: Record<"bg" | "en" | "ru" | "ua", string>;
}

export const FAQ: FAQEntry[] = [
  {
    id: "warranty",
    keywords: ["гаранция", "warranty", "гарантия", "гарантія"],
    q: {
      bg: "Каква е гаранцията?",
      en: "What is the warranty?",
      ru: "Какая гарантия?",
      ua: "Яка гарантія?",
    },
    a: {
      bg: "Официална гаранция от производителя 3 години на климатика. При извършен монтаж от нашия екип — 2 години гаранция на монтажа. Обслужване на гаранционни случаи — във Варна.",
      en: "Official manufacturer warranty of 3 years on the unit. When installed by our team — 2 years warranty on the installation. Warranty service handled in Varna.",
      ru: "Официальная гарантия производителя 3 года на климатик. При монтаже нашей бригадой — 2 года гарантии на монтаж. Гарантийное обслуживание — в Варне.",
      ua: "Офіційна гарантія виробника 3 роки на кондиціонер. При монтажі нашою бригадою — 2 роки гарантії на монтаж. Гарантійне обслуговування — у Варні.",
    },
  },
  {
    id: "install-price",
    keywords: ["монтаж", "install", "монтаж", "цена монтажа", "installation"],
    q: {
      bg: "Колко струва монтажът?",
      en: "How much does installation cost?",
      ru: "Сколько стоит монтаж?",
      ua: "Скільки коштує монтаж?",
    },
    a: {
      bg: "Стандартен монтаж на сплит система: 250–400 лв. в зависимост от сложността (етаж, дължина на трасето, наличие на готови отвори). Демонтаж на стар климатик: 80–120 лв. Точната цена — след оглед или по снимки.",
      en: "Standard split system installation: 250–400 BGN depending on complexity (floor, pipe length, existing holes). Old unit removal: 80–120 BGN. Exact price after on-site visit or photos.",
      ru: "Стандартный монтаж сплит-системы: 250–400 лв. в зависимости от сложности (этаж, длина трассы, наличие отверстий). Демонтаж старого: 80–120 лв. Точная цена — после осмотра или по фото.",
      ua: "Стандартний монтаж спліт-системи: 250–400 лв. залежно від складності (поверх, довжина траси, наявність отворів). Демонтаж старого: 80–120 лв. Точна ціна — після огляду або за фото.",
    },
  },
  {
    id: "delivery-time",
    keywords: ["срок", "когда", "доставка", "delivery", "when", "коли", "за сколько"],
    q: {
      bg: "Колко бързо можете да монтирате?",
      en: "How fast can you install?",
      ru: "Как быстро можете приехать?",
      ua: "Як швидко можете приїхати?",
    },
    a: {
      bg: "Ако климатикът е наличен на склад и заявката е до обяд — монтаж в същия или следващия ден. При поръчка от доставчик — 2–5 работни дни.",
      en: "If the unit is in stock and the request is before noon — installation same or next day. If ordered from supplier — 2–5 business days.",
      ru: "Если климатик в наличии и заявка до обеда — монтаж в тот же или следующий день. Под заказ — 2–5 рабочих дней.",
      ua: "Якщо кондиціонер у наявності та заявка до обіду — монтаж того ж або наступного дня. Під замовлення — 2–5 робочих днів.",
    },
  },
  {
    id: "coverage-area",
    keywords: ["варна", "varna", "регион", "area", "район", "где", "де"],
    q: {
      bg: "В кои райони работите?",
      en: "Which areas do you serve?",
      ru: "В каких районах работаете?",
      ua: "В яких районах працюєте?",
    },
    a: {
      bg: "Варна и областта: всички квартали (Чайка, Виница, Аспарухово, Владиславово, Младост, Левски, център). Извън града — по договаряне (обикновено до 30 км).",
      en: "Varna city and region: all neighborhoods (Chayka, Vinitsa, Asparuhovo, Vladislavovo, Mladost, Levski, center). Outside city — by arrangement (usually up to 30 km).",
      ru: "Варна и область: все кварталы (Чайка, Виница, Аспарухово, Владиславово, Младост, Левски, центр). За городом — по договорённости (обычно до 30 км).",
      ua: "Варна та область: усі квартали (Чайка, Вініца, Аспарухово, Владіславово, Младость, Левскі, центр). За містом — за домовленістю (зазвичай до 30 км).",
    },
  },
  {
    id: "payment",
    keywords: ["плащане", "payment", "оплата", "оплата", "рассрочка", "карта", "брой"],
    q: {
      bg: "Как мога да платя?",
      en: "Payment options?",
      ru: "Как можно оплатить?",
      ua: "Як можна оплатити?",
    },
    a: {
      bg: "В брой при доставка/монтаж, по банков път, с карта на място. За разсрочено плащане — обсъждаме индивидуално.",
      en: "Cash on delivery/installation, bank transfer, card on-site. Installments — discussed individually.",
      ru: "Наличные при доставке/монтаже, банковский перевод, карта на месте. Рассрочка — обсуждается индивидуально.",
      ua: "Готівкою при доставці/монтажі, банківський переказ, картка на місці. Розстрочка — обговорюється індивідуально.",
    },
  },
  {
    id: "inverter-explained",
    keywords: ["инвертор", "inverter", "что такое", "щo таке"],
    q: {
      bg: "Какво е инверторен климатик?",
      en: "What is an inverter AC?",
      ru: "Что такое инверторный климатик?",
      ua: "Що таке інверторний кондиціонер?",
    },
    a: {
      bg: "Инверторният компресор работи плавно — не се включва и изключва на пълна мощност. Резултат: 30–50% по-малко ток, по-тихо, по-равномерна температура. Почти всички наши модели са инверторни.",
      en: "Inverter compressor runs smoothly — doesn't cycle on/off at full power. Result: 30–50% less electricity, quieter, more stable temperature. Almost all our models are inverter.",
      ru: "Инверторный компрессор работает плавно — не включается/выключается на полную мощность. Результат: 30–50% меньше электричества, тише, стабильнее температура. Почти все наши модели инверторные.",
      ua: "Інверторний компресор працює плавно — не вмикається/вимикається на повну потужність. Результат: 30–50% менше електрики, тихіше, стабільніша температура. Майже всі наші моделі інверторні.",
    },
  },
  {
    id: "multi-split",
    keywords: ["мулти", "multi", "несколько комнат", "кілька кімнат", "multi-split"],
    q: {
      bg: "Мога ли един външен блок да обслужва няколко стаи?",
      en: "Can one outdoor unit serve multiple rooms?",
      ru: "Может ли один внешний блок обслуживать несколько комнат?",
      ua: "Чи може один зовнішній блок обслуговувати кілька кімнат?",
    },
    a: {
      bg: "Да, това е мулти-сплит система: един външен блок + 2–5 вътрешни в различни стаи. Икономия на място на балкона и по-естетично. Пишете какви стаи имате — ще предложа подходяща конфигурация.",
      en: "Yes, this is a multi-split system: one outdoor + 2–5 indoor units in different rooms. Saves balcony space and looks cleaner. Tell me your rooms — I'll suggest a configuration.",
      ru: "Да, это мульти-сплит система: один внешний + 2–5 внутренних блоков в разных комнатах. Экономит место на балконе и выглядит аккуратнее. Напишите какие комнаты — предложу конфигурацию.",
      ua: "Так, це мульти-спліт система: один зовнішній + 2–5 внутрішніх блоків у різних кімнатах. Економить місце на балконі та виглядає акуратніше. Напишіть які кімнати — запропоную конфігурацію.",
    },
  },
  {
    id: "noise-levels",
    keywords: ["шум", "noise", "тихий", "тихо", "quiet", "db"],
    q: {
      bg: "Колко шумен е климатикът?",
      en: "How noisy is an AC?",
      ru: "Насколько шумный климатик?",
      ua: "Наскільки шумний кондиціонер?",
    },
    a: {
      bg: "Ориентири: <22 dB — шепот (идеално за спалня), 22–28 dB — тих разговор (OK за хол), 28–35 dB — нормална стая, >35 dB — усеща се. За детска/спалня търсете модел <25 dB на минимални обороти.",
      en: "Reference: <22 dB — whisper (ideal for bedroom), 22–28 dB — quiet conversation (OK for living room), 28–35 dB — normal room, >35 dB — noticeable. For kids room/bedroom look for <25 dB at min speed.",
      ru: "Ориентиры: <22 dB — шёпот (идеально для спальни), 22–28 dB — тихий разговор (OK для гостиной), 28–35 dB — обычная комната, >35 dB — слышно. Для детской/спальни ищите <25 dB на минимуме.",
      ua: "Орієнтири: <22 dB — шепіт (ідеально для спальні), 22–28 dB — тиха розмова (OK для вітальні), 28–35 dB — звичайна кімната, >35 dB — чутно. Для дитячої/спальні шукайте <25 dB на мінімумі.",
    },
  },
];

/**
 * BTU selection rules. These are widely-accepted HVAC rules of thumb for residential spaces.
 * Returns recommended BTU range for the given area + conditions.
 */
export function recommendBTU(input: {
  area_m2: number;
  orientation?: "north" | "south" | "east" | "west" | "unknown";
  top_floor?: boolean;
  insulation?: "good" | "average" | "poor";
  occupants?: number;
  heat_sources?: boolean; // kitchen nearby, many electronics
  ceiling_height_m?: number;
}): { min: number; recommended: number; max: number; notes: string[] } {
  // Base: 100 W per m² for typical residential → 1000 BTU per 3 m²
  // Rule of thumb: 1 kW ≈ 3413 BTU, industry uses ~340 BTU per m² as baseline
  const baseBTU = Math.round(input.area_m2 * 340);
  let multiplier = 1.0;
  const notes: string[] = [];

  if (input.orientation === "south" || input.orientation === "west") {
    multiplier += 0.15;
    notes.push("+15% за южна/западна страна");
  }
  if (input.top_floor) {
    multiplier += 0.1;
    notes.push("+10% за последен етаж");
  }
  if (input.insulation === "poor") {
    multiplier += 0.2;
    notes.push("+20% за лоша изолация");
  } else if (input.insulation === "good") {
    multiplier -= 0.1;
    notes.push("-10% за добра изолация");
  }
  if ((input.occupants ?? 1) > 2) {
    multiplier += 0.05 * (input.occupants! - 2);
    notes.push(`+${5 * (input.occupants! - 2)}% за повече хора`);
  }
  if (input.heat_sources) {
    multiplier += 0.1;
    notes.push("+10% за кухня/електроника наблизо");
  }
  if (input.ceiling_height_m && input.ceiling_height_m > 2.8) {
    multiplier += 0.05 * Math.ceil((input.ceiling_height_m - 2.8) / 0.3);
    notes.push("+5% за всеки 30 см таван над 2.8 м");
  }

  const recommended = Math.round(baseBTU * multiplier);
  // Common market sizes: 9K, 12K, 18K, 24K, 36K, 48K
  const marketSizes = [9000, 12000, 18000, 24000, 36000, 48000];
  const closest = marketSizes.find((s) => s >= recommended) ?? 48000;
  const prev = marketSizes[Math.max(0, marketSizes.indexOf(closest) - 1)];

  return {
    min: prev,
    recommended: closest,
    max: marketSizes[Math.min(marketSizes.length - 1, marketSizes.indexOf(closest) + 1)],
    notes,
  };
}

export function findFAQByKeywords(query: string, locale: "bg" | "en" | "ru" | "ua"): FAQEntry[] {
  const q = query.toLowerCase();
  return FAQ.filter((f) => f.keywords.some((k) => q.includes(k.toLowerCase())))
    .slice(0, 3)
    .map((f) => ({
      ...f,
      q: { ...f.q, [locale]: f.q[locale] },
      a: { ...f.a, [locale]: f.a[locale] },
    }));
}
