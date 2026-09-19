import { KpiTiles } from './fragments/KpiTiles'
import { MiniChart } from './fragments/MiniChart'
import { OrdersTable } from './fragments/OrdersTable'

const SHEET_ROWS = [
  ['PO 4468', 'Branch 2', '24', '#REF!', '??'],
  ['PO 4469', 'Brnch 1', '6', '118', 'sent?'],
  ['PO 4470', 'Branch 2', '', '#REF!', ''],
  ['PO 4471', 'branch2', '12', '96', 'call'],
  ['PO 4467', 'Branch 1', '30', '#VALUE!', ''],
  ['PO 4466', 'Branch 3', '8', '64', 'recount'],
  ['PO 4465', 'Branch 2', '', '#REF!', '??'],
  ['PO 4464', 'Brnch 3', '15', '120', ''],
]

/** Stylised chaos: a broken spreadsheet, a reply-all thread, and a sticky note. */
export function BeforeScene() {
  return (
    <div
      role="img"
      aria-label="Before: a spreadsheet with broken formulas, a long reply-all email thread, and a sticky note reminder"
      className="relative grid min-h-[340px] gap-4 p-4 pt-14 sm:min-h-[380px] sm:grid-cols-[1.4fr_1fr] sm:p-6 sm:pt-14"
    >
      <div className="overflow-hidden rounded-sm border border-border-subtle bg-surface-1 text-[12px]">
        <div className="flex gap-1 border-b border-border-subtle px-2 py-1.5 text-[11px] text-text-subtle">
          <span className="rounded-sm bg-surface-2 px-1.5">stock_FINAL_v4</span>
          <span className="px-1.5">stock_FINAL_v4 (1)</span>
          <span className="max-sm:hidden px-1.5">orders_copy</span>
        </div>
        <table className="w-full table-fixed text-left text-text-muted">
          <tbody>
            {SHEET_ROWS.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border-subtle last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={
                      cell.startsWith('#')
                        ? 'truncate border-r border-border-subtle px-1.5 py-1.5 text-danger last:border-r-0'
                        : 'truncate border-r border-border-subtle px-1.5 py-1.5 last:border-r-0'
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3">
        {[
          'RE: RE: FW: updated numbers',
          'RE: FW: which sheet is right?',
          'FW: stock count (final)',
        ].map((subject, index) => (
          <div
            key={subject}
            className="rounded-sm border border-border-subtle bg-surface-1 px-3 py-2 text-[12px]"
            style={{ marginLeft: `${index * 10}px` }}
          >
            <span className="block truncate font-semibold text-text">{subject}</span>
            <span className="block truncate text-text-subtle">
              Can someone check Branch 2 again…
            </span>
          </div>
        ))}
        <div className="mt-1 w-fit rotate-[-3deg] rounded-sm border border-warn bg-surface-2 px-3 py-2 text-[12px] text-warn">
          Re-enter Friday orders by 6pm
        </div>
      </div>
    </div>
  )
}

/** One screen that updates itself. */
export function AfterScene() {
  return (
    <div
      role="img"
      aria-label="After: one dashboard with live order counts, an orders table that updates itself, and a weekly chart"
      className="grid min-h-[340px] gap-4 bg-bg p-4 pt-14 sm:min-h-[380px] sm:grid-cols-2 sm:p-6 sm:pt-14"
    >
      <div className="flex flex-col gap-4">
        <KpiTiles />
        <OrdersTable />
      </div>
      <MiniChart className="max-sm:hidden" />
    </div>
  )
}
