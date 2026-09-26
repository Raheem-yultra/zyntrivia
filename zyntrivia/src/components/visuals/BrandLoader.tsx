import { LogoMark } from '@/components/layout/LogoMark'
import { cn } from '@/lib/cn'

/**
 * The logo mark with its Z drawing in and out, centred in the space a page is loading into.
 * Decorative: `PageLoading` owns the status announcement. It fades in after a short delay,
 * so a route that resolves quickly never shows it (see `animate-loader-in` in globals.css).
 */
export function BrandLoader({ className }: { className?: string }) {
  return (
    // Not `data-visual`: that marks a section's page visual (copy-budget test), and a loading
    // indicator isn't one.
    <div aria-hidden data-loader className={cn('animate-loader-in', className)}>
      <LogoMark animation="loop" className="size-16 md:size-20" />
    </div>
  )
}
