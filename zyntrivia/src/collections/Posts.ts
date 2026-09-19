import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { revalidateCollection } from '../hooks/revalidate'
import { TAGS } from '../lib/cms/tags'
import { postEditor } from '../lib/editor'
import { previewUrl } from '../lib/preview'
import { readingTimeMinutes, type LexicalState } from '../lib/richtext'
import { maxWords } from '../lib/words'

const computeDerivedFields: CollectionBeforeChangeHook = ({ data }) => {
  data.readingTime = readingTimeMinutes(data.content as LexicalState)
  if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
  return data
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'topics', '_status', 'publishedAt'],
    livePreview: {
      url: ({ data }) => previewUrl('posts', data?.slug),
    },
    preview: (doc) => previewUrl('posts', doc?.slug),
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: {
    beforeChange: [computeDerivedFields],
    ...revalidateCollection((doc) => [
      TAGS.posts,
      ...(doc.slug ? [TAGS.post(doc.slug)] : []),
      TAGS.home,
    ]),
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 90 },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 180,
      validate: maxWords(25),
      admin: { description: 'Shown on the blog index and in search results. 25 words max.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: postEditor,
      admin: {
        description:
          'Add a "Quote CTA" block around 60% of the way through. If you don’t, one is inserted automatically.',
      },
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set automatically when first published.',
      },
    },
    {
      name: 'topics',
      type: 'relationship',
      relationTo: 'topics',
      hasMany: true,
      required: true,
      minRows: 1,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'The newest featured post is shown large at the top of /blog.',
      },
    },
    { name: 'series', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Zyntrivia team',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'relatedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { hidden: true },
    },
    seoField,
  ],
}
