import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { WORK } from "@/lib/work";
import { getWorkBody } from "@/lib/mdx";
import { ArchDiagram, B } from "@/components/work/ArchDiagram";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const meta = WORK.find((w) => w.slug === params.slug);
  if (!meta) return {};
  return {
    title: `${meta.name} Case Study`,
    description: meta.headline,
  };
}

const mdxComponents = {
  ArchDiagram,
  B,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mb-6 mt-20 font-mono text-[12px] uppercase tracking-[0.2em] text-primary first:mt-0"
      {...props}
    >
      <span aria-hidden>— </span>
      {props.children}
    </h2>
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 max-w-measure text-body-md text-on-surface-variant" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="mb-6 list-none space-y-4 border-l-2 border-primary/20 pl-6 text-body-md text-on-surface-variant"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-medium text-on-surface" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded-sm bg-surface-container px-1.5 py-0.5 font-mono text-[13px] text-on-surface"
      {...props}
    />
  ),
};

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = WORK.find((w) => w.slug === params.slug);
  if (!meta) notFound();
  const body = await getWorkBody(params.slug);
  if (!body) notFound();

  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${meta.name}: ${meta.headline}`,
          description: meta.summary,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          url: `${SITE.url}/work/${meta.slug}`,
        }}
      />
      {/* Header */}
      <header className="mb-stack-lg border-l border-outline-variant py-4 pl-8 md:pl-12">
        <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-outline">
          Case Study · Built by Zyntrivia · {meta.category}
        </span>
        <h1 className="mb-6 max-w-4xl font-display text-4xl leading-[1.1] text-on-surface md:text-display-xl">
          {meta.headline}
        </h1>
        <p className="mb-8 max-w-2xl text-body-md text-on-surface-variant">
          {meta.summary}
        </p>
        <div className="flex flex-wrap gap-3">
          {meta.stack.map((t) => (
            <span
              key={t}
              className="border border-outline-variant bg-surface-container px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-outline"
            >
              {t}
            </span>
          ))}
        </div>

        {/*
         * Live demo. It is a self-contained SPA served from /public (outside
         * Next's router), so use a plain anchor for a full navigation — a
         * next/link client transition would look for an RSC route that isn't
         * there. Opens in a new tab so the case study stays put.
         */}
        {meta.demoHref && (
          <div className="mt-8">
            <a
              href={meta.demoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-none bg-primary px-8 py-4 font-display text-label-sm uppercase tracking-[0.12em] text-white transition-all duration-150 ease-mechanical hover:brightness-110"
            >
              Open live demo <span aria-hidden>→</span>
            </a>
            <p className="mt-3 font-mono text-[11px] text-outline">
              Runs entirely in your browser — real ledger logic, seeded data, no signup.
            </p>
          </div>
        )}
      </header>

      {/* Offset readable column, per the Stitch case-study layout */}
      <div className="grid grid-cols-1 md:grid-cols-12">
        <article className="md:col-span-7 md:col-start-4">
          {/*
           * blockJS:false re-enables JS expressions in MDX (needed for the
           * <ArchDiagram tiers={[...]} /> array props). Safe here because the
           * MDX is trusted, first-party content in content/work — never user
           * input. blockDangerousJS stays true (its default), so eval/Function/
           * process/require remain blocked.
           */}
          <MDXRemote
            source={body}
            components={mdxComponents}
            options={{ blockJS: false }}
          />
        </article>
      </div>

      {/* Final CTA */}
      <section className="mt-section-mobile border-t border-outline-variant pt-16 text-center md:mt-32">
        <h3 className="mb-8 font-display text-headline-md text-on-surface">
          Have a system like this in mind?
        </h3>
        <div className="flex justify-center">
          <Button href="/quote" className="px-12 py-5">
            Request a Quote
          </Button>
        </div>
      </section>
    </main>
  );
}
