'use client'

import { MoveHorizontal } from 'lucide-react'
import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  before: ReactNode
  after: ReactNode
  beforeLabel?: string
  afterLabel?: string
  label: string
  className?: string
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

/** Before/after comparison: drag, tap, or use arrow keys (±5%), Page keys (±10%), Home/End. */
export function CompareSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  label,
  className,
}: Props) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function positionFromPointer(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    positionFromPointer(event.clientX)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragging.current) positionFromPointer(event.clientX)
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -10,
      PageUp: 10,
    }
    if (event.key in steps) {
      event.preventDefault()
      setPosition((value) => clamp(value + (steps[event.key] ?? 0)))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setPosition(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setPosition(100)
    }
  }

  const rounded = Math.round(position)

  return (
    <div
      ref={containerRef}
      data-visual
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={cn(
        'relative touch-pan-y overflow-hidden rounded-lg border border-border-subtle bg-bg select-none',
        className,
      )}
    >
      <div className="relative">{before}</div>
      <div
        aria-hidden={rounded === 0}
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        {after}
      </div>

      <span className="type-small pointer-events-none absolute top-3 left-3 rounded-sm bg-bg px-2 py-1 text-text-muted">
        {beforeLabel}
      </span>
      <span className="type-small pointer-events-none absolute top-3 right-3 rounded-sm bg-bg px-2 py-1 text-accent">
        {afterLabel}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-accent"
        style={{ left: `${position}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={`${rounded}% ${afterLabel.toLowerCase()} shown`}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex size-11 -translate-1/2 cursor-ew-resize items-center justify-center rounded-full border border-accent bg-surface-2 text-accent"
        style={{ left: `${position}%` }}
      >
        <MoveHorizontal aria-hidden className="size-5" strokeWidth={1.75} />
      </div>
    </div>
  )
}
