import { AfterScene, BeforeScene } from '@/components/visuals/BeforeAfterScenes'
import { CompareSlider } from '@/components/visuals/CompareSlider'
import type { Homepage } from '@/payload-types'

export function BeforeAfter({ copy }: { copy: Homepage['beforeAfter'] }) {
  return (
    <section
      data-section="before-after"
      aria-labelledby="before-after-heading"
      className="page-x section-y"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="before-after-heading" data-budget={10} className="type-h2 text-text">
            Sound familiar?
          </h2>
          <dl data-budget={30} className="type-body-l mt-6 flex flex-col gap-4">
            <div>
              <dt data-budget-skip className="type-small text-text-subtle">
                Before
              </dt>
              <dd className="text-text-muted">{copy.before}</dd>
            </div>
            <div>
              <dt data-budget-skip className="type-small text-accent">
                After
              </dt>
              <dd className="text-text">{copy.after}</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-8">
          <CompareSlider
            label="Compare before and after"
            before={<BeforeScene />}
            after={<AfterScene />}
          />
        </div>
      </div>
    </section>
  )
}
