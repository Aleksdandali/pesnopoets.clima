// Translation map for Bittel API feature names (Bulgarian → en/ru/ua)
// These are the ~30 unique spec names that appear in product features

const featureTranslations: Record<string, { en: string; ru: string; ua: string }> = {
  // Основни характеристики (Main specs)
  "Основни характеристики": { en: "Main Specifications", ru: "Основные характеристики", ua: "Основні характеристики" },
  "Отдавана мощност на охлаждане (Мін./Ном./Макс)": { en: "Cooling capacity (Min/Nom/Max)", ru: "Мощность охлаждения (Мин./Ном./Макс.)", ua: "Потужність охолодження (Мін./Ном./Макс.)" },
  "Отдавана мощност на отопление (Мін./Ном./Макс)": { en: "Heating capacity (Min/Nom/Max)", ru: "Мощность обогрева (Мин./Ном./Макс.)", ua: "Потужність обігріву (Мін./Ном./Макс.)" },
  "Консумирана мощност на охлаждане (Мін./Ном./Макс)": { en: "Power consumption cooling (Min/Nom/Max)", ru: "Потребляемая мощность охлаждения (Мин./Ном./Макс.)", ua: "Споживана потужність охолодження (Мін./Ном./Макс.)" },
  "Консумирана мощност на отопление (Мін./Ном./Макс)": { en: "Power consumption heating (Min/Nom/Max)", ru: "Потребляемая мощность обогрева (Мин./Ном./Макс.)", ua: "Споживана потужність обігріву (Мін./Ном./Макс.)" },
  "Мощност (BTU)": { en: "Power (BTU)", ru: "Мощность (BTU)", ua: "Потужність (BTU)" },
  "EER (хладилен коефициент на охлаждане)": { en: "EER (cooling efficiency ratio)", ru: "EER (коэффициент охлаждения)", ua: "EER (коефіцієнт охолодження)" },
  "SEER (сезонен коефициент на охлаждане)": { en: "SEER (seasonal cooling efficiency)", ru: "SEER (сезонный коэффициент охлаждения)", ua: "SEER (сезонний коефіцієнт охолодження)" },
  "COP (коефициент на трансф. отопление)": { en: "COP (heating coefficient)", ru: "COP (коэффициент обогрева)", ua: "COP (коефіцієнт обігріву)" },
  "SCOP (сезонен коефициент на трансф. отопление)": { en: "SCOP (seasonal heating coefficient)", ru: "SCOP (сезонный коэффициент обогрева)", ua: "SCOP (сезонний коефіцієнт обігріву)" },
  "Годишен разход на електроенергия (Охлаждане / Отопление)": { en: "Annual energy consumption (Cooling / Heating)", ru: "Годовой расход электроэнергии (Охлаждение / Обогрев)", ua: "Річне споживання електроенергії (Охолодження / Обігрів)" },
  "Енергиен клас на охлаждане / отопление (умерена зона)": { en: "Energy class cooling / heating (moderate zone)", ru: "Энергокласс охлаждения / обогрева (умеренная зона)", ua: "Енергоклас охолодження / обігріву (помірна зона)" },
  "Работна температура на охлаждане": { en: "Operating temperature (cooling)", ru: "Рабочая температура охлаждения", ua: "Робоча температура охолодження" },
  "Работна температура на отопление": { en: "Operating temperature (heating)", ru: "Рабочая температура обогрева", ua: "Робоча температура обігріву" },
  "Подходящ за помещения до": { en: "Suitable for rooms up to", ru: "Подходит для помещений до", ua: "Підходить для приміщень до" },
  "Гаранция": { en: "Warranty", ru: "Гарантия", ua: "Гарантія" },
  "Хладилен агент": { en: "Refrigerant", ru: "Хладагент", ua: "Холодоагент" },
  "Захранване (Фаза/Честота/Напрежение)": { en: "Power supply (Phase/Frequency/Voltage)", ru: "Электропитание (Фаза/Частота/Напряжение)", ua: "Електроживлення (Фаза/Частота/Напруга)" },
  "Максимален брой вътрешни тела": { en: "Maximum indoor units", ru: "Максимум внутренних блоков", ua: "Максимум внутрішніх блоків" },

  // Вътрешно тяло (Indoor unit)
  "Вътрешно тяло": { en: "Indoor Unit", ru: "Внутренний блок", ua: "Внутрішній блок" },
  "Размери": { en: "Dimensions", ru: "Размеры", ua: "Розміри" },
  "Тегло": { en: "Weight", ru: "Вес", ua: "Вага" },
  "Ниво на шум на охлаждане (Високо/Ном./Ниско/Безшумно)": { en: "Noise level cooling (High/Nom/Low/Silent)", ru: "Уровень шума охлаждения (Выс./Ном./Низк./Бесшумно)", ua: "Рівень шуму охолодження (Вис./Ном./Низьк./Безшумно)" },
  "Ниво на шум на отопление (Високо/Ном./Ниско/Безшумно)": { en: "Noise level heating (High/Nom/Low/Silent)", ru: "Уровень шума обогрева (Выс./Ном./Низк./Бесшумно)", ua: "Рівень шуму обігріву (Вис./Ном./Низьк./Безшумно)" },

  // Външно тяло (Outdoor unit)
  "Външно тяло": { en: "Outdoor Unit", ru: "Наружный блок", ua: "Зовнішній блок" },
  "Компресор": { en: "Compressor", ru: "Компрессор", ua: "Компресор" },
  "Тръбни връзки - течна / газообразна фаза": { en: "Pipe connections - liquid / gas phase", ru: "Трубные соединения - жидкая / газообразная фаза", ua: "Трубні з'єднання - рідка / газоподібна фаза" },
};

// Section name translations
const sectionTranslations: Record<string, { en: string; ru: string; ua: string }> = {
  "Основни характеристики": { en: "Main Specifications", ru: "Основные характеристики", ua: "Основні характеристики" },
  "Вътрешно тяло": { en: "Indoor Unit", ru: "Внутренний блок", ua: "Внутрішній блок" },
  "Външно тяло": { en: "Outdoor Unit", ru: "Наружный блок", ua: "Зовнішній блок" },
};

export function translateFeatureName(bgName: string, locale: string): string {
  if (locale === "bg") return bgName;

  // Exact match
  const exact = featureTranslations[bgName];
  if (exact) return exact[locale as "en" | "ru" | "ua"] || bgName;

  // Partial match (some names have slight variations)
  for (const [key, translations] of Object.entries(featureTranslations)) {
    if (bgName.includes(key) || key.includes(bgName)) {
      return translations[locale as "en" | "ru" | "ua"] || bgName;
    }
  }

  return bgName;
}

export function translateSectionName(bgName: string, locale: string): string {
  if (locale === "bg") return bgName;
  const tr = sectionTranslations[bgName];
  return tr ? tr[locale as "en" | "ru" | "ua"] || bgName : bgName;
}

// Category GROUP name translations (for sidebar headers)
const groupTranslations: Record<string, { en: string; ru: string; ua: string }> = {
  "ИНВЕРТОРНИ КЛИМАТИЦИ": { en: "Inverter Air Conditioners", ru: "Инверторные кондиционеры", ua: "Інверторні кондиціонери" },
  "ИНВ.МУЛТИСПЛИТ СИСТЕМИ": { en: "Multi-Split Systems", ru: "Мульти-сплит системы", ua: "Мульти-спліт системи" },
  "ТЕРМОПОМПИ": { en: "Heat Pumps", ru: "Тепловые насосы", ua: "Теплові насоси" },
  "ПРОФЕСИОНАЛНИ СИСТЕМИ": { en: "Professional Systems", ru: "Профессиональные системы", ua: "Професійні системи" },
  "VRV СИСТЕМИ": { en: "VRV Systems", ru: "VRV системы", ua: "VRV системи" },
  "ВЕНТИЛАЦИЯ": { en: "Ventilation", ru: "Вентиляция", ua: "Вентиляція" },
  "ВЪЗДУХОПРЕЧИСТВАТЕЛИ": { en: "Air Purifiers", ru: "Очистители воздуха", ua: "Очищувачі повітря" },
  "АКСЕСОАРИ": { en: "Accessories", ru: "Аксессуары", ua: "Аксесуари" },
  "БОЙЛЕРИ": { en: "Boilers", ru: "Бойлеры", ua: "Бойлери" },
  "ЧИЛЪРИ": { en: "Chillers", ru: "Чиллеры", ua: "Чилери" },
  "ДРУГИ": { en: "Other", ru: "Другое", ua: "Інше" },
};

export function translateGroupName(bgName: string, locale: string): string {
  if (locale === "bg") return bgName;
  const tr = groupTranslations[bgName];
  return tr ? tr[locale as "en" | "ru" | "ua"] || bgName : bgName;
}
