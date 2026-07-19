import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section id="cta" className="border-t border-outline-variant bg-surface-dim">
      <div className="section-x mx-auto max-w-container py-32 text-center md:py-48">
        <h2 className="mx-auto mb-stack-lg max-w-4xl font-display text-headline-md leading-tight text-on-surface md:text-display-xl">
          Tell us what your team keeps doing by hand.
        </h2>
        <div className="flex justify-center">
          <Button href="/quote" className="px-12 py-5">
            Request a Quote
          </Button>
        </div>
        <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.08em] text-outline-dim">
          Fixed scope · Fixed price · Ship date within 24 hours
        </p>
      </div>
    </section>
  );
}
