import { cn } from '@/lib/cn'

/**
 * Placeholder block for route-level loading UI. Always `aria-hidden`: the shape carries no
 * meaning, and the loading state is announced once by `PageLoading`'s status region.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-skeleton rounded-sm bg-surface-2', className)} />
}

/** A run of text lines, the last one short so it reads as a paragraph rather than a block. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden className={cn('flex flex-col gap-2.5', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', index === lines - 1 ? 'w-2/5' : index % 2 ? 'w-11/12' : 'w-full')}
        />
      ))}
    </div>
  )
}

/**
 * Accent bar pinned under the sticky header while a route streams in. Indeterminate —
 * Next gives no progress figure — so it sweeps rather than filling.
 */
export function RouteProgress() {
  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-16 z-30 h-0.5 overflow-hidden bg-border-subtle md:top-[72px]"
    >
      <div className="animate-route-progress h-full w-full bg-accent" />
    </div>
  )
}
