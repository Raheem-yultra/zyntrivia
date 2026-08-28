/**
 * One-off: pushes the site's pre-CMS content into a fresh Sanity dataset so
 * the Studio starts populated instead of empty. Idempotent — every document
 * uses a deterministic _id and this uses createOrReplace, so running it
 * again after editing this file (or after editing content in the Studio and
 * wanting to reset to the seed) is safe to repeat.
 *
 * Usage:
 *   SANITY_API_TOKEN=... NEXT_PUBLIC_SANITY_PROJECT_ID=... NEXT_PUBLIC_SANITY_DATASET=production \
 *     npx tsx scripts/seed-sanity.ts
 *
 * The token needs Editor or Admin permission (sanity.io/manage → API → Tokens).
 * It is never committed — pass it as an env var for this one run only.
 */
import { createClient } from "next-sanity";
import {
  FALLBACK_SERVICES,
  FALLBACK_FAQ,
  FALLBACK_HOMEPAGE,
  FALLBACK_PROCESS_STEPS,
} from "../lib/sanity/fallback";
import { WORK } from "../lib/work";
import { stocksenseBody, resourceableBody, workflowaiBody } from "./case-studies-content";

const CASE_STUDY_BODIES: Record<string, unknown[]> = {
  stocksense: stocksenseBody,
  resourceable: resourceableBody,
  workflowai: workflowaiBody,
};

const ADAPTABLE_FOR: Record<string, string[]> = {
  stocksense: [
    "pharmacy and clinic supply",
    "food and beverage distribution",
    "cosmetics",
    "chemicals",
    "any regulated stock with a shelf life",
  ],
  resourceable: [
    "home services",
    "professional services",
    "rentals",
    "freelance and creator marketplaces",
    "B2B supplier networks",
  ],
  workflowai: [
    "lead routing",
    "document and invoice processing",
    "client onboarding",
    "reporting pipelines",
    "CRM synchronization",
    "any workflow currently held together by a person remembering to check",
  ],
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    console.error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN. Set both (and " +
        "optionally NEXT_PUBLIC_SANITY_DATASET) as env vars before running this script.",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-06-01",
    token,
    useCdn: false,
  });

  const tx = client.transaction();

  FALLBACK_SERVICES.forEach((s) => {
    tx.createOrReplace({
      _id: `service-${slugify(s.name)}`,
      _type: "service",
      name: s.name,
      summary: s.summary,
      tags: s.tags,
      body: s.body,
      variant: s.variant ?? "default",
      order: s.order,
    });
  });

  FALLBACK_FAQ.forEach((f, i) => {
    tx.createOrReplace({
      _id: `faq-${i + 1}`,
      _type: "faqItem",
      question: f.question,
      answer: f.answer,
      order: f.order,
    });
  });

  tx.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    hero: FALLBACK_HOMEPAGE.hero,
    problems: FALLBACK_HOMEPAGE.problems.map((p, i) => ({ _key: `p${i}`, ...p })),
    whyUs: FALLBACK_HOMEPAGE.whyUs.map((w, i) => ({ _key: `w${i}`, ...w })),
  });

  FALLBACK_PROCESS_STEPS.forEach((s, i) => {
    tx.createOrReplace({
      _id: `process-step-${i + 1}`,
      _type: "processStep",
      title: s.title,
      shortBody: s.shortBody,
      longBody: s.longBody,
      order: s.order,
    });
  });

  WORK.forEach((w, i) => {
    tx.createOrReplace({
      _id: `case-study-${w.slug}`,
      _type: "caseStudy",
      name: w.name,
      slug: { _type: "slug", current: w.slug },
      category: w.category,
      headline: w.headline,
      summary: w.summary,
      stack: w.stack,
      demoHref: w.demoHref ?? undefined,
      order: i + 1,
      body: CASE_STUDY_BODIES[w.slug] ?? [],
      adaptableFor: ADAPTABLE_FOR[w.slug] ?? [],
    });
  });

  const result = await tx.commit();
  console.log(`Seeded ${result.results.length} documents into "${dataset}".`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
