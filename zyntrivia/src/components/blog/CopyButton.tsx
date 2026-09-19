'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="type-small inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2 font-normal text-text-muted hover:text-text"
    >
      {copied ? (
        <Check aria-hidden className="size-4 text-signal" strokeWidth={2} />
      ) : (
        <Copy aria-hidden className="size-4" strokeWidth={1.75} />
      )}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
