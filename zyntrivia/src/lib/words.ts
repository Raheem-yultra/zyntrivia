export function countWords(text: string | null | undefined): number {
  if (!text) return 0
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

/** Payload field validator enforcing a word budget (docs/01-PRD.md §4). */
export function maxWords(limit: number) {
  return (value: unknown): true | string => {
    if (typeof value !== 'string') return true
    const count = countWords(value)
    return count <= limit || `Keep this to ${limit} words or fewer (currently ${count}).`
  }
}
