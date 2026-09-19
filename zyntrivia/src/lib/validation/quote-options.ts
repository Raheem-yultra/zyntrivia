/** Option lists shared by the quote wizard, Zod schema, and the Payload collection. */

// Labels name the problem in plain language; values stay stable for stored leads and links.
export const PROJECT_TYPES = [
  { value: 'automation', label: 'Copying data between apps' },
  { value: 'internal-tool', label: 'Spreadsheets nobody trusts' },
  { value: 'ai-agent', label: 'Answering the same questions' },
  { value: 'web-app', label: 'An app for your customers' },
  { value: 'not-sure', label: 'Something else' },
] as const

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'In 1–3 months' },
  { value: 'exploring', label: 'Just exploring' },
] as const

export const STAGES = [
  { value: 'idea', label: 'An idea' },
  { value: 'replace-tool', label: 'An existing tool to replace' },
  { value: 'extend-product', label: 'An existing product to extend' },
] as const

export const SOURCES = [
  { value: 'search', label: 'Search engine' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'Referral' },
  { value: 'blog', label: 'Our blog' },
  { value: 'other', label: 'Other' },
] as const

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'call-booked', label: 'Call booked' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
] as const

type Option = { readonly value: string; readonly label: string }

export type ProjectType = (typeof PROJECT_TYPES)[number]['value']
export type Timeline = (typeof TIMELINES)[number]['value']
export type Stage = (typeof STAGES)[number]['value']
export type Source = (typeof SOURCES)[number]['value']

export function values<const T extends readonly Option[]>(
  options: T,
): [T[number]['value'], ...T[number]['value'][]] {
  return options.map((option) => option.value) as [T[number]['value'], ...T[number]['value'][]]
}

export function labelFor(options: readonly Option[], value: string | null | undefined): string {
  return options.find((option) => option.value === value)?.label ?? value ?? ''
}

/** Quote project type → service slug, for matching case studies on /quote/thanks. */
export const SERVICE_FOR_PROJECT_TYPE: Record<ProjectType, string | null> = {
  'web-app': 'web-apps',
  automation: 'automation',
  'internal-tool': 'internal-tools',
  'ai-agent': 'ai-agents',
  'not-sure': null,
}
