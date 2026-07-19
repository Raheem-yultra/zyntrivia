export type AccordionItem = { q: string; a: string };

/** Native <details> accordion — keyboard accessible for free. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-outline-variant border-y border-outline-variant">
      {items.map((item) => (
        <details key={item.q} className="group cursor-pointer py-6">
          <summary className="flex list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-lg text-on-surface md:text-xl">
              {item.q}
            </span>
            <span
              aria-hidden
              className="text-outline transition-transform duration-150 ease-mechanical group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-measure text-body-md text-on-surface-variant">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
