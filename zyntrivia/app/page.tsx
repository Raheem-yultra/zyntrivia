import { PipelineRail } from "@/components/layout/PipelineRail";
import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { Problem } from "@/components/home/Problem";
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
import { SITE } from "@/lib/site";
import { getServices, getFaqItems, getHomepage, getProcessSteps, getCaseStudies } from "@/lib/sanity/queries";

const RAIL_STAGES = [
  { id: "problem", label: "PROBLEM" },
  { id: "calculator", label: "LEAK" },
  { id: "services", label: "SERVICES" },
  { id: "work", label: "WORK" },
  { id: "process", label: "PROCESS" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "CONTACT" },
];

export default async function Home() {
  // Fetched once here and passed down, so /services, ServicesRows, and this
  // page's own JSON-LD catalog can never drift relative to each other or to
  // whatever a CMS editor last published.
  const [services, faqItems, homepage, processSteps, work] = await Promise.all([
    getServices(),
    getFaqItems(),
    getHomepage(),
    getProcessSteps(),
    getCaseStudies(),
  ]);

  const ORG_LD = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    description:
      "Engineering studio building internal tools, AI workflow automation, full-stack applications, and digital asset design.",
    areaServed: ["US", "EU"],
    address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
    sameAs: ["https://github.com/zyntrivia"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.summary,
        },
      })),
    },
  };

  const FAQ_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main>
      <JsonLd data={ORG_LD} />
      <JsonLd data={FAQ_LD} />
      <PipelineRail stages={RAIL_STAGES} />
      <Hero {...homepage.hero} />
      <ProofStrip />
      <Problem problems={homepage.problems} />
      <LeakCalculator />
      <SectionRule />
      <ServicesRows services={services} />
      <SectionRule />
      <WorkPreview work={work} />
      <StackMarquee />
      <ProcessSection steps={processSteps} />
      <WhyUs points={homepage.whyUs} />
      <FAQ items={faqItems} />
      <FinalCTA />
    </main>
  );
}
