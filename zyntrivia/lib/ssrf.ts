import { promises as dns } from "dns";

/**
 * SSRF guard for the pipeline demo. https only, public hostnames only,
 * resolved address must not be private/loopback/link-local.
 * (DNS re-resolution between check and fetch is an accepted residual risk
 * for a rate-limited, read-only demo endpoint.)
 */

function isPrivateIp(ip: string): boolean {
  if (ip.includes(":")) {
    const v6 = ip.toLowerCase();
    return (
      v6 === "::1" ||
      v6.startsWith("fc") ||
      v6.startsWith("fd") ||
      v6.startsWith("fe80") ||
      v6.startsWith("::ffff:") // v4-mapped — reject rather than re-parse
    );
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

export async function validatePublicHttpsUrl(raw: string): Promise<URL | null> {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal"))
    return null;
  if (host === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":"))
    return null;
  try {
    const { address } = await dns.lookup(host);
    if (isPrivateIp(address)) return null;
  } catch {
    return null;
  }
  return url;
}

/** Fetch with manual redirect handling — every hop is re-validated. */
export async function fetchPublicHtml(
  url: URL,
  timeoutMs: number,
): Promise<string | null> {
  let current = url;
  for (let hop = 0; hop < 3; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(current.href, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "ZyntriviaDemo/1.0 (+https://zyntrivia.com)" },
      });
    } catch {
      clearTimeout(timer);
      return null;
    }
    clearTimeout(timer);

    if (res.status >= 301 && res.status <= 308) {
      const loc = res.headers.get("location");
      if (!loc) return null;
      const next = await validatePublicHttpsUrl(new URL(loc, current).href);
      if (!next) return null;
      current = next;
      continue;
    }
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("text/html")) return null;
    // Cap the body read at 1MB.
    const text = await res.text();
    return text.slice(0, 1_000_000);
  }
  return null;
}
