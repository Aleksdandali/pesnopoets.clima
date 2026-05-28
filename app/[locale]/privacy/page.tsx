import type { Metadata } from "next";
import Link from "next/link";

type Locale = "bg" | "en" | "ru" | "ua";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
const LAST_UPDATED = "2026-05-21";
const CONTACT_PHONE = "+359 877 670 222";
const CONTACT_EMAIL = "office@pesnopoets-clima.com";
const COMPANY_NAME = "Песнопоец Клима";
const COMPANY_LOCATION = "гр. Варна, България";

type Section = { h: string; p: string[] };
type Copy = {
  title: string;
  intro: string;
  lastUpdated: string;
  toc: string;
  sections: Record<
    | "controller"
    | "webData"
    | "mobileData"
    | "purposes"
    | "legalBasis"
    | "subprocessors"
    | "retention"
    | "rights"
    | "transfers"
    | "children"
    | "changes"
    | "contact"
    | "cookies",
    Section
  >;
};

const COPY: Record<Locale, Copy> = {
  bg: {
    title: "Политика за поверителност",
    intro:
      "Тази политика описва как Песнопоец Клима събира, използва и защитава личните данни на нашите клиенти, посетители на сайта и потребители на мобилното приложение.",
    lastUpdated: "Последна актуализация",
    toc: "Съдържание",
    sections: {
      controller: {
        h: "1. Кои сме ние (администратор на данни)",
        p: [
          `Администратор на личните данни е ${COMPANY_NAME}, със седалище в ${COMPANY_LOCATION}.`,
          `Контакт за въпроси относно поверителността: ${CONTACT_PHONE}, ${CONTACT_EMAIL}.`,
        ],
      },
      webData: {
        h: "2. Какви данни събираме през уебсайта",
        p: [
          "Когато попълвате форма за запитване или оферта (включително бизнес абонамент), събираме: име, телефонен номер, имейл адрес (опционално), населено място, тип обект и съобщение.",
          "Технически данни: IP адрес, тип браузър, посетени страници — обработват се чрез доставчика на хостинг (Vercel) за защита и измерване на трафика.",
          "Бисквитки за анализ (Google Analytics, Meta Pixel) се активират едва след вашето съгласие.",
        ],
      },
      mobileData: {
        h: "3. Какви данни събираме през мобилното приложение",
        p: [
          "Телефонен номер: използва се за вход в приложението чрез еднократен SMS код (без парола). Изпращането на SMS се извършва през Twilio.",
          "Име и адрес: попълват се от техника при активиране на профила ви след монтаж, за да можете да виждате собствените си климатици в приложението.",
          "Снимки на монтажа: вътрешно тяло, външно тяло и табелка със сериен номер. Качват се от техника при завършване на монтажа и са видими само на вас и нашия екип.",
          "Снимки в чата: ако решите да прикачите снимка в съобщение към техника, тя се качва в защитено хранилище.",
          "Местоположение (опционално): при подаване на нов монтаж от техника, се използва грубо местоположение за автоматично попълване на адреса. Можете да откажете това разрешение.",
          "Push токен: уникален идентификатор на устройството, чрез който получавате напомняния за профилактика и съобщения от техника. Не съдържа лична информация.",
          "Диагностични данни за срив (анонимизирани, без свързване с конкретен потребител): използват се само за стабилност на приложението.",
        ],
      },
      purposes: {
        h: "4. За какво използваме тези данни",
        p: [
          "Изпълнение на услугите: монтаж, профилактика, ремонт и гаранционно обслужване.",
          "Автоматични напомняния за годишна профилактика 14, 7 и 0 дни преди падежа.",
          "Двупосочна комуникация чрез чат между клиента и техника.",
          "Поддържане на история на сервиза за всеки климатик (какво е правено, кога, за каква цена).",
          "Издаване на фактури и счетоводно отчитане съгласно българското законодателство.",
          "Подобряване на сайта и приложението чрез агрегиран, анонимен анализ.",
        ],
      },
      legalBasis: {
        h: "5. Правно основание (GDPR член 6)",
        p: [
          "Изпълнение на договор (член 6, параграф 1, буква б): монтаж, обслужване, гаранция.",
          "Законово задължение (буква в): данъчно и счетоводно отчитане.",
          "Легитимен интерес (буква е): защита от измами, поддържане на сигурност на сайта.",
          "Съгласие (буква а): аналитични бисквитки, маркетингови съобщения.",
        ],
      },
      subprocessors: {
        h: "6. С кого споделяме данни (подизпълнители)",
        p: [
          "Supabase Inc. (САЩ/ЕС) — база данни, удостоверяване, хранилище за снимки. Договор за обработка на данни (DPA) подписан.",
          "Twilio Inc. (САЩ) — изпращане на SMS кодове за вход.",
          "Vercel Inc. (САЩ) — хостинг на сайта.",
          "Apple Inc. (САЩ) — Push Notification Service за iOS.",
          "Google LLC (САЩ) — Firebase Cloud Messaging за Android push, Google Analytics, Google Ads.",
          "Anthropic PBC (САЩ) — Claude AI за асистент в чата извън работно време. Изпращат се само текстовете на въпросите, без идентификатори на потребителя.",
          "Meta Platforms Ireland Ltd. (ЕС) — Meta Pixel за измерване на реклами, само при дадено съгласие.",
          "Не продаваме лични данни на трети страни.",
        ],
      },
      retention: {
        h: "7. Срок на съхранение",
        p: [
          "Данни за изпълнен монтаж и сервиз: 10 години след последното обслужване (счетоводен срок + гаранционни претенции).",
          "Чат съобщения: 3 години след последното съобщение.",
          "Запитвания през сайта без последвал договор: 12 месеца.",
          "Push токени: до отмяна на разрешението или деинсталиране на приложението.",
        ],
      },
      rights: {
        h: "8. Вашите права",
        p: [
          "Достъп до данните, които съхраняваме за вас.",
          "Корекция на неточни данни.",
          "Изтриване („правото да бъдеш забравен“) — при условие, че не противоречи на законови задължения.",
          "Ограничаване на обработката.",
          "Преносимост на данните.",
          "Възражение срещу обработване, основано на легитимен интерес.",
          "Оттегляне на съгласие по всяко време.",
          "Жалба до Комисията за защита на личните данни (КЗЛД) — kzld.bg.",
          `За упражняване на правата: ${CONTACT_EMAIL} или ${CONTACT_PHONE}. Отговаряме в срок до 30 дни.`,
        ],
      },
      transfers: {
        h: "9. Прехвърляне на данни извън ЕС",
        p: [
          "Някои от нашите подизпълнители (Supabase, Twilio, Vercel, Apple, Google, Anthropic) обработват данни в САЩ. Прехвърлянето се извършва съгласно стандартните договорни клаузи на Европейската комисия или сертификация по EU-US Data Privacy Framework.",
        ],
      },
      children: {
        h: "10. Деца",
        p: [
          "Услугите ни не са насочени към лица под 16 години. Не събираме съзнателно данни на деца. Ако сте родител и считате, че сме получили данни за вашето дете, моля свържете се с нас и ще ги изтрием.",
        ],
      },
      changes: {
        h: "11. Промени в политиката",
        p: [
          "Можем да актуализираме тази политика. При съществени промени ще уведомим клиентите си чрез приложението или имейл. Датата на последна актуализация е в горната част на тази страница.",
        ],
      },
      contact: {
        h: "12. Контакт",
        p: [
          `${COMPANY_NAME}, ${COMPANY_LOCATION}`,
          `Телефон: ${CONTACT_PHONE}`,
          `Имейл: ${CONTACT_EMAIL}`,
        ],
      },
      cookies: {
        h: "13. Бисквитки и подобни технологии",
        p: [
          "Използваме три категории бисквитки и локално съхранение, които можете да управлявате по всяко време чрез линка \"Бисквитки\" в долната част на сайта.",
          "Необходими (винаги активни): поддържат вход в акаунт, количка и базови мерки за сигурност. Без тях сайтът не работи.",
          "Аналитика (по съгласие): първостранна мерилка (анонимен идентификатор, изтрит след 90 дни), Google Analytics 4, Microsoft Clarity (топлинни карти и записи на сесии с маскирани полета).",
          "Маркетинг (по съгласие): Meta Pixel, TikTok Pixel и Google Ads — за измерване на реклами и ремаркетинг.",
          "Можете да оттеглите съгласието си по всяко време — оттеглянето не засяга обработката преди него. След оттегляне новите събития не се записват, а вече записаните се изтриват според сроковете в раздел 7.",
        ],
      },
    },
  },
  en: {
    title: "Privacy Policy",
    intro:
      "This policy describes how Pesnopoets Clima collects, uses and protects personal data of our customers, website visitors and mobile app users.",
    lastUpdated: "Last updated",
    toc: "Contents",
    sections: {
      controller: {
        h: "1. Who we are (data controller)",
        p: [
          `Data controller: ${COMPANY_NAME}, based in Varna, Bulgaria.`,
          `Privacy contact: ${CONTACT_PHONE}, ${CONTACT_EMAIL}.`,
        ],
      },
      webData: {
        h: "2. Data we collect through the website",
        p: [
          "When you submit an enquiry, quote request or business contract form, we collect: name, phone number, email (optional), city, property type and message.",
          "Technical data: IP address, browser type, pages visited — processed by our hosting provider (Vercel) for security and traffic measurement.",
          "Analytics cookies (Google Analytics, Meta Pixel) are activated only after your consent.",
        ],
      },
      mobileData: {
        h: "3. Data we collect through the mobile app",
        p: [
          "Phone number: used to sign in via one-time SMS code (no password). SMS delivery is handled by Twilio.",
          "Name and address: filled in by the technician when your profile is activated after installation, so you can see your own AC units in the app.",
          "Installation photos: indoor unit, outdoor unit and serial-number plate. Uploaded by the technician on installation completion, visible only to you and our team.",
          "Chat photos: if you attach a photo to a chat message, it is uploaded to a secured storage bucket.",
          "Location (optional): when a new installation is logged by the technician, coarse location is used to auto-fill the address. You can decline this permission.",
          "Push token: a device identifier that lets you receive maintenance reminders and messages from the technician. Contains no personal info.",
          "Anonymous crash diagnostics (not linked to a specific user) — used solely for app stability.",
        ],
      },
      purposes: {
        h: "4. What we use this data for",
        p: [
          "Service delivery: installation, maintenance, repair, warranty handling.",
          "Automatic reminders for annual maintenance 14, 7 and 0 days before due date.",
          "Two-way chat between customer and technician.",
          "Service history for each AC unit (what was done, when, for what price).",
          "Issuing invoices and accounting reports under Bulgarian law.",
          "Improving the website and app through aggregated, anonymous analytics.",
        ],
      },
      legalBasis: {
        h: "5. Legal basis (GDPR Art. 6)",
        p: [
          "Contract performance (Art. 6(1)(b)): installation, service, warranty.",
          "Legal obligation (Art. 6(1)(c)): tax and accounting reporting.",
          "Legitimate interest (Art. 6(1)(f)): fraud prevention, site security.",
          "Consent (Art. 6(1)(a)): analytics cookies, marketing communications.",
        ],
      },
      subprocessors: {
        h: "6. Who we share data with (sub-processors)",
        p: [
          "Supabase Inc. (US/EU) — database, auth, photo storage. DPA signed.",
          "Twilio Inc. (US) — sending SMS sign-in codes.",
          "Vercel Inc. (US) — website hosting.",
          "Apple Inc. (US) — Push Notification Service for iOS.",
          "Google LLC (US) — Firebase Cloud Messaging for Android push, Google Analytics, Google Ads.",
          "Anthropic PBC (US) — Claude AI for after-hours chat assistant. Only message text is sent, no user identifiers.",
          "Meta Platforms Ireland Ltd. (EU) — Meta Pixel for ad measurement, only with consent.",
          "We do not sell personal data to third parties.",
        ],
      },
      retention: {
        h: "7. Retention periods",
        p: [
          "Installation and service records: 10 years after the last service (accounting period + warranty claims).",
          "Chat messages: 3 years after the last message.",
          "Website enquiries without a follow-up contract: 12 months.",
          "Push tokens: until permission is revoked or the app is uninstalled.",
        ],
      },
      rights: {
        h: "8. Your rights",
        p: [
          "Access to the data we hold about you.",
          "Rectification of inaccurate data.",
          "Erasure (right to be forgotten) — subject to legal retention requirements.",
          "Restriction of processing.",
          "Data portability.",
          "Objection to processing based on legitimate interest.",
          "Withdrawal of consent at any time.",
          "Complaint to the Bulgarian Personal Data Protection Commission (kzld.bg).",
          `To exercise rights: ${CONTACT_EMAIL} or ${CONTACT_PHONE}. We reply within 30 days.`,
        ],
      },
      transfers: {
        h: "9. Transfers outside the EU",
        p: [
          "Some of our sub-processors (Supabase, Twilio, Vercel, Apple, Google, Anthropic) process data in the US. Transfers rely on the European Commission's Standard Contractual Clauses or EU-US Data Privacy Framework certification.",
        ],
      },
      children: {
        h: "10. Children",
        p: [
          "Our services are not directed at children under 16. We do not knowingly collect data from children. If you are a parent and believe we have received data about your child, please contact us and we will delete it.",
        ],
      },
      changes: {
        h: "11. Changes to this policy",
        p: [
          "We may update this policy. For material changes we will notify customers through the app or by email. The last updated date appears at the top of this page.",
        ],
      },
      contact: {
        h: "12. Contact",
        p: [
          `${COMPANY_NAME}, Varna, Bulgaria`,
          `Phone: ${CONTACT_PHONE}`,
          `Email: ${CONTACT_EMAIL}`,
        ],
      },
      cookies: {
        h: "13. Cookies and similar technologies",
        p: [
          "We use three categories of cookies and local storage. You can manage them at any time via the \"Cookies\" link in the site footer.",
          "Necessary (always on): power account sign-in, cart, and basic security. The site does not work without them.",
          "Analytics (with consent): first-party measurement (anonymous identifier, deleted after 90 days), Google Analytics 4, and Microsoft Clarity (heatmaps and session recordings with form fields masked).",
          "Marketing (with consent): Meta Pixel, TikTok Pixel, and Google Ads — for ad measurement and remarketing.",
          "You can withdraw consent at any time — withdrawal does not affect processing before it. After withdrawal, no new events are recorded; events already collected are deleted per the schedule in section 7.",
        ],
      },
    },
  },
  ru: {
    title: "Политика конфиденциальности",
    intro:
      "Эта политика описывает, как Песнопоец Клима собирает, использует и защищает персональные данные наших клиентов, посетителей сайта и пользователей мобильного приложения.",
    lastUpdated: "Последнее обновление",
    toc: "Содержание",
    sections: {
      controller: {
        h: "1. Кто мы (контролёр данных)",
        p: [
          `Контролёр персональных данных — ${COMPANY_NAME}, юридический адрес: Варна, Болгария.`,
          `Контакт по вопросам конфиденциальности: ${CONTACT_PHONE}, ${CONTACT_EMAIL}.`,
        ],
      },
      webData: {
        h: "2. Какие данные мы собираем через сайт",
        p: [
          "При заполнении формы запроса, расчёта или бизнес-абонемента мы собираем: имя, телефон, email (опционально), населённый пункт, тип объекта и сообщение.",
          "Технические данные: IP-адрес, тип браузера, посещённые страницы — обрабатываются хостинг-провайдером (Vercel) для безопасности и измерения трафика.",
          "Аналитические cookies (Google Analytics, Meta Pixel) активируются только после вашего согласия.",
        ],
      },
      mobileData: {
        h: "3. Какие данные мы собираем через мобильное приложение",
        p: [
          "Телефонный номер: используется для входа в приложение через одноразовый SMS-код (без пароля). Доставка SMS — через Twilio.",
          "Имя и адрес: заполняются техником при активации вашего профиля после монтажа, чтобы вы видели свои кондиционеры в приложении.",
          "Фотографии монтажа: внутренний блок, внешний блок и шильдик с серийным номером. Загружаются техником после завершения работ, видны только вам и нашей команде.",
          "Фотографии в чате: если вы прикрепляете фото к сообщению технику, оно загружается в защищённое хранилище.",
          "Местоположение (опционально): при создании нового монтажа техник использует приблизительное местоположение для автозаполнения адреса. Это разрешение можно отклонить.",
          "Push-токен: уникальный идентификатор устройства для получения напоминаний о профилактике и сообщений от техника. Не содержит личных данных.",
          "Анонимная диагностика сбоев (не связана с конкретным пользователем) — только для стабильности приложения.",
        ],
      },
      purposes: {
        h: "4. Для чего мы используем эти данные",
        p: [
          "Оказание услуг: монтаж, профилактика, ремонт, гарантийное обслуживание.",
          "Автоматические напоминания о ежегодной профилактике за 14, 7 и 0 дней до срока.",
          "Двусторонний чат между клиентом и техником.",
          "История сервиса по каждому кондиционеру (что сделано, когда, за какую цену).",
          "Выставление счетов и бухгалтерская отчётность согласно болгарскому законодательству.",
          "Улучшение сайта и приложения через агрегированную, анонимную аналитику.",
        ],
      },
      legalBasis: {
        h: "5. Правовое основание (GDPR ст. 6)",
        p: [
          "Исполнение договора (ст. 6(1)(b)): монтаж, обслуживание, гарантия.",
          "Законодательная обязанность (ст. 6(1)(c)): налоговая и бухгалтерская отчётность.",
          "Законный интерес (ст. 6(1)(f)): защита от мошенничества, безопасность сайта.",
          "Согласие (ст. 6(1)(a)): аналитические cookies, маркетинговые сообщения.",
        ],
      },
      subprocessors: {
        h: "6. С кем мы делимся данными (субпроцессоры)",
        p: [
          "Supabase Inc. (США/ЕС) — база данных, авторизация, хранилище фото. Подписан DPA.",
          "Twilio Inc. (США) — отправка SMS-кодов для входа.",
          "Vercel Inc. (США) — хостинг сайта.",
          "Apple Inc. (США) — Push Notification Service для iOS.",
          "Google LLC (США) — Firebase Cloud Messaging для Android, Google Analytics, Google Ads.",
          "Anthropic PBC (США) — Claude AI для ассистента в чате вне рабочего времени. Передаётся только текст вопроса, без идентификаторов пользователя.",
          "Meta Platforms Ireland Ltd. (ЕС) — Meta Pixel для измерения рекламы, только при согласии.",
          "Мы не продаём персональные данные третьим лицам.",
        ],
      },
      retention: {
        h: "7. Сроки хранения",
        p: [
          "Данные о монтаже и сервисе: 10 лет после последнего обслуживания (бухгалтерский срок + гарантийные претензии).",
          "Сообщения чата: 3 года после последнего сообщения.",
          "Запросы с сайта без последующего договора: 12 месяцев.",
          "Push-токены: до отзыва разрешения или удаления приложения.",
        ],
      },
      rights: {
        h: "8. Ваши права",
        p: [
          "Доступ к хранимым нами данным о вас.",
          "Исправление неточных данных.",
          "Удаление («право на забвение») — с учётом законодательных требований.",
          "Ограничение обработки.",
          "Переносимость данных.",
          "Возражение против обработки на основе законного интереса.",
          "Отзыв согласия в любой момент.",
          "Жалоба в Комиссию по защите персональных данных Болгарии (kzld.bg).",
          `Для реализации прав: ${CONTACT_EMAIL} или ${CONTACT_PHONE}. Отвечаем в течение 30 дней.`,
        ],
      },
      transfers: {
        h: "9. Передача данных за пределы ЕС",
        p: [
          "Некоторые субпроцессоры (Supabase, Twilio, Vercel, Apple, Google, Anthropic) обрабатывают данные в США. Передача осуществляется согласно стандартным договорным условиям Еврокомиссии или сертификации EU-US Data Privacy Framework.",
        ],
      },
      children: {
        h: "10. Дети",
        p: [
          "Наши услуги не адресованы лицам моложе 16 лет. Мы сознательно не собираем данные детей. Если вы родитель и считаете, что мы получили данные о вашем ребёнке, свяжитесь с нами — мы их удалим.",
        ],
      },
      changes: {
        h: "11. Изменения политики",
        p: [
          "Мы можем обновлять эту политику. О существенных изменениях уведомим клиентов через приложение или по email. Дата последнего обновления указана вверху страницы.",
        ],
      },
      contact: {
        h: "12. Контакт",
        p: [
          `${COMPANY_NAME}, Варна, Болгария`,
          `Телефон: ${CONTACT_PHONE}`,
          `Email: ${CONTACT_EMAIL}`,
        ],
      },
      cookies: {
        h: "13. Cookie и аналогичные технологии",
        p: [
          "Мы используем три категории cookie и локального хранилища. Вы можете управлять ими в любой момент по ссылке \"Cookie\" в подвале сайта.",
          "Необходимые (всегда включены): обеспечивают вход в аккаунт, корзину и базовую безопасность. Без них сайт не работает.",
          "Аналитика (по согласию): собственная аналитика (анонимный идентификатор, удаляется через 90 дней), Google Analytics 4, Microsoft Clarity (карты кликов и записи сессий со скрытыми полями форм).",
          "Маркетинг (по согласию): Meta Pixel, TikTok Pixel и Google Ads — для измерения рекламы и ремаркетинга.",
          "Согласие можно отозвать в любой момент — отзыв не затрагивает обработку до него. После отзыва новые события не записываются, уже собранные удаляются в сроки из раздела 7.",
        ],
      },
    },
  },
  ua: {
    title: "Політика конфіденційності",
    intro:
      "Ця політика описує, як Песнопоец Клима збирає, використовує та захищає персональні дані наших клієнтів, відвідувачів сайту та користувачів мобільного застосунку.",
    lastUpdated: "Останнє оновлення",
    toc: "Зміст",
    sections: {
      controller: {
        h: "1. Хто ми (контролер даних)",
        p: [
          `Контролер персональних даних — ${COMPANY_NAME}, юридична адреса: Варна, Болгарія.`,
          `Контакт з питань конфіденційності: ${CONTACT_PHONE}, ${CONTACT_EMAIL}.`,
        ],
      },
      webData: {
        h: "2. Які дані ми збираємо через сайт",
        p: [
          "Під час заповнення форми запиту, розрахунку або бізнес-абонемента ми збираємо: ім'я, телефон, email (за бажанням), населений пункт, тип об'єкта та повідомлення.",
          "Технічні дані: IP-адреса, тип браузера, відвідані сторінки — обробляються хостинг-провайдером (Vercel) для безпеки та вимірювання трафіку.",
          "Аналітичні cookies (Google Analytics, Meta Pixel) активуються лише після вашої згоди.",
        ],
      },
      mobileData: {
        h: "3. Які дані ми збираємо через мобільний застосунок",
        p: [
          "Телефонний номер: використовується для входу в застосунок через одноразовий SMS-код (без пароля). Доставка SMS — через Twilio.",
          "Ім'я та адреса: заповнюються технiком під час активації вашого профілю після монтажу, щоб ви бачили свої кондиціонери в застосунку.",
          "Фотографії монтажу: внутрішній блок, зовнішній блок та шильдик із серійним номером. Завантажуються технiком після завершення робіт, видимі лише вам та нашій команді.",
          "Фотографії у чаті: якщо ви прикріплюєте фото до повідомлення технiку, воно завантажується в захищене сховище.",
          "Місцеположення (опціонально): при створенні нового монтажу технiк використовує наближене місцеположення для автозаповнення адреси. Цей дозвіл можна відхилити.",
          "Push-токен: унікальний ідентифікатор пристрою для отримання нагадувань про профілактику та повідомлень від технiка. Не містить особистих даних.",
          "Анонімна діагностика збоїв (не пов'язана з конкретним користувачем) — лише для стабільності застосунку.",
        ],
      },
      purposes: {
        h: "4. Для чого ми використовуємо ці дані",
        p: [
          "Надання послуг: монтаж, профілактика, ремонт, гарантійне обслуговування.",
          "Автоматичні нагадування про щорічну профілактику за 14, 7 та 0 днів до терміну.",
          "Двосторонній чат між клієнтом і технiком.",
          "Історія сервісу для кожного кондиціонера (що зроблено, коли, за яку ціну).",
          "Виставлення рахунків та бухгалтерська звітність згідно з болгарським законодавством.",
          "Покращення сайту та застосунку через агреговану, анонімну аналітику.",
        ],
      },
      legalBasis: {
        h: "5. Правова підстава (GDPR ст. 6)",
        p: [
          "Виконання договору (ст. 6(1)(b)): монтаж, обслуговування, гарантія.",
          "Юридичне зобов'язання (ст. 6(1)(c)): податкова та бухгалтерська звітність.",
          "Законний інтерес (ст. 6(1)(f)): захист від шахрайства, безпека сайту.",
          "Згода (ст. 6(1)(a)): аналітичні cookies, маркетингові повідомлення.",
        ],
      },
      subprocessors: {
        h: "6. З ким ми ділимося даними (субпроцесори)",
        p: [
          "Supabase Inc. (США/ЄС) — база даних, авторизація, сховище фото. Підписано DPA.",
          "Twilio Inc. (США) — надсилання SMS-кодів для входу.",
          "Vercel Inc. (США) — хостинг сайту.",
          "Apple Inc. (США) — Push Notification Service для iOS.",
          "Google LLC (США) — Firebase Cloud Messaging для Android, Google Analytics, Google Ads.",
          "Anthropic PBC (США) — Claude AI як асистент у чаті поза робочим часом. Передається лише текст запитання, без ідентифікаторів користувача.",
          "Meta Platforms Ireland Ltd. (ЄС) — Meta Pixel для вимірювання реклами, лише за згоди.",
          "Ми не продаємо персональні дані третім сторонам.",
        ],
      },
      retention: {
        h: "7. Терміни зберігання",
        p: [
          "Дані про монтаж та сервіс: 10 років після останнього обслуговування (бухгалтерський термін + гарантійні претензії).",
          "Повідомлення чату: 3 роки після останнього повідомлення.",
          "Запити із сайту без подальшого договору: 12 місяців.",
          "Push-токени: до відкликання дозволу або видалення застосунку.",
        ],
      },
      rights: {
        h: "8. Ваші права",
        p: [
          "Доступ до даних, які ми зберігаємо про вас.",
          "Виправлення неточних даних.",
          "Видалення («право бути забутим») — з урахуванням законодавчих вимог.",
          "Обмеження обробки.",
          "Переносимість даних.",
          "Заперечення проти обробки на основі законного інтересу.",
          "Відкликання згоди в будь-який момент.",
          "Скарга до Комісії із захисту персональних даних Болгарії (kzld.bg).",
          `Для реалізації прав: ${CONTACT_EMAIL} або ${CONTACT_PHONE}. Відповідаємо протягом 30 днів.`,
        ],
      },
      transfers: {
        h: "9. Передача даних за межі ЄС",
        p: [
          "Деякі субпроцесори (Supabase, Twilio, Vercel, Apple, Google, Anthropic) обробляють дані у США. Передача здійснюється згідно зі стандартними договірними умовами Єврокомісії або сертифікацією EU-US Data Privacy Framework.",
        ],
      },
      children: {
        h: "10. Діти",
        p: [
          "Наші послуги не адресовані особам молодше 16 років. Ми свідомо не збираємо дані дітей. Якщо ви батьки і вважаєте, що ми отримали дані про вашу дитину, зв'яжіться з нами — ми їх видалимо.",
        ],
      },
      changes: {
        h: "11. Зміни політики",
        p: [
          "Ми можемо оновлювати цю політику. Про суттєві зміни повідомимо клієнтів через застосунок або email. Дату останнього оновлення зазначено вгорі сторінки.",
        ],
      },
      contact: {
        h: "12. Контакт",
        p: [
          `${COMPANY_NAME}, Варна, Болгарія`,
          `Телефон: ${CONTACT_PHONE}`,
          `Email: ${CONTACT_EMAIL}`,
        ],
      },
      cookies: {
        h: "13. Cookie та подібні технології",
        p: [
          "Ми використовуємо три категорії cookie та локального сховища. Керувати ними можна будь-коли через посилання \"Cookie\" у підвалі сайту.",
          "Необхідні (завжди увімкнені): забезпечують вхід до акаунта, кошик і базову безпеку. Без них сайт не працює.",
          "Аналітика (за згодою): власна аналітика (анонімний ідентифікатор, видаляється через 90 днів), Google Analytics 4, Microsoft Clarity (карти кліків і записи сесій з прихованими полями форм).",
          "Маркетинг (за згодою): Meta Pixel, TikTok Pixel та Google Ads — для вимірювання реклами та ремаркетингу.",
          "Згоду можна відкликати будь-коли — відкликання не впливає на обробку до нього. Після відкликання нові події не записуються, вже зібрані видаляються у строки з розділу 7.",
        ],
      },
    },
  },
};

function pickLocale(value: string): Locale {
  if (value === "en" || value === "ru" || value === "ua") return value;
  return "bg";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = pickLocale(locale);
  const c = COPY[loc];
  // Trim intro to ≤160 chars for meta description (SerpStat 2026-05-28 flagged 168 chars).
  const metaDesc =
    c.intro.length > 158
      ? c.intro.slice(0, 157).replace(/[\s,.;:!?]+$/, "") + "…"
      : c.intro;
  return {
    title: `${c.title} | ${COMPANY_NAME}`,
    description: metaDesc,
    alternates: {
      canonical: `${SITE_URL}/${loc}/privacy`,
      languages: {
        bg: `${SITE_URL}/bg/privacy`,
        en: `${SITE_URL}/en/privacy`,
        ru: `${SITE_URL}/ru/privacy`,
        uk: `${SITE_URL}/ua/privacy`,
        "x-default": `${SITE_URL}/bg/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = pickLocale(locale);
  const c = COPY[loc];
  const sectionKeys = Object.keys(c.sections) as Array<keyof Copy["sections"]>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{c.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {c.lastUpdated}: {LAST_UPDATED}
      </p>
      <p className="text-base text-foreground/90 mb-10">{c.intro}</p>

      <nav className="mb-10 rounded-lg border border-border bg-muted/40 p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">{c.toc}</h2>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
          {sectionKeys.map((k) => (
            <li key={k}>
              <Link href={`#${k}`} className="hover:text-foreground hover:underline">
                {c.sections[k].h.replace(/^\d+\.\s*/, "")}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-8">
        {sectionKeys.map((k) => {
          const s = c.sections[k];
          return (
            <section key={k} id={k} className="scroll-mt-20">
              <h2 className="text-xl font-semibold text-foreground mb-3">{s.h}</h2>
              <div className="space-y-2 text-muted-foreground">
                {s.p.map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
