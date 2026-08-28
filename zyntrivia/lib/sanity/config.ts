export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const SANITY_API_VERSION = "2024-06-01";

/**
 * Every content fetcher in lib/sanity/queries.ts checks this before calling
 * Sanity and falls back to the hardcoded content in lib/site.ts, lib/faq.ts,
 * lib/work.ts, and content/work/*.mdx when it's false — the same
 * "every integration degrades gracefully" pattern already used by
 * lib/rate-limit.ts and lib/leads.ts. Local dev with no Sanity project
 * configured renders exactly as it did before the CMS existed.
 */
export function isSanityConfigured(): boolean {
  return Boolean(SANITY_PROJECT_ID);
}
