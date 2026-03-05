// In-memory sliding window rate limiter
const store = new Map<string, number[]>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of store) {
    const filtered = timestamps.filter((t) => now - t < 15 * 60 * 1000);
    if (filtered.length === 0) store.delete(key);
    else store.set(key, filtered);
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const timestamps = store.get(key) ?? [];
  const windowStart = now - windowMs;
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= maxAttempts) {
    const oldest = recent[0];
    return { allowed: false, retryAfterMs: oldest + windowMs - now };
  }

  recent.push(now);
  store.set(key, recent);
  return { allowed: true, retryAfterMs: 0 };
}
