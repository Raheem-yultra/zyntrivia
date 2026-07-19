const STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "PostgreSQL",
  "Prisma",
  "Node.js",
  "Redis",
  "Stripe",
  "n8n",
  "Claude",
  "Supabase",
  "Tailwind",
  "Docker",
  "AWS",
];

/** Slow horizontal marquee of mono wordmarks. Pauses on hover. */
export function StackMarquee() {
  return (
    <section
      id="stack"
      className="overflow-hidden border-y border-outline-variant py-8"
      aria-label="Technology stack"
    >
      <div className="group flex">
        <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-16 group-hover:[animation-play-state:paused]">
          {[...STACK, ...STACK].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.2em] text-outline-dim"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
