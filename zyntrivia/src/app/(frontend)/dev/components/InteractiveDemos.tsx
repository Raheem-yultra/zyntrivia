'use client'

import { useState } from 'react'

import { Accordion } from '@/components/ui/Accordion'
import { ChoiceTileGroup } from '@/components/ui/ChoiceTileGroup'
import { Chip } from '@/components/ui/Chip'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { AfterScene, BeforeScene } from '@/components/visuals/BeforeAfterScenes'
import { CompareSlider } from '@/components/visuals/CompareSlider'

export function InteractiveDemos() {
  const [chips, setChips] = useState<string[]>(['automation'])
  const [choice, setChoice] = useState<string | null>(null)

  return (
    <>
      <section aria-label="Chip" className="border-t border-border-subtle pt-8">
        <h2 className="type-h3 text-text">Chip</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {['automation', 'web-apps', 'internal-tools'].map((value) => (
            <Chip
              key={value}
              selected={chips.includes(value)}
              onClick={() =>
                setChips((current) =>
                  current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value],
                )
              }
            >
              {value}
            </Chip>
          ))}
        </div>
      </section>

      <section aria-label="Form fields" className="border-t border-border-subtle pt-8">
        <h2 className="type-h3 text-text">Input, Textarea, Select</h2>
        <div className="mt-6 grid max-w-2xl gap-6">
          <Field id="demo-input" label="Work email" hint="We reply within one business day.">
            {(describedBy) => <Input id="demo-input" type="email" aria-describedby={describedBy} />}
          </Field>
          <Field id="demo-error" label="Name" error="Enter your name.">
            {(describedBy) => <Input id="demo-error" aria-invalid aria-describedby={describedBy} />}
          </Field>
          <Field id="demo-textarea" label="Description" optional>
            {(describedBy) => <Textarea id="demo-textarea" aria-describedby={describedBy} />}
          </Field>
          <Field id="demo-select" label="Source">
            {(describedBy) => (
              <Select id="demo-select" aria-describedby={describedBy}>
                <option>Search engine</option>
                <option>Referral</option>
              </Select>
            )}
          </Field>
        </div>
      </section>

      <section aria-label="ChoiceTile" className="border-t border-border-subtle pt-8">
        <ChoiceTileGroup
          label="ChoiceTile group"
          options={[
            { value: 'a', label: 'First option', description: 'Arrow keys move the selection' },
            { value: 'b', label: 'Second option' },
            { value: 'c', label: 'Third option' },
          ]}
          value={choice}
          onChange={setChoice}
          columns={3}
        />
      </section>

      <section aria-label="Accordion" className="border-t border-border-subtle pt-8">
        <h2 className="type-h3 text-text">Accordion</h2>
        <Accordion
          className="mt-6"
          headingLevel="h4"
          items={[
            { id: 'one', question: 'What does it do?', answer: <p>Height animates in 240ms.</p> },
            {
              id: 'two',
              question: 'Is it keyboard accessible?',
              answer: <p>Yes, with aria-expanded.</p>,
            },
          ]}
        />
      </section>

      <section aria-label="CompareSlider" className="border-t border-border-subtle pt-8">
        <h2 className="type-h3 text-text">CompareSlider</h2>
        <CompareSlider
          className="mt-6"
          label="Compare before and after"
          before={<BeforeScene />}
          after={<AfterScene />}
        />
      </section>
    </>
  )
}
