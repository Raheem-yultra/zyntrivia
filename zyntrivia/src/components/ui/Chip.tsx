import { Check } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Props = { selected: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'>

export function Chip({ selected, className, children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'type-small inline-flex min-h-10 items-center gap-1.5 rounded-sm border px-3 transition-colors duration-150',
        selected
          ? 'border-accent text-accent'
          : 'border-border-subtle text-text-muted hover:border-border-input hover:text-text',
        className,
      )}
      {...rest}
    >
      {selected && <Check aria-hidden className="size-3.5" strokeWidth={2} />}
      {children}
    </button>
  )
}
