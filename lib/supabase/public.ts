import { createClient } from "@supabase/supabase-js";

// Anon client without `next/headers` cookies(). Use this from public
// pages (catalog, home, brands, etc.) so the route stays static/ISR.
// The cookied SSR client in `./server.ts` reads `cookies()` which is a
// Request-time API — calling it from a Server Component opts the whole
// route into Dynamic SSR (Vercel responds `cache-control: no-store`),
// defeating the page's `export const revalidate = …`.
//
// All RLS policies that allow `anon` SELECT continue to work here since
// the anon JWT is the same; we just don't pass the user's session
// cookie through. Don't use this for routes that depend on user auth.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
