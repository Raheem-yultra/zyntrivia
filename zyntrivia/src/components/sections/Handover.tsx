import { CircleCheck } from 'lucide-react'

import {
  DeployThumb,
  ReadmeThumb,
  RepoThumb,
  SupportThumb,
  TestsThumb,
} from '@/components/visuals/HandoverThumbnails'
import { HANDOVER_ITEMS } from '@/lib/content/process'

import { SectionHeading } from './SectionHeading'

const THUMBS = [RepoThumb, ReadmeThumb, TestsThumb, DeployThumb, SupportThumb]

export function Handover() {
  return (
    <section
      data-section="handover"
      aria-labelledby="handover-heading"
      className="page-x section-y"
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading
          id="handover-heading"
          title="It’s all yours when we’re done"
          lead="You can keep it running without us."
          className="lg:col-span-4"
        />
        <ul className="divide-y divide-border-subtle border-y border-border-subtle lg:col-span-8">
          {HANDOVER_ITEMS.map((item, index) => {
            const Thumb = THUMBS[index] ?? RepoThumb
            return (
              <li
                key={item.title}
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-8"
              >
                <div className="flex flex-1 gap-3">
                  <CircleCheck
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-signal"
                    strokeWidth={1.75}
                  />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text">{item.title}</h3>
                    <p className="text-text-muted">{item.summary}</p>
                  </div>
                </div>
                <Thumb />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
