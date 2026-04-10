"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

interface CookieConsentProps {
  locale: string;
  dictionary: {
    cookie: {
      text: string;
      accept: string;
      decline: string;
      learnMore: string;
    };
  };
}

const CONSENT_KEY = "cookie-consent";

export default function CookieConsent({ locale, dictionary }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);
  const t = dictionary.cookie;

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-in slide-in-from-bottom duration-500"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto bg-white/98 backdrop-blur-xl border border-border rounded-2xl shadow-[0_-4px_30px_rgb(0_0_0/0.1)] p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground leading-relaxed">
              {t.text}{" "}
              <a
                href={`/${locale}/privacy`}
                className="text-primary hover:underline font-medium"
              >
                {t.learnMore}
              </a>
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="shrink-0 flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground sm:hidden rounded-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={handleDecline}
            className="hidden sm:inline-flex px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors min-h-[44px]"
          >
            {t.decline}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors shadow-sm min-h-[44px]"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
