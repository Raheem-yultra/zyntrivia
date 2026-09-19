import { describe, expect, it } from 'vitest'

import { plainText, readingTimeMinutes, tableOfContents, type LexicalNode } from './richtext'

const text = (value: string): LexicalNode => ({ type: 'text', text: value })
const paragraph = (value: string): LexicalNode => ({ type: 'paragraph', children: [text(value)] })
const heading = (tag: 'h2' | 'h3', value: string): LexicalNode => ({
  type: 'heading',
  tag,
  children: [text(value)],
})
const doc = (...children: LexicalNode[]) => ({ root: { type: 'root', children } })

describe('rich text helpers', () => {
  it('extracts plain text across blocks', () => {
    expect(plainText(doc(paragraph('Hello there'), paragraph('General')))).toBe(
      'Hello there\nGeneral',
    )
  })

  it('keeps list items as separate words', () => {
    const list: LexicalNode = {
      type: 'list',
      children: [
        { type: 'listitem', children: [text('first item')] },
        { type: 'listitem', children: [text('second item')] },
      ],
    }
    expect(plainText(doc(list)).split(/\s+/)).toEqual(['first', 'item', 'second', 'item'])
  })

  it('rounds reading time up with a one-minute floor', () => {
    expect(readingTimeMinutes(doc(paragraph('short')))).toBe(1)
    expect(readingTimeMinutes(doc(paragraph(Array(451).fill('word').join(' '))))).toBe(3)
    expect(readingTimeMinutes(null)).toBe(1)
  })

  it('builds a table of contents from h2/h3 with unique ids', () => {
    const toc = tableOfContents(
      doc(
        heading('h2', 'Why it breaks'),
        paragraph('...'),
        heading('h3', 'Retries'),
        heading('h2', 'Why it breaks'),
      ),
    )
    expect(toc).toEqual([
      { id: 'why-it-breaks', text: 'Why it breaks', level: 2 },
      { id: 'retries', text: 'Retries', level: 3 },
      { id: 'why-it-breaks-2', text: 'Why it breaks', level: 2 },
    ])
  })
})
