import { createClient } from "next-sanity";
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } from "./config";

/**
 * Only constructed when a project ID is actually configured — callers must
 * check isSanityConfigured() first (queries.ts does this for every fetcher).
 *
 * useCdn is false, deliberately: apicdn.sanity.io is eventually consistent
 * (its own cache, independent of Next's) and trades freshness for speed —
 * the right choice for a site relying on time-based ISR. This one instead
 * revalidates on demand (app/api/revalidate/route.ts calls revalidateTag()
 * the moment Sanity's webhook fires), so freshness is already precisely
 * controlled by Next's data cache. Stacking the CDN's own staleness on top
 * would silently undercut that — a publish could revalidate Next's cache
 * correctly and still serve old content because the CDN hadn't caught up.
 * Talking to the live API directly is slightly slower per request but
 * actually delivers on "publish and it's live," which is the entire point
 * of wiring the webhook in the first place.
 */
export const sanityClient = SANITY_PROJECT_ID
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: false,
    })
  : null;
