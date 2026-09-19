import type { Block } from 'payload'

export const CODE_LANGUAGES = [
  { label: 'TypeScript', value: 'ts' },
  { label: 'TSX', value: 'tsx' },
  { label: 'JavaScript', value: 'js' },
  { label: 'JSON', value: 'json' },
  { label: 'Bash', value: 'bash' },
  { label: 'SQL', value: 'sql' },
  { label: 'Python', value: 'python' },
  { label: 'YAML', value: 'yaml' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: 'Plain text', value: 'text' },
] as const

export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'language',
          type: 'select',
          required: true,
          defaultValue: 'ts',
          options: CODE_LANGUAGES.map((option) => ({ ...option })),
        },
        { name: 'filename', type: 'text' },
      ],
    },
    { name: 'code', type: 'code', required: true },
  ],
}

export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  fields: [
    {
      name: 'tone',
      type: 'select',
      required: true,
      defaultValue: 'note',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Tip', value: 'tip' },
        { label: 'Warning', value: 'warning' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
  ],
}

export const ImageCaptionBlock: Block = {
  slug: 'imageCaption',
  interfaceName: 'ImageCaptionBlock',
  labels: { singular: 'Image with caption', plural: 'Images with caption' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'content',
      options: [
        { label: 'Text width', value: 'content' },
        { label: 'Wide', value: 'wide' },
      ],
    },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  fields: [
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: { mimeType: { in: ['video/mp4', 'video/webm'] } },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
    },
    { name: 'caption', type: 'text' },
  ],
}

export const TableBlock: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  fields: [
    { name: 'caption', type: 'text' },
    {
      name: 'rows',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One row per line, cells separated by | . The first line is the header row.',
        rows: 8,
      },
      validate: (value: unknown) =>
        (typeof value === 'string' && value.trim().split('\n').length >= 2) ||
        'Add a header row and at least one data row.',
    },
  ],
}

export const ComparisonBlock: Block = {
  slug: 'comparison',
  interfaceName: 'ComparisonBlock',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'leftTitle', type: 'text', required: true },
        { name: 'rightTitle', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftItems',
          type: 'textarea',
          required: true,
          admin: { description: 'One point per line.' },
        },
        {
          name: 'rightItems',
          type: 'textarea',
          required: true,
          admin: { description: 'One point per line.' },
        },
      ],
    },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: { singular: 'Quote CTA', plural: 'Quote CTAs' },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'Have a similar problem?',
      maxLength: 60,
    },
  ],
}

export const CaseStudyRefBlock: Block = {
  slug: 'caseStudyRef',
  interfaceName: 'CaseStudyRefBlock',
  labels: { singular: 'Case study card', plural: 'Case study cards' },
  fields: [{ name: 'caseStudy', type: 'relationship', relationTo: 'case-studies', required: true }],
}

export const FeatureShotBlock: Block = {
  slug: 'featureShot',
  interfaceName: 'FeatureShotBlock',
  labels: { singular: 'Feature screenshot', plural: 'Feature screenshots' },
  fields: [
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'textarea', required: true, maxLength: 240 },
  ],
}

export const POST_BLOCKS: Block[] = [
  CodeBlock,
  CalloutBlock,
  ImageCaptionBlock,
  VideoBlock,
  TableBlock,
  ComparisonBlock,
  CTABlock,
  CaseStudyRefBlock,
  FeatureShotBlock,
]
