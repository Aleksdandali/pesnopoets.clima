"use client";

let token: string | null = null;

export function setToken(t: string) { token = t; }
export function getToken() { return token; }

async function refreshToken(): Promise<boolean> {
  const tg = (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp;
  if (!tg?.initData) return false;
  try {
    const res = await fetch("/api/tg/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: tg.initData }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.token) { token = data.token; return true; }
  } catch { /* silent */ }
  return false;
}

export async function tgFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    if (body.code === "TOKEN_EXPIRED") {
      const ok = await refreshToken();
      if (ok) return tgFetch(path, options);
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
