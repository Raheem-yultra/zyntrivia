import { Button } from "@/components/ui/Button";
import { Terminal } from "@/components/ui/Terminal";

type Props = {
  eyebrow: string;
  headline: string;
  subhead: string;
  microcopy: string;
};

export function Hero({ eyebrow, headline, subhead, microcopy }: Props) {
  return (
    <section id="hero" className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="eyebrow mb-stack-md block text-primary-text">
            {eyebrow}
          </span>
          <h1 className="mb-8 font-display text-headline-md leading-[1.05] text-on-surface md:text-display-xl">
            {headline}
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
            {subhead}
          </p>
          <div className="flex flex-wrap items-center gap-8">
            <Button href="/quote">Request a Quote</Button>
            <Button href="/work" variant="ghost">
              See our work
            </Button>
          </div>
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.08em] text-outline-dim">
            {microcopy}
          </p>
        </div>
        <div className="w-full max-w-xl lg:justify-self-end">
          <Terminal />
        </div>
      </div>
    </section>
  );
}
