import { RouteProgress, Skeleton, SkeletonText } from '@/components/ui/Skeleton'

export type LoadingVariant = 'page' | 'index' | 'article' | 'form'

type Props = {
  variant?: LoadingVariant
  /** What is loading, for the status region. Keep it to a noun: "Blog", "Case study". */
  label?: string
}

function Header() {
  return (
    <div className="pt-12 pb-10 md:pt-20 md:pb-14">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-5 h-11 w-4/5 max-w-3xl md:h-14" />
      <Skeleton className="mt-4 h-11 w-3/5 max-w-2xl md:h-14" />
      <SkeletonText lines={2} className="mt-6 max-w-2xl" />
    </div>
  )
}

function Body({ variant }: { variant: LoadingVariant }) {
  if (variant === 'index') {
    return (
      <div className="pb-24">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-28 rounded-sm" />
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="rounded-lg border border-border-subtle p-5 md:p-6">
              <Skeleton className="aspect-16/10 w-full rounded-md" />
              <Skeleton className="mt-5 h-6 w-4/5" />
              <SkeletonText lines={2} className="mt-3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'article') {
    return (
      <div className="pb-24">
        <Skeleton className="aspect-16/10 w-full rounded-lg" />
        <div className="mt-12 max-w-[70ch]">
          <SkeletonText lines={4} />
          <Skeleton className="mt-12 h-8 w-1/2" />
          <SkeletonText lines={5} className="mt-5" />
          <SkeletonText lines={3} className="mt-10" />
        </div>
      </div>
    )
  }

  if (variant === 'form') {
    return (
      <div className="max-w-2xl pb-24">
        <Skeleton className="h-2 w-full rounded-sm" />
        <div className="mt-10 flex flex-col gap-7">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-12 w-full rounded-sm" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-10 h-12 w-44 rounded-md" />
      </div>
    )
  }

  return (
    <div className="grid gap-10 pb-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <SkeletonText lines={4} />
        <Skeleton className="mt-8 h-12 w-44 rounded-md" />
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <Skeleton className="aspect-4/3 w-full rounded-lg" />
      </div>
    </div>
  )
}

/**
 * Route-level loading UI. It mirrors the shape of the page being fetched so the swap to
 * real content doesn't jump, and it renders no text — one status region does the
 * announcing, and empty skeletons can't be mistaken for content if a route ever hangs.
 */
export function PageLoading({ variant = 'page', label = 'Page' }: Props) {
  return (
    <main id="main" aria-busy="true" className="page-x">
      <RouteProgress />
      <p role="status" className="sr-only">
        {label} is loading
      </p>
      <Header />
      <Body variant={variant} />
    </main>
  )
}
