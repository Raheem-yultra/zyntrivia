import { Check, FileText, Folder } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

function Thumb({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="img"
      aria-label={label}
      data-visual
      className="w-full rounded-sm border border-border-subtle bg-bg p-3 text-[12px] leading-relaxed text-text-muted select-none sm:w-56"
    >
      {children}
    </div>
  )
}

const Line = ({ className, children }: { className?: string; children: ReactNode }) => (
  <span className={cn('flex items-center gap-1.5 truncate', className)}>{children}</span>
)

export function RepoThumb() {
  return (
    <Thumb label="Your company account holding the orders app, its logins, and a start-here guide">
      <Line className="text-text">
        <Folder aria-hidden className="size-3.5 text-info" strokeWidth={1.75} /> Your company
      </Line>
      {['Orders app', 'Account logins'].map((name) => (
        <Line key={name} className="pl-4">
          <Folder aria-hidden className="size-3.5" strokeWidth={1.75} /> {name}
        </Line>
      ))}
      <Line className="pl-4">
        <FileText aria-hidden className="size-3.5" strokeWidth={1.75} /> Start here
      </Line>
    </Thumb>
  )
}

export function ReadmeThumb() {
  return (
    <Thumb label="Guide outline: how it works, everyday tasks, and what to do if something goes wrong">
      <span className="block font-display text-sm font-semibold text-text">Orders app guide</span>
      <span className="mt-1 block text-text">How it works</span>
      <span className="block">Everyday tasks</span>
      <span className="block">If something goes wrong</span>
    </Thumb>
  )
}

export function TestsThumb() {
  return (
    <Thumb label="Passing checks: reads PDF orders, tries again when a service is down, never counts stock twice">
      {[
        'Reads a PDF order correctly',
        'Tries again if a service is down',
        'Never counts stock twice',
      ].map((name) => (
        <Line key={name}>
          <Check aria-hidden className="size-3.5 shrink-0 text-signal" strokeWidth={2.5} /> {name}
        </Line>
      ))}
    </Thumb>
  )
}

export function DeployThumb() {
  return (
    <Thumb label="Setup guide steps: connect your accounts, bring your data across, go live">
      {['Connect your accounts', 'Bring your data across', 'Go live and check it works'].map(
        (step, index) => (
          <Line key={step}>
            <span className="w-3 shrink-0 text-accent">{index + 1}</span> {step}
          </Line>
        ),
      )}
    </Thumb>
  )
}

export function SupportThumb() {
  return (
    <Thumb label="Support window covering the 30 days after launch">
      <span className="block text-text">Support window</span>
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-2">
        <span className="block h-full w-2/5 rounded-full bg-signal" />
      </span>
      <span className="mt-1.5 flex justify-between">
        <span>Launch</span>
        <span>Day 30</span>
      </span>
    </Thumb>
  )
}
