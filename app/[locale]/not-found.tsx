import Link from "next/link";
import { headers } from "next/headers";

export default async function NotFound() {
  const headerStore = await headers();
  const locale = headerStore.get("x-locale") || "bg";
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h2 className="text-6xl font-bold text-primary mb-2">404</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Page not found
      </p>
      <Link
        href={`/${locale}`}
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
