"use client";

import { useEffect, useState } from "react";
import { Cookie, X, ShieldCheck, BarChart3, Megaphone } from "lucide-react";
import {
  readConsent,
  writeConsent,
  clearConsent,
  onConsentChange,
  type ConsentState,
} from "@/lib/analytics/consent";
import {
  setAnalyticsConsent,
  setAnalyticsLocale,
  initAnalyticsLifecycle,
} from "@/lib/analytics/track";

type Locale = "bg" | "en" | "ru" | "ua";

export interface ConsentCopy {
  bannerTitle: string;
  bannerText: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  save: string;
  learnMore: string;
  manageLabel: string;
  closeAria: string;
  categories: {
    necessary: { title: string; description: string; alwaysOn: string };
    analytics: { title: string; description: string };
    marketing: { title: string; description: string };
  };
}

interface Props {
  locale: Locale;
  copy: ConsentCopy;
}

export default function ConsentManager({ locale, copy }: Props) {
  const [state, setState] = useState<ConsentState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<{ analytics: boolean; marketing: boolean }>({
    analytics: false,
    marketing: false,
  });

  // Hydration + initial decision read. We deliberately defer banner visibility
  // by one tick so the page paints first; the CMP is the last thing to flash in.
  useEffect(() => {
    setHydrated(true);
    setAnalyticsLocale(locale);
    initAnalyticsLifecycle();

    const current = readConsent();
    setState(current);
    if (current) {
      setAnalyticsConsent(current.analytics);
      setDraft({ analytics: current.analytics, marketing: current.marketing });
    } else {
      const t = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(t);
    }
  }, [locale]);

  // React to external consent changes (e.g. footer "Manage cookies" link).
  useEffect(() => {
    const off = onConsentChange((s) => {
      setState(s);
      setAnalyticsConsent(s?.analytics === true);
      if (!s) {
        setShowBanner(true);
        setDraft({ analytics: false, marketing: false });
      }
    });
    return () => {
      off();
    };
  }, []);

  // Expose a global hook so a "Manage cookies" link anywhere can reopen the
  // dialog without prop-drilling. Listens for a custom DOM event.
  useEffect(() => {
    const handler = () => {
      const current = readConsent();
      setDraft(
        current
          ? { analytics: current.analytics, marketing: current.marketing }
          : { analytics: false, marketing: false },
      );
      setShowModal(true);
      setShowBanner(false);
    };
    window.addEventListener("pc:open-consent", handler);
    return () => window.removeEventListener("pc:open-consent", handler);
  }, []);

  function commit(decision: { analytics: boolean; marketing: boolean }) {
    const next = writeConsent(decision);
    setState(next);
    setAnalyticsConsent(next.analytics);
    setShowBanner(false);
    setShowModal(false);
  }

  function acceptAll() {
    commit({ analytics: true, marketing: true });
  }

  function rejectAll() {
    commit({ analytics: false, marketing: false });
  }

  function openModal() {
    setShowModal(true);
    setShowBanner(false);
  }

  if (!hydrated) return null;
  // Already decided + neither dialog open → render nothing.
  if (state && !showBanner && !showModal) return null;

  return (
    <>
      {/* Bottom banner: shown on first visit */}
      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-in slide-in-from-bottom duration-500"
          role="dialog"
          aria-modal="false"
          aria-label={copy.bannerTitle}
        >
          <div className="max-w-4xl mx-auto bg-white/98 backdrop-blur-xl border border-border rounded-2xl shadow-[0_-4px_30px_rgb(0_0_0/0.1)] p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {copy.bannerTitle}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {copy.bannerText}{" "}
                  <a
                    href={`/${locale}/privacy`}
                    className="text-primary hover:underline font-medium"
                  >
                    {copy.learnMore}
                  </a>
                </p>
              </div>
              <button
                onClick={rejectAll}
                className="shrink-0 flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground sm:hidden rounded-md"
                aria-label={copy.closeAria}
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 mt-4">
              <button
                onClick={openModal}
                className="px-4 py-2.5 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                type="button"
              >
                {copy.customize}
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                type="button"
              >
                {copy.rejectAll}
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors shadow-sm min-h-[44px]"
                type="button"
              >
                {copy.acceptAll}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences modal: per-category toggles */}
      {showModal && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={copy.manageLabel}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // Treat outside-click as cancel — keep current state untouched.
              setShowModal(false);
              if (!state) setShowBanner(true);
            }
          }}
        >
          <div className="w-full sm:max-w-lg bg-background rounded-t-2xl sm:rounded-2xl border border-border shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{copy.manageLabel}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (!state) setShowBanner(true);
                }}
                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md"
                aria-label={copy.closeAria}
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              {/* Necessary — always on */}
              <CategoryRow
                icon={<ShieldCheck className="w-5 h-5 text-primary" />}
                title={copy.categories.necessary.title}
                description={copy.categories.necessary.description}
                rightSlot={
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {copy.categories.necessary.alwaysOn}
                  </span>
                }
              />

              <CategoryRow
                icon={<BarChart3 className="w-5 h-5 text-primary" />}
                title={copy.categories.analytics.title}
                description={copy.categories.analytics.description}
                rightSlot={
                  <Toggle
                    checked={draft.analytics}
                    onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
                    label={copy.categories.analytics.title}
                  />
                }
              />

              <CategoryRow
                icon={<Megaphone className="w-5 h-5 text-primary" />}
                title={copy.categories.marketing.title}
                description={copy.categories.marketing.description}
                rightSlot={
                  <Toggle
                    checked={draft.marketing}
                    onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
                    label={copy.categories.marketing.title}
                  />
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-5 border-t border-border">
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                type="button"
              >
                {copy.rejectAll}
              </button>
              <button
                onClick={() => commit(draft)}
                className="flex-1 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors min-h-[44px]"
                type="button"
              >
                {copy.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Reusable category row with leading icon + title/description + trailing slot. */
function CategoryRow({
  icon,
  title,
  description,
  rightSlot,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  rightSlot: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          {description}
        </p>
      </div>
      <div className="shrink-0">{rightSlot}</div>
    </div>
  );
}

/** Native-looking toggle switch — accessible via keyboard. */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-muted-foreground/40"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/** Programmatic helper for a footer "Manage cookies" link. */
export function openConsentDialog(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("pc:open-consent"));
}

/** Programmatic helper that lets the user re-prompt (e.g. from privacy page). */
export function resetConsentDecision(): void {
  clearConsent();
}
