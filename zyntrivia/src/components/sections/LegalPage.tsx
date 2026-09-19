import type { ReactNode } from 'react'

import { Prose } from '@/components/ui/Prose'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <main id="main" className="page-x pt-12 pb-24 md:pt-20">
      <h1 className="type-h1 text-text">{title}</h1>
      <p className="type-small mt-3 font-normal text-text-subtle">Last updated {updated}</p>
      <Prose className="mt-10">{children}</Prose>
    </main>
  )
}
