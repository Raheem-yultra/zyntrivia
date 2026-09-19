import {
  LinkJSXConverter,
  RichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'

import { headingId, nodeText, type LexicalNode, type LexicalState } from '@/lib/richtext'
import type {
  CalloutBlock,
  CaseStudyRefBlock,
  CodeBlock,
  ComparisonBlock,
  CTABlock,
  FeatureShotBlock,
  ImageCaptionBlock,
  TableBlock,
  VideoBlock,
} from '@/payload-types'

import {
  CalloutView,
  CaseStudyRefView,
  CodeBlockView,
  ComparisonView,
  FeatureShotView,
  ImageCaptionView,
  InlineCtaView,
  TableView,
  VideoView,
} from './blocks'

type LinkDoc = { relationTo: string; value: unknown }

function internalDocToHref({ linkNode }: { linkNode: { fields: { doc?: LinkDoc | null } } }) {
  const doc = linkNode.fields.doc
  const slug =
    doc && typeof doc.value === 'object' && doc.value !== null && 'slug' in doc.value
      ? String((doc.value as { slug: unknown }).slug)
      : ''
  switch (doc?.relationTo) {
    case 'posts':
      return `/blog/${slug}`
    case 'case-studies':
      return `/work/${slug}`
    case 'services':
      return `/services/${slug}`
    default:
      return '/'
  }
}

type Props = {
  data: LexicalState
  className?: string
  /** Posts get a quote CTA ~60% through when the editor hasn't placed one. */
  autoInsertCta?: boolean
}

function withInlineCta(data: NonNullable<LexicalState>): NonNullable<LexicalState> {
  const children = data.root.children ?? []
  const hasCta = children.some(
    (node) => node.type === 'block' && (node.fields as { blockType?: string })?.blockType === 'cta',
  )
  if (hasCta || children.length < 4) return data
  let index = Math.round(children.length * 0.6)
  // Never separate a heading from the content it introduces.
  while (index > 0 && children[index - 1]?.type === 'heading') index -= 1
  const cta: LexicalNode = {
    type: 'block',
    version: 2,
    format: '',
    fields: {
      id: 'auto-cta',
      blockName: '',
      blockType: 'cta',
      headline: 'Have a similar problem?',
    },
  }
  return {
    ...data,
    root: { ...data.root, children: [...children.slice(0, index), cta, ...children.slice(index)] },
  }
}

export function RichTextRenderer({ data, className, autoInsertCta = false }: Props) {
  if (!data?.root) return null
  const content = autoInsertCta ? withInlineCta(data) : data
  const seenHeadings = new Map<string, number>()

  const converters: JSXConvertersFunction<
    | DefaultNodeTypes
    | SerializedBlockNode<
        | CodeBlock
        | CalloutBlock
        | ImageCaptionBlock
        | VideoBlock
        | TableBlock
        | ComparisonBlock
        | CTABlock
        | CaseStudyRefBlock
        | FeatureShotBlock
      >
  > = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: ({ node, nodesToJSX }) => {
      const Tag = node.tag
      const children = nodesToJSX({ nodes: node.children })
      if (Tag !== 'h2' && Tag !== 'h3') return <Tag>{children}</Tag>
      const id = headingId(nodeText(node as unknown as LexicalNode).trim(), seenHeadings)
      return <Tag id={id}>{children}</Tag>
    },
    blocks: {
      code: ({ node }) => <CodeBlockView {...node.fields} />,
      callout: ({ node }) => <CalloutView {...node.fields} />,
      imageCaption: ({ node }) => <ImageCaptionView {...node.fields} />,
      video: ({ node }) => <VideoView {...node.fields} />,
      table: ({ node }) => <TableView {...node.fields} />,
      comparison: ({ node }) => <ComparisonView {...node.fields} />,
      cta: ({ node }) => <InlineCtaView headline={node.fields.headline} />,
      caseStudyRef: ({ node }) => <CaseStudyRefView {...node.fields} />,
      featureShot: ({ node }) => <FeatureShotView {...node.fields} />,
    },
  })

  return (
    <RichText
      data={content as Parameters<typeof RichText>[0]['data']}
      converters={converters}
      className={className}
      disableIndent
      disableTextAlign
    />
  )
}
