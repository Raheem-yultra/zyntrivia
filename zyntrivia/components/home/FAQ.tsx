import { Accordion } from "@/components/ui/Accordion";
import { FAQ_ITEMS } from "@/lib/faq";

export function FAQ() {
  return (
    <section id="faq" className="section-pad section-x mx-auto max-w-container">
      <div className="max-w-3xl">
        <span className="eyebrow mb-stack-lg block text-outline">
          Frequently Asked
        </span>
        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}
