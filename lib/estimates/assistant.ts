/**
 * Conversational estimate assistant powered by Claude.
 * Maintains chat history, extracts/updates params incrementally.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { EstimateParams } from "./extract-params";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

const SYSTEM_PROMPT = `Ты — ассистент по монтажу кондиционеров, компания "Песнопоец Клима", Варна.

СТИЛЬ: Кратко. Без emoji. Без воды. 2-3 предложения. ТОЛЬКО русский язык.

ПАРАМЕТРЫ для сбора (по порядку важности):
1. Площадь (м2), этаж, последний ли
2. Тип здания (панелка/кирпич/дом/новостройка)
3. Окна: сторона (юг/север/восток/запад), большие ли
4. Теплоизоляция (хорошая/средняя/плохая)
5. Куда наружный блок (балкон/фасад/крыша), длина трассы (м)
6. Тип стены для сверления (бетон/кирпич/газобетон)
7. Демонтаж старого? Электролиния? Помпа? Короб?
8. Предпочтения по бренду (Daikin, Mitsubishi, Toshiba, Gree, Midea — или без предпочтений)
9. Бюджет клиента (если есть)
10. Имя и телефон клиента (для КП)

ВСЕ ЦЕНЫ УКАЗЫВАЙ В EUR:
- Монтаж до 14K BTU: 190 EUR (3м трассы включено)
- Монтаж до 24K BTU: 230 EUR (3м включено)
- Доп. метр: 30 EUR (до 14K) / 35 EUR (до 24K)
- Демонтаж: 32 EUR (до 14K) / 60 EUR (до 24K)
- Алпинист: 102 EUR, бетон: 26 EUR, помпа: 61 EUR, канал: 6 EUR/м, эл. линия: 61 EUR

BTU: площадь * 340. +15% юг/запад, +10% посл. этаж, +20% плохая изоляция, +5%/чел сверх 2, +10% кухня. Размеры: 9K, 12K, 18K, 24K.

ЛОГИКА ДИАЛОГА:
1. Сначала собери данные о помещении (1-2 сообщения)
2. Потом уточни монтажные условия
3. Спроси какой бренд предпочитает клиент
4. Когда всё есть — покажи расчёт и спроси имя/телефон для КП

РАСЧЁТ (когда данных достаточно):
Рекомендация: XX,000 BTU
Монтаж: XXX EUR
[доп. позиции]
ИТОГО монтаж: XXX EUR
Кондиционер подберётся автоматически из каталога.

Скажи имя и телефон клиента для КП.

ОБЯЗАТЕЛЬНО в конце каждого ответа — скрытый JSON с ТОЛЬКО НОВЫМИ или ИЗМЕНЁННЫМИ значениями.
Формат: <!--PARAMS:{"ключ":"значение"}:PARAMS-->
Включай ТОЛЬКО поля которые изменились в этом сообщении. НЕ включай поля которые не менялись.
Допустимые ключи: area_m2, ceiling_height_m, orientation, floor, top_floor, insulation, windows_count, large_windows, occupants, heat_sources, room_type, building_type, wall_type, pipe_length_m, outdoor_unit, needs_climber, dismantle_old, old_unit_btu, electrical_ready, needs_drain_pump, decorative_channel, channel_length_m, concrete_drilling, client_name, client_phone, client_address, notes, confidence.

МНОГОСТРОЧНЫЕ КП: если пользователь упоминает несколько единиц оборудования или несколько работ построчно (как в Daikin-предложении), добавь массивы equipment_lines и labor_lines.
- equipment_lines: [{manufacturer, title, btu, qty, unit_price_eur}]
- labor_lines: [{preset_key, title, unit, qty, unit_price_eur}]
  preset_key из набора: channel | pipe_38_14 | drilling | construction | drainage | install | climber | drain_pump | freon_charge (или null для кастомных).
Эти массивы — ПОЛНЫЕ списки строк (не дельта). Возвращай их только если пользователь явно про них говорит.`;

export const GREETING = `Опишите объект: площадь, этаж, тип здания, окна, куда наружный блок, длина трассы. Можно голосом или текстом.`;

export async function chatWithAssistant(
  messages: ChatMessage[],
  currentParams: EstimateParams | null,
): Promise<{ reply: string; params: EstimateParams }> {
  // Clean previous PARAMS blocks from history — they confuse the model
  const anthropicMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content.replace(/<!--PARAMS:[\s\S]*?:PARAMS-->/g, "").trim(),
  })).filter((m) => m.content.length > 0);

  // Inject current state so Claude knows what's already collected
  let systemWithState = SYSTEM_PROMPT;
  if (currentParams) {
    const filled: string[] = [];
    const missing: string[] = [];
    if (currentParams.area_m2) filled.push(`Площадь: ${currentParams.area_m2} м2`); else missing.push("площадь");
    if (currentParams.floor) filled.push(`Этаж: ${currentParams.floor}${currentParams.top_floor ? " (последний)" : ""}`); else missing.push("этаж");
    if (currentParams.building_type !== "unknown") filled.push(`Здание: ${currentParams.building_type}`); else missing.push("тип здания");
    if (currentParams.orientation !== "unknown") filled.push(`Окна: ${currentParams.orientation}`); else missing.push("ориентация окон");
    if (currentParams.insulation !== "average") filled.push(`Изоляция: ${currentParams.insulation}`);
    if (currentParams.large_windows) filled.push("Большие окна");
    if (currentParams.outdoor_unit !== "unknown") filled.push(`Наружный блок: ${currentParams.outdoor_unit}`); else missing.push("куда наружный блок");
    if (currentParams.pipe_length_m > 3) filled.push(`Трасса: ${currentParams.pipe_length_m}м`);
    if (currentParams.wall_type !== "unknown") filled.push(`Стена: ${currentParams.wall_type}`);
    if (currentParams.dismantle_old) filled.push("Демонтаж: да");
    if (currentParams.electrical_ready !== null) filled.push(`Электролиния: ${currentParams.electrical_ready ? "есть" : "нет"}`);
    if (currentParams.needs_drain_pump) filled.push("Помпа: да");
    if (currentParams.decorative_channel) filled.push("Канал: да");
    if (currentParams.client_name) filled.push(`Клиент: ${currentParams.client_name}`);
    if (currentParams.client_phone) filled.push(`Телефон: ${currentParams.client_phone}`);

    if (!currentParams.pipe_length_m || currentParams.pipe_length_m <= 3) missing.push("длина трассы");

    systemWithState += `\n\nУЖЕ СОБРАНО:\n${filled.length > 0 ? filled.join(", ") : "ничего"}\n\nЕЩЁ НУЖНО:\n${missing.length > 0 ? missing.join(", ") : "всё собрано — покажи расчёт"}\n\nНЕ ПОВТОРЯЙ вопросы о том что уже собрано! Спрашивай только о недостающем.`;
  }

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    system: systemWithState,
    messages: anthropicMessages,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract params — MERGE new values with existing, never overwrite with null
  const defaultParams: EstimateParams = {
    area_m2: null, ceiling_height_m: null, orientation: "unknown", floor: null,
    top_floor: false, insulation: "average", windows_count: null, large_windows: false,
    occupants: null, heat_sources: false, room_type: null, building_type: "unknown",
    wall_type: "unknown", pipe_length_m: 3, outdoor_unit: "unknown", needs_climber: false,
    dismantle_old: false, old_unit_btu: null, electrical_ready: null, needs_drain_pump: false,
    decorative_channel: false, channel_length_m: null, concrete_drilling: false,
    client_name: null, client_phone: null, client_address: null, notes: "", confidence: "low",
  };
  let params: EstimateParams = currentParams ? { ...currentParams } : { ...defaultParams };
  const paramsMatch = text.match(/<!--PARAMS:([\s\S]*?):PARAMS-->/);
  if (paramsMatch) {
    try {
      const delta = JSON.parse(paramsMatch[1]) as Partial<EstimateParams>;
      // Merge: only overwrite fields that Claude explicitly set (not null unless intentional)
      for (const [key, value] of Object.entries(delta)) {
        if (value !== null && value !== undefined) {
          (params as unknown as Record<string, unknown>)[key] = value;
        }
      }
      // Update confidence based on how much we have
      const hasBasics = params.area_m2 && params.floor && params.outdoor_unit !== "unknown";
      params.confidence = hasBasics ? (params.building_type !== "unknown" ? "high" : "medium") : "low";
    } catch { /* keep existing */ }
  }

  // Clean reply — remove the hidden params block
  const cleanReply = text.replace(/<!--PARAMS:[\s\S]*?:PARAMS-->/, "").trim();

  return { reply: cleanReply, params };
}
