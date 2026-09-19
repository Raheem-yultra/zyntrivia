import { describe, expect, it } from 'vitest'

import { parseContributions } from './github'

describe('parseContributions', () => {
  it('reads date and level from calendar cells, sorted by date', () => {
    const html = `
      <td tabindex="0" data-ix="1" data-date="2026-09-02" id="c2" data-level="3" class="ContributionCalendar-day"></td>
      <td tabindex="0" data-ix="0" data-date="2026-09-01" id="c1" data-level="0" class="ContributionCalendar-day"></td>
      <td class="ContributionCalendar-label">Mon</td>`
    expect(parseContributions(html)).toEqual([
      { date: '2026-09-01', level: 0 },
      { date: '2026-09-02', level: 3 },
    ])
  })

  it('returns nothing for unrelated markup', () => {
    expect(parseContributions('<html><body>Not found</body></html>')).toEqual([])
  })
})
