import { config } from "dotenv";
config({ path: ".env.local" });
import { syncBulclimaProducts } from "../lib/bulclima/sync";

// npx tsx scripts/sync-bulclima.ts [--dry-run]
const dryRun = process.argv.includes("--dry-run");

async function main() {
  console.log(`Starting Bulclima sync${dryRun ? " (dry run, nothing is written)" : ""}...`);
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const report = await syncBulclimaProducts({ dryRun });
  console.log("\nSync complete:");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
