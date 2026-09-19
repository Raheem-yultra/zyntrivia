import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { JsonLd } from '@/components/seo/JsonLd'
import { Accordion } from '@/components/ui/Accordion'
import type { LexicalState } from '@/lib/richtext'
import { faqPageJsonLd } from '@/lib/seo'
import type { Faq } from '@/payload-types'

import { SectionHeading } from './SectionHeading'

type Props = {
  faqs: Faq[]
  title?: string
  section?: string
  withJsonLd?: boolean
}

export function FaqSection({
  faqs,
  title = 'Questions we get asked',
  section = 'faq',
  withJsonLd = true,
}: Props) {
  if (faqs.length === 0) return null
  return (
    <section
      data-section={section}
      aria-labelledby={`${section}-heading`}
      className="page-x section-y"
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id={`${section}-heading`} title={title} className="lg:col-span-4" />
        <Accordion
          className="lg:col-span-8"
          items={faqs.map((faq) => ({
            id: `faq-${faq.id}`,
            question: faq.question,
            answer: (
              <RichTextRenderer data={faq.answer as LexicalState} className="flex flex-col gap-3" />
            ),
          }))}
        />
      </div>
      {withJsonLd && <JsonLd data={faqPageJsonLd(faqs)} />}
    </section>
  )
}
