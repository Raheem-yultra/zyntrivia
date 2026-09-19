import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { visualKeyField } from '../fields/visual-key'
import { revalidateCollection } from '../hooks/revalidate'
import { TAGS } from '../lib/cms/tags'
import { maxWords } from '../lib/words'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Work',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'featuredOnHome', 'order'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  hooks: revalidateCollection((doc) => [
    TAGS.services,
    ...(doc.slug ? [TAGS.service(doc.slug)] : []),
    TAGS.home,
  ]),
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 48 },
    {
      name: 'outcomeLine',
      type: 'text',
      required: true,
      maxLength: 80,
      validate: maxWords(12),
      admin: { description: 'Outcome first, 12 words max. Shown on the homepage tile.' },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      validate: maxWords(22),
      admin: {
        description:
          'Supporting line under the service page headline. 22 words max. Plain language: name the problem, not the technology.',
      },
    },
    { ...visualKeyField('heroVisual', 'Hero visual'), required: true },
    {
      name: 'problem',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', required: true, validate: maxWords(10) },
        { name: 'body', type: 'textarea', required: true, validate: maxWords(45) },
        visualKeyField('visual'),
      ],
    },
    {
      name: 'capabilities',
      label: 'What you get',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true, validate: maxWords(8) },
        { name: 'body', type: 'textarea', required: true, validate: maxWords(30) },
        { ...visualKeyField('visual'), required: true },
      ],
    },
    slugField(),
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredOnHome',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'The most in-demand service. Gets the large homepage tile.',
      },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'relatedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    seoField,
  ],
}
