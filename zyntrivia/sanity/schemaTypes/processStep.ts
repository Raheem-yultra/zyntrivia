import { defineField, defineType } from "sanity";

/**
 * Feeds both the home page's condensed teaser (shortBody) and the full
 * /process page (longBody) from one document, so the two no longer drift —
 * previously the same four steps were hand-copied in two components.
 */
export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "shortBody",
      title: "Short body (home page teaser)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "longBody",
      title: "Long body (/process page)",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "shortBody" },
  },
});
