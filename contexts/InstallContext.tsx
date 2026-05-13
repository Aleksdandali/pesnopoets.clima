"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface InstallContextValue {
  /** Whether user opted-in for standard installation on this product page. */
  withInstallation: boolean;
  /** Standard install price in EUR for the current product (BTU-tier based). */
  installEur: number;
  setWithInstallation: (v: boolean) => void;
}

const InstallContext = createContext<InstallContextValue | null>(null);

interface InstallProviderProps {
  children: ReactNode;
  installEur: number;
  /** Initial toggle state — default OFF. */
  defaultOn?: boolean;
}

export function InstallProvider({ children, installEur, defaultOn = false }: InstallProviderProps) {
  const [withInstallation, setWithInstallation] = useState<boolean>(defaultOn);
  const value = useMemo(
    () => ({ withInstallation, installEur, setWithInstallation }),
    [withInstallation, installEur]
  );
  return <InstallContext.Provider value={value}>{children}</InstallContext.Provider>;
}

export function useInstall(): InstallContextValue {
  const ctx = useContext(InstallContext);
  if (!ctx) {
    // Safe fallback when used outside provider — install OFF, no price impact.
    return { withInstallation: false, installEur: 0, setWithInstallation: () => {} };
  }
  return ctx;
}
