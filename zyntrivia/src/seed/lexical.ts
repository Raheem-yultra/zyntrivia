import { randomBytes } from 'node:crypto'

/** Tiny builders for Lexical editor state, so seed content stays readable. */

type Node = Record<string, unknown>

const FORMAT = { bold: 1, italic: 2, code: 16 } as const

export type Inline =
  string | { text: string; bold?: boolean; italic?: boolean; code?: boolean } | Node

function textNode(value: Inline): Node {
  if (typeof value === 'object' && 'type' in value) return value
  const spec = typeof value === 'string' ? { text: value } : value
  const format =
    ('bold' in spec && spec.bold ? FORMAT.bold : 0) |
    ('italic' in spec && spec.italic ? FORMAT.italic : 0) |
    ('code' in spec && spec.code ? FORMAT.code : 0)
  return {
    type: 'text',
    text: spec.text,
    format,
    style: '',
    mode: 'normal',
    detail: 0,
    version: 1,
  }
}

const element = (type: string, children: Node[], extra: Node = {}): Node => ({
  type,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children,
  ...extra,
})

export const p = (...content: Inline[]): Node =>
  element('paragraph', content.map(textNode), { textFormat: 0, textStyle: '' })

export const h2 = (text: string): Node => element('heading', [textNode(text)], { tag: 'h2' })
export const h3 = (text: string): Node => element('heading', [textNode(text)], { tag: 'h3' })

export const ul = (...items: Inline[][]): Node =>
  element(
    'list',
    items.map((content, index) => element('listitem', content.map(textNode), { value: index + 1 })),
    { listType: 'bullet', tag: 'ul', start: 1 },
  )

export const link = (text: string, url: string): Node => ({
  type: 'link',
  format: '',
  indent: 0,
  version: 3,
  direction: 'ltr',
  fields: { linkType: 'custom', url, newTab: false },
  children: [textNode(text)],
})

export const block = (blockType: string, fields: Node): Node => ({
  type: 'block',
  format: '',
  version: 2,
  fields: { id: randomBytes(12).toString('hex'), blockName: '', blockType, ...fields },
})

export const doc = (...children: Node[]) => ({
  root: element('root', children),
})
