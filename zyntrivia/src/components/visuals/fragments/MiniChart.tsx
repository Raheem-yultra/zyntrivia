import { DemoLabel, Fragment } from './Fragment'

const VALUES = [18, 24, 21, 30, 27, 34, 41]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function MiniChart({
  className,
  title = 'Orders processed automatically',
}: {
  className?: string
  title?: string
}) {
  const max = Math.max(...VALUES)
  return (
    <Fragment
      label={`Bar chart: ${title.toLowerCase()} rising across the week (demo data)`}
      className={className}
    >
      <div className="flex items-center justify-between px-3 pt-3 text-xs">
        <span className="font-semibold text-text">{title}</span>
        <DemoLabel />
      </div>
      <svg aria-hidden viewBox="0 0 140 64" className="h-auto w-full px-3 pt-2 pb-1">
        {VALUES.map((value, index) => {
          const height = (value / max) * 48
          const last = index === VALUES.length - 1
          return (
            <g key={index}>
              <rect
                x={index * 20 + 3}
                y={52 - height}
                width={12}
                height={height}
                rx={2}
                className={last ? 'fill-accent' : 'fill-info'}
                opacity={last ? 1 : 0.55}
              />
              <text
                x={index * 20 + 9}
                y={62}
                textAnchor="middle"
                className="fill-text-subtle"
                fontSize="7"
              >
                {DAYS[index]}
              </text>
            </g>
          )
        })}
      </svg>
    </Fragment>
  )
}
