'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/Button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="main" className="page-x section-y">
      <h1 className="type-h1 text-text">Something went wrong</h1>
      <p className="type-body-l mt-4 max-w-xl text-text-muted">
        This page failed to load. Try again, or come back in a minute.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Go to the homepage
        </Button>
      </div>
    </main>
  )
}
