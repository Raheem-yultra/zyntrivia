import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limiter. Uses Upstash when configured; otherwise a
 * per-instance in-memory window (fine for dev, resets on redeploy).
 */

const memory = new Map<string, number[]>();

/**
 * Without eviction this Map grows once per distinct IP for the life of the
 * process — a slow leak on any instance that stays warm, and the fallback path
 * is exactly what runs during an Upstash outage. Sweep expired keys whenever
 * the map gets large rather than on a timer, so there is nothing to unref.
 */
const MAX_KEYS = 10_000;

function sweep(now: number, windowMs: number) {
  // forEach rather than for..of: the build targets ES5 without downlevelIteration.
  const stale: string[] = [];
  memory.forEach((hits, k) => {
    if (hits.length === 0 || now - hits[hits.length - 1] >= windowMs) stale.push(k);
  });
  stale.forEach((k) => memory.delete(k));
}

function memoryLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (memory.size > MAX_KEYS) sweep(now, windowMs);
  const hits = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  return true;
}

const upstash =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const limiters = new Map<string, Ratelimit>();

export async function rateLimit(
  scope: string,
  id: string,
  limit: number,
  windowSec: number,
): Promise<boolean> {
  if (!upstash) return memoryLimit(`${scope}:${id}`, limit, windowSec * 1000);
  let limiter = limiters.get(scope);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: upstash,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: `rl:${scope}`,
    });
    limiters.set(scope, limiter);
  }
  try {
    const { success } = await limiter.limit(id);
    return success;
  } catch {
    // Upstash outage should not take the funnel down.
    return memoryLimit(`${scope}:${id}`, limit, windowSec * 1000);
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "local";
}
