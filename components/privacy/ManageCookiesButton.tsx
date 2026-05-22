"use client";

import { openConsentDialog } from "./ConsentManager";

interface Props {
  label: string;
  className?: string;
}

/** Footer link that re-opens the consent preferences modal. */
export default function ManageCookiesButton({ label, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => openConsentDialog()}
      className={className}
    >
      {label}
    </button>
  );
}
