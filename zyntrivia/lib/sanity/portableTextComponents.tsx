import type { PortableTextComponents } from "@portabletext/react";
import { ArchDiagram, B } from "@/components/work/ArchDiagram";

type TierBox = { label: string; sub?: string; accent?: boolean };
type TierRow = { boxes?: TierBox[] };
type ArchDiagramValue = { tiers?: TierRow[] };
type BenchmarkValue = { text: string };

/**
 * Renders Sanity Portable Text with the exact same visual treatment the old
 * MDX case studies used (mdxComponents in app/work/[slug]/page.tsx before
 * this migration) — plus the two custom block types that stand in for what
 * MDX did with real JSX: archDiagram and benchmark map straight back onto
 * the existing ArchDiagram/B components, unchanged.
 */
export const caseStudyPortableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-6 mt-20 font-mono text-[12px] uppercase tracking-[0.2em] text-primary-text first:mt-0">
        <span aria-hidden>— </span>
        {children}
      </h2>
    ),
    normal: ({ children }) => (
      <p className="mb-6 max-w-measure text-body-md text-on-surface-variant">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-none space-y-4 border-l-2 border-primary/20 pl-6 text-body-md text-on-surface-variant">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-on-surface">{children}</strong>,
    code: ({ children }) => (
      <code className="rounded-sm bg-surface-container px-1.5 py-0.5 font-mono text-[13px] text-on-surface">
        {children}
      </code>
    ),
  },
  types: {
    archDiagram: ({ value }: { value: ArchDiagramValue }) => (
      <ArchDiagram
        tiers={(value.tiers ?? []).map((row) =>
          (row.boxes ?? []).map((box) => ({ label: box.label, sub: box.sub ?? "", accent: box.accent })),
        )}
      />
    ),
    benchmark: ({ value }: { value: BenchmarkValue }) => <B>{value.text}</B>,
  },
};
