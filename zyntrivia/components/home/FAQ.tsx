import { Accordion } from "@/components/ui/Accordion";

type FaqItem = { question: string; answer: string };

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" className="section-pad section-x mx-auto max-w-container">
      <div className="max-w-3xl">
        <span className="eyebrow mb-stack-lg block text-outline">
          Frequently Asked
        </span>
        <Accordion items={items.map((i) => ({ q: i.question, a: i.answer }))} />
      </div>
    </section>
  );
}
