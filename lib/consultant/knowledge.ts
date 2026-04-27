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
      bg: "До 5 години гаранция — пълна гаранция от производителя (Daikin, Mitsubishi, Gree и др.) при монтаж от нашата бригада във Варна. Плюс 12 месеца гаранция на самия монтаж. Гаранционното обслужване се извършва на място.",
      en: "Up to 5 years warranty — full manufacturer warranty (Daikin, Mitsubishi, Gree, etc.) when installed by our Varna crew. Plus 12 months warranty on the installation itself. Warranty service is handled on-site.",
      ru: "До 5 лет гарантии — полная гарантия производителя (Daikin, Mitsubishi, Gree и др.) при монтаже нашей бригадой во Варне. Плюс 12 месяцев гарантии на сам монтаж. Гарантийное обслуживание — на месте.",
      ua: "До 5 років гарантії — повна гарантія виробника (Daikin, Mitsubishi, Gree та ін.) при монтажі нашою бригадою у Варні. Плюс 12 місяців гарантії на сам монтаж. Гарантійне обслуговування — на місці.",
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
      bg: "Фиксирана цена за стандартен монтаж (включва 3 м трасе + всички материали + чист монтаж с прахосмукачка): до 14 000 BTU — 372 лв, до 24 000 BTU — 450 лв. Допълнителен метър трасе: 59–69 лв. Демонтаж/монтаж: от 63 лв (до 14K BTU) до 117 лв (15–24K BTU). Диагностика: 40 лв. Оглед на място: 49 лв (приспада се от поръчката). Без скрити разходи — точната цена се фиксира преди монтажа.",
      en: "Fixed price for standard install (includes 3 m pipe + all materials + clean install with vacuum): up to 14,000 BTU — 372 BGN, up to 24,000 BTU — 450 BGN. Extra pipe metre: 59–69 BGN. Dismantle/reinstall: from 63 BGN (up to 14K BTU) to 117 BGN (15–24K BTU). Diagnostics: 40 BGN. On-site inspection: 49 BGN (deducted from order). No hidden costs — exact price locked before work starts.",
      ru: "Фиксированная цена стандартного монтажа (3 м трассы + все материалы + чистый монтаж с пылесосом): до 14 000 BTU — 372 лв, до 24 000 BTU — 450 лв. Доп. метр трассы: 59–69 лв. Демонтаж/монтаж: от 63 лв (до 14K BTU) до 117 лв (15–24K BTU). Диагностика: 40 лв. Выезд на осмотр: 49 лв (вычитается из заказа). Без скрытых расходов — точная цена фиксируется до монтажа.",
      ua: "Фіксована ціна стандартного монтажу (3 м траси + усі матеріали + чистий монтаж з пилососом): до 14 000 BTU — 372 лв, до 24 000 BTU — 450 лв. Дод. метр траси: 59–69 лв. Демонтаж/монтаж: від 63 лв (до 14K BTU) до 117 лв (15–24K BTU). Діагностика: 40 лв. Виїзд на огляд: 49 лв (вираховується із замовлення). Без прихованих витрат — точна ціна фіксується до монтажу.",
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
      bg: "Посещение в същия ден при заявка до обяд — за Варна и област Варна. Ако климатикът трябва да се поръча от доставчик — 2–5 работни дни.",
      en: "Same-day visit when the request comes in before noon — across Varna city and region. If the unit must be ordered from the supplier — 2–5 business days.",
      ru: "Посещение в тот же день при заявке до обеда — по Варне и области. Если климатик нужно заказать у поставщика — 2–5 рабочих дней.",
      ua: "Візит того ж дня при заявці до обіду — по Варні та області. Якщо кондиціонер треба замовляти у постачальника — 2–5 робочих днів.",
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
    keywords: ["плащане", "payment", "оплата", "карта", "брой", "банк"],
    q: {
      bg: "Как мога да платя?",
      en: "Payment options?",
      ru: "Как можно оплатить?",
      ua: "Як можна оплатити?",
    },
    a: {
      bg: "В брой при доставка/монтаж, по банков път, с карта на място. Онлайн плащане още не е налично.",
      en: "Cash on delivery/installation, bank transfer, card on-site. Online payment is not available yet.",
      ru: "Наличные при доставке/монтаже, банковский перевод, карта на месте. Онлайн-оплата пока недоступна.",
      ua: "Готівкою при доставці/монтажі, банківський переказ, картка на місці. Онлайн-оплата поки недоступна.",
    },
  },
  {
    id: "commercial",
    keywords: [
      "офис", "office", "офіс", "магазин", "shop", "store", "ресторант", "restaurant",
      "хотел", "hotel", "готель", "бизнес", "business", "бізнес", "търговски",
      "коммерческий", "комерційний", "склад", "warehouse", "индустр", "industrial",
    ],
    q: {
      bg: "Работите ли с бизнес обекти — офиси, магазини, ресторанти?",
      en: "Do you work with commercial spaces — offices, shops, restaurants?",
      ru: "Работаете с коммерческими объектами — офисами, магазинами, ресторанами?",
      ua: "Працюєте з комерційними об'єктами — офісами, магазинами, ресторанами?",
    },
    a: {
      bg: "Да, работим и с бизнес обекти — офиси, магазини, ресторанти, хотели, складове. Предлагаме мулти-сплит, VRV/VRF системи и индустриални решения. За такива проекти правим безплатен оглед на място и даваме писмена оферта. Оставете телефон — ще се свържем.",
      en: "Yes, we work with commercial spaces — offices, shops, restaurants, hotels, warehouses. We offer multi-split, VRV/VRF systems and industrial solutions. For such projects we do a free on-site survey and provide a written quote. Leave your phone — we'll be in touch.",
      ru: "Да, работаем и с бизнес-объектами — офисы, магазины, рестораны, отели, склады. Предлагаем мульти-сплит, VRV/VRF системы и промышленные решения. По таким проектам делаем бесплатный осмотр и даём письменное предложение. Оставьте телефон — свяжемся.",
      ua: "Так, працюємо і з бізнес-об'єктами — офіси, магазини, ресторани, готелі, склади. Пропонуємо мульти-спліт, VRV/VRF системи та промислові рішення. По таких проєктах робимо безкоштовний огляд і даємо письмову пропозицію. Залиште телефон — зв'яжемося.",
    },
  },
  {
    id: "service-maintenance",
    keywords: [
      "профилактика", "обслужване", "поддръжка", "почистване", "ремонт",
      "сервис", "обслуживание", "чистка", "профилактика", "ремонт",
      "сервіс", "обслуговування", "чистка", "профілактика", "ремонт",
      "service", "maintenance", "cleaning", "refill", "freon", "фреон", "repair",
    ],
    q: {
      bg: "Предлагате ли сервиз и профилактика след монтажа?",
      en: "Do you offer service and maintenance after installation?",
      ru: "Предлагаете сервис и профилактику после монтажа?",
      ua: "Чи пропонуєте сервіс і профілактику після монтажу?",
    },
    a: {
      bg: "Да — предлагаме пълно обслужване след монтажа: 1) Годишна профилактика — пълно почистване на вътрешно и външно тяло, проверка на фреон, дезинфекция. От 70 лв. 2) Ремонт и диагностика (всички марки) — диагностика 40 лв., търсене на течове, смяна на компресор/платки, зареждане с R-32 / R-410A. Правилната профилактика веднъж годишно удължава живота на климатика с години.",
      en: "Yes — full post-install service: 1) Annual maintenance — full cleaning of indoor and outdoor units, freon check, disinfection. From 70 BGN. 2) Repair and diagnostics (all brands) — diagnostics 40 BGN, leak detection, compressor/board replacement, R-32 / R-410A refill. Annual maintenance extends unit life by years.",
      ru: "Да — полный сервис после монтажа: 1) Годовая профилактика — полная чистка внутреннего и внешнего блока, проверка фреона, дезинфекция. От 70 лв. 2) Ремонт и диагностика (все марки) — диагностика 40 лв., поиск утечек, замена компрессора/плат, заправка R-32 / R-410A. Регулярная профилактика продлевает срок службы на годы.",
      ua: "Так — повний сервіс після монтажу: 1) Річна профілактика — повне чищення внутрішнього і зовнішнього блоку, перевірка фреону, дезінфекція. Від 70 лв. 2) Ремонт і діагностика (усі марки) — діагностика 40 лв., пошук витоків, заміна компресора/плат, заправка R-32 / R-410A. Регулярна профілактика подовжує термін служби на роки.",
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
