import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h2 className="text-6xl font-bold text-primary mb-2">404</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Page not found
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
