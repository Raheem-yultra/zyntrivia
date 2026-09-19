'use client'

import { useState } from 'react'

import { cn } from '@/lib/cn'

/** Hover, focus, or tap a node to see a one-line caption. */
export function NodeCaption({
  id,
  title,
  caption,
}: {
  id: string
  title: string
  caption: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={id}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
        className="absolute inset-0 z-10 cursor-help rounded-md"
      >
        <span className="sr-only">{title}</span>
      </button>
      <p
        id={id}
        className={cn(
          'type-small pointer-events-none absolute inset-x-2 top-full z-20 mt-2 rounded-sm border border-border-subtle bg-surface-2 px-3 py-2 font-normal text-text opacity-0 shadow-popover transition-opacity duration-150',
          'group-hover:opacity-100 group-has-[button:focus-visible]:opacity-100',
          open && 'opacity-100',
        )}
      >
        {caption}
      </p>
    </>
  )
}
