'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { buttonClasses } from '@/components/ui/Button'
import { analyticsAttrs } from '@/lib/analytics'
import { cn } from '@/lib/cn'

import { NavLinks } from './NavLinks'

/**
 * Native modal <dialog>: traps focus, makes the page inert, closes on Esc, and
 * returns focus to the menu button.
 */
export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-text md:hidden"
      >
        <Menu aria-hidden className="size-6" strokeWidth={1.5} />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,100vw)] max-w-none bg-surface-1 p-0 text-text backdrop:bg-bg/80 md:hidden"
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes the sheet.
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        {/*
          Scrolls rather than clips: in landscape on a phone (~360px tall) the links plus
          the quote CTA are taller than the sheet, and the CTA was unreachable.
        */}
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain pt-3 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(2rem,env(safe-area-inset-bottom))] pl-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex size-11 items-center justify-center rounded-md"
            >
              <X aria-hidden className="size-6" strokeWidth={1.5} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-4 flex flex-1 flex-col">
            <NavLinks
              className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle"
              linkClassName="font-display w-full py-3 text-2xl font-semibold [@media(height<32rem)]:py-2 [@media(height<32rem)]:text-xl"
            />
            <Link
              href="/quote"
              className={cn(buttonClasses('primary', 'lg'), 'mt-8 w-full')}
              {...analyticsAttrs('cta_click', { location: 'nav', label: 'Request a quote' })}
            >
              Request a quote
            </Link>
          </nav>
        </div>
      </dialog>
    </>
  )
}
