'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'

type Option = { value: string; label: string }

export type WorkItem = {
  slug: string
  services: string[]
  industry: string
  card: ReactNode
}

type Props = {
  items: WorkItem[]
  services: Option[]
  industries: Option[]
}

function parseList(value: string | null): string[] {
  return value ? value.split(',').filter(Boolean) : []
}

/** Multi-select filters synced to ?service=a,b&industry=c. Any selected value within a group matches. */
export function WorkBrowser({ items, services, industries }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedServices = parseList(searchParams.get('service'))
  const selectedIndustries = parseList(searchParams.get('industry'))

  function update(key: 'service' | 'industry', values: string[]) {
    const params = new URLSearchParams(searchParams.toString())
    if (values.length > 0) params.set(key, values.join(','))
    else params.delete(key)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const toggle = (key: 'service' | 'industry', selected: string[], value: string) =>
    update(
      key,
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
    )

  const visible = items.filter(
    (item) =>
      (selectedServices.length === 0 ||
        item.services.some((service) => selectedServices.includes(service))) &&
      (selectedIndustries.length === 0 || selectedIndustries.includes(item.industry)),
  )

  const hasFilters = selectedServices.length > 0 || selectedIndustries.length > 0

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-border-subtle py-6">
        {[
          {
            key: 'service' as const,
            label: 'Service',
            options: services,
            selected: selectedServices,
          },
          {
            key: 'industry' as const,
            label: 'Industry',
            options: industries,
            selected: selectedIndustries,
          },
        ].map((group) =>
          group.options.length > 0 ? (
            <div
              key={group.key}
              role="group"
              aria-label={`Filter by ${group.label.toLowerCase()}`}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
            >
              <span className="type-small w-20 shrink-0 text-text-subtle">{group.label}</span>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <Chip
                    key={option.value}
                    selected={group.selected.includes(option.value)}
                    onClick={() => toggle(group.key, group.selected, option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length === 1 ? '1 project shown' : `${visible.length} projects shown`}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {visible.map((item) => (
            <li key={item.slug}>{item.card}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-start gap-4 rounded-lg border border-border-subtle bg-surface-1 p-8">
          <p className="type-h3 text-text">No projects match these filters.</p>
          {hasFilters && (
            <Button variant="secondary" onClick={() => router.replace(pathname, { scroll: false })}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
