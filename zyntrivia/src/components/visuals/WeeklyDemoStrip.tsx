import { cn } from '@/lib/cn'

const WEEKS = 6
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

/** Mock calendar strip: a demo at the end of every build week. */
export function WeeklyDemoStrip({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Calendar strip showing a working demo at the end of every week of the build"
      data-visual
      className={cn(
        'overflow-hidden rounded-md border border-border-subtle bg-surface-1',
        className,
      )}
    >
      <div className="grid grid-cols-6 divide-x divide-border-subtle">
        {Array.from({ length: WEEKS }, (_, week) => (
          <div key={week} className={cn('p-2 sm:p-3', week >= 4 && 'max-sm:hidden')}>
            <span className="text-[11px] text-text-subtle">Week {week + 1}</span>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {DAYS.map((day) => (
                <span
                  key={day}
                  className={cn(
                    'h-6 rounded-[3px]',
                    day === 'Fri' ? 'bg-accent-solid' : 'bg-surface-2',
                  )}
                />
              ))}
            </div>
            <span className="mt-2 block text-[11px] text-accent">Demo</span>
          </div>
        ))}
      </div>
    </div>
  )
}
