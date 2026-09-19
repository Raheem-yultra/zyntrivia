import { describe, expect, it } from 'vitest'

import { formatDate, lowerFirst } from './format'

describe('lowerFirst', () => {
  it('lowercases a leading word but keeps acronyms', () => {
    expect(lowerFirst('Web apps and SaaS MVPs')).toBe('web apps and SaaS MVPs')
    expect(lowerFirst('AI agents and chatbots')).toBe('AI agents and chatbots')
  })
})

describe('formatDate', () => {
  it('formats ISO dates in UTC and tolerates empty values', () => {
    expect(formatDate('2026-09-08T09:00:00.000Z')).toBe('Sep 8, 2026')
    expect(formatDate(null)).toBe('')
    expect(formatDate('not a date')).toBe('')
  })
})
