'use client'

import { CircleAlert } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition, type FormEvent } from 'react'

import { submitQuote } from '@/app/(frontend)/quote/actions'
import { Button } from '@/components/ui/Button'
import { ChoiceTileGroup } from '@/components/ui/ChoiceTileGroup'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { Stepper } from '@/components/ui/Stepper'
import { ATTRIBUTION_STORAGE_KEY, track, type Attribution } from '@/lib/analytics'
import {
  DESCRIPTION_MIN,
  fieldErrors,
  step1Schema,
  step2Schema,
  step3Schema,
  type FieldErrors,
  type QuoteDraft,
} from '@/lib/validation/quote'
import { PROJECT_TYPES, SOURCES, STAGES, TIMELINES } from '@/lib/validation/quote-options'

import { PROJECT_TYPE_HINTS, ProjectTypeIcon } from './projectTypeIcons'
import { QUOTE_STEPS } from './steps'
import { Turnstile } from './Turnstile'

const STORAGE_KEY = 'zyn:quote-draft'
const EMPTY: QuoteDraft = {
  projectType: '',
  timeline: '',
  stage: '',
  name: '',
  email: '',
  company: '',
  description: '',
  source: '',
}

function readDraft(): QuoteDraft {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    return stored ? { ...EMPTY, ...(JSON.parse(stored) as Partial<QuoteDraft>) } : EMPTY
  } catch {
    return EMPTY
  }
}

function readAttribution(): Attribution | undefined {
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Attribution) : undefined
  } catch {
    return undefined
  }
}

const isProjectType = (value: string | null) => PROJECT_TYPES.some((type) => type.value === value)

function initialDraft(typeParam: string | null): QuoteDraft {
  if (typeof window === 'undefined') return EMPTY
  const restored = readDraft()
  // Homepage tiles link to /quote?type=…&step=2.
  if (isProjectType(typeParam)) restored.projectType = typeParam as string
  return restored
}

type Feedback = { step: number; errors: FieldErrors; banner: string | null }

export function QuoteWizard({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedStep = Number(searchParams.get('step'))
  const step = requestedStep === 2 || requestedStep === 3 ? requestedStep : 1

  // useSearchParams opts this component out of static HTML, so the first render already
  // runs in the browser and can restore the saved draft directly.
  const [draft, setDraft] = useState<QuoteDraft>(() => initialDraft(searchParams.get('type')))
  // Errors and the banner belong to the step they were raised on.
  const [feedback, setFeedback] = useState<Feedback>({ step, errors: {}, banner: null })
  const [turnstileToken, setTurnstileToken] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [pending, startTransition] = useTransition()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const errors = feedback.step === step ? feedback.errors : {}
  const banner = feedback.step === step ? feedback.banner : null

  const goTo = useCallback(
    (next: number, mode: 'push' | 'replace' = 'push') => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('step', String(next))
      params.delete('type')
      const url = `${pathname}?${params.toString()}`
      if (mode === 'push') router.push(url, { scroll: false })
      else router.replace(url, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  // Never show a step whose earlier answers are missing (e.g. a bookmarked ?step=3).
  useEffect(() => {
    const needed = !draft.projectType ? 1 : !draft.timeline || !draft.stage ? 2 : 3
    if (step > needed) goTo(needed, 'replace')
    // Checked when the step changes, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Storage unavailable; the form still works for this page view.
    }
  }, [draft])

  useEffect(() => {
    track('quote_step_view', { step, type: draft.projectType || 'none' })
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    // Move focus to the new step so keyboard and screen reader users start there.
    headingRef.current?.focus()
    // Only when the step changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setFeedback((current) =>
      current.step === step
        ? { ...current, errors: { ...current.errors, [key]: undefined } }
        : current,
    )
  }

  function next(event: FormEvent) {
    event.preventDefault()
    const schema = step === 1 ? step1Schema : step2Schema
    const result = schema.safeParse(draft)
    if (!result.success) {
      setFeedback({ step, errors: fieldErrors(result.error), banner: null })
      track('quote_error', { kind: 'validation' })
      return
    }
    track('quote_step_complete', { step, type: draft.projectType })
    goTo(step + 1)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const local = step3Schema.safeParse(draft)
    if (!local.success) {
      setFeedback({ step, errors: fieldErrors(local.error), banner: null })
      track('quote_error', { kind: 'validation' })
      return
    }
    setFeedback({ step, errors: {}, banner: null })

    startTransition(async () => {
      try {
        const result = await submitQuote({
          ...draft,
          attribution: readAttribution(),
          turnstileToken,
          website: honeypot,
        })
        if (result.ok) {
          track('quote_step_complete', { step: 3, type: draft.projectType })
          track('quote_submit', { type: draft.projectType, timeline: draft.timeline })
          try {
            window.sessionStorage.removeItem(STORAGE_KEY)
          } catch {
            // Ignore.
          }
          router.push(`/quote/thanks?type=${encodeURIComponent(draft.projectType)}`)
          return
        }
        track('quote_error', { kind: result.kind })
        setFeedback({ step: 3, errors: result.fieldErrors ?? {}, banner: result.message })
      } catch {
        track('quote_error', { kind: 'server' })
        setFeedback({
          step: 3,
          errors: {},
          banner: 'We couldn’t send your request. Check your connection and try again.',
        })
      }
    })
  }

  const errorList = Object.values(errors).filter(Boolean)

  return (
    <div>
      <Stepper steps={QUOTE_STEPS} current={step} />

      <form
        noValidate
        onSubmit={step === 3 ? submit : next}
        className="mt-10"
        aria-busy={pending || undefined}
      >
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Step {step} of 3: {QUOTE_STEPS[step - 1]}
        </h2>

        {banner && (
          <div
            role="alert"
            className="mb-8 flex gap-3 rounded-md border border-danger bg-surface-1 p-4 text-text"
          >
            <CircleAlert
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-danger"
              strokeWidth={1.75}
            />
            <p>{banner}</p>
          </div>
        )}
        {!banner && errorList.length > 0 && (
          <p role="alert" className="sr-only">
            {errorList.join(' ')}
          </p>
        )}

        {step === 1 && (
          <ChoiceTileGroup
            label="What would you like help with?"
            options={PROJECT_TYPES.map((type) => ({
              value: type.value,
              label: type.label,
              description: PROJECT_TYPE_HINTS[type.value],
              icon: <ProjectTypeIcon type={type.value} />,
            }))}
            value={draft.projectType || null}
            onChange={(value) => update('projectType', value)}
            error={errors.projectType}
          />
        )}

        {step === 2 && (
          <div className="flex flex-col gap-10">
            <ChoiceTileGroup
              label="When would you like to start?"
              columns={3}
              options={TIMELINES}
              value={draft.timeline || null}
              onChange={(value) => update('timeline', value)}
              error={errors.timeline}
            />
            <ChoiceTileGroup
              label="Where do things stand today?"
              columns={3}
              options={STAGES}
              value={draft.stage || null}
              onChange={(value) => update('stage', value)}
              error={errors.stage}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <p className="type-h3 text-text">Tell us about you and the project</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="quote-name" label="Name" error={errors.name}>
                {(describedBy) => (
                  <Input
                    id="quote-name"
                    name="name"
                    autoComplete="name"
                    value={draft.name}
                    onChange={(event) => update('name', event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy}
                    required
                  />
                )}
              </Field>
              <Field id="quote-email" label="Work email" error={errors.email}>
                {(describedBy) => (
                  <Input
                    id="quote-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={draft.email}
                    onChange={(event) => update('email', event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy}
                    required
                  />
                )}
              </Field>
            </div>
            <Field id="quote-company" label="Company" optional error={errors.company}>
              {(describedBy) => (
                <Input
                  id="quote-company"
                  name="company"
                  autoComplete="organization"
                  value={draft.company}
                  onChange={(event) => update('company', event.target.value)}
                  aria-invalid={errors.company ? true : undefined}
                  aria-describedby={describedBy}
                />
              )}
            </Field>
            <Field
              id="quote-description"
              label="What should the software do?"
              hint={`What happens today, what breaks, and what you’d like instead. At least ${DESCRIPTION_MIN} characters.`}
              error={errors.description}
            >
              {(describedBy) => (
                <Textarea
                  id="quote-description"
                  name="description"
                  rows={6}
                  value={draft.description}
                  onChange={(event) => update('description', event.target.value)}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={describedBy}
                  required
                />
              )}
            </Field>
            <Field
              id="quote-source"
              label="How did you hear about us?"
              optional
              error={errors.source}
            >
              {(describedBy) => (
                <Select
                  id="quote-source"
                  name="source"
                  value={draft.source}
                  onChange={(event) => update('source', event.target.value)}
                  aria-describedby={describedBy}
                >
                  <option value="">Choose one</option>
                  {SOURCES.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            {/* Honeypot: invisible to people and assistive tech. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="quote-website">Website</label>
              <input
                id="quote-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            {turnstileSiteKey && (
              <Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
            )}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => goTo(step - 1)} disabled={pending}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg" loading={pending}>
            {step === 3 ? (pending ? 'Sending' : 'Send request') : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}
