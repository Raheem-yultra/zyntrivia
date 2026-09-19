import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateCollection } from '../hooks/revalidate'
import { TAGS } from '../lib/cms/tags'

export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection(() => [TAGS.topics, TAGS.posts]),
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 40 },
    slugField(),
    { name: 'description', type: 'textarea', maxLength: 200 },
  ],
}
