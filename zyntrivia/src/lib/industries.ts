export const INDUSTRIES = [
  { label: 'Retail & distribution', value: 'retail-distribution' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Marketplaces', value: 'marketplaces' },
  { label: 'Professional services', value: 'professional-services' },
  { label: 'SaaS', value: 'saas' },
  { label: 'Cross-industry operations', value: 'cross-industry' },
] as const

export function industryLabel(value: string | null | undefined): string {
  return INDUSTRIES.find((industry) => industry.value === value)?.label ?? ''
}
