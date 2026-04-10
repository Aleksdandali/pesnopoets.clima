import { config } from "dotenv";
config({ path: ".env.local" });
import { syncProducts } from "../lib/bittel/sync";

async function main() {
  console.log("Starting Bittel sync...");
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Bittel token:", process.env.BITTEL_API_TOKEN ? "set" : "MISSING");

  const report = await syncProducts();
  console.log("\nSync complete:");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
