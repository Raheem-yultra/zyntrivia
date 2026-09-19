import { DemoLabel, Fragment } from './Fragment'

function Sparkline() {
  return (
    <svg aria-hidden viewBox="0 0 64 20" className="h-5 w-16 text-info" fill="none">
      <polyline
        points="0,16 10,14 20,15 30,10 40,11 50,6 64,4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KpiTiles({ className, single = false }: { className?: string; single?: boolean }) {
  return (
    <Fragment
      label="Dashboard tiles showing orders processed today and open stock alerts (demo data)"
      className={className}
    >
      <div className={single ? 'p-3' : 'grid grid-cols-2 divide-x divide-border-subtle'}>
        <div className={single ? '' : 'p-3'}>
          <span className="text-xs">Orders today</span>
          <div className="mt-1 flex items-end justify-between gap-2">
            <span className="font-display text-2xl font-semibold text-text tabular-nums">128</span>
            <Sparkline />
          </div>
        </div>
        {!single && (
          <div className="p-3">
            <span className="text-xs">Stock alerts</span>
            <div className="mt-1 flex items-end justify-between gap-2">
              <span className="font-display text-2xl font-semibold text-text tabular-nums">3</span>
              <span className="text-[11px] text-warn">2 expiring</span>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-border-subtle px-3 py-1">
        <DemoLabel />
      </div>
    </Fragment>
  )
}
