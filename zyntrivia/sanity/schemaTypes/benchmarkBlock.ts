import { defineField, defineType } from "sanity";

/**
 * Structured equivalent of the inline <B>...</B> marker from the old MDX case
 * studies: a visibly-flagged placeholder for a figure that must be measured,
 * never invented. Modeled as an inline object so editors can drop it into a
 * sentence exactly where the old JSX component sat.
 */
export const benchmarkBlock = defineType({
  name: "benchmark",
  title: "Benchmark placeholder",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Placeholder text",
      description: 'e.g. "measure with seeded 50k-movement dataset"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "text" },
    prepare({ title }) {
      return { title: `Benchmark: ${title}` };
    },
  },
});
