import { defineField, defineType } from "sanity";

/**
 * One row on /services and the home ServicesRows list. `variant: "design"`
 * is the one escape hatch — it routes to the DigitalAssetShowcase component
 * instead of the plain hairline row, so the CMS can flag a service as the
 * visually distinct "creative" offering without a code change.
 */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      description:
        "One sentence. Feeds the structured-data service catalog — keep it factual, not a headline.",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      description: "The long-form paragraph shown on /services.",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Visual treatment",
      type: "string",
      options: {
        list: [
          { title: "Default (hairline row)", value: "default" },
          { title: "Design (accent showcase card)", value: "design" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers show first.",
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
    select: { title: "name", subtitle: "summary" },
  },
});
