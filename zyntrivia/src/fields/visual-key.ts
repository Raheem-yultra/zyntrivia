import type { SelectField } from 'payload'

/**
 * Keys map to UI fragments in src/components/visuals/fragments (registry.tsx).
 * Editors pick a fragment where no real screenshot exists yet.
 */
export const VISUAL_KEYS = [
  { label: 'Order email', value: 'email-row' },
  { label: 'Stock ledger rows', value: 'ledger' },
  { label: 'Workflow node', value: 'workflow-node' },
  { label: 'KPI tiles', value: 'kpi-tiles' },
  { label: 'Marketplace filter panel', value: 'filter-panel' },
  { label: 'Slack alert', value: 'slack-message' },
  { label: 'Orders table', value: 'table' },
  { label: 'Chart (demo data)', value: 'chart' },
  { label: 'Agent run trace', value: 'agent-trace' },
] as const

export type VisualKey = (typeof VISUAL_KEYS)[number]['value']

export function visualKeyField(name = 'visualKey', label = 'UI fragment'): SelectField {
  return {
    name,
    label,
    type: 'select',
    options: VISUAL_KEYS.map(({ label: optionLabel, value }) => ({ label: optionLabel, value })),
  }
}
