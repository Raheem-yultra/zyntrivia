import { Button } from '@/components/ui/Button'
import { analyticsAttrs } from '@/lib/analytics'

import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { NavLinks } from './NavLinks'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg">
      <div className="page-x flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-8 max-md:hidden">
          <NavLinks className="flex items-center gap-7 font-medium" />
          <Button
            href="/quote"
            {...analyticsAttrs('cta_click', { location: 'nav', label: 'Request a quote' })}
          >
            Request a quote
          </Button>
        </nav>
        <MobileNav />
      </div>
    </header>
  )
}
