type Node = { label: string; sub: string; accent?: boolean };

/** Boxes-and-hairlines architecture diagram, in the Stitch case-study style. */
export function ArchDiagram({ tiers }: { tiers: Node[][] }) {
  return (
    <div className="my-12 rounded-lg border border-outline-variant bg-surface-container-low p-8 md:p-12">
      <span className="mb-10 block text-center font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
        Architecture Overview
      </span>
      <div className="flex flex-col items-center">
        {tiers.map((row, i) => (
          <div key={i} className="flex w-full flex-col items-center">
            {i > 0 && <div aria-hidden className="h-8 w-px bg-outline-variant" />}
            <div className="flex w-full flex-col items-stretch justify-center gap-4 md:flex-row">
              {row.map((node) => (
                <div
                  key={node.label}
                  className={`min-w-0 flex-1 rounded-lg border px-5 py-4 text-center md:max-w-[280px] ${
                    node.accent
                      ? "border-primary/40 bg-surface-container-high"
                      : "border-outline-variant bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`block font-mono text-[10px] uppercase tracking-[0.12em] ${
                      node.accent ? "text-primary" : "text-outline"
                    }`}
                  >
                    {node.label}
                  </span>
                  <span className="mt-1 block text-sm text-on-surface-variant">
                    {node.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * [BENCHMARK] marker — a figure to be measured and filled in, never invented.
 * Kept deliberately visible so a fabricated number can't sneak in.
 */
export function B({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-1 inline-block border border-dashed border-outline bg-surface-container px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-outline">
      Benchmark: {children}
    </span>
  );
}
