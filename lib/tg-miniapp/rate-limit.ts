/**
 * In-memory sliding-window rate limiter.
 * Sufficient for single-instance Vercel deployment.
 */

const windows = new Map<string, number[]>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 3600_000;
    for (const [key, timestamps] of windows) {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) windows.delete(key);
      else windows.set(key, filtered);
    }
  }, 300_000);
}

export function isRateLimited(key: string, maxRequests: number, windowSeconds: number): boolean {
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;
  let timestamps = windows.get(key);

  if (!timestamps) {
    windows.set(key, [now]);
    return false;
  }

  const valid = timestamps.filter((t) => t > cutoff);
  if (valid.length >= maxRequests) {
    windows.set(key, valid);
    return true;
  }

  valid.push(now);
  windows.set(key, valid);
  return false;
}
