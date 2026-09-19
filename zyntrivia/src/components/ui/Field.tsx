import { ChevronDown, CircleAlert } from 'lucide-react'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

import { cn } from '@/lib/cn'

type FieldProps = {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  optional?: boolean
  children: (describedBy: string | undefined) => ReactNode
  className?: string
}

/** Label always visible above the control; hint and error wired via aria-describedby. */
export function Field({ id, label, hint, error, optional, children, className }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="type-small text-text">
        {label}
        {optional && <span className="font-normal text-text-subtle"> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="type-small -mt-1 font-normal text-text-subtle">
          {hint}
        </p>
      )}
      {children(describedBy)}
      {error && (
        <p id={errorId} className="type-small flex items-start gap-1.5 text-danger">
          <CircleAlert aria-hidden className="mt-px size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  )
}

const control =
  'w-full rounded-sm border border-border-input bg-surface-2 text-text placeholder:text-text-subtle aria-invalid:border-danger'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, 'h-12 px-3.5', className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(control, 'min-h-36 px-3.5 py-3 leading-relaxed', className)}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(control, 'h-12 appearance-none pr-10 pl-3.5', className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-text-subtle"
        strokeWidth={1.5}
      />
    </div>
  )
}
