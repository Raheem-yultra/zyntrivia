import { CmsMedia, isMediaDoc } from '@/components/media/CmsMedia'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Visual } from '@/components/visuals/fragments/registry'
import type { CaseStudy } from '@/payload-types'

type Props = {
  study: Pick<CaseStudy, 'coverMedia' | 'coverPoster' | 'coverVisual' | 'featureShots'>
  sizes: string
  priority?: boolean
  className?: string
}

/** Cover video loop or screenshot; overlapping real UI fragments when neither exists. */
export function CaseStudyMedia({ study, sizes, priority, className }: Props) {
  if (isMediaDoc(study.coverMedia)) {
    return (
      <MediaFrame
        className={className}
        frameClassName="aspect-[16/10] [&_img]:h-full [&_img]:object-cover [&_img]:object-left-top [&_video]:h-full [&_video]:object-cover"
      >
        <CmsMedia
          media={study.coverMedia}
          poster={study.coverPoster}
          sizes={sizes}
          priority={priority}
        />
      </MediaFrame>
    )
  }

  const secondary = (study.featureShots ?? [])
    .map((shot) => shot.visual)
    .find((visual) => visual && visual !== study.coverVisual)

  return (
    <MediaFrame className={className} frameClassName="hero-wash relative aspect-[16/10] bg-bg">
      <div className="absolute top-[12%] left-[8%] w-[62%] max-w-xs">
        <Visual name={study.coverVisual} />
      </div>
      {secondary && (
        <div className="absolute right-[7%] bottom-[10%] w-[52%] max-w-72">
          <Visual name={secondary} />
        </div>
      )}
    </MediaFrame>
  )
}
