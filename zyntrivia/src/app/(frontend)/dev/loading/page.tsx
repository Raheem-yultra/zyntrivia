import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageLoading, type LoadingVariant } from '@/components/sections/PageLoading'

export const metadata: Metadata = { title: 'Loading states', robots: { index: false } }

const VARIANTS: LoadingVariant[] = ['page', 'index', 'article', 'form']

function isVariant(value: string | undefined): value is LoadingVariant {
  return VARIANTS.includes(value as LoadingVariant)
}

type Props = {
  searchParams: Promise<{ variant?: string; delay?: string }>
}

/**
 * Dev-only preview of the route-level loading UI. 404 in production.
 *
 * `?variant=page|index|article|form` renders one skeleton directly; `?delay=4000` holds the
 * page instead, which exercises the real Suspense fallback from `(frontend)/loading.tsx`.
 */
export default async function LoadingStatesPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === 'production') notFound()

  const { variant, delay } = await searchParams

  if (delay) {
    const ms = Math.min(Number(delay) || 0, 10_000)
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  if (isVariant(variant)) return <PageLoading variant={variant} label={variant} />

  return (
    <main id="main" className="page-x section-y">
      <h1 className="type-h1 text-text">Loading states</h1>
      <p className="type-body-l mt-4 max-w-2xl text-text-muted">
        Each variant mirrors the page shape it stands in for, so the swap to real content does not
        jump.
      </p>
      <ul className="mt-10 flex flex-col gap-3">
        {VARIANTS.map((name) => (
          <li key={name}>
            <a className="text-info underline underline-offset-4" href={`?variant=${name}`}>
              {name}
            </a>
          </li>
        ))}
        <li>
          <a className="text-info underline underline-offset-4" href="?delay=4000">
            hold this route for 4s (real Suspense fallback)
          </a>
        </li>
      </ul>
    </main>
  )
}
