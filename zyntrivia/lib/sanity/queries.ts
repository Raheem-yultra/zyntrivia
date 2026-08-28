import type { PortableTextBlock } from "@portabletext/react";
import { sanityClient } from "./client";
import { isSanityConfigured } from "./config";
import {
  FALLBACK_SERVICES,
  FALLBACK_FAQ,
  FALLBACK_HOMEPAGE,
  FALLBACK_PROCESS_STEPS,
  type FallbackService,
  type FallbackFaqItem,
  type FallbackHomepage,
  type FallbackProcessStep,
} from "./fallback";
import { WORK, type WorkMeta } from "@/lib/work";

/**
 * Every fetcher here follows the same shape: if Sanity isn't configured,
 * return the fallback constant untouched (no network call, no risk of a
 * build-time failure from a missing project). If it is, fetch with a
 * next.tags entry so app/api/revalidate/route.ts can invalidate just this
 * content type when the matching document changes in Sanity.
 */

export type ServiceContent = FallbackService;

export async function getServices(): Promise<ServiceContent[]> {
  if (!isSanityConfigured() || !sanityClient) return FALLBACK_SERVICES;
  const data = await sanityClient.fetch<ServiceContent[]>(
    `*[_type == "service"] | order(order asc){ name, summary, tags, body, variant, order }`,
    {},
    { next: { tags: ["services"] } },
  );
  return data.length ? data : FALLBACK_SERVICES;
}

export type FaqContent = FallbackFaqItem;

export async function getFaqItems(): Promise<FaqContent[]> {
  if (!isSanityConfigured() || !sanityClient) return FALLBACK_FAQ;
  const data = await sanityClient.fetch<FaqContent[]>(
    `*[_type == "faqItem"] | order(order asc){ question, answer, order }`,
    {},
    { next: { tags: ["faq"] } },
  );
  return data.length ? data : FALLBACK_FAQ;
}

export type HomepageContent = FallbackHomepage;

export async function getHomepage(): Promise<HomepageContent> {
  if (!isSanityConfigured() || !sanityClient) return FALLBACK_HOMEPAGE;
  const data = await sanityClient.fetch<HomepageContent | null>(
    `*[_type == "homepage"][0]{ hero, problems, whyUs }`,
    {},
    { next: { tags: ["homepage"] } },
  );
  return data ?? FALLBACK_HOMEPAGE;
}

export type ProcessStepContent = FallbackProcessStep;

export async function getProcessSteps(): Promise<ProcessStepContent[]> {
  if (!isSanityConfigured() || !sanityClient) return FALLBACK_PROCESS_STEPS;
  const data = await sanityClient.fetch<ProcessStepContent[]>(
    `*[_type == "processStep"] | order(order asc){ title, shortBody, longBody, order }`,
    {},
    { next: { tags: ["process"] } },
  );
  return data.length ? data : FALLBACK_PROCESS_STEPS;
}

/**
 * Case studies are the one content type where the fallback is NOT the
 * fallback constant fed straight to the renderer: WORK (lib/work.ts) carries
 * only metadata, and its body content lives in content/work/*.mdx, rendered
 * by the existing MDXRemote pipeline (lib/mdx.ts). So `body` here is null in
 * fallback mode, and app/work/[slug]/page.tsx renders the old MDX path
 * whenever it sees a null body rather than duplicating that content as
 * hand-written Portable Text.
 */
export type CaseStudyMeta = WorkMeta;
export type CaseStudyContent = {
  meta: CaseStudyMeta;
  body: PortableTextBlock[] | null;
  /** Empty in fallback mode — the MDX fallback already embeds this in its body text. */
  adaptableFor: string[];
};

export async function getCaseStudies(): Promise<CaseStudyMeta[]> {
  if (!isSanityConfigured() || !sanityClient) return WORK;
  const data = await sanityClient.fetch<CaseStudyMeta[]>(
    `*[_type == "caseStudy"] | order(order asc){
      "slug": slug.current, name, category, headline, summary, stack, demoHref
    }`,
    {},
    { next: { tags: ["case-studies"] } },
  );
  return data.length ? data : WORK;
}

export async function getCaseStudy(slug: string): Promise<CaseStudyContent | null> {
  if (!isSanityConfigured() || !sanityClient) {
    const meta = WORK.find((w) => w.slug === slug);
    return meta ? { meta, body: null, adaptableFor: [] } : null;
  }
  const data = await sanityClient.fetch<
    { meta: CaseStudyMeta; body: PortableTextBlock[]; adaptableFor: string[] | null } | null
  >(
    `*[_type == "caseStudy" && slug.current == $slug][0]{
      "meta": { "slug": slug.current, name, category, headline, summary, stack, demoHref },
      body,
      adaptableFor
    }`,
    { slug },
    { next: { tags: [`case-study:${slug}`] } },
  );
  if (data) return { ...data, adaptableFor: data.adaptableFor ?? [] };
  const meta = WORK.find((w) => w.slug === slug);
  return meta ? { meta, body: null, adaptableFor: [] } : null;
}
