import { countWords } from './words'
import { slugify } from './slugify'

/** Minimal shape of Lexical's serialized editor state — enough to walk it. */
export type LexicalNode = {
  type: string
  text?: string
  tag?: string
  children?: LexicalNode[]
  fields?: Record<string, unknown>
  [key: string]: unknown
}

export type LexicalState = { root: LexicalNode } | null | undefined

// Containers whose children are separate blocks rather than runs of inline text.
const BLOCK_CONTAINERS = new Set(['root', 'list', 'table', 'tablerow', 'tablecell', 'quote'])

export function nodeText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  const separator = BLOCK_CONTAINERS.has(node.type) ? '\n' : ''
  return (node.children ?? []).map(nodeText).join(separator)
}

export function plainText(state: LexicalState): string {
  return state?.root ? nodeText(state.root) : ''
}

const WORDS_PER_MINUTE = 225
const BLOCK_META_FIELDS = new Set(['id', 'blockName', 'blockType', 'language', 'tone', 'width'])

/** Text inside custom blocks (code, callouts, tables…), which plainText skips. */
function blockText(node: LexicalNode): string {
  const own =
    node.type === 'block' && node.fields
      ? Object.entries(node.fields)
          .filter(([key, value]) => !BLOCK_META_FIELDS.has(key) && typeof value === 'string')
          .map(([, value]) => value as string)
          .join(' ')
      : ''
  return [own, ...(node.children ?? []).map(blockText)].filter(Boolean).join(' ')
}

export function readingTimeMinutes(state: LexicalState): number {
  if (!state?.root) return 1
  const words = countWords(plainText(state)) + countWords(blockText(state.root))
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export type TocEntry = { id: string; text: string; level: 2 | 3 }

/** h2/h3 headings with stable, de-duplicated ids (matches the renderer). */
export function tableOfContents(state: LexicalState): TocEntry[] {
  const seen = new Map<string, number>()
  const entries: TocEntry[] = []
  for (const node of state?.root?.children ?? []) {
    if (node.type !== 'heading' || (node.tag !== 'h2' && node.tag !== 'h3')) continue
    const text = nodeText(node).trim()
    if (!text) continue
    entries.push({ id: headingId(text, seen), text, level: node.tag === 'h2' ? 2 : 3 })
  }
  return entries
}

export function headingId(text: string, seen: Map<string, number>): string {
  const base = slugify(text) || 'section'
  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}
