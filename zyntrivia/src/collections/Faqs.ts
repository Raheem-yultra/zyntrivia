import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'
import { TAGS } from '../lib/cms/tags'
import { simpleEditor } from '../lib/editor'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    group: 'Work',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'showOnHome', 'order'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  hooks: revalidateCollection(() => [TAGS.faqs, TAGS.home, TAGS.services]),
  fields: [
    { name: 'question', type: 'text', required: true, maxLength: 120 },
    { name: 'answer', type: 'richText', required: true, editor: simpleEditor },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Process', value: 'process' },
        { label: 'Ownership', value: 'ownership' },
        { label: 'Communication', value: 'communication' },
        { label: 'Payments', value: 'payments' },
        { label: 'Support', value: 'support' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show 5–6 on the homepage.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
  ],
}
