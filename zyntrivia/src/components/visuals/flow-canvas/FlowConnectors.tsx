'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Connector = { d: string }

const PATH_DURATION = 0.8
const STEP_GAP_MS = 100
const START_DELAY_MS = 350

function anchorPath(from: DOMRect, to: DOMRect, origin: DOMRect): string {
  const x = (value: number) => value - origin.left
  const y = (value: number) => value - origin.top

  // Stacked (mobile): bottom-centre to top-centre.
  if (Math.abs(from.left - to.left) < 8) {
    const sx = x(from.left + from.width / 2)
    return `M ${sx} ${y(from.bottom)} L ${sx} ${y(to.top)}`
  }

  // Side by side: leave from the side facing the next node.
  const toRight = to.left > from.left
  const sx = x(toRight ? from.right : from.left)
  const sy = y(from.top + from.height / 2)
  const tx = x(toRight ? to.left : to.right)
  const ty = y(to.top + to.height / 2)
  const bend = Math.max(24, Math.abs(tx - sx) * 0.6) * (toRight ? 1 : -1)
  return `M ${sx} ${sy} C ${sx + bend} ${sy}, ${tx - bend} ${ty}, ${tx} ${ty}`
}

const canvasOf = (svg: SVGSVGElement | null) =>
  svg?.closest<HTMLElement>('[data-flow-canvas]') ?? null

/** Nodes hidden by the mobile crop have no client rects and are skipped. */
const visibleNodesOf = (svg: SVGSVGElement | null) =>
  Array.from(canvasOf(svg)?.querySelectorAll<HTMLElement>('[data-flow-node]') ?? []).filter(
    (node) => node.getClientRects().length > 0,
  )

export function FlowConnectors() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [active, setActive] = useState(-1)
  const [finished, setFinished] = useState(false)
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    const svg = svgRef.current
    const root = canvasOf(svg)
    if (!root) return

    const measure = () => {
      const origin = root.getBoundingClientRect()
      const rects = visibleNodesOf(svg).map((node) => node.getBoundingClientRect())
      setConnectors(
        rects.slice(1).map((rect, index) => ({ d: anchorPath(rects[index]!, rect, origin) })),
      )
    }

    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const count = connectors.length
  // Reduced motion shows the final state immediately: every node done, no pulse.
  const complete = reduceMotion === true || finished
  const current = reduceMotion ? count : active

  // One-time sequence, started shortly after the hero text has painted.
  useEffect(() => {
    if (count === 0 || reduceMotion === null) return
    const nodes = visibleNodesOf(svgRef.current)

    if (reduceMotion) {
      nodes.forEach((node) => node.setAttribute('data-state', 'done'))
      return
    }

    nodes.forEach((node) => node.setAttribute('data-state', 'pending'))
    const timer = window.setTimeout(() => {
      nodes[0]?.setAttribute('data-state', 'done')
      setActive(0)
      setFinished(false)
    }, START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [count, reduceMotion])

  function onPathDone(index: number) {
    if (index !== active) return
    const nodes = visibleNodesOf(svgRef.current)
    nodes[index + 1]?.setAttribute('data-state', 'done')
    if (index + 1 < count) {
      window.setTimeout(() => setActive(index + 1), STEP_GAP_MS)
    } else {
      nodes[index + 1]?.setAttribute('data-idle', '')
      setActive(count)
      setFinished(true)
    }
  }

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      fill="none"
    >
      <LazyMotion features={domAnimation} strict>
        {connectors.map((connector, index) => {
          const drawn = index < current || complete
          const running = index === current && !complete
          return (
            <g key={index}>
              <path d={connector.d} className="stroke-border-input" strokeWidth={1.5} />
              <m.path
                d={connector.d}
                className="stroke-accent"
                strokeWidth={1.5}
                initial={false}
                animate={{
                  pathLength: drawn || running ? 1 : 0,
                  opacity: drawn ? 0.55 : running ? 1 : 0,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: PATH_DURATION, ease: [0.65, 0, 0.35, 1] }
                }
                onAnimationComplete={() => running && onPathDone(index)}
              />
              {running && (
                <path
                  d={connector.d}
                  pathLength={1}
                  className="animate-flow-pulse stroke-accent"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray="0.001 2"
                />
              )}
            </g>
          )
        })}
      </LazyMotion>
    </svg>
  )
}
