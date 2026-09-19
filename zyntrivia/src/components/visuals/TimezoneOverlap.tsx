const HOURS = 24

type Band = { label: string; detail: string; start: number; end: number; tone: 'accent' | 'info' }

/**
 * Working-hours overlap in UTC, drawn from the v1 site's stated coverage: the full
 * European working day and the US Eastern morning. Review with the studio before changing.
 */
const BANDS: Band[] = [
  { label: 'Europe', detail: '09:00–17:00 CET', start: 8, end: 16, tone: 'info' },
  { label: 'US Eastern', detail: '09:00–17:00 ET', start: 13, end: 21, tone: 'info' },
  { label: 'Zyntrivia', detail: 'Karachi, UTC+5', start: 8, end: 17, tone: 'accent' },
]

export function TimezoneOverlap() {
  return (
    <div
      role="img"
      aria-label="Working hours in UTC: Zyntrivia's day covers the full European working day and the US Eastern morning"
      data-visual
      className="rounded-lg border border-border-subtle bg-surface-1 p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4">
        {BANDS.map((band) => (
          <div
            key={band.label}
            className="grid grid-cols-[6.5rem_1fr] items-center gap-3 sm:grid-cols-[8rem_1fr]"
          >
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-text">{band.label}</span>
              <span className="text-[12px] text-text-subtle">{band.detail}</span>
            </span>
            <span className="relative h-6 rounded-sm bg-surface-2">
              <span
                className={
                  band.tone === 'accent'
                    ? 'absolute inset-y-0 rounded-sm bg-accent-solid'
                    : 'absolute inset-y-0 rounded-sm bg-info/45'
                }
                style={{
                  left: `${(band.start / HOURS) * 100}%`,
                  width: `${((band.end - band.start) / HOURS) * 100}%`,
                }}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[6.5rem_1fr] gap-3 sm:grid-cols-[8rem_1fr]">
        <span className="text-[12px] text-text-subtle">UTC</span>
        <span className="flex justify-between text-[12px] text-text-subtle">
          {['00', '06', '12', '18', '24'].map((hour) => (
            <span key={hour}>{hour}</span>
          ))}
        </span>
      </div>
    </div>
  )
}
