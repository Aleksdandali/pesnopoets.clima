import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  FileText,
  Phone,
  Briefcase,
  Utensils,
  Stethoscope,
  ShoppingBag,
  ClipboardList,
  CalendarCheck2,
  FileSignature,
  XCircle,
} from "lucide-react";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import B2BContractForm from "@/components/forms/B2BContractForm";
import {
  B2B_PRICING_EUR,
  type B2BTier,
  B2B_MIN_UNITS,
  B2B_SURVEY_FEE_EUR,
} from "@/lib/pricing-b2b";
import { EUR_TO_BGN } from "@/lib/pricing";

type Locale = "bg" | "en" | "ru" | "ua";

interface PageProps {
  params: Promise<{ locale: string }>;
}

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

// ---------- Inline i18n copy (page-scoped) ----------

type Copy = {
  breadcrumbHome: string;
  breadcrumbThis: string;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    bullets: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  tiers: {
    title: string;
    subtitle: string;
    recommended: string;
    perUnit: string;
    fromLabel: string;
    chooseCta: string;
    basic: { name: string; tagline: string };
    standard: { name: string; tagline: string };
    pro: { name: string; tagline: string };
  };
  matrix: {
    title: string;
    subtitle: string;
    rowVisits: string;
    rowSla: string;
    rowWash: string;
    rowDisinfect: string;
    rowDrainage: string;
    rowElectro: string;
    rowFreon: string;
    rowDiscount: string;
    rowHotline: string;
    rowReport: string;
    rowConsult: string;
    cell: {
      visitsBasic: string;
      visitsStandard: string;
      visitsPro: string;
      slaBasic: string;
      slaStandard: string;
      slaPro: string;
      hotlineYes: string;
      hotlinePro: string;
      consultPro: string;
      yes: string;
      no: string;
    };
  };
  notIncluded: {
    title: string;
    subtitle: string;
    items: string[];
  };
  guarantee: {
    badge: string;
    title: string;
    text: string;
  };
  segments: {
    title: string;
    subtitle: string;
    office: { name: string; desc: string };
    horeca: { name: string; desc: string };
    medical: { name: string; desc: string };
    retail: { name: string; desc: string };
  };
  process: {
    title: string;
    subtitle: string;
    steps: { title: string; desc: string }[];
  };
  protection: {
    title: string;
    items: string[];
  };
  faq: { q: string; a: string }[];
  faqHeading: { title: string; subtitle: string };
  form: {
    title: string;
    subtitle: string;
    copy: {
      title: string;
      subtitle: string;
      fields: {
        company: string;
        eik: string;
        contact: string;
        phone: string;
        email: string;
        units: string;
        unitType: string;
        unitTypePlaceholder: string;
        address: string;
        tier: string;
        surveyTime: string;
        notes: string;
        notesPlaceholder: string;
      };
      tiers: { basic: string; standard: string; pro: string };
      submit: string;
      submitting: string;
      success: string;
      successMessage: string;
      successNext: string;
      errorMessage: string;
      required: string;
      privacy: string;
      reassurance: string;
      sendAnother: string;
    };
  };
  finalCta: {
    title: string;
    desc: string;
    button: string;
  };
  pricePeriod: string; // "/год" suffix
};

const COPY: Record<Locale, Copy> = {
  bg: {
    breadcrumbHome: "Начало",
    breadcrumbThis: "Бизнес абонамент",
    hero: {
      badge: "За компании във Варна и областта",
      title: "Абонаментно обслужване на климатици за бизнеса",
      subtitle:
        "Един изпълнител за всички климатици във всичките ви обекти. Фиксирана годишна цена, приоритет при авария, ДДС фактура и писмен договор.",
      bullets: [
        "Фиксирана цена за 12 месеца — без изненади в бюджета",
        "Приоритет при авария — преди клиентите без договор",
        "Договор и ДДС фактура — документално покрит всеки обект",
      ],
      ctaPrimary: "Вижте тарифите",
      ctaSecondary: "Безплатна оценка",
    },
    tiers: {
      title: "Три тарифа — избирате обем и скорост на реакция",
      subtitle: `Цена за едно вътрешно тяло на година, с включено ДДС. От ${B2B_MIN_UNITS} тела за договор.`,
      recommended: "Препоръчан",
      perUnit: "на 1 вътрешно тяло",
      fromLabel: "от",
      chooseCta: "Заявка",
      basic: {
        name: "Basic",
        tagline: "1 планова визита годишно · реакция до 3 работни дни",
      },
      standard: {
        name: "Standard",
        tagline:
          "2 планови визити (пролет + есен) · реакция до 2 работни дни · −10% на резервни части",
      },
      pro: {
        name: "Pro",
        tagline:
          "3 планови визити · реакция до 1 работен ден · −15% на резервни части · приоритетна линия",
      },
    },
    matrix: {
      title: "Какво включва всеки тариф",
      subtitle:
        "Подробно сравнение. Всичко по-долу е заложено в писмения договор — без устни уговорки.",
      rowVisits: "Планови визити годишно",
      rowSla: "Реакция при авария",
      rowWash: "Измиване на вътрешно и външно тяло",
      rowDisinfect: "Антибактериална обработка",
      rowDrainage: "Почистване на дренажа",
      rowElectro: "Електрическа проверка и затягане на връзките",
      rowFreon: "Проверка на фреон и налягания",
      rowDiscount: "Отстъпка за резервни части",
      rowHotline: "Приоритетна линия",
      rowReport: "Цифров PDF отчет след всяка визита",
      rowConsult: "Безплатна консултация за нови обекти",
      cell: {
        visitsBasic: "1 визита (пролет)",
        visitsStandard: "2 визити (пролет + есен)",
        visitsPro: "3 визити (на всеки 4 месеца)",
        slaBasic: "до 3 работни дни",
        slaStandard: "до 2 работни дни",
        slaPro: "до 1 работен ден",
        hotlineYes: "В работно време",
        hotlinePro: "В работно време · приоритет",
        consultPro: "1 път годишно · до 1 час",
        yes: "Включено",
        no: "Не е включено",
      },
    },
    notIncluded: {
      title: "Какво НЕ е включено",
      subtitle:
        "Пълна прозрачност: тези услуги се заплащат отделно по фиксиран прайс — без скрити сметки.",
      items: [
        "Долив на фреон (R32 / R410A) — по 25 € на всеки 100 g",
        "Авариен ремонт на компресор, платка или вентилатор",
        "Демонтаж, преместване или повторен монтаж на тяло",
        "Подмяна на климатично тяло или ключови компоненти",
        "Щети от външни фактори — буря, токов удар, влага, насекоми, вандализъм",
      ],
    },
    guarantee: {
      badge: "Без риск за вашия бизнес",
      title: "Не сте доволни от първата планова визита?",
      text: "Следващата визита е за наша сметка. Това е нашата гаранция, че ще получите обслужването, на което разчитате — без бюрокрация и без писма за възстановяване.",
    },
    segments: {
      title: "За кого е този абонамент",
      subtitle:
        "Всяка компания във Варна или областта с 3 и повече климатика — на собствен или нает обект.",
      office: {
        name: "Офиси и административни сгради",
        desc: "Стабилен микроклимат без прекъсване на работата. Планираме визитите извън пиковите ви часове.",
      },
      horeca: {
        name: "Ресторанти и хотели (HoReCa)",
        desc: "Готова техника за активния сезон — без аварии в най-натоварения месец.",
      },
      medical: {
        name: "Медицински и стоматологични кабинети",
        desc: "Антибактериална обработка и протокол на всяка визита — документация за изискванията на РЗИ.",
      },
      retail: {
        name: "Магазини и търговски обекти",
        desc: "Комфорт за клиенти и персонал. Визитите са рано сутрин или след затваряне — без да пречат на търговията.",
      },
    },
    process: {
      title: "Как работим — 4 стъпки",
      subtitle:
        "От заявка до първа планова визита — обикновено 7–10 работни дни.",
      steps: [
        {
          title: "1. Заявка",
          desc: "Попълвате формата — посочвате брой апарати и желан тариф. Свързваме се с вас в рамките на 1 работен ден.",
        },
        {
          title: "2. Оглед на обекта",
          desc: `Идваме на място, описваме всяко тяло и подготвяме индивидуална оферта. Цената на огледа е ${B2B_SURVEY_FEE_EUR} €, приспада се от първата фактура при подписване на договор.`,
        },
        {
          title: "3. Договор и график",
          desc: "Подписваме 12-месечен договор с фиксирани цени и SLA. Получавате график на плановите визити за цялата година.",
        },
        {
          title: "4. Първа визита",
          desc: "Първата планова визита е до 14 дни след подпис. Завършваме с цифров PDF отчет с препоръки за всяко тяло.",
        },
      ],
    },
    protection: {
      title: "Важно да знаете",
      items: [
        `Минимален брой тела за договор — ${B2B_MIN_UNITS}. Срок — 12 месеца, след това автоматично подновяване с възможност за прекратяване с 30-дневно предизвестие.`,
        "SLA се измерва в работни дни (Пон–Съб 08:00–18:00). Неделя и официални празници не се броят.",
        "Доливът на фреон и аварийните ремонти се заплащат отделно — по официален прайс.",
        "За тела над 10 години или монтирани от друга фирма — индивидуална оценка преди включване в договора.",
        "Цените са фиксирани за 12 месеца. Възможна индексация веднъж годишно — не над инфлацията (CPI) на България.",
        "Клиентът осигурява достъп до обекта в уговореното време. Пропусната по вина на клиента визита не се прехвърля.",
      ],
    },
    faq: [
      {
        q: "Какъв е минималният брой апарати за абонамент?",
        a: `Минимум ${B2B_MIN_UNITS} вътрешни тела на един или няколко обекта. За 1–2 апарата препоръчваме разова профилактика — натиснете „Профилактика" в менюто.`,
      },
      {
        q: "Издавате ли ДДС фактура и договор?",
        a: "Да. Работим само с писмен договор и издаваме ДДС фактура за всяко плащане. Можем да включим вашия ЕИК, ДДС № и допълнителни данни за вашата счетоводна отчетност.",
      },
      {
        q: "Какво се случва при авария извън планов график?",
        a: "Обаждате се на приоритетната линия за абонати и реагираме в срока на вашия тариф — до 1, 2 или 3 работни дни. Аварийните работи и резервните части се таксуват отделно по официален прайс (с отстъпка за Standard и Pro).",
      },
      {
        q: "Включена ли е смяна на фреон в абонамента?",
        a: "Не. Доливането на фреон се заплаща отделно — 25 € на всеки 100 g R32 / R410A. Така цената на абонамента остава предвидима и честна.",
      },
      {
        q: "Можем ли да плащаме на части?",
        a: "Да. Стандартно делим сумата на 2 равни вноски (април и октомври), вързани с плановите визити. При плащане на цялата година предварително — 5% отстъпка.",
      },
      {
        q: "Какъв е срокът на договора и как се прекратява?",
        a: "Минимален срок 12 месеца. След първата година договорът се подновява автоматично и може да бъде прекратен с 30-дневно писмено предизвестие — без неустойки.",
      },
      {
        q: "Обслужвате ли апарати, които не сте монтирали вие?",
        a: "Да, след оглед на място. При апарати над 10 години или с признаци на лош монтаж си запазваме правото да откажем включването им в абонамента или да предложим индивидуални условия.",
      },
      {
        q: "Колко струва огледът на обекта?",
        a: `Огледът е ${B2B_SURVEY_FEE_EUR} € и се приспада от първата фактура, ако подпишете договор в рамките на 14 дни.`,
      },
    ],
    faqHeading: {
      title: "Често задавани въпроси",
      subtitle:
        "Кратки и честни отговори за договора, цените и какво точно включва абонаментът.",
    },
    form: {
      title: "Заявка за бизнес абонамент",
      subtitle:
        "Попълнете формата — ще се свържем с вас до 1 работен ден с конкретна оферта за вашите обекти.",
      copy: {
        title: "B2B заявка",
        subtitle: "Без ангажимент",
        fields: {
          company: "Компания",
          eik: "ЕИК / ДДС №",
          contact: "Контактно лице",
          phone: "Телефон",
          email: "Имейл",
          units: "Брой апарати",
          unitType: "Тип апарати",
          unitTypePlaceholder: "Сплит, мулти, касетъчен, VRF…",
          address: "Адрес на обекта/обектите",
          tier: "Желан тариф",
          surveyTime: "Удобно време за оглед",
          notes: "Допълнително",
          notesPlaceholder: "Особености, марки, възраст на апаратите…",
        },
        tiers: { basic: "Basic", standard: "Standard", pro: "Pro" },
        submit: "Изпрати заявка",
        submitting: "Изпращане…",
        success: "Заявката е получена",
        successMessage:
          "Благодарим! Ще се свържем с вас в рамките на 1 работен ден.",
        successNext:
          "След потвърждение организираме оглед на обекта в удобно за вас време.",
        errorMessage:
          "Възникна грешка. Моля, опитайте отново или ни позвънете директно.",
        required: "Задължително поле",
        privacy:
          "Изпращайки заявката, вие приемате обработката на личните си данни за целите на тази оферта.",
        reassurance: "Без ангажимент. Отговаряме до 1 работен ден.",
        sendAnother: "Изпрати нова заявка",
      },
    },
    finalCta: {
      title: "Имате въпроси преди да попълните формата?",
      desc: "Обадете се директно — безплатна консултация по телефона, без задължение.",
      button: "Свържете се с нас",
    },
    pricePeriod: "/год",
  },

  en: {
    breadcrumbHome: "Home",
    breadcrumbThis: "Business contract",
    hero: {
      badge: "For companies in Varna and the region",
      title: "Annual AC maintenance contract for your business",
      subtitle:
        "One partner for every AC across your sites. Fixed annual price, priority response on breakdowns, VAT invoice and a signed contract.",
      bullets: [
        "Fixed price for 12 months — predictable budget",
        "Priority response over non-contract clients",
        "VAT invoice and written contract for every site",
      ],
      ctaPrimary: "See pricing",
      ctaSecondary: "Free assessment",
    },
    tiers: {
      title: "Three tiers based on your fleet size and priority",
      subtitle: `Price per indoor unit per year, VAT included. Minimum ${B2B_MIN_UNITS} units to qualify for a contract.`,
      recommended: "Recommended",
      perUnit: "per 1 indoor unit",
      fromLabel: "from",
      chooseCta: "Apply",
      basic: {
        name: "Basic",
        tagline: "1 scheduled visit/year · response within 3 working days",
      },
      standard: {
        name: "Standard",
        tagline:
          "2 scheduled visits (spring + autumn) · response within 2 working days · −10% on parts",
      },
      pro: {
        name: "Pro",
        tagline:
          "3 scheduled visits · response within 1 working day · −15% on parts · priority hotline",
      },
    },
    matrix: {
      title: "What each tier includes",
      subtitle:
        "Detailed comparison. Everything below is locked into your signed contract.",
      rowVisits: "Scheduled visits per year",
      rowSla: "Breakdown response time",
      rowWash: "Indoor and outdoor unit washing",
      rowDisinfect: "Antibacterial treatment",
      rowDrainage: "Drainage cleaning",
      rowElectro: "Electrical inspection and tightening",
      rowFreon: "Refrigerant and pressure check",
      rowDiscount: "Parts discount",
      rowHotline: "Priority hotline",
      rowReport: "Digital PDF report after every visit",
      rowConsult: "Free consultation for new sites",
      cell: {
        visitsBasic: "1 visit (spring)",
        visitsStandard: "2 visits (spring + autumn)",
        visitsPro: "3 visits (every 4 months)",
        slaBasic: "within 3 working days",
        slaStandard: "within 2 working days",
        slaPro: "within 1 working day",
        hotlineYes: "Working hours",
        hotlinePro: "Working hours · priority",
        consultPro: "1×/year · up to 1 hour",
        yes: "Included",
        no: "Not included",
      },
    },
    notIncluded: {
      title: "What is NOT included",
      subtitle:
        "Full transparency — the items below are billed separately at our published rates.",
      items: [
        "Refrigerant top-up (R32 / R410A) — €25 per 100 g",
        "Emergency repair of compressor, board or motor",
        "Dismantling, relocation or reinstallation of any unit",
        "Replacement of an AC unit or key components",
        "Damage from external factors — storm, surge, moisture, pests, vandalism",
      ],
    },
    guarantee: {
      badge: "Zero risk for your business",
      title: "Not happy with the first scheduled visit?",
      text: "The next visit is on us — no paperwork, no questions. That's how we stand behind the service you're paying for.",
    },
    segments: {
      title: "Who this contract is built for",
      subtitle:
        "For any organisation in Varna and the region with 3 or more AC units on owned or leased premises.",
      office: {
        name: "Offices and administrative buildings",
        desc: "Stable working environment without interruptions — we schedule visits outside business hours.",
      },
      horeca: {
        name: "Restaurants and hotels (HoReCa)",
        desc: "Seasonal readiness with no breakdowns in high season — we service units before the summer and winter peaks.",
      },
      medical: {
        name: "Medical and dental practices",
        desc: "Clean air with antibacterial treatment and a documented protocol per visit — ready for regulator checks.",
      },
      retail: {
        name: "Shops and retail venues",
        desc: "Comfort for customers and staff. Flexible visit slots — early morning or after closing.",
      },
    },
    process: {
      title: "How we work — 4 steps",
      subtitle:
        "From inquiry to the first scheduled visit usually takes 7–10 working days.",
      steps: [
        {
          title: "1. Inquiry",
          desc: "Fill in the form with the number of units and your preferred tier. We call you back within 1 working day.",
        },
        {
          title: "2. On-site survey",
          desc: `We visit your site, inventory each unit and prepare a tailored quote. The survey costs €${B2B_SURVEY_FEE_EUR} and is deducted from your first invoice upon signing.`,
        },
        {
          title: "3. Contract and schedule",
          desc: "We sign a 12-month contract with fixed prices and SLAs. You receive the schedule of planned visits.",
        },
        {
          title: "4. First visit",
          desc: "The first scheduled visit takes place within 14 days of signing. You receive a digital report with recommendations.",
        },
      ],
    },
    protection: {
      title: "Important to know",
      items: [
        `Minimum units: ${B2B_MIN_UNITS}. Term: 12 months, then auto-renewal with the option to cancel via 30-day written notice.`,
        "SLA is measured in working days (Mon–Sat 08:00–18:00). Sundays and public holidays don't count.",
        "Refrigerant top-up and emergency repairs are billed separately at our published rates.",
        "For units older than 10 years or installed by a third party, we assess each case and may decline inclusion.",
        "Prices fixed for 12 months. Possible annual indexation, capped at the Bulgarian CPI.",
        "The client grants access at the agreed time. Missed visits are not rescheduled into the next period.",
      ],
    },
    faq: [
      {
        q: "What's the minimum number of units?",
        a: `Minimum ${B2B_MIN_UNITS} indoor units across one or several sites. For 1–2 units we recommend a one-off maintenance — see the "Maintenance" link in the menu.`,
      },
      {
        q: "Do you issue VAT invoices and contracts?",
        a: "Yes. We only work under a written contract and issue a VAT invoice for every payment. We can include your EIK / VAT number and any other accounting details.",
      },
      {
        q: "What happens with breakdowns outside the schedule?",
        a: "Call the contract priority line — we respond within 1, 2 or 3 working days depending on your tier. Emergency labour and parts are billed separately at our published rates (with a discount on Standard and Pro).",
      },
      {
        q: "Is refrigerant top-up included?",
        a: "No. Refrigerant top-up is billed separately — €25 per 100 g of R32 / R410A. This is how we keep your annual fee predictable and honest.",
      },
      {
        q: "Can we pay in instalments?",
        a: "Yes. Standard schedule — 2 equal instalments (April and October), tied to your scheduled visits. Pay the full year upfront — 5% discount.",
      },
      {
        q: "Contract term and cancellation?",
        a: "Minimum term 12 months. After the first year the contract auto-renews and can be cancelled with 30 days' written notice — no penalties.",
      },
      {
        q: "Do you service units we didn't install?",
        a: "Yes, after an on-site survey. For units older than 10 years or with signs of poor installation, we reserve the right to decline inclusion or offer individual terms.",
      },
      {
        q: "How much is the survey?",
        a: `The on-site survey is €${B2B_SURVEY_FEE_EUR} and is deducted from your first invoice if you sign within 14 days.`,
      },
    ],
    faqHeading: {
      title: "Frequently asked questions",
      subtitle:
        "Short, honest answers about the contract, the pricing and what's included.",
    },
    form: {
      title: "Business contract inquiry",
      subtitle:
        "Fill in the form — we'll come back within 1 working day with a tailored quote for your sites.",
      copy: {
        title: "B2B inquiry",
        subtitle: "No commitment",
        fields: {
          company: "Company",
          eik: "EIK / VAT #",
          contact: "Contact person",
          phone: "Phone",
          email: "Email",
          units: "Number of units",
          unitType: "Unit type(s)",
          unitTypePlaceholder: "split, multi-split, cassette, VRF…",
          address: "Site address(es)",
          tier: "Preferred tier",
          surveyTime: "Preferred time for survey",
          notes: "Additional notes",
          notesPlaceholder: "Brands, age of units, specifics…",
        },
        tiers: { basic: "Basic", standard: "Standard", pro: "Pro" },
        submit: "Send inquiry",
        submitting: "Sending…",
        success: "Inquiry received",
        successMessage:
          "Thank you! We'll get back to you within 1 working day.",
        successNext:
          "After confirmation, we schedule an on-site survey at your convenience.",
        errorMessage:
          "Something went wrong. Please try again or call us directly.",
        required: "Required",
        privacy:
          "By submitting, you accept the processing of your data for this quote.",
        reassurance: "No commitment. We reply within 1 working day.",
        sendAnother: "Send another inquiry",
      },
    },
    finalCta: {
      title: "Questions before submitting the form?",
      desc: "Call us directly — free phone consultation, no obligation.",
      button: "Contact us",
    },
    pricePeriod: "/yr",
  },

  ru: {
    breadcrumbHome: "Главная",
    breadcrumbThis: "Бизнес-абонемент",
    hero: {
      badge: "Для компаний в Варне и области",
      title: "Годовой контракт на обслуживание кондиционеров для бизнеса",
      subtitle:
        "Один подрядчик на все ваши кондиционеры. Фиксированная цена на год, приоритет при аварии, официальная фактура с ДДС и письменный договор.",
      bullets: [
        "Фиксированная цена на 12 месяцев — без сюрпризов в бюджете",
        "Приоритет при аварии — раньше клиентов без договора",
        "Договор и ДДС-фактура — закрываем документально каждый объект",
      ],
      ctaPrimary: "Смотреть тарифы",
      ctaSecondary: "Бесплатный расчёт",
    },
    tiers: {
      title: "Три тарифа — выбираете объём и скорость реакции",
      subtitle: `Цена за один внутренний блок в год, с ДДС. От ${B2B_MIN_UNITS} блоков для договора.`,
      recommended: "Рекомендуем",
      perUnit: "за 1 блок",
      fromLabel: "от",
      chooseCta: "Заявка",
      basic: {
        name: "Basic",
        tagline: "1 плановый визит в год · реакция до 3 рабочих дней",
      },
      standard: {
        name: "Standard",
        tagline:
          "2 плановых визита (весна + осень) · реакция до 2 рабочих дней · −10% на запчасти",
      },
      pro: {
        name: "Pro",
        tagline:
          "3 плановых визита · реакция до 1 рабочего дня · −15% на запчасти · приоритетная линия",
      },
    },
    matrix: {
      title: "Что входит в каждый тариф",
      subtitle:
        "Подробное сравнение. Всё, что ниже, закрепляется в письменном договоре — без устных обещаний.",
      rowVisits: "Плановые визиты в год",
      rowSla: "Реакция при аварии",
      rowWash: "Мойка внутреннего и внешнего блоков",
      rowDisinfect: "Антибактериальная обработка",
      rowDrainage: "Чистка дренажа",
      rowElectro: "Проверка и протяжка электрики",
      rowFreon: "Проверка фреона и давлений",
      rowDiscount: "Скидка на запчасти",
      rowHotline: "Приоритетная линия",
      rowReport: "Цифровой PDF-отчёт после каждого визита",
      rowConsult: "Бесплатная консультация по новым объектам",
      cell: {
        visitsBasic: "1 визит (весна)",
        visitsStandard: "2 визита (весна + осень)",
        visitsPro: "3 визита (каждые 4 месяца)",
        slaBasic: "до 3 рабочих дней",
        slaStandard: "до 2 рабочих дней",
        slaPro: "до 1 рабочего дня",
        hotlineYes: "В рабочие часы",
        hotlinePro: "В рабочие часы · приоритет",
        consultPro: "1 раз в год · до 1 часа",
        yes: "Входит",
        no: "Не входит",
      },
    },
    notIncluded: {
      title: "Что НЕ входит",
      subtitle:
        "Полная прозрачность: эти работы оплачиваются отдельно по фиксированному прайсу — никаких скрытых счетов.",
      items: [
        "Долив фреона (R32 / R410A) — 25 € за каждые 100 г",
        "Аварийный ремонт компрессора, платы или вентилятора",
        "Демонтаж, перенос или повторный монтаж блока",
        "Замена кондиционера или ключевых узлов",
        "Ущерб от внешних факторов — буря, скачки напряжения, влага, насекомые, вандализм",
      ],
    },
    guarantee: {
      badge: "Без риска для вашего бизнеса",
      title: "Не довольны первым плановым визитом?",
      text: "Следующий визит — за наш счёт. Это наша гарантия того, что вы получите сервис, на который рассчитывали — без бюрократии и переписки.",
    },
    segments: {
      title: "Кому подходит абонемент",
      subtitle:
        "Любая компания в Варне или области с 3 и более кондиционерами — на собственной площади или в аренде.",
      office: {
        name: "Офисы и административные здания",
        desc: "Стабильный микроклимат без простоев. Плановые визиты — вне ваших пиковых часов.",
      },
      horeca: {
        name: "Рестораны и отели (HoReCa)",
        desc: "Готовая техника к высокому сезону — без аварий в самый загруженный месяц.",
      },
      medical: {
        name: "Медицинские и стоматологические кабинеты",
        desc: "Антибактериальная обработка и протокол по каждому визиту — документация под требования регулятора.",
      },
      retail: {
        name: "Магазины и торговые объекты",
        desc: "Комфорт для покупателей и персонала. Визиты — рано утром или после закрытия, без помех торговле.",
      },
    },
    process: {
      title: "Как работаем — 4 шага",
      subtitle:
        "От заявки до первого планового визита — обычно 7–10 рабочих дней.",
      steps: [
        {
          title: "1. Заявка",
          desc: "Заполняете форму — указываете количество кондиционеров и желаемый тариф. Перезваниваем в течение 1 рабочего дня.",
        },
        {
          title: "2. Осмотр объекта",
          desc: `Приезжаем на место, фиксируем каждый блок и готовим индивидуальное предложение. Стоимость осмотра — ${B2B_SURVEY_FEE_EUR} €, засчитывается в первый счёт при подписании договора.`,
        },
        {
          title: "3. Договор и график",
          desc: "Подписываем договор на 12 месяцев с фиксированными ценами и SLA. Получаете график плановых визитов на год вперёд.",
        },
        {
          title: "4. Первый визит",
          desc: "Первый плановый визит — в течение 14 дней после подписания договора. По итогам получаете цифровой PDF-отчёт с рекомендациями по каждому блоку.",
        },
      ],
    },
    protection: {
      title: "Важно знать",
      items: [
        `Минимальное число блоков для договора — ${B2B_MIN_UNITS}. Срок — 12 месяцев, далее автоматическое продление с возможностью расторжения за 30 дней.`,
        "SLA считается в рабочих днях (Пн–Сб 08:00–18:00). Воскресенья и государственные праздники не учитываются.",
        "Долив фреона и аварийные ремонты оплачиваются отдельно — по официальному прайсу.",
        "Для блоков старше 10 лет или установленных другой фирмой — индивидуальная оценка перед включением в договор.",
        "Цены зафиксированы на 12 месяцев. Возможна индексация раз в год — не выше уровня инфляции (CPI) Болгарии.",
        "Клиент обеспечивает доступ к объекту в согласованное время. Пропущенный по вине клиента визит не переносится.",
      ],
    },
    faq: [
      {
        q: "Какой минимум кондиционеров для абонемента?",
        a: `Минимум ${B2B_MIN_UNITS} внутренних блока — на одном или нескольких объектах. Если у вас 1–2 кондиционера, выгоднее заказать разовую профилактику (см. в меню).`,
      },
      {
        q: "Выдаёте ли ДДС-фактуру и письменный договор?",
        a: "Да. Работаем только по письменному договору и выдаём ДДС-фактуру за каждый платёж — с вашим ЕИК, ДДС-номером и реквизитами под требования вашей бухгалтерии.",
      },
      {
        q: "Что происходит при аварии вне планового графика?",
        a: "Звоните на приоритетную линию — реагируем по SLA вашего тарифа: до 1, 2 или 3 рабочих дней. Аварийные работы и запчасти оплачиваются отдельно по официальному прайсу (со скидкой для Standard и Pro).",
      },
      {
        q: "Входит ли долив фреона в абонемент?",
        a: "Нет. Долив оплачивается отдельно — 25 € за каждые 100 г R32 / R410A. Так цена абонемента остаётся предсказуемой и честной — вы не платите за чужой расход.",
      },
      {
        q: "Можно ли платить частями?",
        a: "Да. Стандартная схема — два равных платежа (апрель и октябрь), привязанные к плановым визитам. При полной предоплате на год — скидка 5%.",
      },
      {
        q: "Срок договора и как его расторгнуть?",
        a: "Срок — 12 месяцев. После первого года договор автоматически продлевается; расторжение — письменным уведомлением за 30 дней.",
      },
      {
        q: "Обслуживаете ли кондиционеры, которые ставили не вы?",
        a: "Да, но с предварительным осмотром. Для блоков старше 10 лет или с признаками некачественного монтажа можем отказать или предложить индивидуальные условия.",
      },
      {
        q: "Сколько стоит осмотр объекта?",
        a: `Осмотр объекта — ${B2B_SURVEY_FEE_EUR} €. Эта сумма засчитывается в первый счёт при подписании договора в течение 14 дней — то есть вы фактически не платите за осмотр, если идёте на договор.`,
      },
    ],
    faqHeading: {
      title: "Частые вопросы",
      subtitle:
        "Короткие и честные ответы по условиям, документам и тому, что входит в абонемент.",
    },
    form: {
      title: "Заявка на бизнес-абонемент",
      subtitle:
        "Заполните форму — перезвоним в течение 1 рабочего дня с индивидуальным предложением по вашему объекту.",
      copy: {
        title: "B2B-заявка",
        subtitle: "Без обязательств",
        fields: {
          company: "Компания",
          eik: "ЕИК / ДДС №",
          contact: "Контактное лицо",
          phone: "Телефон",
          email: "Email",
          units: "Количество кондиционеров",
          unitType: "Тип блоков",
          unitTypePlaceholder: "сплит, мульти, кассетный, канальный, VRF…",
          address: "Адрес объекта или объектов",
          tier: "Желаемый тариф",
          surveyTime: "Удобное время для осмотра",
          notes: "Дополнительно",
          notesPlaceholder: "Бренды, возраст блоков, известные проблемы…",
        },
        tiers: { basic: "Basic", standard: "Standard", pro: "Pro" },
        submit: "Отправить заявку",
        submitting: "Отправка…",
        success: "Заявка получена",
        successMessage:
          "Спасибо! Перезвоним вам в течение 1 рабочего дня.",
        successNext:
          "После звонка согласуем удобное время для осмотра объекта.",
        errorMessage:
          "Произошла ошибка. Попробуйте ещё раз или позвоните нам напрямую.",
        required: "Обязательное поле",
        privacy:
          "Отправляя заявку, вы соглашаетесь на обработку персональных данных для подготовки коммерческого предложения.",
        reassurance: "Без обязательств. Отвечаем в течение 1 рабочего дня.",
        sendAnother: "Отправить новую заявку",
      },
    },
    finalCta: {
      title: "Есть вопросы до заполнения формы?",
      desc: "Позвоните напрямую — короткая консультация по телефону, без обязательств.",
      button: "Связаться с нами",
    },
    pricePeriod: "/год",
  },

  ua: {
    breadcrumbHome: "Головна",
    breadcrumbThis: "Бізнес-абонемент",
    hero: {
      badge: "Для компаній у Варні та області",
      title: "Річний контракт на обслуговування кондиціонерів для бізнесу",
      subtitle:
        "Один підрядник на всі кондиціонери ваших об'єктів. Фіксована ціна на рік, пріоритет при аварії, офіційна ДДС-фактура та письмовий договір.",
      bullets: [
        "Фіксована ціна на 12 місяців — передбачуваний бюджет",
        "Пріоритет при аварії — раніше за клієнтів без договору",
        "ДДС-фактура та договір на кожен об'єкт",
      ],
      ctaPrimary: "Дивитись тарифи",
      ctaSecondary: "Безкоштовний розрахунок",
    },
    tiers: {
      title: "Три тарифи за обсягом і пріоритетом",
      subtitle: `Ціна за один внутрішній блок на рік, з ДДС. Мінімум ${B2B_MIN_UNITS} апарата для договору.`,
      recommended: "Рекомендуємо",
      perUnit: "за 1 внутр. блок",
      fromLabel: "від",
      chooseCta: "Заявка",
      basic: {
        name: "Basic",
        tagline: "1 плановий візит/рік · реакція до 3 роб. днів",
      },
      standard: {
        name: "Standard",
        tagline:
          "2 планові візити (весна + осінь) · реакція до 2 роб. днів · −10% на запчастини",
      },
      pro: {
        name: "Pro",
        tagline:
          "3 планові візити · реакція до 1 роб. дня · −15% на запчастини · пріоритетна лінія",
      },
    },
    matrix: {
      title: "Що включає кожен тариф",
      subtitle:
        "Детальне порівняння. Усе нижче зафіксовано у підписаному договорі.",
      rowVisits: "Планові візити на рік",
      rowSla: "Реакція при аварії",
      rowWash: "Миття внутрішнього та зовнішнього блоків",
      rowDisinfect: "Антибактеріальна обробка",
      rowDrainage: "Чистка дренажу",
      rowElectro: "Перевірка та затягування електрики",
      rowFreon: "Перевірка фреону і тиску",
      rowDiscount: "Знижка на запчастини",
      rowHotline: "Пріоритетна гаряча лінія",
      rowReport: "Цифровий PDF-звіт після кожного візиту",
      rowConsult: "Безкоштовна консультація для нових об'єктів",
      cell: {
        visitsBasic: "1 візит (весна)",
        visitsStandard: "2 візити (весна + осінь)",
        visitsPro: "3 візити (кожні 4 місяці)",
        slaBasic: "до 3 роб. днів",
        slaStandard: "до 2 роб. днів",
        slaPro: "до 1 роб. дня",
        hotlineYes: "Роб. години",
        hotlinePro: "Роб. години · пріоритет",
        consultPro: "1×/рік · до 1 години",
        yes: "Включено",
        no: "Не входить",
      },
    },
    notIncluded: {
      title: "Що НЕ входить",
      subtitle:
        "Повна прозорість — наведене нижче сплачується окремо за нашим офіційним прайсом.",
      items: [
        "Долив фреону (R32 / R410A) — 25 € за кожні 100 г",
        "Аварійний ремонт компресора, плати або мотора",
        "Демонтаж, перенесення чи повторний монтаж блока",
        "Заміна кондиціонера або ключових компонентів",
        "Збитки від зовнішніх факторів — буря, струм, волога, комахи, вандалізм",
      ],
    },
    guarantee: {
      badge: "Без ризику для вашого бізнесу",
      title: "Незадоволені першим плановим візитом?",
      text: "Наступний візит — за наш кошт, без паперової тяганини та зайвих питань. Так ми відповідаємо за сервіс, за який ви платите.",
    },
    segments: {
      title: "Кому підходить цей абонемент",
      subtitle:
        "Для будь-якої організації у Варні та області з 3+ кондиціонерами на власному або орендованому об'єкті.",
      office: {
        name: "Офіси та адміністративні будівлі",
        desc: "Стабільне робоче середовище без зупинок — плануємо візити поза робочими годинами.",
      },
      horeca: {
        name: "Ресторани та готелі (HoReCa)",
        desc: "Сезонна готовність без аварій у пік — готуємо техніку перед літнім і зимовим сезонами.",
      },
      medical: {
        name: "Медичні та стоматологічні кабінети",
        desc: "Чисте повітря з антибактеріальною обробкою та документований протокол на кожен візит — готово до перевірок регуляторів.",
      },
      retail: {
        name: "Магазини та торгові об'єкти",
        desc: "Комфорт для клієнтів і персоналу. Гнучкий час візиту — рано вранці або після закриття.",
      },
    },
    process: {
      title: "Як ми працюємо — 4 кроки",
      subtitle:
        "Від заявки до першого планового візиту — зазвичай 7–10 робочих днів.",
      steps: [
        {
          title: "1. Заявка",
          desc: "Заповнюєте форму з кількістю апаратів і бажаним тарифом. Передзвонюємо протягом 1 робочого дня.",
        },
        {
          title: "2. Огляд об'єкта",
          desc: `Приїжджаємо на місце, інвентаризуємо кожен апарат і готуємо індивідуальну пропозицію. Вартість огляду — ${B2B_SURVEY_FEE_EUR} €, віднімається з першої фактури при підписанні договору.`,
        },
        {
          title: "3. Договір і графік",
          desc: "Підписуємо договір на 12 місяців із фіксованими цінами та SLA. Ви отримуєте графік планових візитів.",
        },
        {
          title: "4. Перший візит",
          desc: "Перший плановий візит — протягом 14 днів після підписання. Ви отримуєте цифровий звіт із рекомендаціями.",
        },
      ],
    },
    protection: {
      title: "Важливо знати",
      items: [
        `Мінімум апаратів: ${B2B_MIN_UNITS}. Термін: 12 місяців, далі автопродовження з можливістю розірвання через 30-денне письмове повідомлення.`,
        "SLA рахується в робочих днях (Пн–Сб 08:00–18:00). Неділі та державні свята не враховуються.",
        "Долив фреону та аварійні ремонти — окремо за нашим офіційним прайсом.",
        "Для апаратів старше 10 років або встановлених третьою фірмою — індивідуальна оцінка, можемо відмовити.",
        "Ціни фіксовані 12 місяців. Можлива індексація раз на рік — не вище за інфляцію (CPI) Болгарії.",
        "Клієнт забезпечує доступ у погоджений час. Пропущений візит не переноситься на наступний період.",
      ],
    },
    faq: [
      {
        q: "Який мінімум апаратів для абонементу?",
        a: `Мінімум ${B2B_MIN_UNITS} внутрішніх блоків на одному чи декількох об'єктах. Для 1–2 апаратів — разова профілактика, посилання в меню.`,
      },
      {
        q: "Чи видаєте ДДС-фактуру та договір?",
        a: "Так. Працюємо тільки за письмовим договором і видаємо ДДС-фактуру за кожен платіж. Включаємо ваш ЕІК, ДДС № та додаткові реквізити для бухгалтерії.",
      },
      {
        q: "Що при аварії поза плановим графіком?",
        a: "Телефонуєте на пріоритетну лінію для абонентів — реагуємо у строк вашого тарифу (до 1, 2 або 3 робочих днів). Аварійні роботи та запчастини — окремо за нашим офіційним прайсом (зі знижкою для Standard і Pro).",
      },
      {
        q: "Чи входить долив фреону в абонемент?",
        a: "Ні. Долив фреону оплачується окремо — 25 € за кожні 100 г R32 / R410A. Так ціна абонементу залишається передбачуваною та чесною.",
      },
      {
        q: "Чи можна сплачувати частинами?",
        a: "Так. Стандартна схема — 2 рівні внески (квітень і жовтень), прив'язані до планових візитів. При оплаті всього року наперед — 5% знижка.",
      },
      {
        q: "Термін договору і як розірвати?",
        a: "Мінімум 12 місяців. Після першого року договір автоматично продовжується і може бути розірваний письмовим повідомленням за 30 днів — без штрафів.",
      },
      {
        q: "Чи обслуговуєте апарати, які встановлювали не ви?",
        a: "Так, після огляду на місці. Для апаратів старше 10 років або з ознаками поганого монтажу залишаємо за собою право відмовити або запропонувати індивідуальні умови.",
      },
      {
        q: "Скільки коштує огляд об'єкта?",
        a: `Огляд — ${B2B_SURVEY_FEE_EUR} €, віднімається з першої фактури, якщо ви підпишете договір протягом 14 днів.`,
      },
    ],
    faqHeading: {
      title: "Часті запитання",
      subtitle:
        "Короткі та чесні відповіді про договір, ціни і що саме включає абонемент.",
    },
    form: {
      title: "Заявка на бізнес-абонемент",
      subtitle:
        "Заповніть форму — зв'яжемося з вами протягом 1 робочого дня з конкретною пропозицією для ваших об'єктів.",
      copy: {
        title: "B2B заявка",
        subtitle: "Без зобов'язань",
        fields: {
          company: "Компанія",
          eik: "ЕІК / ДДС №",
          contact: "Контактна особа",
          phone: "Телефон",
          email: "Email",
          units: "Кількість апаратів",
          unitType: "Тип апаратів",
          unitTypePlaceholder: "спліт, мульти, касетний, VRF…",
          address: "Адреса об'єкта/об'єктів",
          tier: "Бажаний тариф",
          surveyTime: "Зручний час для огляду",
          notes: "Додатково",
          notesPlaceholder: "Особливості, бренди, вік апаратів…",
        },
        tiers: { basic: "Basic", standard: "Standard", pro: "Pro" },
        submit: "Надіслати заявку",
        submitting: "Надсилання…",
        success: "Заявку отримано",
        successMessage:
          "Дякуємо! Зв'яжемося з вами протягом 1 робочого дня.",
        successNext:
          "Після підтвердження організуємо огляд об'єкта у зручний для вас час.",
        errorMessage:
          "Сталася помилка. Спробуйте ще раз або зателефонуйте нам.",
        required: "Обов'язкове поле",
        privacy:
          "Надсилаючи заявку, ви погоджуєтесь на обробку персональних даних для цілей цієї пропозиції.",
        reassurance: "Без зобов'язань. Відповідаємо протягом 1 робочого дня.",
        sendAnother: "Надіслати нову заявку",
      },
    },
    finalCta: {
      title: "Питання перед заповненням форми?",
      desc: "Зателефонуйте напряму — безкоштовна консультація, без зобов'язань.",
      button: "Зв'язатися з нами",
    },
    pricePeriod: "/рік",
  },
};

// ---------- Metadata ----------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : "bg"];
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";

  return {
    title: `${c.hero.title} | ${dict.common.siteName}`,
    description: c.hero.subtitle,
    alternates: {
      canonical: `${siteUrl}/${locale}/abonament-biznes`,
      languages: {
        bg: `${siteUrl}/bg/abonament-biznes`,
        en: `${siteUrl}/en/abonament-biznes`,
        ru: `${siteUrl}/ru/abonament-biznes`,
        uk: `${siteUrl}/ua/abonament-biznes`,
        "x-default": `${siteUrl}/bg/abonament-biznes`,
      },
    },
  };
}

// ---------- Page ----------

export default async function AbonamentBiznesPage({ params }: PageProps) {
  const { locale } = await params;
  const loc: Locale = (["bg", "en", "ru", "ua"] as const).includes(
    locale as Locale
  )
    ? (locale as Locale)
    : "bg";
  const dict = await getDictionary(locale);
  const c = COPY[loc];
  const common = dict.common;

  const siteUrl = "https://pesnopoets-clima.com";

  // Anchor price: Basic 7-14k BTU (cheapest entry point shown in hero/tiers)
  const basicAnchorEur = B2B_PRICING_EUR.find((t) => t.tier === "basic")!
    .prices.wall_small;
  const standardAnchorEur = B2B_PRICING_EUR.find((t) => t.tier === "standard")!
    .prices.wall_small;
  const proAnchorEur = B2B_PRICING_EUR.find((t) => t.tier === "pro")!.prices
    .wall_small;
  const highEur = B2B_PRICING_EUR.find((t) => t.tier === "pro")!.prices
    .semi_industrial;

  // ---- JSON-LD ----
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType:
      loc === "bg"
        ? "Абонаментно обслужване на климатици за бизнеса"
        : loc === "en"
        ? "Business AC maintenance contract"
        : loc === "ru"
        ? "Бизнес-абонемент на обслуживание кондиционеров"
        : "Бізнес-абонемент на обслуговування кондиціонерів",
    category: "HVAC Maintenance Contract",
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: [
      { "@type": "City", name: "Варна" },
      { "@type": "City", name: "Девня" },
      { "@type": "City", name: "Аксаково" },
      { "@type": "AdministrativeArea", name: "Варненска област" },
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        loc === "bg"
          ? "Бизнес клиенти, офиси, ресторанти, медицински кабинети, магазини"
          : loc === "en"
          ? "Businesses, offices, restaurants, medical practices, retail"
          : loc === "ru"
          ? "Бизнес-клиенты, офисы, рестораны, медицинские кабинеты, магазины"
          : "Бізнес-клієнти, офіси, ресторани, медичні кабінети, магазини",
    },
    name: c.hero.title,
    description: c.hero.subtitle,
    url: `${siteUrl}/${locale}/abonament-biznes`,
    priceRange: `€${basicAnchorEur} – €${highEur}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(basicAnchorEur),
      highPrice: String(highEur),
      offerCount: 3,
      offers: [
        {
          "@type": "Offer",
          name: `${c.tiers.basic.name} — ${c.tiers.basic.tagline}`,
          priceCurrency: "EUR",
          price: String(basicAnchorEur),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(basicAnchorEur),
            priceCurrency: "EUR",
            unitText: "per indoor unit per year",
            valueAddedTaxIncluded: true,
          },
        },
        {
          "@type": "Offer",
          name: `${c.tiers.standard.name} — ${c.tiers.standard.tagline}`,
          priceCurrency: "EUR",
          price: String(standardAnchorEur),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(standardAnchorEur),
            priceCurrency: "EUR",
            unitText: "per indoor unit per year",
            valueAddedTaxIncluded: true,
          },
        },
        {
          "@type": "Offer",
          name: `${c.tiers.pro.name} — ${c.tiers.pro.tagline}`,
          priceCurrency: "EUR",
          price: String(proAnchorEur),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(proAnchorEur),
            priceCurrency: "EUR",
            unitText: "per indoor unit per year",
            valueAddedTaxIncluded: true,
          },
        },
      ],
    },
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: c.breadcrumbHome,
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: c.breadcrumbThis,
        item: `${siteUrl}/${locale}/abonament-biznes`,
      },
    ],
  };

  // ---- Tier card data ----
  const tierCards: {
    tier: B2BTier;
    name: string;
    tagline: string;
    priceEur: number;
    highlighted: boolean;
  }[] = [
    {
      tier: "basic",
      name: c.tiers.basic.name,
      tagline: c.tiers.basic.tagline,
      priceEur: basicAnchorEur,
      highlighted: false,
    },
    {
      tier: "standard",
      name: c.tiers.standard.name,
      tagline: c.tiers.standard.tagline,
      priceEur: standardAnchorEur,
      highlighted: true,
    },
    {
      tier: "pro",
      name: c.tiers.pro.name,
      tagline: c.tiers.pro.tagline,
      priceEur: proAnchorEur,
      highlighted: false,
    },
  ];

  // ---- Comparison matrix rows ----
  const matrixRows: { label: string; basic: string; standard: string; pro: string }[] = [
    { label: c.matrix.rowVisits, basic: c.matrix.cell.visitsBasic, standard: c.matrix.cell.visitsStandard, pro: c.matrix.cell.visitsPro },
    { label: c.matrix.rowSla, basic: c.matrix.cell.slaBasic, standard: c.matrix.cell.slaStandard, pro: c.matrix.cell.slaPro },
    { label: c.matrix.rowWash, basic: c.matrix.cell.yes, standard: c.matrix.cell.yes, pro: c.matrix.cell.yes },
    { label: c.matrix.rowDisinfect, basic: c.matrix.cell.no, standard: c.matrix.cell.yes, pro: c.matrix.cell.yes },
    { label: c.matrix.rowDrainage, basic: c.matrix.cell.no, standard: c.matrix.cell.yes, pro: c.matrix.cell.yes },
    { label: c.matrix.rowElectro, basic: c.matrix.cell.yes, standard: c.matrix.cell.yes, pro: c.matrix.cell.yes },
    { label: c.matrix.rowFreon, basic: c.matrix.cell.yes, standard: c.matrix.cell.yes, pro: c.matrix.cell.yes },
    { label: c.matrix.rowDiscount, basic: c.matrix.cell.no, standard: "−10%", pro: "−15%" },
    { label: c.matrix.rowHotline, basic: c.matrix.cell.no, standard: c.matrix.cell.hotlineYes, pro: c.matrix.cell.hotlinePro },
    { label: c.matrix.rowReport, basic: c.matrix.cell.yes, standard: c.matrix.cell.yes, pro: c.matrix.cell.yes },
    { label: c.matrix.rowConsult, basic: c.matrix.cell.no, standard: c.matrix.cell.no, pro: c.matrix.cell.consultPro },
  ];

  const segments = [
    { key: "office", Icon: Briefcase, data: c.segments.office },
    { key: "horeca", Icon: Utensils, data: c.segments.horeca },
    { key: "medical", Icon: Stethoscope, data: c.segments.medical },
    { key: "retail", Icon: ShoppingBag, data: c.segments.retail },
  ];

  const stepIcons = [ClipboardList, FileText, FileSignature, CalendarCheck2];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero with image */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/abonament-biznes/hero-real.jpg"
            alt={c.hero.title}
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/85 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24">
          <nav
            className="text-xs text-white/50 mb-5 flex items-center gap-1.5"
            aria-label="breadcrumb"
          >
            <Link href={`/${locale}`} className="hover:text-white/80">
              {c.breadcrumbHome}
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white/80">{c.breadcrumbThis}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full mb-5">
              <Building2
                className="w-3.5 h-3.5 text-primary"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-white/90 tracking-wide">
                {c.hero.badge}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              {c.hero.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">
              {c.hero.subtitle}
            </p>
            <ul className="mt-7 space-y-2.5 max-w-xl">
              {c.hero.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm sm:text-base">
                  <CheckCircle2
                    className="w-5 h-5 text-primary shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-white/85 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="#tariffs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors min-h-[48px]"
              >
                {c.hero.ctaPrimary}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="#b2b-form"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-colors min-h-[48px]"
              >
                {c.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tier cards */}
      <section id="tariffs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {c.tiers.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {c.tiers.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tierCards.map((card) => {
            const priceBgn = Math.round(card.priceEur * EUR_TO_BGN);
            return (
              <div
                key={card.tier}
                className={`relative bg-white rounded-2xl border p-6 sm:p-7 flex flex-col ${
                  card.highlighted
                    ? "border-primary shadow-[0_12px_28px_rgb(0_0_0/0.08)] md:scale-[1.02]"
                    : "border-border/60 shadow-[0_2px_8px_rgb(0_0_0/0.04)]"
                }`}
              >
                {card.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-md">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    {c.tiers.recommended}
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">{card.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                  {card.tagline}
                </p>
                <div className="mt-6 pb-5 border-b border-border/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground">
                      {c.tiers.fromLabel}
                    </span>
                    <span className="text-4xl font-extrabold text-foreground tabular-nums">
                      {card.priceEur}
                    </span>
                    <span className="text-lg font-semibold text-foreground">€</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {c.pricePeriod}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    ≈ {priceBgn} лв · {c.tiers.perUnit}
                  </p>
                </div>
                <Link
                  href={`#b2b-form`}
                  className={`mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-colors min-h-[48px] ${
                    card.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                      : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.09]"
                  }`}
                >
                  {c.tiers.chooseCta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison matrix */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-6 sm:mb-8 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {c.matrix.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {c.matrix.subtitle}
            </p>
          </div>
          <div className="overflow-x-auto bg-white border border-border rounded-2xl shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#0a1628] text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    &nbsp;
                  </th>
                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    {c.tiers.basic.name}
                  </th>
                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary/30">
                    {c.tiers.standard.name}
                  </th>
                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    {c.tiers.pro.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {matrixRows.map((row) => (
                  <tr key={row.label} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-foreground">
                      {row.label}
                    </td>
                    {[row.basic, row.standard, row.pro].map((val, i) => {
                      const isNo = val === c.matrix.cell.no;
                      const isYes = val === c.matrix.cell.yes;
                      return (
                        <td
                          key={i}
                          className={`px-3 sm:px-5 py-3 sm:py-4 text-center text-sm ${
                            i === 1 ? "bg-primary/[0.04]" : ""
                          } ${isNo ? "text-muted-foreground" : "text-foreground"}`}
                        >
                          {isYes ? (
                            <CheckCircle2
                              className="w-5 h-5 text-primary mx-auto"
                              aria-label={val}
                            />
                          ) : isNo ? (
                            <XCircle
                              className="w-5 h-5 text-muted-foreground/40 mx-auto"
                              aria-label={val}
                            />
                          ) : (
                            <span className="font-medium tabular-nums">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* NOT included — transparency block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
                <XCircle
                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-1.5">
                {c.notIncluded.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c.notIncluded.subtitle}
            </p>
          </div>
          <ul className="lg:col-span-2 space-y-3">
            {c.notIncluded.items.map((it) => (
              <li
                key={it}
                className="flex items-start gap-3 p-4 bg-white border border-border/60 rounded-xl"
              >
                <XCircle
                  className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm text-foreground leading-relaxed">
                  {it}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Anti-risk guarantee */}
      <section className="bg-primary-light/40 border-y border-primary/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
              <ShieldCheck
                className="w-3.5 h-3.5 text-primary"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-primary-dark tracking-wide">
                {c.guarantee.badge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {c.guarantee.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-foreground/80 leading-relaxed">
              {c.guarantee.text}
            </p>
          </div>
        </div>
      </section>

      {/* Segments — who is this for */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {c.segments.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {c.segments.subtitle}
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {segments.map(({ key, Icon, data }) => (
            <li
              key={key}
              className="bg-white border border-border/60 rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgb(0_0_0/0.04)]"
            >
              <div className="w-10 h-10 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                {data.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Process — 4 steps */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-8 sm:mb-10 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {c.process.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {c.process.subtitle}
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {c.process.steps.map((step, i) => {
              const Icon = stepIcons[i] ?? ClipboardList;
              return (
                <li
                  key={step.title}
                  className="relative bg-white border border-border/60 rounded-2xl p-5 sm:p-6"
                >
                  <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Sticker trust block — service trail audit for businesses */}
      <section className="border-t border-border/40 bg-gradient-to-b from-[#fafbfc] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border/40 order-2 md:order-1">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/team/sticker-on-pcb.jpg"
                  alt={
                    locale === "en"
                      ? "Branded Pesnopoets Clima service sticker on the PCB of a serviced AC unit"
                      : locale === "ru"
                      ? "Брендированная сервисная наклейка Песнопоец Клима на плате обслуженного кондиционера"
                      : locale === "ua"
                      ? "Брендований сервісний стікер Песнопоец Клима на платі обслуженого кондиціонера"
                      : "Брандиран сервизен стикер Песнопоец Клима върху платката на обслужен климатик"
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/[0.08] border border-primary/15 rounded-full mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                  {locale === "en"
                    ? "Service log"
                    : locale === "ru"
                    ? "История обслуживания"
                    : locale === "ua"
                    ? "Історія обслуговування"
                    : "Дневник за сервиз"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {locale === "en"
                  ? "Every AC under contract carries a service sticker"
                  : locale === "ru"
                  ? "На каждом кондиционере по договору — наша сервисная наклейка"
                  : locale === "ua"
                  ? "На кожному кондиціонері за договором — наш сервісний стікер"
                  : "Всеки климатик по договор носи наш сервизен стикер"}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {locale === "en"
                  ? "After each scheduled visit we mark the indoor unit with a dated sticker and our direct service phone. Your facility manager can audit any AC in the building without digging through paperwork."
                  : locale === "ru"
                  ? "После каждого планового визита мы оставляем на блоке наклейку с датой и прямым телефоном сервиса. Управляющему достаточно подойти к кондиционеру — никаких поисков в почте и архивах."
                  : locale === "ua"
                  ? "Після кожного планового візиту ми залишаємо на блоці стікер з датою та прямим телефоном сервісу. Керівнику достатньо підійти до кондиціонера — без пошуку в пошті та архівах."
                  : "След всеки планов визит оставяме на блока стикер с дата и директен телефон за сервиз. Вашият мениджър проверява всеки климатик на място — без търсене в архиви."}
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  locale === "en"
                    ? "Date of last service visible right on the unit"
                    : locale === "ru"
                    ? "Дата последнего сервиса — прямо на блоке, видна без отчётов"
                    : locale === "ua"
                    ? "Дата останнього сервісу — на блоці, видно без звітів"
                    : "Датата на последния сервиз е на блока — без отчети",
                  locale === "en"
                    ? "Fits internal audit and HVAC service requirements"
                    : locale === "ru"
                    ? "Подходит для внутреннего аудита и требований к обслуживанию HVAC"
                    : locale === "ua"
                    ? "Підходить для внутрішнього аудиту та вимог до обслуговування HVAC"
                    : "Подходящо за вътрешен одит и изисквания за HVAC обслужване",
                  locale === "en"
                    ? "Service history follows the unit — survives staff turnover"
                    : locale === "ru"
                    ? "История привязана к технике, а не к сотруднику — переживёт любую ротацию"
                    : locale === "ua"
                    ? "Історія прив'язана до техніки, а не до співробітника — переживе будь-яку ротацію"
                    : "Историята остава на техниката, не при служителя — преживява смяна на персонал",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <PortfolioGallery
        locale={locale}
        tags={["install", "outdoor", "maintenance"]}
        limit={8}
      />

      {/* Protection / important to know */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light/60 rounded-xl flex items-center justify-center shrink-0">
              <FileText
                className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-1.5 sm:pt-2">
              {c.protection.title}
            </h2>
          </div>
          <ul className="space-y-3">
            {c.protection.items.map((it) => (
              <li
                key={it}
                className="flex items-start gap-3 p-4 bg-white border border-border/60 rounded-xl"
              >
                <CheckCircle2
                  className="w-5 h-5 text-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm text-foreground leading-relaxed">
                  {it}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — visible content mirrors FAQPage JSON-LD (AIO citation) */}
      <section className="bg-muted/50 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {c.faqHeading.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {c.faqHeading.subtitle}
              </p>
            </div>
            <div className="space-y-3">
              {c.faq.map((item, i) => (
                <details
                  key={item.q}
                  className="group bg-white border border-border/60 rounded-2xl overflow-hidden"
                  open={i < 2}
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none p-5 sm:p-6 hover:bg-muted/30 transition-colors">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug pr-2">
                      {item.q}
                    </h3>
                    <ChevronRight
                      className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* B2B form */}
      <section id="b2b-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {c.form.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {c.form.subtitle}
            </p>
          </div>
          <div className="bg-white border border-border/60 rounded-2xl shadow-[0_2px_12px_rgb(0_0_0/0.04)] p-5 sm:p-7">
            <B2BContractForm locale={loc} copy={c.form.copy} />
          </div>
        </div>
      </section>

      {/* Final CTA — phone */}
      <section className="relative overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
                <ShieldCheck
                  className="w-3.5 h-3.5 text-white"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  {common.authorizedDealer}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {c.finalCta.title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
                {c.finalCta.desc}
              </p>
            </div>
            <Link
              href={`/${locale}/kontakti`}
              className="shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[var(--primary-dark)] font-semibold rounded-xl hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_14px_0_rgb(0_0_0/0.15)] min-h-[48px]"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {c.finalCta.button}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
