"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

const cache = new Map<string, string>();
const memoryOnly = new Set<string>();
const listeners = new Map<string, Set<() => void>>();
function read(key: string, fallbackKey?: string) {
  if (typeof window === "undefined") return "[]";
  if (memoryOnly.has(key)) return cache.get(key) ?? "[]";
  try { return window.localStorage.getItem(key) ?? (fallbackKey ? window.localStorage.getItem(fallbackKey) : null) ?? "[]"; }
  catch { return cache.get(key) ?? "[]"; }
}
function parse<T>(raw: string, validate: (input: unknown) => T[]): T[] {
  try { return validate(JSON.parse(raw)); } catch { return []; }
}
// Only product selections are saved. The enquiry form never enters this store.
export function useSavedList<T>(key: string, validate: (input: unknown) => T[], fallbackKey?: string) {
  const subscribe = useCallback((callback: () => void) => {
    const bucket = listeners.get(key) ?? new Set();
    listeners.set(key, bucket); bucket.add(callback);
    const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === fallbackKey || event.key === null) callback(); };
    window.addEventListener("storage", onStorage);
    return () => { bucket.delete(callback); window.removeEventListener("storage", onStorage); };
  }, [key, fallbackKey]);
  const raw = useSyncExternalStore(subscribe, () => read(key, fallbackKey), () => "[]");
  const value = useMemo(() => parse(raw, validate), [raw, validate]);
  const setValue = (update: T[] | ((previous: T[]) => T[])) => {
    const next = typeof update === "function" ? update(parse(read(key, fallbackKey), validate)) : update;
    const text = JSON.stringify(validate(next));
    cache.set(key, text);
    try { window.localStorage.setItem(key, text); memoryOnly.delete(key); }
    catch { memoryOnly.add(key); }
    listeners.get(key)?.forEach(callback => callback());
  };
  return [value, setValue] as const;
}
