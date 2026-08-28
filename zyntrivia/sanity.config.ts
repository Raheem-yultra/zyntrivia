import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } from "./lib/sanity/config";

export default defineConfig({
  name: "zyntrivia",
  title: "Zyntrivia CMS",
  // Falls back to empty strings so `sanity typegen` / local tooling doesn't
  // crash before NEXT_PUBLIC_SANITY_PROJECT_ID is set — the /studio route
  // itself will simply fail to connect until real credentials exist.
  projectId: SANITY_PROJECT_ID ?? "",
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
