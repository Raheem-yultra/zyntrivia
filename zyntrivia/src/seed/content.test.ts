import { describe, expect, it } from 'vitest'

import { plainText, readingTimeMinutes, type LexicalState } from '@/lib/richtext'
import { countWords } from '@/lib/words'

import { CASE_STUDIES, FAQS, POSTS, SERVICES } from './content'

/** Word budgets from docs/01-PRD.md §4, applied to the seed content. */
describe('seed content word budgets', () => {
  it('keeps services within their field budgets', () => {
    for (const service of SERVICES) {
      expect(countWords(service.outcomeLine), service.slug).toBeLessThanOrEqual(12)
      expect(countWords(service.summary), service.slug).toBeLessThanOrEqual(22)
      expect(countWords(service.problem.headline), service.slug).toBeLessThanOrEqual(10)
      expect(countWords(service.problem.body), service.slug).toBeLessThanOrEqual(45)
      for (const capability of service.capabilities) {
        expect(countWords(capability.body), capability.title).toBeLessThanOrEqual(30)
      }
    }
  })

  it('keeps case study summaries short', () => {
    for (const study of CASE_STUDIES) {
      expect(countWords(study.problemLine), study.slug).toBeLessThanOrEqual(12)
      expect(countWords(study.outcomeLine), study.slug).toBeLessThanOrEqual(20)
      expect(study.summary.length, study.slug).toBeLessThanOrEqual(160)
      for (const fact of Object.values(study.atAGlance)) {
        expect(countWords(fact), study.slug).toBeLessThanOrEqual(20)
      }
    }
  })

  it('keeps FAQ answers to a section body (45 words)', () => {
    for (const faq of FAQS) {
      expect(countWords(plainText(faq.answer as LexicalState)), faq.key).toBeLessThanOrEqual(45)
    }
  })

  it('keeps post excerpts within 25 words and gives realistic reading times', () => {
    const ids = { stocksense: 1, workflowai: 3 }
    for (const post of POSTS) {
      expect(countWords(post.excerpt), post.slug).toBeLessThanOrEqual(25)
      expect(
        readingTimeMinutes(post.content(ids) as LexicalState),
        post.slug,
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it('never seeds invented results', () => {
    for (const study of CASE_STUDIES) {
      expect('results' in study, study.slug).toBe(false)
    }
  })
})
