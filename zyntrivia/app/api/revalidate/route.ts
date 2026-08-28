import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

/**
 * Sanity webhook target (configure at sanity.io/manage → API → Webhooks,
 * pointed at this route, with the same secret set below as a custom header
 * `x-webhook-secret`). Lets a Studio publish update the live site within
 * seconds without a redeploy, by invalidating just the next.tags this
 * content type's fetcher used (see lib/sanity/queries.ts).
 */
const TAG_BY_TYPE: Record<string, string> = {
  service: "services",
  faqItem: "faq",
  homepage: "homepage",
  processStep: "process",
};

type WebhookPayload = { _type?: string; slug?: { current?: string } };

export async function POST(req: Request) {
  const secret = req.headers.get("x-webhook-secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: WebhookPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body._type;
  if (!type) {
    return NextResponse.json({ error: "Missing _type" }, { status: 400 });
  }

  const tags: string[] = [];
  if (type === "caseStudy") {
    tags.push("case-studies");
    if (body.slug?.current) tags.push(`case-study:${body.slug.current}`);
  } else if (TAG_BY_TYPE[type]) {
    tags.push(TAG_BY_TYPE[type]);
  } else {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }

  tags.forEach((t) => revalidateTag(t));
  return NextResponse.json({ revalidated: true, tags });
}
