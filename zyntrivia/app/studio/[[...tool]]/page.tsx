"use client";

/**
 * Embeds Sanity Studio at /studio instead of a separate deployment — one
 * fewer thing to host, and editors log in with their own Sanity account
 * (managed at sanity.io/manage), unrelated to any auth in this codebase.
 * The catch-all [[...tool]] segment is required by next-sanity's routing.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
