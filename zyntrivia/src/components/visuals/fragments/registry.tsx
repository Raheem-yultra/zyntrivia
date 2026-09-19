import type { VisualKey } from '@/fields/visual-key'

import { AgentTrace } from './AgentTrace'
import { EmailRow } from './EmailRow'
import { FilterPanel } from './FilterPanel'
import { KpiTiles } from './KpiTiles'
import { LedgerRows } from './LedgerRows'
import { MiniChart } from './MiniChart'
import { OrdersTable } from './OrdersTable'
import { SlackMessage } from './SlackMessage'
import { WorkflowNode } from './WorkflowNode'

const REGISTRY: Record<VisualKey, (props: { className?: string }) => React.ReactNode> = {
  'email-row': EmailRow,
  ledger: LedgerRows,
  'workflow-node': WorkflowNode,
  'kpi-tiles': KpiTiles,
  'filter-panel': FilterPanel,
  'slack-message': SlackMessage,
  table: OrdersTable,
  chart: MiniChart,
  'agent-trace': AgentTrace,
}

export function Visual({
  name,
  className,
}: {
  name: string | null | undefined
  className?: string
}) {
  const Component = name ? REGISTRY[name as VisualKey] : undefined
  return Component ? <Component className={className} /> : null
}
