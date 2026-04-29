"use client";

export default function AiBannerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("pesnopoets:open-consultant"))}
      className="group relative block aspect-[580/300] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-left w-full cursor-pointer"
    >
      {children}
    </button>
  );
}
