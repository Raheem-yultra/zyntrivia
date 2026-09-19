export type ContributionDay = { date: string; level: 0 | 1 | 2 | 3 | 4 }

const USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

/** Parses GitHub's public contribution calendar markup into days. */
export function parseContributions(html: string): ContributionDay[] {
  const days: ContributionDay[] = []
  const cell = /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*\bdata-level="([0-4])"/g
  for (const match of html.matchAll(cell)) {
    days.push({ date: match[1]!, level: Number(match[2]) as ContributionDay['level'] })
  }
  return days.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Real public data only; any failure returns null so the proof item is hidden.
 * Refreshed daily.
 */
export async function getContributions(
  username: string | null | undefined,
  weeks = 18,
): Promise<ContributionDay[] | null> {
  if (!username || !USERNAME.test(username)) return null
  try {
    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(username)}/contributions`,
      { next: { revalidate: 86_400 }, signal: AbortSignal.timeout(5_000) },
    )
    if (!response.ok) return null
    const days = parseContributions(await response.text())
    return days.length > 0 ? days.slice(-weeks * 7) : null
  } catch {
    return null
  }
}
