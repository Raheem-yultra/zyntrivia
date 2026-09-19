import { AppWindow, Bot, CircleHelp, LayoutDashboard, Workflow } from 'lucide-react'

import type { ProjectType } from '@/lib/validation/quote-options'

const ICONS: Record<ProjectType, typeof AppWindow> = {
  'web-app': AppWindow,
  automation: Workflow,
  'internal-tool': LayoutDashboard,
  'ai-agent': Bot,
  'not-sure': CircleHelp,
}

export function ProjectTypeIcon({
  type,
  className = 'size-5',
}: {
  type: ProjectType
  className?: string
}) {
  const Icon = ICONS[type]
  return <Icon aria-hidden className={className} strokeWidth={1.5} />
}

export const PROJECT_TYPE_HINTS: Record<ProjectType, string> = {
  automation: 'Orders, invoices, or leads typed in by hand',
  'internal-tool': 'Numbers spread across copies and inboxes',
  'ai-agent': 'Emails and requests handled one at a time',
  'web-app': 'A portal, booking system, or product to sell',
  'not-sure': 'Tell us the problem and we’ll suggest a fix',
}
