import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function translateText(text: string, targetLang: string): Promise<string> {
  const langNames: Record<string, string> = {
    en: "English",
    ru: "Russian",
    ua: "Ukrainian",
  };

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Translate this Bulgarian HVAC product description to ${langNames[targetLang]}. Keep technical terms, model numbers, and brand names unchanged. Output ONLY the translation, no explanations.\n\n${text}`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type === "text") return block.text;
  return text;
}

// Strip HTML for short descriptions, keep HTML for longer ones
function cleanDescription(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

async function main() {
  console.log("=== Description Translation Script ===\n");

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY not set in .env.local");
    console.log("Add: ANTHROPIC_API_KEY=sk-ant-... to .env.local");
    process.exit(1);
  }

  // Get products with descriptions that need translation
  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, description, description_en, description_ru, description_ua")
    .eq("is_active", true)
    .not("description", "is", null);

  if (error) {
    console.error("DB error:", error);
    process.exit(1);
  }

  // Filter products that actually have meaningful descriptions
  const toTranslate = (products || []).filter((p) => {
    const clean = cleanDescription(p.description || "");
    // Skip empty, too short, or already-translated descriptions
    if (clean.length < 20) return false;
    if (clean === p.title) return false; // Description is just the title
    if (p.description_en && p.description_ru && p.description_ua) return false; // Already done
    return true;
  });

  console.log(`Found ${products?.length || 0} products with descriptions`);
  console.log(`${toTranslate.length} need translation\n`);

  let translated = 0;
  let errors = 0;

  for (const product of toTranslate) {
    const cleanDesc = cleanDescription(product.description);
    const updates: Record<string, string> = {};

    try {
      // Translate to each missing language
      for (const lang of ["en", "ru", "ua"] as const) {
        const field = `description_${lang}` as keyof typeof product;
        if (!product[field]) {
          const result = await translateText(cleanDesc, lang);
          updates[`description_${lang}`] = result;
        }
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("products")
          .update(updates)
          .eq("id", product.id);

        if (updateError) {
          console.error(`  Error updating product ${product.id}:`, updateError.message);
          errors++;
        } else {
          translated++;
          if (translated % 10 === 0 || translated <= 3) {
            console.log(`  [${translated}/${toTranslate.length}] ${product.title.slice(0, 60)}...`);
            if (translated <= 3) {
              // Show first few examples
              for (const [key, val] of Object.entries(updates)) {
                console.log(`    ${key}: ${(val as string).slice(0, 100)}...`);
              }
            }
          }
        }
      }

      // Small delay to respect rate limits
      if (translated % 5 === 0) {
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (err) {
      console.error(`  Error translating product ${product.id}:`, err);
      errors++;
      // Continue with next product
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n=== Done! ===`);
  console.log(`Translated: ${translated}`);
  console.log(`Errors: ${errors}`);
  console.log(`Skipped: ${(products?.length || 0) - toTranslate.length}`);
}

main().catch(console.error);
