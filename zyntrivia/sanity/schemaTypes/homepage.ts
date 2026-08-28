import { defineField, defineType } from "sanity";

/**
 * Singleton — one document holds all of it. The Studio structure (sanity/structure.ts)
 * pins this to a single non-creatable, non-deletable entry so editors can't
 * accidentally spawn a second "homepage".
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "subhead", title: "Subhead", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
        defineField({
          name: "microcopy",
          title: "Microcopy under the buttons",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "problems",
      title: "Problem cards",
      description: "The three 'silent killer of scale' cards.",
      type: "array",
      of: [
        {
          type: "object",
          name: "problemCard",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "whyUs",
      title: "Why Zyntrivia points",
      type: "array",
      of: [
        {
          type: "object",
          name: "whyUsPoint",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
