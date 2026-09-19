'use client'

import dynamic from 'next/dynamic'

/**
 * The connectors draw nothing until they've measured the nodes, so they load after hydration.
 * That keeps Motion out of the homepage's first-load JS (docs/03-ARCHITECTURE.md §8).
 */
export const FlowConnectorsLazy = dynamic(
  () => import('./FlowConnectors').then((module) => module.FlowConnectors),
  { ssr: false },
)
