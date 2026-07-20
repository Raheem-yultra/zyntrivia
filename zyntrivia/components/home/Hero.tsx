import { Button } from "@/components/ui/Button";
import { Terminal } from "@/components/ui/Terminal";

export function Hero() {
  return (
    <section id="hero" className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="eyebrow mb-stack-md block text-primary">
            Engineering &amp; AI Automation
          </span>
          <h1 className="mb-8 font-display text-headline-md leading-[1.05] text-on-surface md:text-display-xl">
            We build software that keeps your business running smoothly.
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
            Full-stack systems and AI workflows for teams who are done
            duct-taping. Scoped in days, shipped in weeks.
          </p>
          <div className="flex flex-wrap items-center gap-8">
            <Button href="/quote">Request a Quote</Button>
            <Button href="/work" variant="ghost">
              See our work
            </Button>
          </div>
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.08em] text-outline-dim">
            You&apos;ll hear back from an engineer, not a salesperson, within 24
            hours.
          </p>
        </div>
        <div className="w-full max-w-xl lg:justify-self-end">
          <Terminal />
        </div>
      </div>
    </section>
  );
}
