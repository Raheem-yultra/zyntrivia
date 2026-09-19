import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { POST_BLOCKS } from '../blocks'

const INTERNAL_LINK_COLLECTIONS = ['posts', 'case-studies', 'services'] as const

// Replaced or dropped defaults: images go through the ImageCaption block so alt text
// and captions stay consistent, and headings are limited to what the TOC understands.
const DROPPED_FEATURES = new Set([
  'heading',
  'link',
  'upload',
  'relationship',
  'checklist',
  'indent',
  'align',
])

/** Full editor for blog posts: h2/h3, links, lists, and the custom blocks. */
export const postEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => !DROPPED_FEATURES.has(feature.key)),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    LinkFeature({ enabledCollections: [...INTERNAL_LINK_COLLECTIONS] }),
    BlocksFeature({ blocks: POST_BLOCKS }),
    FixedToolbarFeature(),
  ],
})

/** Short-form editor (case study problem, FAQ answers): paragraphs, emphasis, lists, links. */
export const simpleEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter(
      (feature) =>
        !DROPPED_FEATURES.has(feature.key) &&
        !['blockquote', 'horizontalRule', 'subscript', 'superscript'].includes(feature.key),
    ),
    LinkFeature({ enabledCollections: [...INTERNAL_LINK_COLLECTIONS] }),
  ],
})
