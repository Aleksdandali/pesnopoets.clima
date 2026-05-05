/**
 * Extract structured installation estimate parameters from voice transcript
 * using Claude API.
 */
import Anthropic from "@anthropic-ai/sdk";

export interface EstimateParams {
  // Room
  area_m2: number | null;
  ceiling_height_m: number | null;
  orientation: "north" | "south" | "east" | "west" | "unknown";
  floor: number | null;
  top_floor: boolean;
  insulation: "good" | "average" | "poor";
  windows_count: number | null;
  large_windows: boolean;
  occupants: number | null;
  heat_sources: boolean;
  room_type: string | null; // спальня, кухня, хол, офис...

  // Installation
  building_type: "panel" | "brick" | "house" | "new_build" | "unknown";
  wall_type: "concrete" | "brick" | "aerated" | "drywall" | "unknown";
  pipe_length_m: number;
  outdoor_unit: "balcony" | "facade_accessible" | "facade_no_access" | "roof" | "ground" | "unknown";
  needs_climber: boolean;
  dismantle_old: boolean;
  old_unit_btu: number | null;
  electrical_ready: boolean | null;
  needs_drain_pump: boolean;
  decorative_channel: boolean;
  channel_length_m: number | null;
  concrete_drilling: boolean;

  // Client
  client_name: string | null;
  client_phone: string | null;
  client_address: string | null;

  // Meta
  notes: string;
  confidence: "high" | "medium" | "low";
}

const SYSTEM_PROMPT = `You are a parameter extraction assistant for an AC installation company in Varna, Bulgaria.

The user (an installer/монтажник) dictates observations from a site visit. Extract structured data from their speech.

IMPORTANT:
- The speech may be in Russian, Bulgarian, Ukrainian, or mixed.
- Technical jargon is common: "трасса" = pipe run, "панелка" = Soviet-era panel block, "тухла" = brick, "газобетон" = aerated concrete, "алпинист" = industrial climber.
- "Южна страна" / "южная сторона" = south-facing windows.
- "Последен етаж" / "последний этаж" = top floor.
- "Лоша изолация" / "без изоляция" / "нет утепления" = poor insulation.
- "Панорамни прозорци" / "большие окна" / "французские окна" = large windows.
- Default pipe length is 3m if not mentioned.
- Default pipe_length_m if not specified is 3.
- electrical_ready = null if not mentioned.

Return ONLY valid JSON matching the schema. No markdown, no explanation.`;

const EXTRACTION_PROMPT = `Extract installation estimate parameters from this transcript.

Transcript:
"""
{TRANSCRIPT}
"""

Return JSON with these fields:
{
  "area_m2": number | null,
  "ceiling_height_m": number | null,
  "orientation": "north" | "south" | "east" | "west" | "unknown",
  "floor": number | null,
  "top_floor": boolean,
  "insulation": "good" | "average" | "poor",
  "windows_count": number | null,
  "large_windows": boolean,
  "occupants": number | null,
  "heat_sources": boolean,
  "room_type": string | null,
  "building_type": "panel" | "brick" | "house" | "new_build" | "unknown",
  "wall_type": "concrete" | "brick" | "aerated" | "drywall" | "unknown",
  "pipe_length_m": number,
  "outdoor_unit": "balcony" | "facade_accessible" | "facade_no_access" | "roof" | "ground" | "unknown",
  "needs_climber": boolean,
  "dismantle_old": boolean,
  "old_unit_btu": number | null,
  "electrical_ready": boolean | null,
  "needs_drain_pump": boolean,
  "decorative_channel": boolean,
  "channel_length_m": number | null,
  "concrete_drilling": boolean,
  "client_name": string | null,
  "client_phone": string | null,
  "client_address": string | null,
  "notes": string,
  "confidence": "high" | "medium" | "low"
}

Rules:
- If building_type is "panel", wall_type is almost certainly "concrete" and concrete_drilling is true.
- If floor >= 4 and outdoor_unit is "facade_no_access", set needs_climber to true.
- If orientation is south/west AND large_windows is true, set heat_sources to true.
- Confidence: "high" if area + pipe length are explicit, "medium" if area is given but other values inferred, "low" if key data is missing.`;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

export async function extractParams(transcript: string): Promise<EstimateParams> {
  const prompt = EXTRACTION_PROMPT.replace("{TRANSCRIPT}", transcript);

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON — handle possible markdown wrapping
  const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr) as EstimateParams;

  // Defaults
  if (!parsed.pipe_length_m) parsed.pipe_length_m = 3;
  if (!parsed.orientation) parsed.orientation = "unknown";
  if (!parsed.insulation) parsed.insulation = "average";
  if (!parsed.building_type) parsed.building_type = "unknown";
  if (!parsed.wall_type) parsed.wall_type = "unknown";
  if (!parsed.outdoor_unit) parsed.outdoor_unit = "unknown";

  return parsed;
}
