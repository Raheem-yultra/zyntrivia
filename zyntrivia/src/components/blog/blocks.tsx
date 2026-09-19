import { Info, Lightbulb, TriangleAlert } from 'lucide-react'
import Link from 'next/link'

import { CmsMedia, isMediaDoc, mediaSrc } from '@/components/media/CmsMedia'
import { Button } from '@/components/ui/Button'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Tile, stretchedLink } from '@/components/ui/Tile'
import { Visual } from '@/components/visuals/fragments/registry'
import { analyticsAttrs } from '@/lib/analytics'
import { CODE_LANGUAGES } from '@/blocks'
import { cn } from '@/lib/cn'
import { highlightCode } from '@/lib/highlight'
import type {
  CalloutBlock as CalloutFields,
  CaseStudyRefBlock as CaseStudyRefFields,
  CodeBlock as CodeFields,
  ComparisonBlock as ComparisonFields,
  CTABlock as CTAFields,
  FeatureShotBlock as FeatureShotFields,
  ImageCaptionBlock as ImageCaptionFields,
  TableBlock as TableFields,
  VideoBlock as VideoFields,
} from '@/payload-types'

import { CopyButton } from './CopyButton'

export async function CodeBlockView({ code, language, filename }: CodeFields) {
  const html = await highlightCode(code, language)
  const languageLabel =
    CODE_LANGUAGES.find((option) => option.value === language)?.label ?? language
  const label = filename ? `Code: ${filename}` : `${languageLabel} code`

  return (
    <div className="code-block not-prose overflow-hidden rounded-md border border-border-subtle bg-surface-1">
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle py-1 pr-1 pl-4">
        <span className="type-small truncate font-normal text-text-subtle">
          {filename || languageLabel}
        </span>
        <CopyButton code={code} />
      </div>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

const CALLOUT = {
  note: { icon: Info, className: 'border-info', iconClass: 'text-info', label: 'Note' },
  tip: { icon: Lightbulb, className: 'border-signal', iconClass: 'text-signal', label: 'Tip' },
  warning: {
    icon: TriangleAlert,
    className: 'border-warn',
    iconClass: 'text-warn',
    label: 'Warning',
  },
} as const

export function CalloutView({ tone, title, body }: CalloutFields) {
  const style = CALLOUT[tone] ?? CALLOUT.note
  const Icon = style.icon
  return (
    <aside
      aria-label={title || style.label}
      className={cn('flex gap-3 rounded-md border-l-2 bg-surface-1 px-4 py-4', style.className)}
    >
      <Icon
        aria-hidden
        className={cn('mt-1 size-5 shrink-0', style.iconClass)}
        strokeWidth={1.75}
      />
      <div>
        {title && <p className="font-semibold text-text">{title}</p>}
        <p className="whitespace-pre-line">{body}</p>
      </div>
    </aside>
  )
}

export function ImageCaptionView({ image, caption, width }: ImageCaptionFields) {
  if (!isMediaDoc(image)) return null
  return (
    <MediaFrame caption={caption} className={cn(width === 'wide' && 'md:-mx-16')}>
      <CmsMedia media={image} sizes="(min-width: 900px) 760px, 100vw" />
    </MediaFrame>
  )
}

export function VideoView({ video, poster, caption }: VideoFields) {
  if (!isMediaDoc(video) || !video.url) return null
  return (
    <MediaFrame caption={caption}>
      <video
        controls
        preload="none"
        playsInline
        poster={isMediaDoc(poster) && poster.url ? mediaSrc(poster.url) : undefined}
        aria-label={video.alt}
        width={video.width ?? undefined}
        height={video.height ?? undefined}
        className="block h-auto w-full"
      >
        <source src={mediaSrc(video.url)} type={video.mimeType ?? 'video/mp4'} />
      </video>
    </MediaFrame>
  )
}

export function parseTable(rows: string): { header: string[]; body: string[][] } {
  const lines = rows
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split('|').map((cell) => cell.trim()))
  return { header: lines[0] ?? [], body: lines.slice(1) }
}

export function TableView({ caption, rows }: TableFields) {
  const { header, body } = parseTable(rows)
  return (
    <div
      role="region"
      aria-label={caption || 'Table'}
      tabIndex={0}
      className="overflow-x-auto rounded-md border border-border-subtle"
    >
      <table className="w-full min-w-md border-collapse text-left text-base">
        {caption && (
          <caption className="type-small px-4 pt-3 text-left text-text-subtle">{caption}</caption>
        )}
        <thead>
          <tr className="border-b border-border-subtle">
            {header.map((cell, index) => (
              <th key={index} scope="col" className="px-4 py-3 font-semibold text-text">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border-subtle last:border-b-0">
              {header.map((_, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {row[cellIndex] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const lines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

export function ComparisonView({ leftTitle, leftItems, rightTitle, rightItems }: ComparisonFields) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        { title: leftTitle, items: lines(leftItems), accent: false },
        { title: rightTitle, items: lines(rightItems), accent: true },
      ].map((column) => (
        <div
          key={column.title}
          className={cn(
            'rounded-md border bg-surface-1 p-5',
            column.accent ? 'border-accent' : 'border-border-subtle',
          )}
        >
          <p className="font-display text-lg font-semibold text-text">{column.title}</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base">
            {column.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function InlineCtaView({
  headline,
  location = 'blog_inline',
}: Pick<CTAFields, 'headline'> & { location?: 'blog_inline' | 'blog_end' }) {
  return (
    <aside
      aria-label="Request a quote"
      className="not-prose flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="font-display text-xl font-semibold text-text">{headline}</p>
      <Button
        href="/quote"
        {...analyticsAttrs('cta_click', { location, label: 'Request a quote' })}
      >
        Request a quote
      </Button>
    </aside>
  )
}

export function CaseStudyRefView({ caseStudy }: CaseStudyRefFields) {
  if (typeof caseStudy !== 'object' || caseStudy === null) return null
  return (
    <Tile interactive className="not-prose flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="sm:w-56 sm:shrink-0">
        {isMediaDoc(caseStudy.coverMedia) && caseStudy.coverMedia.mimeType?.startsWith('image/') ? (
          <MediaFrame>
            <CmsMedia media={caseStudy.coverMedia} sizes="224px" />
          </MediaFrame>
        ) : (
          <Visual name={caseStudy.coverVisual} />
        )}
      </div>
      <div>
        <p className="type-small font-normal text-text-subtle">Case study</p>
        <Link
          href={`/work/${caseStudy.slug}`}
          className={cn(
            'font-display text-xl font-semibold text-text hover:underline',
            stretchedLink,
          )}
        >
          {caseStudy.title}
        </Link>
        <p className="mt-1 text-base">{caseStudy.problemLine}</p>
      </div>
    </Tile>
  )
}

export function FeatureShotView({ media, caption }: FeatureShotFields) {
  if (!isMediaDoc(media)) return null
  return (
    <MediaFrame caption={caption}>
      <CmsMedia media={media} sizes="(min-width: 900px) 760px, 100vw" />
    </MediaFrame>
  )
}
