import { PipelineRail } from "@/components/layout/PipelineRail";
import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { Problem } from "@/components/home/Problem";
import { LiveDemo } from "@/components/home/LiveDemo";
import { LeakCalculator } from "@/components/home/LeakCalculator";
import { ServicesRows } from "@/components/home/ServicesRows";
import { WorkPreview } from "@/components/home/WorkPreview";
import { StackMarquee } from "@/components/home/StackMarquee";
import { ProcessSection } from "@/components/home/ProcessSection";
import { WhyUs } from "@/components/home/WhyUs";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { SectionRule } from "@/components/layout/SectionRule";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ_ITEMS } from "@/lib/faq";
import { SITE } from "@/lib/site";

const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  url: SITE.url,
  description:
    "Engineering studio building internal tools, AI workflow automation, and full-stack applications.",
  areaServed: ["US", "EU"],
  address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
  sameAs: ["https://github.com/zyntrivia"],
};

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const RAIL_STAGES = [
  { id: "problem", label: "PROBLEM" },
  { id: "demo", label: "PIPELINE" },
  { id: "calculator", label: "LEAK" },
  { id: "services", label: "SERVICES" },
  { id: "work", label: "WORK" },
  { id: "process", label: "PROCESS" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "CONTACT" },
];

export default function Home() {
  return (
    <main>
      <JsonLd data={ORG_LD} />
      <JsonLd data={FAQ_LD} />
      <PipelineRail stages={RAIL_STAGES} />
      <Hero />
      <ProofStrip />
      <Problem />
      <LiveDemo />
      <LeakCalculator />
      <SectionRule />
      <ServicesRows />
      <SectionRule />
      <WorkPreview />
      <StackMarquee />
      <ProcessSection />
      <WhyUs />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
