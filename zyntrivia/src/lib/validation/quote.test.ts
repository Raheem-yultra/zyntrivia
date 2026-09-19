import { describe, expect, it } from 'vitest'

import { fieldErrors, quoteSubmissionSchema, step3Schema, stripHtml } from './quote'

const valid = {
  projectType: 'automation',
  timeline: 'asap',
  stage: 'replace-tool',
  name: 'Sam Rivera',
  email: '  Sam@Example.COM ',
  company: '',
  description: 'We re-type every supplier order from email into two systems by hand.',
  source: '',
}

describe('quote submission schema', () => {
  it('accepts a complete submission and normalises the email', () => {
    const result = quoteSubmissionSchema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data?.email).toBe('sam@example.com')
  })

  it('rejects unknown option values', () => {
    expect(quoteSubmissionSchema.safeParse({ ...valid, projectType: 'crypto' }).success).toBe(false)
    expect(quoteSubmissionSchema.safeParse({ ...valid, timeline: 'someday' }).success).toBe(false)
  })

  it('has no budget field', () => {
    expect(Object.keys(quoteSubmissionSchema.shape)).not.toContain('budget')
  })

  it('reports field-level messages for step 3', () => {
    const result = step3Schema.safeParse({
      ...valid,
      email: 'not-an-email',
      description: 'too short',
    })
    expect(result.success).toBe(false)
    const errors = fieldErrors(result.error!)
    expect(errors.email).toMatch(/valid email/)
    expect(errors.description).toMatch(/at least 30/)
  })
})

describe('stripHtml', () => {
  it('removes tags but keeps the text', () => {
    expect(stripHtml('<b>Orders</b> are <script>alert(1)</script>late')).toBe(
      'Orders are alert(1)late',
    )
  })
})
