// Top districts of Varna we serve.
// Each district fuels a localized landing page at /[locale]/montazh/[slug].
// SEO target: long-tail "монтаж климатик [квартал] варна" — low competition.

export type Locale = "bg" | "en" | "ru" | "ua";

export interface DistrictContent {
  /** Display name shown in H1, breadcrumbs, etc. */
  name: string;
  /** Page <title> (without site brand suffix). */
  metaTitle: string;
  /** Meta description, 140–160 chars. */
  metaDescription: string;
  /** 1–2 paragraph hero intro, unique per district (~140–180 words). */
  intro: string;
  /** 4–5 short strings — landmarks/streets/sub-areas inside the district. */
  landmarks: string[];
  /** 2–3 typical job profiles for this district (high-rise / villa / etc). */
  typicalJobs: string[];
  /** One install/tech tip specific to the area (1–2 sentences). */
  localTip: string;
}

export interface District {
  slug: string;
  /** Approx. centroid — used for LocalBusiness/Place schema. */
  geo?: { lat: number; lng: number };
  content: Record<Locale, DistrictContent>;
}

export const DISTRICTS: District[] = [
  {
    slug: "asparuhovo",
    geo: { lat: 43.1869, lng: 27.9118 },
    content: {
      bg: {
        name: "Аспарухово",
        metaTitle: "Монтаж климатик Аспарухово — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик в Аспарухово, Варна. Собствена бригада, фиксирани цени от 190 €, монтаж в същия ден. Daikin, Mitsubishi, Gree.",
        intro:
          "Аспарухово е южният квартал на Варна — от двете страни на моста, със смесена застройка: панелни блокове близо до плажа и нови сгради на височина. За монтаж в Аспарухово най-често правим: външни тела на високи фасади откъм морето (с автокошница), пробиване през тухлени стени в стария фонд и късите трасета в новите комплекси. Идваме с пълно оборудване и материалите — не пращаме клиенти на магазина по средата на монтажа. При обаждане преди обяд — монтаж в същия ден.",
        landmarks: ["мост към Варна", "ул. Народни будители", "ул. Кирил и Методий", "ж.к. Аспарухово", "плаж Аспарухово"],
        typicalJobs: [
          "9–12K BTU моноблок в апартамент в панелен блок",
          "18K BTU инвертор в нова сграда с морски изглед",
          "Мулти-сплит за самостоятелна къща",
        ],
        localTip:
          "Височината от морето + солена влажност скъсява живота на външните тела. Препоръчваме модели с антикорозионна обработка на бобината (Daikin, Mitsubishi Electric) — иначе резервоар на компресора пада за 3–4 години.",
      },
      en: {
        name: "Asparuhovo",
        metaTitle: "AC Installation Asparuhovo — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Asparuhovo, Varna. Own crew, fixed prices from €190, same-day install. Daikin, Mitsubishi, Gree authorized.",
        intro:
          "Asparuhovo is Varna's southern district — both sides of the bridge, mixed housing: panel blocks near the beach and new buildings up the hill. Typical jobs here: outdoor units on tall sea-facing façades (cherry picker), drilling through brick walls in old stock, short pipe runs in new complexes. We arrive fully equipped — no mid-job runs to the shop. Call before noon — same-day install.",
        landmarks: ["bridge to Varna", "Narodni Buditeli St.", "Cyril & Methodius St.", "Asparuhovo district", "Asparuhovo beach"],
        typicalJobs: [
          "9–12K BTU mono-split in a panel-block apartment",
          "18K BTU inverter in a new sea-view building",
          "Multi-split for a detached house",
        ],
        localTip:
          "Sea elevation plus salty humidity shortens outdoor unit life. Pick models with anti-corrosion coil treatment (Daikin, Mitsubishi Electric) — without it, the compressor lasts 3–4 years.",
      },
      ru: {
        name: "Аспарухово",
        metaTitle: "Монтаж кондиционера Аспарухово — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Аспарухово, Варна. Своя бригада, фиксированные цены от 190 €, монтаж в день обращения. Daikin, Mitsubishi, Gree.",
        intro:
          "Аспарухово — южный район Варны по обе стороны моста, смешанная застройка: панельные дома у пляжа и новые здания выше по склону. Типовые задачи здесь: внешние блоки на высоких морских фасадах (с автовышкой), бурение через кирпич в старом фонде, короткие трассы в новых комплексах. Приезжаем с полным оборудованием и материалами — без отлучек в магазин в середине монтажа. Звонок до обеда — монтаж в тот же день.",
        landmarks: ["мост к Варне", "ул. Народни будители", "ул. Кирилл и Мефодий", "ж.к. Аспарухово", "пляж Аспарухово"],
        typicalJobs: [
          "9–12K BTU моноблок в квартире панельного дома",
          "18K BTU инвертор в новостройке с видом на море",
          "Мульти-сплит для частного дома",
        ],
        localTip:
          "Высота над морем + солёная влажность сокращают срок внешних блоков. Берите модели с антикоррозийной обработкой змеевика (Daikin, Mitsubishi Electric) — иначе компрессор выходит за 3–4 года.",
      },
      ua: {
        name: "Аспарухово",
        metaTitle: "Монтаж кондиціонера Аспарухово — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера в Аспарухово, Варна. Власна бригада, фіксовані ціни від 190 €, монтаж того ж дня. Daikin, Mitsubishi, Gree.",
        intro:
          "Аспарухово — південний район Варни з обох боків мосту, мішана забудова: панельні будинки біля пляжу та новобудови вище схилом. Типові завдання: зовнішні блоки на високих морських фасадах (з автовишкою), буріння цегли в старому фонді, короткі траси в нових комплексах. Приїжджаємо з повним обладнанням і матеріалами — без відлучок у магазин. Дзвінок до обіду — монтаж того ж дня.",
        landmarks: ["міст до Варни", "вул. Народні будителі", "вул. Кирило і Мефодій", "ж/к Аспарухово", "пляж Аспарухово"],
        typicalJobs: [
          "9–12K BTU моноблок у квартирі панельного будинку",
          "18K BTU інвертор у новобудові з видом на море",
          "Мульти-спліт для приватного будинку",
        ],
        localTip:
          "Висота над морем + солона вологість скорочують термін зовнішніх блоків. Беріть моделі з антикорозійною обробкою змійовика (Daikin, Mitsubishi Electric) — інакше компресор виходить за 3–4 роки.",
      },
    },
  },
  {
    slug: "chayka",
    geo: { lat: 43.2086, lng: 27.9437 },
    content: {
      bg: {
        name: "Чайка",
        metaTitle: "Монтаж климатик Чайка — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик в Чайка, Варна. Тихи режими за крайбрежни апартаменти. Цени от 190 €, монтаж в същия ден. Daikin, Mitsubishi.",
        intro:
          "Чайка е плътно застроен жилищен квартал в южната част на Варна, между Морската градина и Аспарухово. Тук работим основно с апартаменти от 60 до 110 м² — стандартни 9K и 12K BTU за хол + спалня, понякога мулти-сплит за две стаи на едно външно тяло. Жилищните комплекси често имат правила за фасадно тяло — съгласуваме мястото и цвета на тръбопровода с домсъвета.",
        landmarks: ["бул. Княз Борис I", "ж.к. Чайка", "ВВМУ Никола Йонков Вапцаров", "Морска градина", "ул. Битоля"],
        typicalJobs: [
          "9K BTU инвертор в спалня — тих режим под 23 dB",
          "12K BTU в хол с южно изложение",
          "Мулти-сплит 2×9K за двустаен апартамент",
        ],
        localTip:
          "При апартаменти с южно изложение слагайте външното тяло в сянка — на пряко слънце компресорът губи до 15% от ефективността през август. Понякога монтираме козирка.",
      },
      en: {
        name: "Chayka",
        metaTitle: "AC Installation Chayka — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Chayka, Varna. Quiet modes for coastal apartments. From €190, same-day install. Daikin, Mitsubishi authorized.",
        intro:
          "Chayka is a dense residential district in southern Varna, between Sea Garden and Asparuhovo. Most jobs here are 60–110 m² apartments — standard 9K and 12K BTU for living room + bedroom, sometimes a multi-split on a single outdoor unit. Many complexes have façade rules — we coordinate position and pipe colour with the building manager.",
        landmarks: ["Knyaz Boris I Blvd.", "Chayka district", "Naval Academy", "Sea Garden", "Bitola St."],
        typicalJobs: [
          "9K BTU inverter for a bedroom — quiet mode below 23 dB",
          "12K BTU for a south-facing living room",
          "Multi-split 2×9K for a two-bedroom apartment",
        ],
        localTip:
          "For south-facing apartments, place the outdoor unit in shade — direct sun costs up to 15% of efficiency in August. We sometimes install a sun visor.",
      },
      ru: {
        name: "Чайка",
        metaTitle: "Монтаж кондиционера Чайка — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Чайке, Варна. Тихий режим для прибрежных квартир. От 190 €, монтаж в день обращения. Daikin, Mitsubishi.",
        intro:
          "Чайка — плотный жилой район в южной части Варны, между Морским садом и Аспарухово. Здесь в основном квартиры 60–110 м² — стандарт 9K и 12K BTU на гостиную + спальню, иногда мульти-сплит на одном внешнем. В жилых комплексах часто есть фасадные правила — место и цвет трубопровода согласуем с домкомом.",
        landmarks: ["бул. Княз Борис I", "ж/к Чайка", "Военно-морское училище", "Морской сад", "ул. Битоля"],
        typicalJobs: [
          "9K BTU инвертор в спальню — тихий режим до 23 dB",
          "12K BTU в гостиную с южным окном",
          "Мульти-сплит 2×9K на двухкомнатную",
        ],
        localTip:
          "В южных квартирах ставьте внешний блок в тень — под прямым солнцем компрессор теряет до 15% эффективности в августе. Иногда монтируем козырёк.",
      },
      ua: {
        name: "Чайка",
        metaTitle: "Монтаж кондиціонера Чайка — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера в Чайці, Варна. Тихий режим для прибережних квартир. Від 190 €, монтаж того ж дня. Daikin, Mitsubishi.",
        intro:
          "Чайка — щільний житловий район у південній частині Варни, між Морським садом та Аспарухово. Тут в основному квартири 60–110 м² — стандарт 9K та 12K BTU на вітальню + спальню, іноді мульті-спліт на одному зовнішньому. У ЖК часто є фасадні правила — місце і колір трубопроводу узгоджуємо з домкомом.",
        landmarks: ["бул. Княз Борис I", "ж/к Чайка", "Військово-морське училище", "Морський сад", "вул. Бітоля"],
        typicalJobs: [
          "9K BTU інвертор у спальню — тихий режим до 23 dB",
          "12K BTU у вітальню з південним вікном",
          "Мульті-спліт 2×9K на двокімнатну",
        ],
        localTip:
          "У південних квартирах ставте зовнішній блок у тінь — під прямим сонцем компресор втрачає до 15% ефективності в серпні. Іноді монтуємо козирок.",
      },
    },
  },
  {
    slug: "levski",
    geo: { lat: 43.2241, lng: 27.9018 },
    content: {
      bg: {
        name: "Левски",
        metaTitle: "Монтаж климатик Левски — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик в кв. Левски, Варна. Висока ефективност за панелни блокове. Цени от 190 €. Daikin, Mitsubishi, Gree.",
        intro:
          "Левски е голям централно-западен жилищен квартал със смесена застройка — повече панелни блокове, по-малко нови сгради. За Левски най-често правим монтаж в три-стайни апартаменти с по 2–3 вътрешни тела. Тук типично пробиваме през носещи стени, затова идваме с диамантено-перфораторна техника и аспирация — без прах в апартамента ви.",
        landmarks: ["бул. Цар Освободител", "ж.к. Левски", "ул. Подвис", "ул. Девня", "СОУ \"Васил Левски\""],
        typicalJobs: [
          "12K + 9K BTU мулти-сплит за тристаен апартамент",
          "9K BTU моноблок в детска стая — нощен режим",
          "Подмяна на стар R22 уред с нов A++",
        ],
        localTip:
          "В стария панелен фонд електрическата инсталация често е под напрежение. Преди монтаж проверяваме сечение на кабела — за 18K BTU и нагоре трябва отделна линия 2.5 мм² с автоматичен предпазител.",
      },
      en: {
        name: "Levski",
        metaTitle: "AC Installation Levski — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Levski, Varna. High efficiency for panel blocks. From €190. Daikin, Mitsubishi, Gree authorized.",
        intro:
          "Levski is a large central-west residential district with mixed housing — mostly panel blocks, fewer new builds. Typical job here: 3-room apartments with 2–3 indoor units. We often drill through load-bearing walls, so we bring diamond-perforator gear with dust extraction — no dust in your apartment.",
        landmarks: ["Tsar Osvoboditel Blvd.", "Levski district", "Podvis St.", "Devnya St.", "Vasil Levski High School"],
        typicalJobs: [
          "12K + 9K BTU multi-split for a 3-room apartment",
          "9K BTU mono-split for a kid's room — night mode",
          "Replace old R22 unit with new A++",
        ],
        localTip:
          "Old panel-block wiring is often overloaded. We check cable cross-section before install — for 18K BTU and up, a dedicated 2.5 mm² line with breaker is required.",
      },
      ru: {
        name: "Левски",
        metaTitle: "Монтаж кондиционера Левски — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Левски, Варна. Высокая эффективность для панельных домов. От 190 €. Daikin, Mitsubishi, Gree.",
        intro:
          "Левски — большой центрально-западный район смешанной застройки: больше панелей, меньше новостроек. Типичная задача — трёхкомнатная с 2–3 внутренними блоками. Часто бурим через несущие стены: приходим с алмазным перфоратором и пылеотводом — без пыли в квартире.",
        landmarks: ["бул. Цар Освободител", "ж/к Левски", "ул. Подвис", "ул. Девня", "СОШ \"Васил Левски\""],
        typicalJobs: [
          "12K + 9K BTU мульти-сплит на трёхкомнатную",
          "9K BTU моноблок в детскую — ночной режим",
          "Замена старого R22 на новый A++",
        ],
        localTip:
          "В старом панельном фонде электрика часто перегружена. Перед монтажом проверяем сечение кабеля — для 18K BTU и выше нужна отдельная линия 2.5 мм² с автоматом.",
      },
      ua: {
        name: "Левски",
        metaTitle: "Монтаж кондиціонера Левски — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера в Левски, Варна. Висока ефективність для панельних будинків. Від 190 €. Daikin, Mitsubishi, Gree.",
        intro:
          "Левски — великий центрально-західний район мішаної забудови: більше панелей, менше новобудов. Типове завдання — трикімнатна з 2–3 внутрішніми блоками. Часто буримо несучі стіни: приходимо з алмазним перфоратором та пиловідведенням — без пилу у квартирі.",
        landmarks: ["бул. Цар Освободитель", "ж/к Левски", "вул. Подвис", "вул. Девня", "ЗОШ \"Васил Левски\""],
        typicalJobs: [
          "12K + 9K BTU мульті-спліт на трикімнатну",
          "9K BTU моноблок у дитячу — нічний режим",
          "Заміна старого R22 на новий A++",
        ],
        localTip:
          "У старому панельному фонді електрика часто перевантажена. Перед монтажем перевіряємо переріз кабелю — для 18K BTU і вище потрібна окрема лінія 2.5 мм² з автоматом.",
      },
    },
  },
  {
    slug: "vladislavovo",
    geo: { lat: 43.2403, lng: 27.8800 },
    content: {
      bg: {
        name: "Владиславово",
        metaTitle: "Монтаж климатик Владиславово — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик във Владиславово, Варна. Голям резерв панелни блокове. Цени от 190 €, монтаж в същия ден.",
        intro:
          "Владиславово е най-голямата панелна зона на Варна — над 50 000 жители, основно блокове от 80-те и 90-те. Тук типичните монтажи са в стандартни 9K и 12K BTU, понякога 18K за двустаен. Често подменяме стари климатици R22 с нови — старите блокове имат вече трасе, но е добре да се пробие нова дупка през тухла, не през стария отвор.",
        landmarks: ["бул. Република", "ж.к. Владиславово", "ул. Хан Севар", "ОУ \"Стефан Караджа\"", "стадион \"Спартак\""],
        typicalJobs: [
          "9K BTU моноблок в спалня — стандартен бюджет",
          "12K BTU в дневна на 18–22 м²",
          "Подмяна на R22 уред с нов R32 + ремонт на стара дупка",
        ],
        localTip:
          "Старите 80-те години панели имат хидроизолация в стените, която често пропуска влага около кабелните канали. След пробиване уплътняваме с PU пяна + силикон, иначе стената отвътре започва да цъфти през зимата.",
      },
      en: {
        name: "Vladislavovo",
        metaTitle: "AC Installation Vladislavovo — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Vladislavovo, Varna. Largest panel-block district. From €190, same-day install.",
        intro:
          "Vladislavovo is Varna's largest panel-block district — 50,000+ residents, mostly 1980s–90s blocks. Standard jobs here: 9K and 12K BTU, sometimes 18K for a two-bedroom flat. We often replace old R22 units with new ones — the old pipe run may exist, but we recommend drilling a fresh brick hole rather than reusing the old opening.",
        landmarks: ["Republika Blvd.", "Vladislavovo district", "Han Sevar St.", "Stefan Karadzha School", "Spartak Stadium"],
        typicalJobs: [
          "9K BTU mono-split for a bedroom — budget standard",
          "12K BTU for an 18–22 m² living room",
          "Replace R22 with new R32 + repair old wall hole",
        ],
        localTip:
          "1980s panel walls have moisture barriers that often leak around cable channels. After drilling we seal with PU foam + silicone, otherwise the wall blooms with mould in winter.",
      },
      ru: {
        name: "Владиславово",
        metaTitle: "Монтаж кондиционера Владиславово — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Владиславово, Варна. Самый крупный панельный массив. От 190 €, в день обращения.",
        intro:
          "Владиславово — крупнейший панельный массив Варны: 50 000+ жителей, в основном дома 80–90-х. Типовые монтажи: 9K и 12K BTU, иногда 18K на двушку. Часто меняем старые R22 на новые — старая трасса может быть, но советуем сверлить свежее отверстие в кирпиче, не использовать старое.",
        landmarks: ["бул. Република", "ж/к Владиславово", "ул. Хан Севар", "ОШ \"Стефан Караджа\"", "стадион \"Спартак\""],
        typicalJobs: [
          "9K BTU моноблок в спальню — базовый бюджет",
          "12K BTU в зал 18–22 м²",
          "Замена R22 на новый R32 + ремонт старого отверстия",
        ],
        localTip:
          "В панелях 80-х есть гидроизоляция, которая часто пропускает влагу вокруг кабельных каналов. После сверления герметизируем PU-пеной + силиконом — иначе стена внутри плесневеет зимой.",
      },
      ua: {
        name: "Владиславово",
        metaTitle: "Монтаж кондиціонера Владиславово — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера у Владиславово, Варна. Найбільший панельний масив. Від 190 €, того ж дня.",
        intro:
          "Владиславово — найбільший панельний масив Варни: 50 000+ мешканців, в основному будинки 80–90-х. Типові монтажі: 9K і 12K BTU, іноді 18K на двокімнатну. Часто міняємо старі R22 на нові — стара траса може бути, але радимо свердлити свіжий отвір у цеглі.",
        landmarks: ["бул. Республіка", "ж/к Владиславово", "вул. Хан Севар", "ЗШ \"Стефан Караджа\"", "стадіон \"Спартак\""],
        typicalJobs: [
          "9K BTU моноблок у спальню — базовий бюджет",
          "12K BTU у зал 18–22 м²",
          "Заміна R22 на новий R32 + ремонт старого отвору",
        ],
        localTip:
          "У панелях 80-х є гідроізоляція, яка часто пропускає вологу навколо кабельних каналів. Після свердління герметизуємо PU-піною + силіконом — інакше стіна всередині пліснявіє взимку.",
      },
    },
  },
  {
    slug: "vinitsa",
    geo: { lat: 43.2522, lng: 28.0072 },
    content: {
      bg: {
        name: "Виница",
        metaTitle: "Монтаж климатик Виница — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик във Виница, Варна. Къщи, вили, апартаменти. Мулти-сплит и термопомпи. От 190 €. Daikin, Mitsubishi.",
        intro:
          "Виница е североизточно от Варна — смесена застройка от вили, самостоятелни къщи и нови жилищни комплекси близо до плажа. Тук много често правим мулти-сплит за 3–4 стаи на едно външно тяло и термопомпи въздух-вода за отопление + охлаждане. Заради разстоянието от центъра идваме с пълно скеле и стълба — не разчитаме на нищо на място.",
        landmarks: ["плаж Виница", "ул. Цар Симеон I", "комплекс Слънчев Дом", "ВВМУ военно поделение", "Манастира"],
        typicalJobs: [
          "Мулти-сплит 4×9K BTU за двуетажна къща",
          "Термопомпа въздух-вода 8 kW за самостоятелна къща",
          "12K BTU в нов апартамент с морски изглед",
        ],
        localTip:
          "За къщи с термопомпа задължително слагаме външното тяло на бетонна площадка на минимум 30 см от земята — за защита от сняг зимата и за свободна циркулация на въздух.",
      },
      en: {
        name: "Vinitsa",
        metaTitle: "AC Installation Vinitsa — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Vinitsa, Varna. Houses, villas, apartments. Multi-split & heat pumps. From €190.",
        intro:
          "Vinitsa is northeast of Varna — mixed villas, detached houses and new beachside complexes. We often do multi-splits (3–4 rooms on one outdoor unit) and air-to-water heat pumps for heating + cooling. We come fully self-sufficient — full scaffold, ladders, materials — no shortcuts.",
        landmarks: ["Vinitsa beach", "Tsar Simeon I St.", "Slunchev Dom complex", "Military area", "Monastery"],
        typicalJobs: [
          "Multi-split 4×9K BTU for a two-storey house",
          "Air-to-water 8 kW heat pump for a detached house",
          "12K BTU in a new sea-view apartment",
        ],
        localTip:
          "For houses with heat pumps, mount the outdoor unit on a concrete pad at least 30 cm above ground — protects from winter snow and ensures free airflow.",
      },
      ru: {
        name: "Виница",
        metaTitle: "Монтаж кондиционера Виница — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Виница, Варна. Дома, виллы, квартиры. Мульти-сплит и тепловые насосы. От 190 €.",
        intro:
          "Виница — северо-восточнее Варны, смешанная застройка: виллы, частные дома и новые ЖК у пляжа. Часто делаем мульти-сплит (3–4 комнаты на один внешний) и тепловые насосы воздух-вода для отопления + охлаждения. Приезжаем со всем необходимым: леса, лестницы, материалы — никаких компромиссов.",
        landmarks: ["пляж Виница", "ул. Цар Симеон I", "комплекс Слънчев Дом", "военная часть", "Монастырь"],
        typicalJobs: [
          "Мульти-сплит 4×9K BTU для двухэтажного дома",
          "Тепловой насос воздух-вода 8 kW для частного дома",
          "12K BTU в новостройке с видом на море",
        ],
        localTip:
          "Для домов с тепловым насосом обязательно монтируем внешний блок на бетонной площадке минимум 30 см от земли — защита от снега зимой и свободная циркуляция воздуха.",
      },
      ua: {
        name: "Виниця",
        metaTitle: "Монтаж кондиціонера Виниця — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера у Виниці, Варна. Будинки, вілли, квартири. Мульті-спліт і теплові насоси. Від 190 €.",
        intro:
          "Виниця — північно-східніше Варни, мішана забудова: вілли, приватні будинки та нові ЖК біля пляжу. Часто робимо мульті-спліт (3–4 кімнати на один зовнішній) і теплові насоси повітря-вода для опалення + охолодження. Приїжджаємо з усім: ліси, драбини, матеріали — жодних компромісів.",
        landmarks: ["пляж Виниця", "вул. Цар Симеон I", "комплекс Слънчев Дом", "військова частина", "Монастир"],
        typicalJobs: [
          "Мульті-спліт 4×9K BTU для двоповерхового будинку",
          "Тепловий насос повітря-вода 8 kW для приватного будинку",
          "12K BTU у новобудові з видом на море",
        ],
        localTip:
          "Для будинків з тепловим насосом обов'язково монтуємо зовнішній блок на бетонному майданчику мінімум 30 см від землі — захист від снігу взимку та вільна циркуляція повітря.",
      },
    },
  },
  {
    slug: "mladost",
    geo: { lat: 43.2228, lng: 27.8916 },
    content: {
      bg: {
        name: "Младост",
        metaTitle: "Монтаж климатик Младост — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик в кв. Младост, Варна. Голяма централна жилищна зона. От 190 €, монтаж в същия ден.",
        intro:
          "Младост е централна жилищна зона на запад от центъра, със смесена застройка — панели, нови сгради и редица обществени обекти. Тук типичните монтажи са 9K и 12K BTU за стандартни апартаменти. Заради близостта до центъра обикновено идваме до 30 минути след обаждане — паркирането е сравнително добро, не губим време в кръгове из квартала.",
        landmarks: ["ул. Цар Симеон I", "ж.к. Младост", "ул. Андрей Сахаров", "Народно читалище", "Стадион \"Червено знаме\""],
        typicalJobs: [
          "9K BTU в спалня — нощен тих режим",
          "12K BTU в дневна 18–25 м²",
          "Поддръжка + смяна на стар уред с нов A+++",
        ],
        localTip:
          "В новите блокове в Младост често има ограничения за външни тела на главната фасада. Поставяме ги на странична фасада или вътрешен двор — съгласуваме с домсъвета преди монтаж.",
      },
      en: {
        name: "Mladost",
        metaTitle: "AC Installation Mladost — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Mladost, Varna. Large central residential area. From €190, same-day install.",
        intro:
          "Mladost is a central residential zone west of downtown — mixed panels and new builds. Standard jobs: 9K and 12K BTU for typical apartments. Being close to center, we usually arrive within 30 minutes of your call — parking is decent, no time lost circling the block.",
        landmarks: ["Tsar Simeon I St.", "Mladost district", "Andrey Saharov St.", "Community Centre", "Cherveno Zname Stadium"],
        typicalJobs: [
          "9K BTU for a bedroom — quiet night mode",
          "12K BTU for an 18–25 m² living room",
          "Maintenance + swap old unit to new A+++",
        ],
        localTip:
          "New blocks in Mladost often forbid outdoor units on the main façade. We mount them on a side wall or inner courtyard — pre-approved with building manager.",
      },
      ru: {
        name: "Младост",
        metaTitle: "Монтаж кондиционера Младост — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Младост, Варна. Большая центральная жилая зона. От 190 €, монтаж в день обращения.",
        intro:
          "Младост — центральная жилая зона к западу от центра, смешанная застройка: панели и новостройки. Типичные монтажи: 9K и 12K BTU на стандартные квартиры. Близко к центру — приезжаем обычно за 30 минут после звонка, паркинг приличный, не теряем время.",
        landmarks: ["ул. Цар Симеон I", "ж/к Младост", "ул. Андрей Сахаров", "Народный читалище", "Стадион \"Червено знаме\""],
        typicalJobs: [
          "9K BTU в спальню — тихий ночной режим",
          "12K BTU в зал 18–25 м²",
          "Профилактика + замена на новый A+++",
        ],
        localTip:
          "В новых блоках Младост часто запрещено вешать внешний блок на главный фасад. Ставим на боковую стену или внутренний двор — согласуем с домкомом.",
      },
      ua: {
        name: "Младост",
        metaTitle: "Монтаж кондиціонера Младост — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера в Младост, Варна. Велика центральна житлова зона. Від 190 €, того ж дня.",
        intro:
          "Младост — центральна житлова зона на захід від центру, мішана забудова: панелі і новобудови. Типові монтажі: 9K та 12K BTU на стандартні квартири. Близько до центру — приїжджаємо за 30 хв після дзвінка, паркінг непоганий.",
        landmarks: ["вул. Цар Симеон I", "ж/к Младост", "вул. Андрій Сахаров", "Народне читалище", "Стадіон \"Червоне знамено\""],
        typicalJobs: [
          "9K BTU у спальню — тихий нічний режим",
          "12K BTU у зал 18–25 м²",
          "Профілактика + заміна на новий A+++",
        ],
        localTip:
          "У нових блоках Младост часто заборонено вішати зовнішній блок на головний фасад. Ставимо на бічну стіну або внутрішній двір — узгоджуємо з домкомом.",
      },
    },
  },
  {
    slug: "briz",
    geo: { lat: 43.2247, lng: 27.9544 },
    content: {
      bg: {
        name: "Бриз",
        metaTitle: "Монтаж климатик Бриз — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик в кв. Бриз, Варна. Премиум новостроящи се сгради. Дизайн-серии Daikin Emura, Mitsubishi.",
        intro:
          "Бриз е премиум жилищна зона между Морската градина и Чайка — основно нови сгради от последните 10 години, повишен среден чек. Тук много често правим дизайнерски серии: Daikin Emura (стъклен фронт), Mitsubishi MSZ-EF Black, Gree Lomo. Клиентите тук са взискателни към естетика — изпълняваме трасета в кутии в цвят на стената, не в стандартен бял PVC.",
        landmarks: ["ул. Поручик Минков", "ж.к. Бриз", "Морска градина", "ул. Кубан", "комплекс \"Слънчев бряг\""],
        typicalJobs: [
          "Daikin Emura 12K BTU — стъклен фронт, бял или черен",
          "Mitsubishi MSZ-EF премиум серия",
          "Мулти-сплит 5×9K за пентхаус",
        ],
        localTip:
          "За дизайнерски серии винаги препоръчваме trasse в боядисани PVC канали в цвят на стената — стандартен бял канал убива визията на 1500-евровия уред. Допълнително 25–40 € на стая.",
      },
      en: {
        name: "Briz",
        metaTitle: "AC Installation Briz — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Briz, Varna. Premium new builds. Designer series Daikin Emura, Mitsubishi.",
        intro:
          "Briz is a premium residential zone between Sea Garden and Chayka — mostly new builds from the last 10 years, higher average ticket. We install designer series here: Daikin Emura (glass front), Mitsubishi MSZ-EF Black, Gree Lomo. Customers care about aesthetics — we run pipes in wall-coloured trunking, not stock white PVC.",
        landmarks: ["Poruchik Minkov St.", "Briz district", "Sea Garden", "Kuban St.", "Slunchev Bryag complex"],
        typicalJobs: [
          "Daikin Emura 12K BTU — glass front, white or black",
          "Mitsubishi MSZ-EF premium series",
          "Multi-split 5×9K for a penthouse",
        ],
        localTip:
          "For designer series we recommend painted PVC trunking matching the wall — stock white tubing kills a €1500 unit's look. Extra €25–40 per room.",
      },
      ru: {
        name: "Бриз",
        metaTitle: "Монтаж кондиционера Бриз — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Бриз, Варна. Премиум новостройки. Дизайн-серии Daikin Emura, Mitsubishi.",
        intro:
          "Бриз — премиум жилая зона между Морским садом и Чайкой, в основном новостройки последних 10 лет, выше средний чек. Здесь часто монтируем дизайн-серии: Daikin Emura (стеклянный фронт), Mitsubishi MSZ-EF Black, Gree Lomo. Клиенты тут требовательны к эстетике — трассы тянем в окрашенных коробах под цвет стены, не в стандартном белом PVC.",
        landmarks: ["ул. Поручик Минков", "ж/к Бриз", "Морской сад", "ул. Кубан", "комплекс \"Слънчев бряг\""],
        typicalJobs: [
          "Daikin Emura 12K BTU — стеклянный фронт, белый или чёрный",
          "Mitsubishi MSZ-EF премиум-серия",
          "Мульти-сплит 5×9K для пентхауса",
        ],
        localTip:
          "Для дизайн-серий советуем окрашенный PVC-короб в цвет стены — стандартный белый убивает вид аппарата за 1500 €. Доплата 25–40 € за комнату.",
      },
      ua: {
        name: "Бриз",
        metaTitle: "Монтаж кондиціонера Бриз — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера в Бриз, Варна. Преміум новобудови. Дизайн-серії Daikin Emura, Mitsubishi.",
        intro:
          "Бриз — преміум житлова зона між Морським садом і Чайкою, в основному новобудови останніх 10 років. Тут часто монтуємо дизайн-серії: Daikin Emura (скляний фронт), Mitsubishi MSZ-EF Black, Gree Lomo. Клієнти вимогливі до естетики — траси тягнемо у фарбованих коробах під колір стіни.",
        landmarks: ["вул. Поручик Мінков", "ж/к Бриз", "Морський сад", "вул. Кубань", "комплекс \"Сонячний берег\""],
        typicalJobs: [
          "Daikin Emura 12K BTU — скляний фронт, білий або чорний",
          "Mitsubishi MSZ-EF преміум-серія",
          "Мульті-спліт 5×9K для пентхауса",
        ],
        localTip:
          "Для дизайн-серій радимо фарбований PVC-короб у колір стіни — стандартний білий вбиває вигляд апарата за 1500 €. Доплата 25–40 € за кімнату.",
      },
    },
  },
  {
    slug: "galata",
    geo: { lat: 43.1683, lng: 27.9272 },
    content: {
      bg: {
        name: "Галата",
        metaTitle: "Монтаж климатик Галата — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж на климатик в кв. Галата, Варна. Вили и къщи с морски изглед. Мулти-сплит и термопомпи. От 190 €.",
        intro:
          "Галата е южният район на Варна — основно вили, самостоятелни къщи и вилни зони с морски изглед. Тук близо до 80% от монтажите са в къщи: мулти-сплит 3–5 вътрешни тела на едно външно или термопомпи въздух-вода 8–14 kW. Стръмният терен и ветровитото крайбрежие изискват специфични скоби и допълнителна фиксация на трасета — идваме подготвени.",
        landmarks: ["ул. Морска", "вилна зона Галата", "Аладжа манастир", "ул. Македония", "плаж Карантината"],
        typicalJobs: [
          "Мулти-сплит 4×9K BTU за вила на два етажа",
          "Термопомпа въздух-вода 10 kW за самостоятелна къща",
          "Кулен сплит 24K BTU за всекидневна 40 м²",
        ],
        localTip:
          "Заради вятъра от морето в Галата всеки външен блок задължително го фиксираме с 4 анкера в бетон, не само 2 — обикновените скоби не държат при буря с 80 км/ч, а тук такива има всяка зима.",
      },
      en: {
        name: "Galata",
        metaTitle: "AC Installation Galata — Varna | Pesnopoets Clima",
        metaDescription:
          "AC installation in Galata, Varna. Villas and sea-view houses. Multi-splits and heat pumps. From €190.",
        intro:
          "Galata is Varna's southern district — mostly villas, detached houses and sea-view vacation zones. About 80% of jobs here are houses: multi-splits 3–5 indoor units on one outdoor, or air-to-water heat pumps 8–14 kW. Steep terrain and coastal wind demand specific brackets and extra pipe fixation — we come prepared.",
        landmarks: ["Morska St.", "Galata holiday zone", "Aladzha Monastery", "Macedonia St.", "Karantinata beach"],
        typicalJobs: [
          "Multi-split 4×9K BTU for a 2-storey villa",
          "Air-to-water heat pump 10 kW for a detached house",
          "Column-split 24K BTU for a 40 m² living room",
        ],
        localTip:
          "Sea wind in Galata mandates 4 concrete anchors per outdoor unit, not 2 — standard brackets fail in 80 km/h gusts, which we get every winter.",
      },
      ru: {
        name: "Галата",
        metaTitle: "Монтаж кондиционера Галата — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиционера в Галата, Варна. Виллы и дома с видом на море. Мульти-сплит и тепловые насосы. От 190 €.",
        intro:
          "Галата — южный район Варны, в основном виллы, частные дома и дачные зоны с видом на море. Около 80% монтажей тут — дома: мульти-сплит 3–5 внутренних блоков на один внешний, или тепловые насосы воздух-вода 8–14 kW. Крутой рельеф и ветер с моря требуют специальных кронштейнов и дополнительной фиксации трасс — приезжаем готовыми.",
        landmarks: ["ул. Морска", "дачная зона Галата", "Аладжа монастырь", "ул. Македония", "пляж Карантината"],
        typicalJobs: [
          "Мульти-сплит 4×9K BTU для двухэтажной виллы",
          "Тепловой насос воздух-вода 10 kW для частного дома",
          "Колонный сплит 24K BTU в гостиную 40 м²",
        ],
        localTip:
          "Из-за ветра с моря в Галате каждый внешний блок фиксируем 4 анкерами в бетон, не 2 — стандартные кронштейны не держат при порывах 80 км/ч, которые тут бывают каждую зиму.",
      },
      ua: {
        name: "Галата",
        metaTitle: "Монтаж кондиціонера Галата — Варна | Песнопоец Клима",
        metaDescription:
          "Монтаж кондиціонера в Галата, Варна. Вілли і будинки з видом на море. Мульті-спліт і теплові насоси. Від 190 €.",
        intro:
          "Галата — південний район Варни, переважно вілли, приватні будинки та дачні зони з видом на море. Близько 80% монтажів тут — будинки: мульті-спліт 3–5 внутрішніх блоків на один зовнішній, або теплові насоси повітря-вода 8–14 kW. Крутий рельєф і вітер з моря потребують спеціальних кронштейнів та додаткової фіксації трас.",
        landmarks: ["вул. Морська", "дачна зона Галата", "Аладжа монастир", "вул. Македонія", "пляж Карантина"],
        typicalJobs: [
          "Мульті-спліт 4×9K BTU для двоповерхової вілли",
          "Тепловий насос повітря-вода 10 kW для приватного будинку",
          "Колонний спліт 24K BTU у вітальню 40 м²",
        ],
        localTip:
          "Через вітер з моря в Галаті кожен зовнішній блок фіксуємо 4 анкерами в бетон, не 2 — стандартні кронштейни не тримають при поривах 80 км/год, які тут бувають щозими.",
      },
    },
  },
];

export const DISTRICT_SLUGS = DISTRICTS.map((d) => d.slug);

export function getDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}
