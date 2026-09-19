'use client'

import { Check } from 'lucide-react'
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ChoiceOption<V extends string> = {
  value: V
  label: string
  description?: string
  icon?: ReactNode
}

type Props<V extends string> = {
  label: string
  options: readonly ChoiceOption<V>[]
  value: V | null
  onChange: (value: V) => void
  error?: string
  columns?: 2 | 3
  className?: string
}

/** Radio semantics with roving focus: arrows move and select, like a native radio group. */
export function ChoiceTileGroup<V extends string>({
  label,
  options,
  value,
  onChange,
  error,
  columns = 2,
  className,
}: Props<V>) {
  const labelId = useId()
  const errorId = useId()
  const refs = useRef<Array<HTMLDivElement | null>>([])
  const selectedIndex = options.findIndex((option) => option.value === value)
  const focusIndex = selectedIndex === -1 ? 0 : selectedIndex

  function select(index: number) {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    refs.current[index]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    const last = options.length - 1
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        select(index === last ? 0 : index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        select(index === 0 ? last : index - 1)
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        select(index)
        break
    }
  }

  return (
    <div className={className}>
      <p id={labelId} className="type-h3 text-text">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'mt-5 grid gap-3',
          columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        {options.map((option, index) => {
          const checked = option.value === value
          return (
            <div
              key={option.value}
              ref={(node) => {
                refs.current[index] = node
              }}
              role="radio"
              aria-checked={checked}
              tabIndex={index === focusIndex ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'relative flex min-h-16 cursor-pointer items-start gap-3 rounded-md border bg-surface-1 p-4 transition-colors duration-150',
                checked ? 'border-accent' : 'border-border-subtle hover:border-border-input',
              )}
            >
              {option.icon && (
                <span
                  className={cn('mt-0.5 shrink-0', checked ? 'text-accent' : 'text-text-subtle')}
                >
                  {option.icon}
                </span>
              )}
              <span className="flex min-w-0 flex-col">
                <span className="font-semibold text-text">{option.label}</span>
                {option.description && (
                  <span className="type-small font-normal text-text-subtle">
                    {option.description}
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className={cn(
                  'ml-auto flex size-5 shrink-0 items-center justify-center rounded-full border',
                  checked ? 'border-accent bg-accent text-bg' : 'border-border-input',
                )}
              >
                {checked && <Check className="size-3.5" strokeWidth={2.5} />}
              </span>
            </div>
          )
        })}
      </div>
      {error && (
        <p id={errorId} className="type-small mt-3 text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
