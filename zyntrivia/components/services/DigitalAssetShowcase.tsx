/**
 * Distinct treatment for the Digital Asset Design service on /services.
 * The eight engineering services render as plain hairline rows; this one — the
 * lone creative offering — reads as a bordered, accent-tinted card with a strip
 * of asset "specimen" tiles (3D model, icon set, vector illustration), so it
 * stands out without leaving the Neo-Minimalist system.
 */

type Props = { index: number; title: string; tags: string[]; body: string };

function CubeIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-9 w-9 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M24 6 40 15 40 33 24 42 8 33 8 15Z" />
      <path d="M24 24 24 42M24 24 8 15M24 24 40 15" strokeOpacity="0.55" />
    </svg>
  );
}

function IconsGridIcon() {
  const pos = [8, 20, 32];
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-9 w-9 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden
    >
      {pos.flatMap((y) =>
        pos.map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="8"
            height="8"
            rx="1.6"
            fill={x === 20 && y === 20 ? "currentColor" : "none"}
          />
        )),
      )}
    </svg>
  );
}

function VectorCurveIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-9 w-9 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M8 34C18 8 30 40 40 14" />
      <rect x="5" y="31" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="37" y="11" width="6" height="6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SPECIMENS = [
  { label: "3D Models", Icon: CubeIcon },
  { label: "Icons", Icon: IconsGridIcon },
  { label: "Illustration", Icon: VectorCurveIcon },
];

export function DigitalAssetShowcase({ index, title, tags, body }: Props) {
  return (
    <div className="group relative grid gap-6 overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent p-6 md:grid-cols-12 md:gap-8 md:p-10">
      {/* Soft corner glow — the only place on /services with any bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="font-mono text-[13px] text-primary md:col-span-1">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="md:col-span-5">
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">
          Creative &amp; Assets
        </span>
        <h2 className="mb-6 font-display text-headline-md text-primary md:text-headline-lg">
          {title}
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-primary/40 bg-primary/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="md:col-span-6">
        <p className="mb-8 max-w-measure text-body-md leading-relaxed text-on-surface-variant">
          {body}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {SPECIMENS.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2.5 rounded-md border border-outline-variant bg-surface-container/40 py-4 transition-colors duration-300 group-hover:border-primary/40"
            >
              <Icon />
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-outline">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
