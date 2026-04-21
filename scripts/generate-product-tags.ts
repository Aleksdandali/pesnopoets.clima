/**
 * Generate AI enrichment tags (selling_points, best_for, warnings)
 * for every active product that doesn't have them yet.
 *
 * Uses Claude Opus 4.6 to read product title + brand + specs + features
 * and produce short curated hooks the AI consultant will use in chat.
 *
 * Safe to re-run: only touches rows where all three columns are NULL.
 * Pass `--force` to regenerate for ALL rows.
 * Pass `--limit=N` to cap the batch size.
 *
 * Output language: Russian (AI consultant translates per locale on the fly).
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const FORCE = process.argv.includes("--force");
const LIMIT_ARG = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split("=")[1], 10) : undefined;

interface ProductForTagging {
  id: number;
  slug: string;
  title: string;
  manufacturer: string | null;
  description: string | null;
  btu: number | null;
  area_m2: number | null;
  noise_db_indoor: number | null;
  energy_class: string | null;
  refrigerant: string | null;
  seer: number | null;
  scop: number | null;
  features: unknown;
}

interface Tags {
  selling_points: string[];
  best_for: string[];
  warnings: string[];
}

function summarizeFeatures(features: unknown): string {
  if (!features || typeof features !== "object") return "";
  const groups = features as Record<string, { name?: string; items?: Array<{ name: string; value: string }> }>;
  const lines: string[] = [];
  for (const g of Object.values(groups)) {
    if (!g?.items) continue;
    for (const item of g.items.slice(0, 12)) {
      if (item?.name && item?.value) {
        lines.push(`${item.name}: ${item.value}`);
      }
    }
  }
  return lines.slice(0, 30).join("; ");
}

async function generateTags(p: ProductForTagging): Promise<Tags | null> {
  const featuresSummary = summarizeFeatures(p.features);
  const specs = [
    p.manufacturer ? `Бренд: ${p.manufacturer}` : null,
    p.btu ? `BTU: ${p.btu}` : null,
    p.area_m2 ? `Площадь покрытия: до ${p.area_m2} м²` : null,
    p.noise_db_indoor ? `Шум внутреннего блока: ${p.noise_db_indoor} дБ` : null,
    p.energy_class ? `Класс энергоэффективности: ${p.energy_class}` : null,
    p.refrigerant ? `Хладагент: ${p.refrigerant}` : null,
    p.seer ? `SEER: ${p.seer}` : null,
    p.scop ? `SCOP: ${p.scop}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  const descSnippet = (p.description ?? "").slice(0, 1200);

  const prompt = `Ты — эксперт по кондиционерам. Читаешь один товар и возвращаешь краткие теги для AI-консультанта, который рекомендует технику клиентам в розничном магазине (Варна, Болгария).

ТОВАР:
Название: ${p.title}
${specs}
${featuresSummary ? `Фичи: ${featuresSummary}` : ""}
${descSnippet ? `Описание: ${descSnippet}` : ""}

Верни СТРОГО JSON в формате:
{
  "selling_points": ["...", "..."],   // 2-4 коротких хука на русском, по которым AI будет продавать. Без маркетинговой воды. Только конкретика (дБ, класс, инвертор, Wi-Fi, фильтры, тип компрессора). Длина каждого — 2-5 слов.
  "best_for": ["...", "..."],          // 1-3 сценария где этот кондиционер идеально подходит. Варианты: "спальня", "детская", "гостиная", "кухня", "офис", "маленькая комната до 20 м²", "большая комната 40-55 м²", "для аллергиков", "для холодного климата" и т.п.
  "warnings": []                       // 0-2 честных ограничения. Например "не для большой гостиной", "шумноват для спальни", "без Wi-Fi". Пусто если нет реальных минусов относительно других моделей в каталоге.
}

ПРАВИЛА:
- Только JSON, ничего больше. Без markdown, без комментариев.
- Теги — на русском (AI сам переведёт в чате на нужный язык).
- НЕ выдумывай характеристики, которых нет в данных выше.
- Если что-то неясно (например шум не указан) — просто не упоминай это в тегах.
- "selling_points" — только реальные плюсы из спеков. Не пиши "качественный", "надёжный", "премиум" без основания.
- "best_for" определяй по BTU→площади: 9K=спальня/детская, 12K=спальня большая/гостиная малая, 18K=гостиная, 24K+=большая гостиная/студия, 36K+=офис/коммерция.
- "warnings" — только если действительно есть ограничение по сравнению со средним кондиционером. Высокий шум (>25 дБ) для спальни — warning. Низкий BTU для большой площади — warning.`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") return null;

  let raw = block.text.trim();
  // Strip code fences if model added them despite instruction
  if (raw.startsWith("```")) raw = raw.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "");

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.selling_points || !Array.isArray(parsed.selling_points)) return null;
    return {
      selling_points: parsed.selling_points.slice(0, 4),
      best_for: Array.isArray(parsed.best_for) ? parsed.best_for.slice(0, 3) : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings.slice(0, 2) : [],
    };
  } catch {
    console.error(`   ⚠ JSON parse failed for ${p.slug}:`, raw.slice(0, 200));
    return null;
  }
}

async function main() {
  console.log(`=== AI enrichment tag generator ===`);
  console.log(`Mode: ${FORCE ? "FORCE (regenerate all)" : "only untagged rows"}`);
  if (LIMIT) console.log(`Limit: ${LIMIT} products`);
  console.log("");

  let q = supabase
    .from("products")
    .select(
      "id, slug, title, manufacturer, description, btu, area_m2, noise_db_indoor, energy_class, refrigerant, seer, scop, features, selling_points"
    )
    .eq("is_active", true)
    .eq("is_hidden", false);

  if (!FORCE) q = q.is("selling_points", null);
  if (LIMIT) q = q.limit(LIMIT);

  const { data, error } = await q;
  if (error) {
    console.error("❌ Supabase error:", error.message);
    process.exit(1);
  }
  const products = (data ?? []) as (ProductForTagging & { selling_points: unknown })[];
  console.log(`Found ${products.length} products to tag\n`);

  if (products.length === 0) {
    console.log("Nothing to do. Use --force to regenerate existing tags.");
    return;
  }

  let done = 0;
  let failed = 0;

  for (const p of products) {
    process.stdout.write(`[${done + failed + 1}/${products.length}] ${p.slug} ... `);
    try {
      const tags = await generateTags(p);
      if (!tags) {
        console.log("SKIP (no tags)");
        failed++;
        continue;
      }
      const { error: upErr } = await supabase
        .from("products")
        .update({
          selling_points: tags.selling_points,
          best_for: tags.best_for,
          warnings: tags.warnings,
        })
        .eq("id", p.id);
      if (upErr) {
        console.log(`FAIL: ${upErr.message}`);
        failed++;
      } else {
        console.log(`OK (${tags.selling_points.length}sp / ${tags.best_for.length}bf / ${tags.warnings.length}w)`);
        done++;
      }
    } catch (e) {
      console.log(`ERROR: ${(e as Error).message}`);
      failed++;
    }
    // Gentle throttle to avoid rate limits
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\nDone. Success: ${done}, Failed: ${failed}`);
}

main();
