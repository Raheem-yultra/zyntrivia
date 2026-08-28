/**
 * Minimal Portable Text builder used only by scripts/seed-sanity.ts to
 * transcribe content/work/*.mdx into the structured shape the caseStudy
 * schema expects (see sanity/schemaTypes/caseStudy.ts). Not imported by the
 * app — the app renders Portable Text it fetches from Sanity, it doesn't
 * build it.
 */

let counter = 0;
function key(): string {
  counter += 1;
  return `k${counter.toString(36)}`;
}

export type Span = string | { bold?: boolean; italic?: boolean; code?: boolean; text: string } | { benchmark: string };

function spanNode(s: Span) {
  if (typeof s === "string") return { _type: "span", _key: key(), text: s, marks: [] };
  if ("benchmark" in s) return { _type: "benchmark", _key: key(), text: s.benchmark };
  const marks: string[] = [];
  if (s.bold) marks.push("strong");
  if (s.italic) marks.push("em");
  if (s.code) marks.push("code");
  return { _type: "span", _key: key(), text: s.text, marks };
}

function block(style: "normal" | "h2", spans: Span[], listItem?: "bullet") {
  return {
    _type: "block",
    _key: key(),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs: [],
    children: spans.map(spanNode),
  };
}

export const h2 = (text: string) => block("h2", [text]);
export const p = (...spans: Span[]) => block("normal", spans);
export const bullet = (...spans: Span[]) => block("normal", spans, "bullet");

type TierBox = { label: string; sub?: string; accent?: boolean };

export const archDiagram = (tiers: TierBox[][]) => ({
  _type: "archDiagram",
  _key: key(),
  tiers: tiers.map((row) => ({
    _key: key(),
    boxes: row.map((box) => ({ _key: key(), ...box })),
  })),
});
