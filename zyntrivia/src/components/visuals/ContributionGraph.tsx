import type { ContributionDay } from '@/lib/github'
import { cn } from '@/lib/cn'

const LEVEL_CLASS = [
  'fill-surface-2',
  'fill-info/35',
  'fill-info/60',
  'fill-info/85',
  'fill-info',
] as const

export function ContributionGraph({
  days,
  username,
  className,
}: {
  days: ContributionDay[]
  username: string
  className?: string
}) {
  const size = 7
  const gap = 2
  const firstWeekday = new Date(`${days[0]?.date}T00:00:00Z`).getUTCDay()
  const cells = days.map((day, index) => {
    const offset = index + firstWeekday
    return { ...day, column: Math.floor(offset / 7), row: offset % 7 }
  })
  const columns = (cells.at(-1)?.column ?? 0) + 1
  const total = days.filter((day) => day.level > 0).length

  return (
    <svg
      role="img"
      aria-label={`GitHub activity for ${username}: contributions on ${total} of the last ${days.length} days`}
      viewBox={`0 0 ${columns * (size + gap)} ${7 * (size + gap)}`}
      className={cn('h-auto w-full', className)}
    >
      {cells.map((cell) => (
        <rect
          key={cell.date}
          x={cell.column * (size + gap)}
          y={cell.row * (size + gap)}
          width={size}
          height={size}
          rx={1.5}
          className={LEVEL_CLASS[cell.level]}
        />
      ))}
    </svg>
  )
}
