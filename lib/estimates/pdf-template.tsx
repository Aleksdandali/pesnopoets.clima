/**
 * Professional commercial proposal (КП) PDF template.
 * Brand colors from Песнопоец Клима logo: orange #E8711A + blue #2E6CB5
 * Supports 4 languages: BG, EN, RU, UA
 */
import React from "react";
import {
  Document, Page, View, Text, Image, StyleSheet, Font,
} from "@react-pdf/renderer";
import type { ExtraItem } from "./calculate";

export interface EquipmentLine {
  product_id: number | null;
  manufacturer: string;
  title: string;
  btu: number | null;
  qty: number;
  unit_price_eur: number;
  total_eur: number;
}

export interface LaborLine {
  preset_key: string | null;
  title: string;
  unit: string;
  qty: number;
  unit_price_eur: number;
  total_eur: number;
}

// Roboto — full TTF with Latin + Cyrillic, hosted locally
const FONT_BASE = "https://pesnopoets-clima.com/fonts";
Font.register({
  family: "Roboto",
  fonts: [
    { src: `${FONT_BASE}/Roboto-Regular.ttf`, fontWeight: 400 },
    { src: `${FONT_BASE}/Roboto-Medium.ttf`, fontWeight: 500 },
    { src: `${FONT_BASE}/Roboto-Bold.ttf`, fontWeight: 700 },
  ],
});

// Disable hyphenation for Cyrillic
Font.registerHyphenationCallback((word) => [word]);

// Brand colors from logo
const ORANGE = "#E8711A";
const BLUE = "#2E6CB5";
const DARK = "#1a1a2e";
const GRAY = "#6b7280";
const LIGHT_BG = "#f8fafc";
const LIGHT_ORANGE = "#fef3e2";
const LIGHT_BLUE = "#eef4fb";

const s = StyleSheet.create({
  page: { padding: 0, fontFamily: "Roboto", fontSize: 10, color: DARK },

  // Header
  headerBand: { backgroundColor: DARK, paddingHorizontal: 40, paddingVertical: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 55, height: 55 },
  brandName: { fontSize: 16, fontWeight: 700, color: "#ffffff" },
  brandSub: { fontSize: 9, fontWeight: 400, color: "#94a3b8", marginTop: 2 },
  contactArea: { textAlign: "right" },
  contactLine: { fontSize: 8, fontWeight: 400, color: "#94a3b8", marginTop: 1.5 },
  contactBold: { fontSize: 9, fontWeight: 700, color: "#ffffff" },

  accentStripe: { height: 4, backgroundColor: ORANGE },

  body: { paddingHorizontal: 40, paddingTop: 25 },

  // Title
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700, color: DARK },
  titleNum: { fontSize: 20, fontWeight: 700, color: ORANGE },
  dateBox: { textAlign: "right" },
  dateLabel: { fontSize: 8, fontWeight: 500, color: GRAY, letterSpacing: 1 },
  dateValue: { fontSize: 10, fontWeight: 500, color: DARK, marginTop: 2 },

  // Client
  clientCard: { backgroundColor: LIGHT_BG, borderRadius: 8, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: ORANGE, borderLeftStyle: "solid" },
  clientTitle: { fontSize: 8, fontWeight: 700, color: ORANGE, letterSpacing: 1.5, marginBottom: 8 },
  clientRow: { flexDirection: "row", marginBottom: 4 },
  clientLabel: { fontSize: 9, fontWeight: 400, color: GRAY, width: 70 },
  clientValue: { fontSize: 10, fontWeight: 500, color: DARK },

  // BTU
  btuCard: { backgroundColor: LIGHT_BLUE, borderRadius: 8, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: BLUE, borderLeftStyle: "solid" },
  btuHeader: { fontSize: 8, fontWeight: 700, color: BLUE, letterSpacing: 1.5, marginBottom: 6 },
  btuValue: { fontSize: 26, fontWeight: 700, color: DARK },
  btuSub: { fontSize: 9, fontWeight: 400, color: GRAY, marginTop: 4 },
  btuNote: { fontSize: 8, fontWeight: 400, color: BLUE, marginTop: 2 },

  // Product
  productCard: { backgroundColor: LIGHT_ORANGE, borderRadius: 8, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: ORANGE, borderLeftStyle: "solid" },
  productTitle: { fontSize: 8, fontWeight: 700, color: ORANGE, letterSpacing: 1.5, marginBottom: 6 },
  productName: { fontSize: 12, fontWeight: 700, color: DARK },
  productPrice: { fontSize: 16, fontWeight: 700, color: ORANGE, marginTop: 4 },

  // Pricing table
  sectionTitle: { fontSize: 8, fontWeight: 700, color: BLUE, letterSpacing: 1.5, marginBottom: 10 },
  tableHeader: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 12, backgroundColor: DARK, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  tableHeaderText: { fontSize: 8, fontWeight: 700, color: "#ffffff", letterSpacing: 0.5 },
  row: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", borderBottomStyle: "solid" },
  rowAlt: { backgroundColor: LIGHT_BG },
  rowLabel: { flex: 1, fontSize: 10, fontWeight: 400, color: DARK },
  rowValue: { width: 90, fontSize: 10, fontWeight: 500, color: DARK, textAlign: "right" },

  totalRow: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 12, backgroundColor: ORANGE, borderRadius: 6, marginTop: 6 },
  totalLabel: { flex: 1, fontSize: 12, fontWeight: 700, color: "#ffffff" },
  totalValue: { width: 100, fontSize: 12, fontWeight: 700, color: "#ffffff", textAlign: "right" },

  // Multi-line tables (Equipment / Labor)
  mlSection: { marginBottom: 14 },
  mlHeaderEq: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: ORANGE, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  mlHeaderLb: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: BLUE, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  mlHeaderText: { fontSize: 8, fontWeight: 700, color: "#ffffff", letterSpacing: 0.5 },
  mlRow: { flexDirection: "row", paddingVertical: 7, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", borderBottomStyle: "solid" },
  mlRowAlt: { backgroundColor: LIGHT_BG },
  mlCellNum: { width: 22, fontSize: 9, fontWeight: 500, color: GRAY },
  mlCellTitle: { flex: 1, fontSize: 9.5, fontWeight: 500, color: DARK, paddingRight: 6 },
  mlCellSub: { fontSize: 8, fontWeight: 400, color: GRAY, marginTop: 1.5 },
  mlCellSm: { width: 50, fontSize: 9, fontWeight: 400, color: DARK, textAlign: "center" },
  mlCellMd: { width: 70, fontSize: 9, fontWeight: 500, color: DARK, textAlign: "right" },
  mlCellLg: { width: 80, fontSize: 9.5, fontWeight: 700, color: DARK, textAlign: "right" },
  mlSubtotalRow: { flexDirection: "row", paddingVertical: 9, paddingHorizontal: 10, backgroundColor: DARK, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  mlSubtotalLabel: { flex: 1, fontSize: 10, fontWeight: 700, color: "#ffffff" },
  mlSubtotalValue: { width: 80, fontSize: 11, fontWeight: 700, color: "#ffffff", textAlign: "right" },

  // Grand total
  grandTotal: { backgroundColor: DARK, borderRadius: 8, padding: 20, marginTop: 12, marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  grandLabel: { fontSize: 11, fontWeight: 400, color: "#94a3b8" },
  grandLabelBig: { fontSize: 13, fontWeight: 700, color: "#ffffff", marginTop: 2 },
  grandValue: { fontSize: 28, fontWeight: 700, color: "#ffffff" },
  grandValueSub: { fontSize: 11, fontWeight: 400, color: "#94a3b8", textAlign: "right", marginTop: 2 },

  // Conditions
  conditionsCard: { borderRadius: 8, borderWidth: 1, borderColor: "#e2e8f0", borderStyle: "solid", padding: 16, marginBottom: 20 },
  condTitle: { fontSize: 8, fontWeight: 700, color: DARK, letterSpacing: 1.5, marginBottom: 8 },
  condItem: { fontSize: 8, fontWeight: 400, color: GRAY, marginBottom: 3, paddingLeft: 10 },

  // Footer
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: DARK, paddingHorizontal: 40, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 7, fontWeight: 400, color: "#94a3b8" },
  footerBrand: { fontSize: 8, fontWeight: 700, color: ORANGE },
});

/* ─── Translations ─── */
type PdfLang = "bg" | "en" | "ru" | "ua";

const T: Record<PdfLang, {
  title: string; date: string; validUntil: string;
  client: string; name: string; phone: string; address: string;
  btuHeader: string; forRoom: string;
  product: string;
  services: string; description: string; price: string;
  standardInstall: string; extraPipe: string; installTotal: string;
  acAndInstall: string; totalSum: string; finalPrice: string; currency: string;
  conditions: string;
  cond1: string; cond2: string; cond3: string; cond4: string; cond5: string; cond6: string;
  cond7prefix: string; cond7suffix: string;
  footerLabel: string;
  // Multi-line tables
  equipmentTable: string; laborTable: string;
  colNum: string; colManufacturer: string; colModel: string;
  colQty: string; colUnit: string; colUnitPrice: string; colTotal: string;
  subtotalEquipment: string; subtotalLabor: string;
  kpNumber: string;
}> = {
  bg: {
    title: "Оферта", date: "Дата", validUntil: "Валидна до",
    client: "КЛИЕНТ", name: "Име", phone: "Телефон", address: "Адрес",
    btuHeader: "ПРЕПОРЪЧАНА МОЩНОСТ", forRoom: "За помещение",
    product: "ПРЕПОРЪЧАН КЛИМАТИК",
    services: "МОНТАЖ И УСЛУГИ", description: "Описание", price: "Цена",
    standardInstall: "Стандартен монтаж", extraPipe: "Допълнителна тръба", installTotal: "Монтаж общо",
    acAndInstall: "Климатик + монтаж", totalSum: "Обща сума", finalPrice: "Крайна цена", currency: "лв",
    equipmentTable: "ОБОРУДВАНЕ", laborTable: "РАБОТА",
    colNum: "№", colManufacturer: "Производител", colModel: "Модел / BTU",
    colQty: "К-во", colUnit: "Ед.", colUnitPrice: "Ед. цена", colTotal: "Общо",
    subtotalEquipment: "Оборудване общо", subtotalLabor: "Работа общо",
    kpNumber: "КП №",
    conditions: "УСЛОВИЯ",
    cond1: "Стандартен монтаж включва 3м медна тръба, материали, вакуумиране и пускане",
    cond2: "Гаранция монтаж: 12 месеца",
    cond3: "Гаранция климатик: до 5 години (от производителя)",
    cond4: "Плащане: в брой, банков превод или карта на място",
    cond5: "Безплатен оглед на място преди монтаж",
    cond6: "Цените са окончателни — без скрити разходи",
    cond7prefix: "Предложението е валидно ", cond7suffix: " дни от датата на издаване",
    footerLabel: "Оферта",
  },
  en: {
    title: "Quotation", date: "Date", validUntil: "Valid until",
    client: "CLIENT", name: "Name", phone: "Phone", address: "Address",
    btuHeader: "RECOMMENDED CAPACITY", forRoom: "For room",
    product: "RECOMMENDED AC UNIT",
    services: "INSTALLATION & SERVICES", description: "Description", price: "Price",
    standardInstall: "Standard installation", extraPipe: "Extra pipe", installTotal: "Installation total",
    acAndInstall: "AC unit + installation", totalSum: "Total", finalPrice: "Final price", currency: "BGN",
    equipmentTable: "EQUIPMENT", laborTable: "LABOR",
    colNum: "#", colManufacturer: "Manufacturer", colModel: "Model / BTU",
    colQty: "Qty", colUnit: "Unit", colUnitPrice: "Unit price", colTotal: "Total",
    subtotalEquipment: "Equipment subtotal", subtotalLabor: "Labor subtotal",
    kpNumber: "Quote No.",
    conditions: "TERMS & CONDITIONS",
    cond1: "Standard installation includes 3m copper pipe, materials, vacuum and commissioning",
    cond2: "Installation warranty: 12 months",
    cond3: "AC warranty: up to 5 years (manufacturer)",
    cond4: "Payment: cash, bank transfer or card on-site",
    cond5: "Free on-site inspection before installation",
    cond6: "Prices are final — no hidden costs",
    cond7prefix: "This quotation is valid for ", cond7suffix: " days from date of issue",
    footerLabel: "Quotation",
  },
  ru: {
    title: "Коммерческое предложение", date: "Дата", validUntil: "Действует до",
    client: "КЛИЕНТ", name: "Имя", phone: "Телефон", address: "Адрес",
    btuHeader: "РЕКОМЕНДУЕМАЯ МОЩНОСТЬ", forRoom: "Для помещения",
    product: "РЕКОМЕНДУЕМЫЙ КОНДИЦИОНЕР",
    services: "МОНТАЖ И УСЛУГИ", description: "Описание", price: "Цена",
    standardInstall: "Стандартный монтаж", extraPipe: "Дополнительная труба", installTotal: "Монтаж итого",
    acAndInstall: "Кондиционер + монтаж", totalSum: "Общая сума", finalPrice: "Итого к оплате", currency: "лв",
    equipmentTable: "ОБОРУДОВАНИЕ", laborTable: "РАБОТЫ",
    colNum: "№", colManufacturer: "Производитель", colModel: "Модель / BTU",
    colQty: "Кол-во", colUnit: "Ед.", colUnitPrice: "Цена за ед.", colTotal: "Сумма",
    subtotalEquipment: "Оборудование, итого", subtotalLabor: "Работы, итого",
    kpNumber: "КП №",
    conditions: "УСЛОВИЯ",
    cond1: "Стандартный монтаж включает 3м медной трубы, материалы, вакуумирование и пуск",
    cond2: "Гарантия на монтаж: 12 месяцев",
    cond3: "Гарантия на кондиционер: до 5 лет (производитель)",
    cond4: "Оплата: наличные, банковский перевод или карта на месте",
    cond5: "Бесплатный осмотр на месте перед монтажом",
    cond6: "Цены окончательные — без скрытых расходов",
    cond7prefix: "Предложение действует ", cond7suffix: " дней с даты выдачи",
    footerLabel: "КП",
  },
  ua: {
    title: "Комерцiйна пропозицiя", date: "Дата", validUntil: "Дiйсна до",
    client: "КЛIЄНТ", name: "Iм'я", phone: "Телефон", address: "Адреса",
    btuHeader: "РЕКОМЕНДОВАНА ПОТУЖНIСТЬ", forRoom: "Для примiщення",
    product: "РЕКОМЕНДОВАНИЙ КОНДИЦIОНЕР",
    services: "МОНТАЖ ТА ПОСЛУГИ", description: "Опис", price: "Цiна",
    standardInstall: "Стандартний монтаж", extraPipe: "Додаткова труба", installTotal: "Монтаж разом",
    acAndInstall: "Кондицiонер + монтаж", totalSum: "Загальна сума", finalPrice: "До сплати", currency: "лв",
    equipmentTable: "ОБЛАДНАННЯ", laborTable: "РОБОТИ",
    colNum: "№", colManufacturer: "Виробник", colModel: "Модель / BTU",
    colQty: "К-сть", colUnit: "Од.", colUnitPrice: "Цiна за од.", colTotal: "Сума",
    subtotalEquipment: "Обладнання, разом", subtotalLabor: "Роботи, разом",
    kpNumber: "КП №",
    conditions: "УМОВИ",
    cond1: "Стандартний монтаж включає 3м мiдної труби, матерiали, вакуумування та пуск",
    cond2: "Гарантiя на монтаж: 12 мiсяцiв",
    cond3: "Гарантiя на кондицiонер: до 5 рокiв (виробник)",
    cond4: "Оплата: готiвка, банкiвський переказ або картка на мiсцi",
    cond5: "Безкоштовний огляд на мiсцi перед монтажем",
    cond6: "Цiни остаточнi — без прихованих витрат",
    cond7prefix: "Пропозицiя дiйсна ", cond7suffix: " днiв з дати видачi",
    footerLabel: "КП",
  },
};

interface PDFProps {
  id: number;
  date: string;
  clientName: string | null;
  clientPhone: string | null;
  clientAddress: string | null;
  area_m2: number | null;
  recommendedBtu: number;
  btuNotes: string[];
  baseInstallBgn: number;
  extraPipeM: number;
  extraPipeBgn: number;
  extras: ExtraItem[];
  totalInstallBgn: number;
  productTitle: string | null;
  productPriceEur: number | null;
  validDays?: number;
  language?: PdfLang;
  // Multi-line additions (optional — empty arrays => fall back to single-product layout)
  equipmentLines?: EquipmentLine[];
  laborLines?: LaborLine[];
  kpNumber?: string | null;
  validUntil?: string | null;
}

const EUR_TO_BGN = 1.95583;
const LOGO_URL = "https://pesnopoets-clima.com/logo.png";

export function EstimatePDF(props: PDFProps) {
  const lang = props.language || "bg";
  const t = T[lang];
  const validDays = props.validDays || 14;
  const created = new Date(props.date);
  const validUntil = props.validUntil ? new Date(props.validUntil) : new Date(created.getTime() + validDays * 86400000);
  const fmtDate = (d: Date) => d.toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric" });

  const equipmentLines = props.equipmentLines ?? [];
  const laborLines = props.laborLines ?? [];
  const isMultiLine = equipmentLines.length > 0 || laborLines.length > 0;

  const equipmentSubtotalEur = equipmentLines.reduce((sum, l) => sum + (l.total_eur || l.qty * l.unit_price_eur), 0);
  const laborSubtotalEur = laborLines.reduce((sum, l) => sum + (l.total_eur || l.qty * l.unit_price_eur), 0);

  const productBgn = props.productPriceEur ? Math.round(props.productPriceEur * EUR_TO_BGN) : 0;
  const legacyGrandBgn = props.totalInstallBgn + productBgn;

  const grandTotalEur = isMultiLine
    ? Math.round(equipmentSubtotalEur + laborSubtotalEur)
    : Math.round(legacyGrandBgn / EUR_TO_BGN);
  const grandTotalBgn = isMultiLine
    ? Math.round((equipmentSubtotalEur + laborSubtotalEur) * EUR_TO_BGN)
    : legacyGrandBgn;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Dark header */}
        <View style={s.headerBand}>
          <View style={s.logoArea}>
            <Image src={LOGO_URL} style={s.logo} />
            <View>
              <Text style={s.brandName}>{"ПЕСНОПОЕЦ КЛИМА"}</Text>
              <Text style={s.brandSub}>{"Продажба, монтаж и сервиз на климатици"}</Text>
            </View>
          </View>
          <View style={s.contactArea}>
            <Text style={s.contactBold}>{"+359 87 799 8795"}</Text>
            <Text style={s.contactLine}>{"pesnopoetsklima@gmail.com"}</Text>
            <Text style={s.contactLine}>{"pesnopoets-clima.com"}</Text>
            <Text style={s.contactLine}>{"Варна, България"}</Text>
          </View>
        </View>

        {/* Orange stripe */}
        <View style={s.accentStripe} />

        {/* Body */}
        <View style={s.body}>
          {/* Title */}
          <View style={s.titleRow}>
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <Text style={s.title}>{t.title}</Text>
                <Text style={s.titleNum}>{"#"}{props.id}</Text>
              </View>
              {props.kpNumber && (
                <Text style={{ fontSize: 9, fontWeight: 500, color: GRAY, marginTop: 4 }}>
                  {t.kpNumber} {props.kpNumber}
                </Text>
              )}
            </View>
            <View style={s.dateBox}>
              <Text style={s.dateLabel}>{t.date.toUpperCase()}</Text>
              <Text style={s.dateValue}>{fmtDate(created)}</Text>
              <Text style={{ ...s.dateLabel, marginTop: 6 }}>{t.validUntil.toUpperCase()}</Text>
              <Text style={s.dateValue}>{fmtDate(validUntil)}</Text>
            </View>
          </View>

          {/* Client */}
          {(props.clientName || props.clientPhone || props.clientAddress) && (
            <View style={s.clientCard}>
              <Text style={s.clientTitle}>{t.client}</Text>
              {props.clientName && (
                <View style={s.clientRow}>
                  <Text style={s.clientLabel}>{t.name}:</Text>
                  <Text style={s.clientValue}>{props.clientName}</Text>
                </View>
              )}
              {props.clientPhone && (
                <View style={s.clientRow}>
                  <Text style={s.clientLabel}>{t.phone}:</Text>
                  <Text style={s.clientValue}>{props.clientPhone}</Text>
                </View>
              )}
              {props.clientAddress && (
                <View style={s.clientRow}>
                  <Text style={s.clientLabel}>{t.address}:</Text>
                  <Text style={s.clientValue}>{props.clientAddress}</Text>
                </View>
              )}
            </View>
          )}

          {/* BTU */}
          <View style={s.btuCard}>
            <Text style={s.btuHeader}>{t.btuHeader}</Text>
            <Text style={s.btuValue}>{props.recommendedBtu.toLocaleString()} BTU</Text>
            {props.area_m2 && <Text style={s.btuSub}>{t.forRoom} {props.area_m2} {"\u043C\u00B2"}</Text>}
            {props.btuNotes.map((n, i) => <Text key={i} style={s.btuNote}>{"\u2022 "}{n}</Text>)}
          </View>

          {/* ── Single-product fallback (legacy) ── */}
          {!isMultiLine && props.productTitle && (
            <View style={s.productCard}>
              <Text style={s.productTitle}>{t.product}</Text>
              <Text style={s.productName}>{props.productTitle}</Text>
              {props.productPriceEur && (
                <Text style={s.productPrice}>
                  {props.productPriceEur.toFixed(0)} EUR ({productBgn} {t.currency})
                </Text>
              )}
            </View>
          )}

          {!isMultiLine && (
            <>
              <Text style={s.sectionTitle}>{t.services}</Text>

              <View style={s.tableHeader}>
                <Text style={{ ...s.tableHeaderText, flex: 1 }}>{t.description}</Text>
                <Text style={{ ...s.tableHeaderText, width: 90, textAlign: "right" }}>{t.price}</Text>
              </View>

              <View style={[s.row, s.rowAlt]}>
                <Text style={s.rowLabel}>{t.standardInstall} ({props.recommendedBtu <= 14000 ? "до 14K" : "до 24K"}{" BTU, 3м)"}</Text>
                <Text style={s.rowValue}>{props.baseInstallBgn} {t.currency}</Text>
              </View>

              {props.extraPipeM > 0 && (
                <View style={s.row}>
                  <Text style={s.rowLabel}>{t.extraPipe} ({props.extraPipeM} м)</Text>
                  <Text style={s.rowValue}>{props.extraPipeBgn} {t.currency}</Text>
                </View>
              )}

              {props.extras.map((extra, i) => (
                <View key={i} style={[s.row, i % 2 === 0 ? s.rowAlt : {}]}>
                  <Text style={s.rowLabel}>{extra.name}</Text>
                  <Text style={s.rowValue}>{extra.price_bgn} {t.currency}</Text>
                </View>
              ))}

              <View style={s.totalRow}>
                <Text style={s.totalLabel}>{t.installTotal}:</Text>
                <Text style={s.totalValue}>{props.totalInstallBgn} {t.currency}</Text>
              </View>
            </>
          )}

          {/* ── Multi-line: Equipment table ── */}
          {equipmentLines.length > 0 && (
            <View style={s.mlSection}>
              <Text style={s.sectionTitle}>{t.equipmentTable}</Text>
              <View style={s.mlHeaderEq}>
                <Text style={{ ...s.mlHeaderText, width: 22 }}>{t.colNum}</Text>
                <Text style={{ ...s.mlHeaderText, flex: 1 }}>{t.colManufacturer + " / " + t.colModel}</Text>
                <Text style={{ ...s.mlHeaderText, width: 50, textAlign: "center" }}>{t.colQty}</Text>
                <Text style={{ ...s.mlHeaderText, width: 70, textAlign: "right" }}>{t.colUnitPrice}</Text>
                <Text style={{ ...s.mlHeaderText, width: 80, textAlign: "right" }}>{t.colTotal}</Text>
              </View>
              {equipmentLines.map((line, i) => {
                const total = line.total_eur || line.qty * line.unit_price_eur;
                return (
                  <View key={i} style={[s.mlRow, i % 2 === 1 ? s.mlRowAlt : {}]}>
                    <Text style={s.mlCellNum}>{i + 1}</Text>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={s.mlCellTitle}>
                        {line.manufacturer ? line.manufacturer + " " : ""}{line.title}
                      </Text>
                      {line.btu && (
                        <Text style={s.mlCellSub}>{line.btu.toLocaleString()} BTU</Text>
                      )}
                    </View>
                    <Text style={s.mlCellSm}>{line.qty}</Text>
                    <Text style={s.mlCellMd}>{line.unit_price_eur.toFixed(0)} EUR</Text>
                    <Text style={s.mlCellLg}>{total.toFixed(0)} EUR</Text>
                  </View>
                );
              })}
              <View style={s.mlSubtotalRow}>
                <Text style={s.mlSubtotalLabel}>{t.subtotalEquipment}</Text>
                <Text style={s.mlSubtotalValue}>{equipmentSubtotalEur.toFixed(0)} EUR</Text>
              </View>
            </View>
          )}

          {/* ── Multi-line: Labor table ── */}
          {laborLines.length > 0 && (
            <View style={s.mlSection}>
              <Text style={s.sectionTitle}>{t.laborTable}</Text>
              <View style={s.mlHeaderLb}>
                <Text style={{ ...s.mlHeaderText, width: 22 }}>{t.colNum}</Text>
                <Text style={{ ...s.mlHeaderText, flex: 1 }}>{t.description}</Text>
                <Text style={{ ...s.mlHeaderText, width: 50, textAlign: "center" }}>{t.colUnit}</Text>
                <Text style={{ ...s.mlHeaderText, width: 50, textAlign: "center" }}>{t.colQty}</Text>
                <Text style={{ ...s.mlHeaderText, width: 70, textAlign: "right" }}>{t.colUnitPrice}</Text>
                <Text style={{ ...s.mlHeaderText, width: 80, textAlign: "right" }}>{t.colTotal}</Text>
              </View>
              {laborLines.map((line, i) => {
                const total = line.total_eur || line.qty * line.unit_price_eur;
                return (
                  <View key={i} style={[s.mlRow, i % 2 === 1 ? s.mlRowAlt : {}]}>
                    <Text style={s.mlCellNum}>{i + 1}</Text>
                    <Text style={s.mlCellTitle}>{line.title}</Text>
                    <Text style={s.mlCellSm}>{line.unit}</Text>
                    <Text style={s.mlCellSm}>{line.qty}</Text>
                    <Text style={s.mlCellMd}>{line.unit_price_eur.toFixed(0)} EUR</Text>
                    <Text style={s.mlCellLg}>{total.toFixed(0)} EUR</Text>
                  </View>
                );
              })}
              <View style={s.mlSubtotalRow}>
                <Text style={s.mlSubtotalLabel}>{t.subtotalLabor}</Text>
                <Text style={s.mlSubtotalValue}>{laborSubtotalEur.toFixed(0)} EUR</Text>
              </View>
            </View>
          )}

          {/* Grand total */}
          <View style={s.grandTotal}>
            <View>
              <Text style={s.grandLabel}>{(isMultiLine || props.productTitle) ? t.acAndInstall : t.totalSum}</Text>
              <Text style={s.grandLabelBig}>{t.finalPrice}</Text>
            </View>
            <View>
              {isMultiLine ? (
                <>
                  <Text style={s.grandValue}>{grandTotalEur} EUR</Text>
                  <Text style={s.grandValueSub}>{"\u2248 "}{grandTotalBgn} {t.currency}</Text>
                </>
              ) : (
                <>
                  <Text style={s.grandValue}>{grandTotalBgn} {t.currency}</Text>
                  <Text style={s.grandValueSub}>{"\u2248 "}{grandTotalEur} EUR</Text>
                </>
              )}
            </View>
          </View>

          {/* Conditions */}
          <View style={s.conditionsCard}>
            <Text style={s.condTitle}>{t.conditions}</Text>
            <Text style={s.condItem}>{"\u2022  "}{t.cond1}</Text>
            <Text style={s.condItem}>{"\u2022  "}{t.cond2}</Text>
            <Text style={s.condItem}>{"\u2022  "}{t.cond3}</Text>
            <Text style={s.condItem}>{"\u2022  "}{t.cond4}</Text>
            <Text style={s.condItem}>{"\u2022  "}{t.cond5}</Text>
            <Text style={s.condItem}>{"\u2022  "}{t.cond6}</Text>
            <Text style={s.condItem}>{"\u2022  "}{t.cond7prefix}{validDays}{t.cond7suffix}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerBrand}>{"ПЕСНОПОЕЦ КЛИМА"}</Text>
          <Text style={s.footerText}>{"+359 87 799 8795  \u2022  pesnopoets-clima.com  \u2022  Варна"}</Text>
          <Text style={s.footerText}>{t.footerLabel} #{props.id}</Text>
        </View>
      </Page>
    </Document>
  );
}
