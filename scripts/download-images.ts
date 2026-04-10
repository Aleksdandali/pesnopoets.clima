import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "product-images";

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
    });
    if (error) {
      console.error("Failed to create bucket:", error.message);
      process.exit(1);
    }
    console.log("Created bucket:", BUCKET);
  } else {
    console.log("Bucket exists:", BUCKET);
  }
}

async function downloadAndUpload(url: string, path: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = Buffer.from(await res.arrayBuffer());

    if (buffer.length < 100) return null; // Skip tiny/empty files

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`  Upload error for ${path}:`, error.message);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error(`  Download error for ${url}:`, (err as Error).message);
    return null;
  }
}

function getFileExtension(url: string): string {
  const match = url.match(/\.(png|jpg|jpeg|webp|gif)/i);
  return match ? match[0].toLowerCase() : ".png";
}

async function main() {
  console.log("=== Image Download Script ===\n");

  await ensureBucket();

  // Get all products with gallery images
  const { data: products, error } = await supabase
    .from("products")
    .select("id, bittel_id, gallery")
    .eq("is_active", true);

  if (error) {
    console.error("DB error:", error);
    process.exit(1);
  }

  const allProducts = products || [];
  let totalImages = 0;
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  // Count total images
  for (const p of allProducts) {
    if (p.gallery && Array.isArray(p.gallery)) {
      totalImages += p.gallery.length;
    }
  }

  console.log(`Products: ${allProducts.length}`);
  console.log(`Total images: ${totalImages}\n`);

  for (const product of allProducts) {
    if (!product.gallery || !Array.isArray(product.gallery) || product.gallery.length === 0) {
      continue;
    }

    const newGallery: string[] = [];
    let productUpdated = false;

    for (let i = 0; i < product.gallery.length; i++) {
      const originalUrl = product.gallery[i];

      // Skip if already a Supabase URL
      if (originalUrl.includes("supabase.co/storage")) {
        newGallery.push(originalUrl);
        skipped++;
        continue;
      }

      const ext = getFileExtension(originalUrl);
      const storagePath = `${product.bittel_id}/${i}${ext}`;

      // Check if already uploaded
      const { data: existingFile } = await supabase.storage
        .from(BUCKET)
        .list(product.bittel_id, { limit: 100 });

      const alreadyExists = existingFile?.some((f) => f.name === `${i}${ext}`);
      if (alreadyExists) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        newGallery.push(data.publicUrl);
        skipped++;
        continue;
      }

      const publicUrl = await downloadAndUpload(originalUrl, storagePath);
      if (publicUrl) {
        newGallery.push(publicUrl);
        downloaded++;
        productUpdated = true;
      } else {
        // Keep original URL as fallback
        newGallery.push(originalUrl);
        errors++;
      }

      // Rate limit: small pause every 3 images
      if ((downloaded + errors) % 3 === 0) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    // Update product gallery with new URLs
    if (productUpdated) {
      await supabase
        .from("products")
        .update({ gallery: newGallery })
        .eq("id", product.id);
    }

    const total = downloaded + skipped + errors;
    if (total % 50 === 0) {
      console.log(`Progress: ${total}/${totalImages} (${downloaded} downloaded, ${skipped} skipped, ${errors} errors)`);
    }
  }

  console.log(`\n=== Done! ===`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (already done): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total: ${downloaded + skipped + errors}/${totalImages}`);
}

main().catch(console.error);
