import { Mail, Paperclip } from 'lucide-react'

import { Fragment } from './Fragment'

export function EmailRow({ className }: { className?: string }) {
  return (
    <Fragment label="An order email with the order attached as a PDF" className={className}>
      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center gap-2 text-xs">
          <Mail aria-hidden className="size-3.5 text-info" strokeWidth={1.75} />
          <span className="font-semibold text-text">Purchasing team</span>
          <span className="ml-auto text-text-subtle">09:41</span>
        </div>
        <p className="truncate font-semibold text-text">Order 4471: 24 cold-chain boxes</p>
        <p className="truncate text-xs text-text-subtle">
          Please confirm delivery to Branch 2 by Friday…
        </p>
        <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-sm border border-border-subtle px-1.5 py-0.5 text-[11px]">
          <Paperclip aria-hidden className="size-3" strokeWidth={1.75} />
          order-4471.pdf
        </span>
      </div>
    </Fragment>
  )
}
