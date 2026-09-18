/**
 * Model-specific copy for product pages, derived from the SKU's own specs.
 *
 * Every product page used to carry the same generic FAQ and the supplier's
 * (bittel.bg) description, which Google treats as near-duplicate content —
 * GSC 2026-09-18 showed 214 BG product URLs "discovered, not indexed". This
 * module turns btu / area / noise / SEER / SCOP / kW into text that differs
 * per model: what rooms it fits, what it costs to run, what it costs
 * installed, and a FAQ with the model's own numbers.
 *
 * Electricity assumptions match the blog post "electricity-cost-ac-varna":
 * cost = kW × hours × price ÷ SEER, 8 h/day, 0.27 лв/kWh.
 */

import { EUR_TO_BGN } from "@/lib/pricing";

export type InsightLocale = "bg" | "en" | "ru" | "ua";

interface FeatureItem {
  name: string;
  value: string;
}
interface FeatureGroup {
  name?: string;
  items?: FeatureItem[];
}

export interface InsightProduct {
  btu?: number | null;
  area_m2?: number | null;
  noise_db_indoor?: number | null;
  energy_class?: string | null;
  seer?: number | null;
  scop?: number | null;
  refrigerant?: string | null;
  warranty_months?: number | null;
  manufacturer: string;
  features?: Record<string, FeatureGroup> | null;
}

export interface ModelInsights {
  /** Short, spec-derived paragraphs (2–4). */
  paragraphs: string[];
  /** Model-specific FAQ items with the SKU's own numbers. */
  faq: Array<{ q: string; a: string }>;
  /** Spec-derived facts reused by the schema layer. */
  facts: {
    coolingKw: number | null;
    heatingKw: number | null;
    heatingMinTemp: number | null;
    monthlyCoolingEur: number | null;
  };
}

const HOURS_PER_DAY = 8;
const DAYS_PER_MONTH = 30;
const BGN_PER_KWH = 0.27;

function findFeature(features: InsightProduct["features"], needle: RegExp): string | null {
  if (!features) return null;
  for (const group of Object.values(features)) {
    for (const item of group.items ?? []) {
      if (needle.test(item.name)) return item.value;
    }
  }
  return null;
}

/** "0.9 / 3.5 / 4.0 kW" → 3.5 (the nominal, middle value). */
function nominalKw(value: string | null): number | null {
  if (!value) return null;
  const nums = value.match(/-?\d+(?:[.,]\d+)?/g)?.map((n) => parseFloat(n.replace(",", ".")));
  if (!nums || nums.length === 0) return null;
  const n = nums.length >= 3 ? nums[1] : nums[0];
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** "-15 ~ 24 °C" → -15 */
function minTemp(value: string | null): number | null {
  if (!value) return null;
  const m = value.match(/-?\d+/);
  return m ? parseInt(m[0], 10) : null;
}

function fmt(n: number, digits = 0): string {
  return n.toFixed(digits).replace(".", ",");
}

/**
 * "Инверторен климатик Mitsubishi Heavy Industries SRK35ZS-W + SRC35ZS-W"
 * → "Mitsubishi Heavy Industries SRK35ZS-W": drop the generic type prefix
 * and the outdoor-unit code so the name reads naturally inside a sentence.
 */
export function shortModelName(title: string, manufacturer: string): string {
  let name = title;
  const idx = manufacturer ? title.toLowerCase().indexOf(manufacturer.toLowerCase()) : -1;
  if (idx > 0) name = title.slice(idx);
  name = name.split(/\s\+\s|\s\/\s/)[0].trim();
  return name || title;
}

export function buildModelInsights(
  product: InsightProduct,
  locale: string,
  modelName: string,
  priceEur: number,
  installEur: number
): ModelInsights {
  const l: InsightLocale = (["bg", "en", "ru", "ua"] as const).includes(locale as InsightLocale)
    ? (locale as InsightLocale)
    : "bg";

  const coolingKw =
    nominalKw(findFeature(product.features, /отдавана мощност на охлаждане/i)) ??
    (product.btu ? Math.round((product.btu * 0.293) / 100) / 10 : null);
  const heatingKw = nominalKw(findFeature(product.features, /отдавана мощност на отопление/i));
  const heatingMinTemp = minTemp(findFeature(product.features, /работна температура на отопление/i));

  const monthlyCoolingEur =
    coolingKw && product.seer
      ? (coolingKw * HOURS_PER_DAY * DAYS_PER_MONTH * BGN_PER_KWH) / product.seer / EUR_TO_BGN
      : null;

  const area = product.area_m2 ?? null;
  const noise = product.noise_db_indoor ?? null;
  const totalEur = priceEur + installEur;
  const warrantyYears = product.warranty_months ? Math.round(product.warranty_months / 12) : null;
  const brand = product.manufacturer;

  const paragraphs: string[] = [];
  const faq: Array<{ q: string; a: string }> = [];

  if (l === "bg") {
    if (area && product.btu) {
      paragraphs.push(
        `${modelName} е ${fmt(product.btu / 1000)}-хиляден BTU модел за помещения до ${area} кв.м — ` +
          (area <= 20
            ? "спалня, детска стая или малък кабинет."
            : area <= 30
            ? "хол, голяма спалня или офис за 2–3 работни места."
            : area <= 45
            ? "хол с трапезария, студио или търговско помещение."
            : "open space, зала или по-голям търговски обект.") +
          (noise
            ? noise <= 21
              ? ` С ${noise} dB на най-ниска степен вътрешното тяло е практически безшумно — подходящ е и за спалня.`
              : noise <= 26
              ? ` Шумът на вътрешното тяло е ${noise} dB — тих за дневна и приемлив за спалня при нощен режим.`
              : ` Шумът на вътрешното тяло е ${noise} dB — добре за дневна или офис, за спалня препоръчваме по-тих модел.`
            : "")
      );
    }
    if (product.seer && monthlyCoolingEur) {
      paragraphs.push(
        `Енергиен клас ${product.energy_class ?? "—"}, SEER ${fmt(product.seer, 1)}${product.scop ? ` и SCOP ${fmt(product.scop, 1)}` : ""}. ` +
          `При 8 часа работа на ден и цена 0,27 лв/kWh охлаждането излиза около ${fmt(monthlyCoolingEur)} € (${fmt(monthlyCoolingEur * EUR_TO_BGN)} лв.) на месец.` +
          (heatingKw && heatingMinTemp !== null && heatingMinTemp <= -10
            ? ` Отоплителна мощност ${fmt(heatingKw, 1)} kW и работа до ${heatingMinTemp} °C — за варненската зима това е основно отопление, не само допълнение.`
            : heatingKw
            ? ` Отоплителна мощност ${fmt(heatingKw, 1)} kW — достатъчна за отопление през по-голямата част от варненската зима.`
            : "")
      );
    }
    paragraphs.push(
      `С монтаж във Варна цената е ${fmt(totalEur)} € с ДДС: ${fmt(priceEur)} € за уреда и ${fmt(installEur)} € за стандартен монтаж (3 м медна тръба, всички материали, вакуумиране и пуск). ` +
        `Доставка и монтаж — от собствен екип, до 3 дни след заявка${warrantyYears ? `, гаранция на уреда ${warrantyYears} г.` : ""} и 12 месеца гаранция на монтажа.`
    );

    faq.push({
      q: `Колко струва ${modelName} с монтаж във Варна?`,
      a: `${fmt(totalEur)} € с ДДС — ${fmt(priceEur)} € за климатика плюс ${fmt(installEur)} € стандартен монтаж. Ако трасето е над 3 м или има нестандартен монтаж, цената се уточнява при безплатен оглед.`,
    });
    if (area) {
      faq.push({
        q: `За каква стая е подходящ ${modelName}?`,
        a: `За помещения до ${area} кв.м при стандартна височина на тавана. При южно изложение, голямо остъкляване или последен етаж препоръчваме следващата мощност.`,
      });
    }
    if (monthlyCoolingEur && product.seer) {
      faq.push({
        q: `Колко ток харчи ${modelName}?`,
        a: `Около ${fmt(monthlyCoolingEur)} € (${fmt(monthlyCoolingEur * EUR_TO_BGN)} лв.) на месец при 8 часа дневно охлаждане и 0,27 лв/kWh — благодарение на SEER ${fmt(product.seer, 1)}. При нощен тариф или режим Sleep сметката е по-ниска.`,
      });
    }
    if (heatingKw) {
      faq.push({
        q: `Може ли ${modelName} да отоплява през зимата?`,
        a: heatingMinTemp !== null
          ? `Да — отоплителна мощност ${fmt(heatingKw, 1)} kW и работа при външна температура до ${heatingMinTemp} °C. Във Варна това покрива практически цялата зима.`
          : `Да — отоплителна мощност ${fmt(heatingKw, 1)} kW${product.scop ? ` при SCOP ${fmt(product.scop, 1)}` : ""}, подходящ за основно отопление при варненския климат.`,
      });
    }
    faq.push({
      q: `Каква е гаранцията на ${brand} при монтаж от Песнопоец Клима?`,
      a: `${warrantyYears ? `${warrantyYears} години гаранция от производителя` : "Гаранция от производителя по стандарта на марката"} при монтаж от оторизиран екип, плюс 12 месеца гаранция на самия монтаж. Годишната профилактика запазва гаранцията.`,
    });
  } else if (l === "en") {
    if (area && product.btu) {
      paragraphs.push(
        `${modelName} is a ${fmt(product.btu / 1000)}k BTU unit for rooms up to ${area} m² — ` +
          (area <= 20 ? "a bedroom, kids' room or small office." : area <= 30 ? "a living room, large bedroom or a 2–3 desk office." : area <= 45 ? "a living/dining room, studio or small shop." : "an open space, hall or larger commercial premises.") +
          (noise ? (noise <= 21 ? ` At ${noise} dB on the lowest fan speed the indoor unit is practically silent — fine for a bedroom.` : noise <= 26 ? ` Indoor noise is ${noise} dB — quiet for a living room, acceptable for a bedroom in night mode.` : ` Indoor noise is ${noise} dB — good for a living room or office; for a bedroom pick a quieter model.`) : "")
      );
    }
    if (product.seer && monthlyCoolingEur) {
      paragraphs.push(
        `Energy class ${product.energy_class ?? "—"}, SEER ${fmt(product.seer, 1)}${product.scop ? ` and SCOP ${fmt(product.scop, 1)}` : ""}. ` +
          `At 8 hours a day and 0.27 BGN/kWh, cooling costs about €${fmt(monthlyCoolingEur)} a month.` +
          (heatingKw && heatingMinTemp !== null && heatingMinTemp <= -10 ? ` Heating output ${fmt(heatingKw, 1)} kW down to ${heatingMinTemp} °C — in Varna's winter that is primary heating, not a backup.` : heatingKw ? ` Heating output ${fmt(heatingKw, 1)} kW — enough for most of the Varna winter.` : "")
      );
    }
    paragraphs.push(
      `Installed in Varna it costs €${fmt(totalEur)} incl. VAT: €${fmt(priceEur)} for the unit and €${fmt(installEur)} for standard installation (3 m copper pipe, all materials, vacuum and commissioning). ` +
        `Delivery and installation by our own crew, within 3 days of the order${warrantyYears ? `, ${warrantyYears}-year manufacturer warranty` : ""} and 12 months on the installation.`
    );
    faq.push({ q: `How much does ${modelName} cost installed in Varna?`, a: `€${fmt(totalEur)} incl. VAT — €${fmt(priceEur)} for the unit plus €${fmt(installEur)} standard installation. Pipe runs over 3 m or non-standard mounting are quoted after a free site visit.` });
    if (area) faq.push({ q: `What room size is ${modelName} for?`, a: `Rooms up to ${area} m² with standard ceiling height. For south-facing rooms, large glazing or a top floor we recommend the next capacity up.` });
    if (monthlyCoolingEur && product.seer) faq.push({ q: `How much electricity does ${modelName} use?`, a: `About €${fmt(monthlyCoolingEur)} a month at 8 hours of cooling a day and 0.27 BGN/kWh, thanks to SEER ${fmt(product.seer, 1)}. Night tariff or Sleep mode lowers it further.` });
    if (heatingKw) faq.push({ q: `Can ${modelName} heat in winter?`, a: heatingMinTemp !== null ? `Yes — ${fmt(heatingKw, 1)} kW heating output and operation down to ${heatingMinTemp} °C outdoor. In Varna that covers practically the whole winter.` : `Yes — ${fmt(heatingKw, 1)} kW heating output${product.scop ? ` at SCOP ${fmt(product.scop, 1)}` : ""}, suitable as primary heating in Varna's climate.` });
    faq.push({ q: `What warranty does ${brand} carry when installed by Pesnopoets Clima?`, a: `${warrantyYears ? `${warrantyYears} years manufacturer warranty` : "The brand's standard manufacturer warranty"} with authorised installation, plus 12 months on the installation itself. Annual maintenance keeps the warranty valid.` });
  } else if (l === "ru") {
    if (area && product.btu) {
      paragraphs.push(
        `${modelName} — модель на ${fmt(product.btu / 1000)} тыс. BTU для помещений до ${area} м² — ` +
          (area <= 20 ? "спальня, детская или небольшой кабинет." : area <= 30 ? "гостиная, большая спальня или офис на 2–3 места." : area <= 45 ? "гостиная со столовой, студия или торговое помещение." : "open space, зал или крупный коммерческий объект.") +
          (noise ? (noise <= 21 ? ` При ${noise} дБ на минимальной скорости внутренний блок практически бесшумен — подходит и для спальни.` : noise <= 26 ? ` Шум внутреннего блока ${noise} дБ — тихо для гостиной, приемлемо для спальни в ночном режиме.` : ` Шум внутреннего блока ${noise} дБ — хорошо для гостиной или офиса, для спальни советуем модель тише.`) : "")
      );
    }
    if (product.seer && monthlyCoolingEur) {
      paragraphs.push(
        `Класс энергоэффективности ${product.energy_class ?? "—"}, SEER ${fmt(product.seer, 1)}${product.scop ? ` и SCOP ${fmt(product.scop, 1)}` : ""}. ` +
          `При 8 часах работы в день и 0,27 лв/kWh охлаждение обходится примерно в ${fmt(monthlyCoolingEur)} € (${fmt(monthlyCoolingEur * EUR_TO_BGN)} лв.) в месяц.` +
          (heatingKw && heatingMinTemp !== null && heatingMinTemp <= -10 ? ` Мощность обогрева ${fmt(heatingKw, 1)} кВт и работа до ${heatingMinTemp} °C — для варненской зимы это основное отопление, а не дополнение.` : heatingKw ? ` Мощность обогрева ${fmt(heatingKw, 1)} кВт — хватает на большую часть варненской зимы.` : "")
      );
    }
    paragraphs.push(
      `С монтажом в Варне цена — ${fmt(totalEur)} € с НДС: ${fmt(priceEur)} € за кондиционер и ${fmt(installEur)} € за стандартный монтаж (3 м медной трубы, все материалы, вакуумирование и запуск). ` +
        `Доставка и монтаж своей бригадой, в течение 3 дней после заявки${warrantyYears ? `, гарантия производителя ${warrantyYears} г.` : ""} и 12 месяцев на монтаж.`
    );
    faq.push({ q: `Сколько стоит ${modelName} с монтажом в Варне?`, a: `${fmt(totalEur)} € с НДС — ${fmt(priceEur)} € за кондиционер плюс ${fmt(installEur)} € стандартный монтаж. Если трасса длиннее 3 м или монтаж нестандартный, цену уточняем после бесплатного осмотра.` });
    if (area) faq.push({ q: `Для какой комнаты подходит ${modelName}?`, a: `Для помещений до ${area} м² при стандартной высоте потолка. При южной стороне, большом остеклении или последнем этаже рекомендуем следующую мощность.` });
    if (monthlyCoolingEur && product.seer) faq.push({ q: `Сколько электричества потребляет ${modelName}?`, a: `Около ${fmt(monthlyCoolingEur)} € (${fmt(monthlyCoolingEur * EUR_TO_BGN)} лв.) в месяц при 8 часах охлаждения в день и 0,27 лв/kWh — благодаря SEER ${fmt(product.seer, 1)}. Ночной тариф и режим Sleep снижают расход.` });
    if (heatingKw) faq.push({ q: `Может ли ${modelName} отапливать зимой?`, a: heatingMinTemp !== null ? `Да — мощность обогрева ${fmt(heatingKw, 1)} кВт и работа при наружной температуре до ${heatingMinTemp} °C. В Варне это покрывает практически всю зиму.` : `Да — мощность обогрева ${fmt(heatingKw, 1)} кВт${product.scop ? ` при SCOP ${fmt(product.scop, 1)}` : ""}, подходит как основное отопление в варненском климате.` });
    faq.push({ q: `Какая гарантия на ${brand} при монтаже от Песнопоец Клима?`, a: `${warrantyYears ? `${warrantyYears} года гарантии производителя` : "Стандартная гарантия производителя"} при монтаже авторизованной бригадой плюс 12 месяцев на сам монтаж. Ежегодное обслуживание сохраняет гарантию.` });
  } else {
    if (area && product.btu) {
      paragraphs.push(
        `${modelName} — модель на ${fmt(product.btu / 1000)} тис. BTU для приміщень до ${area} м² — ` +
          (area <= 20 ? "спальня, дитяча або невеликий кабінет." : area <= 30 ? "вітальня, велика спальня або офіс на 2–3 місця." : area <= 45 ? "вітальня з їдальнею, студія або торгове приміщення." : "open space, зал або великий комерційний об'єкт.") +
          (noise ? (noise <= 21 ? ` При ${noise} дБ на мінімальній швидкості внутрішній блок практично безшумний — підходить і для спальні.` : noise <= 26 ? ` Шум внутрішнього блока ${noise} дБ — тихо для вітальні, прийнятно для спальні в нічному режимі.` : ` Шум внутрішнього блока ${noise} дБ — добре для вітальні чи офісу, для спальні радимо тихішу модель.`) : "")
      );
    }
    if (product.seer && monthlyCoolingEur) {
      paragraphs.push(
        `Клас енергоефективності ${product.energy_class ?? "—"}, SEER ${fmt(product.seer, 1)}${product.scop ? ` і SCOP ${fmt(product.scop, 1)}` : ""}. ` +
          `За 8 годин роботи на день і 0,27 лв/kWh охолодження коштує приблизно ${fmt(monthlyCoolingEur)} € (${fmt(monthlyCoolingEur * EUR_TO_BGN)} лв.) на місяць.` +
          (heatingKw && heatingMinTemp !== null && heatingMinTemp <= -10 ? ` Потужність обігріву ${fmt(heatingKw, 1)} кВт і робота до ${heatingMinTemp} °C — для варненської зими це основне опалення, а не доповнення.` : heatingKw ? ` Потужність обігріву ${fmt(heatingKw, 1)} кВт — вистачає на більшу частину варненської зими.` : "")
      );
    }
    paragraphs.push(
      `З монтажем у Варні ціна — ${fmt(totalEur)} € з ПДВ: ${fmt(priceEur)} € за кондиціонер і ${fmt(installEur)} € за стандартний монтаж (3 м мідної труби, всі матеріали, вакуумування та запуск). ` +
        `Доставка й монтаж власною бригадою, протягом 3 днів після заявки${warrantyYears ? `, гарантія виробника ${warrantyYears} р.` : ""} і 12 місяців на монтаж.`
    );
    faq.push({ q: `Скільки коштує ${modelName} з монтажем у Варні?`, a: `${fmt(totalEur)} € з ПДВ — ${fmt(priceEur)} € за кондиціонер плюс ${fmt(installEur)} € стандартний монтаж. Якщо траса довша за 3 м або монтаж нестандартний, ціну уточнюємо після безкоштовного огляду.` });
    if (area) faq.push({ q: `Для якої кімнати підходить ${modelName}?`, a: `Для приміщень до ${area} м² за стандартної висоти стелі. За південної сторони, великого скління або останнього поверху радимо наступну потужність.` });
    if (monthlyCoolingEur && product.seer) faq.push({ q: `Скільки електрики споживає ${modelName}?`, a: `Близько ${fmt(monthlyCoolingEur)} € (${fmt(monthlyCoolingEur * EUR_TO_BGN)} лв.) на місяць за 8 годин охолодження на день і 0,27 лв/kWh — завдяки SEER ${fmt(product.seer, 1)}. Нічний тариф і режим Sleep знижують витрату.` });
    if (heatingKw) faq.push({ q: `Чи може ${modelName} опалювати взимку?`, a: heatingMinTemp !== null ? `Так — потужність обігріву ${fmt(heatingKw, 1)} кВт і робота за зовнішньої температури до ${heatingMinTemp} °C. У Варні це покриває практично всю зиму.` : `Так — потужність обігріву ${fmt(heatingKw, 1)} кВт${product.scop ? ` при SCOP ${fmt(product.scop, 1)}` : ""}, підходить як основне опалення у варненському кліматі.` });
    faq.push({ q: `Яка гарантія на ${brand} при монтажі від Песнопоец Клима?`, a: `${warrantyYears ? `${warrantyYears} роки гарантії виробника` : "Стандартна гарантія виробника"} при монтажі авторизованою бригадою плюс 12 місяців на сам монтаж. Щорічне обслуговування зберігає гарантію.` });
  }

  return {
    paragraphs,
    faq,
    facts: { coolingKw, heatingKw, heatingMinTemp, monthlyCoolingEur },
  };
}

/** Category id → the static landing page that should receive the link equity. */
export function categoryLandingPath(categoryId: number | null | undefined): string {
  switch (categoryId) {
    case 1:
    case 2:
    case 13:
    case 14:
      return "/klimatici/inverter";
    case 3:
    case 5:
      return "/klimatici/multisplit";
    case 11:
    case 12:
      return "/klimatici/termopompa";
    case 6:
      return "/klimatici/kanalen";
    case 7:
      return "/klimatici/kasetachen";
    case 4:
      return "/klimatici/kolonen";
    default:
      return "/klimatici";
  }
}

/** Manufacturer → brand landing page, when one exists. */
export function brandLandingPath(manufacturer: string): string | null {
  const m = manufacturer.toLowerCase();
  if (m === "daikin") return "/daikin-varna";
  if (m === "mitsubishi") return "/mitsubishi-varna";
  if (m === "mitsubishi heavy") return "/marki/mitsubishi-heavy";
  if (m === "gree") return "/marki/gree";
  if (m === "toshiba") return "/marki/toshiba";
  if (m === "aux") return "/marki/aux";
  if (m === "nippon") return "/marki/nippon";
  if (m === "hitachi") return "/marki/hitachi";
  if (m === "lg") return "/marki/lg";
  if (m === "techpoint") return "/marki/techpoint";
  return null;
}
