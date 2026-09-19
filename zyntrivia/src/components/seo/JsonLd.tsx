type Props = { data: Record<string, unknown> | Array<Record<string, unknown>> }

export function JsonLd({ data }: Props) {
  // Escape "<" so CMS text can't close the script tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
