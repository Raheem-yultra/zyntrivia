import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { diagramField } from '../fields/diagram'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { visualKeyField } from '../fields/visual-key'
import { revalidateCollection } from '../hooks/revalidate'
import { TAGS } from '../lib/cms/tags'
import { simpleEditor } from '../lib/editor'
import { INDUSTRIES } from '../lib/industries'
import { previewUrl } from '../lib/preview'
import { maxWords } from '../lib/words'

const httpsUrl = (value: unknown): true | string => {
  if (!value) return true
  const text = String(value)
  if (text.startsWith('/')) return true
  try {
    return new URL(text).protocol === 'https:' || 'Use a full https:// URL or a site path.'
  } catch {
    return 'Use a full https:// URL or a site path.'
  }
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case study', plural: 'Case studies' },
  admin: {
    group: 'Work',
    useAsTitle: 'title',
    defaultColumns: ['title', 'industry', '_status', 'order'],
    livePreview: {
      url: ({ data }) => previewUrl('case-studies', data?.slug),
    },
    preview: (doc) => previewUrl('case-studies', doc?.slug),
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: { autosave: { interval: 800 } },
    maxPerDoc: 30,
  },
  defaultSort: 'order',
  hooks: revalidateCollection((doc) => [
    TAGS.caseStudies,
    ...(doc.slug ? [TAGS.caseStudy(doc.slug)] : []),
    TAGS.home,
  ]),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true, maxLength: 60 },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              maxLength: 160,
              admin: { description: 'One line under the title.' },
            },
            {
              name: 'problemLine',
              type: 'text',
              required: true,
              validate: maxWords(12),
              admin: { description: 'The problem in 12 words or fewer. Used on cards.' },
            },
            {
              name: 'outcomeLine',
              type: 'text',
              validate: maxWords(20),
              admin: {
                description:
                  'One concrete, verifiable result. Leave empty rather than estimate — cards hide it.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'demoUrl', type: 'text', validate: httpsUrl },
                { name: 'repoUrl', type: 'text', validate: httpsUrl },
              ],
            },
            {
              name: 'coverMedia',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Screenshot, or a muted video loop (≤ 8s, ≤ 1.5 MB, WebM or MP4).',
              },
            },
            {
              name: 'coverPoster',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: {
                description: 'Poster frame for a video cover (≤ 60 KB).',
                condition: (_, siblingData) => Boolean(siblingData?.coverMedia),
              },
            },
            {
              ...visualKeyField('coverVisual', 'Fallback UI fragment'),
              admin: { description: 'Shown when there is no cover media.' },
            },
          ],
        },
        {
          label: 'At a glance',
          fields: [
            {
              name: 'atAGlance',
              type: 'group',
              fields: [
                { name: 'problem', type: 'textarea', required: true, validate: maxWords(20) },
                { name: 'solution', type: 'textarea', required: true, validate: maxWords(20) },
                { name: 'result', type: 'textarea', required: true, validate: maxWords(20) },
              ],
            },
          ],
        },
        {
          label: 'Story',
          fields: [
            {
              name: 'problem',
              type: 'richText',
              editor: simpleEditor,
              admin: { description: '120 words max.' },
            },
            diagramField('problemDiagram', 'Current-state diagram'),
            {
              name: 'featureShots',
              label: 'What we built',
              type: 'array',
              labels: { singular: 'Feature', plural: 'Features' },
              fields: [
                { name: 'title', type: 'text', required: true, maxLength: 60 },
                {
                  name: 'caption',
                  type: 'textarea',
                  required: true,
                  maxLength: 240,
                  validate: maxWords(40),
                },
                { name: 'media', type: 'upload', relationTo: 'media' },
                {
                  ...visualKeyField('visual', 'UI fragment'),
                  admin: { description: 'Used when there is no screenshot.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Architecture',
          fields: [
            diagramField('architecture', 'Architecture diagram'),
            {
              name: 'architectureSvg',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { equals: 'image/svg+xml' } },
              admin: { description: 'Optional. Replaces the tiered diagram when set.' },
            },
            {
              name: 'architectureNotes',
              type: 'array',
              labels: { singular: 'Decision', plural: 'Decisions' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Results & stack',
          fields: [
            {
              name: 'results',
              type: 'array',
              admin: {
                description:
                  'Only real, measured results. The section is hidden when empty — never estimate.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, maxLength: 16 },
                    { name: 'label', type: 'text', required: true, maxLength: 60 },
                  ],
                },
                { name: 'note', type: 'text' },
              ],
            },
            {
              name: 'stack',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: { mimeType: { contains: 'image' } },
                },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'industry',
      type: 'select',
      required: true,
      options: INDUSTRIES.map((option) => ({ ...option })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'timeline',
      type: 'text',
      admin: { position: 'sidebar', description: 'e.g. "6 weeks". Leave empty if unknown.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
    seoField,
  ],
}
