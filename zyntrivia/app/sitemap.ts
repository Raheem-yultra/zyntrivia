import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { WORK } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/services", "/work", "/process", "/about", "/quote", "/privacy", "/terms"];
  return [
    ...routes.map((r) => ({
      url: `${SITE.url}${r}`,
      lastModified: now,
      priority: r === "" ? 1 : r === "/quote" ? 0.9 : 0.7,
    })),
    ...WORK.map((w) => ({
      url: `${SITE.url}/work/${w.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
