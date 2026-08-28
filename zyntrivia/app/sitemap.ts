import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getCaseStudies } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes = ["", "/services", "/work", "/process", "/about", "/quote", "/privacy", "/terms"];
  const work = await getCaseStudies();
  return [
    ...routes.map((r) => ({
      url: `${SITE.url}${r}`,
      lastModified: now,
      priority: r === "" ? 1 : r === "/quote" ? 0.9 : 0.7,
    })),
    ...work.map((w) => ({
      url: `${SITE.url}/work/${w.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
