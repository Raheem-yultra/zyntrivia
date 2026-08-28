import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { DigitalAssetShowcase } from "@/components/services/DigitalAssetShowcase";
import { getServices } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Internal tools, AI workflow automation, LLM pipelines, full-stack applications, SaaS MVPs, integrations, data pipelines, digital asset design (icons, 3D models, illustration), and maintenance retainers.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      {/* Hero */}
      <section className="section-x mx-auto max-w-container pb-stack-lg pt-16 md:pt-24">
        <div className="max-w-4xl">
          <span className="eyebrow mb-4 block text-primary-text">What We Build</span>
          <h1 className="mb-10 font-display text-headline-md leading-[1.05] text-on-surface md:text-display-xl">
            Engineering the systems your business actually runs on.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
            We bridge the gap between complex engineering requirements and
            elegant, high-performance software. Our approach is surgical:
            minimal bloat, maximum reliability.
          </p>
        </div>
      </section>

      {/* Numbered service rows */}
      <section className="section-x mx-auto max-w-container border-t border-outline-variant py-section-mobile md:py-section-desktop">
        <div className="grid grid-cols-1 gap-y-16 md:gap-y-24">
          {services.map((s, i) =>
            s.variant === "design" ? (
              <DigitalAssetShowcase
                key={s.name}
                index={i}
                title={s.name}
                tags={s.tags}
                body={s.body}
              />
            ) : (
            <div
              key={s.name}
              className="group grid gap-6 border-b border-outline-variant pb-12 last:border-b-0 md:grid-cols-12 md:gap-8 md:pb-16"
            >
              <div className="font-mono text-[13px] text-outline md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-5">
                <h2 className="mb-6 font-display text-headline-md text-on-surface transition-colors duration-300 group-hover:text-primary md:text-headline-lg">
                  {s.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-surface-container px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-6">
                <p className="mb-8 max-w-measure text-body-md leading-relaxed text-on-surface-variant">
                  {s.body}
                </p>
                <div className="h-1 w-full overflow-hidden bg-outline-variant/20">
                  <div className="h-full w-0 bg-primary transition-all duration-700 ease-in-out group-hover:w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-x mx-auto max-w-container py-section-mobile text-center md:py-section-desktop">
        <h2 className="mb-8 font-display text-headline-md text-on-surface md:text-headline-lg">
          Ready to engineer your advantage?
        </h2>
        <div className="flex justify-center">
          <Button href="/quote" className="px-12 py-5">
            Request a Quote
          </Button>
        </div>
      </section>
    </main>
  );
}
