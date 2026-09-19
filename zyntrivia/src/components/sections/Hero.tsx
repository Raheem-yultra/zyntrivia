import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { FlowCanvas } from '@/components/visuals/flow-canvas/FlowCanvas'
import { analyticsAttrs } from '@/lib/analytics'
import type { Homepage, SiteSetting } from '@/payload-types'

type Props = {
  hero: Homepage['hero']
  settings: SiteSetting
}

export function Hero({ hero, settings }: Props) {
  const review = settings.review
  const hasReview = Boolean(review?.platform && review.rating && review.count && review.url)

  return (
    <section
      data-section="hero"
      aria-labelledby="hero-heading"
      className="page-x pt-10 pb-16 md:pt-16 md:pb-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h1 id="hero-heading" data-budget={10} className="type-display text-text">
            {hero.headline}
          </h1>
          <p data-budget={22} className="type-body-l mt-6 max-w-xl text-text-muted">
            {hero.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              href="/quote"
              size="lg"
              {...analyticsAttrs('cta_click', { location: 'hero', label: 'Request a quote' })}
            >
              Request a quote
            </Button>
            <Button
              href="#how-it-works"
              variant="ghost"
              size="lg"
              {...analyticsAttrs('secondary_cta_click', {
                location: 'hero',
                label: 'See how it works',
              })}
            >
              See how it works
            </Button>
          </div>
          <ul className="type-small mt-7 flex flex-wrap gap-x-5 gap-y-2 font-normal text-text-subtle">
            {settings.responseTime && <li>{settings.responseTime}</li>}
            {settings.social?.githubUrl && (
              <li>
                <TextLink href={settings.social.githubUrl} tone="muted">
                  Public code on GitHub
                </TextLink>
              </li>
            )}
            {hasReview && review?.url && (
              <li>
                <TextLink href={review.url} tone="muted">
                  Rated {review.rating} on {review.platform} ({review.count} reviews)
                </TextLink>
              </li>
            )}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <FlowCanvas />
        </div>
      </div>
    </section>
  )
}
