import { defineField, defineType } from "sanity";

/**
 * Structured equivalent of <ArchDiagram tiers={[...]} /> from the old MDX case
 * studies. Portable Text can't execute JSX, so the tiers/rows/boxes shape is
 * modeled directly as an object block embedded in the body array — the
 * PortableText renderer maps this straight back onto the existing
 * components/work/ArchDiagram.tsx with no visual change.
 */
export const archDiagramBlock = defineType({
  name: "archDiagram",
  title: "Architecture Diagram",
  type: "object",
  fields: [
    defineField({
      name: "tiers",
      title: "Tiers (top to bottom)",
      type: "array",
      of: [
        {
          type: "object",
          name: "tierRow",
          title: "Row",
          fields: [
            defineField({
              name: "boxes",
              title: "Boxes (side by side)",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "tierBox",
                  title: "Box",
                  fields: [
                    defineField({ name: "label", type: "string", title: "Label", validation: (Rule) => Rule.required() }),
                    defineField({ name: "sub", type: "string", title: "Detail" }),
                    defineField({ name: "accent", type: "boolean", title: "Accent (highlighted)", initialValue: false }),
                  ],
                  preview: { select: { title: "label", subtitle: "sub" } },
                },
              ],
            }),
          ],
          preview: {
            select: { boxes: "boxes" },
            prepare({ boxes }) {
              const labels = (boxes ?? []).map((b: { label?: string }) => b.label).join(", ");
              return { title: labels || "(empty row)" };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { tiers: "tiers" },
    prepare({ tiers }) {
      return { title: `Architecture diagram — ${(tiers ?? []).length} row(s)` };
    },
  },
});
