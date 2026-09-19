import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { purgeLostLeads, retentionCutoff } from '@/jobs/purgeLostLeads'
import config from '@/payload.config'

const EMAIL_DOMAIN = 'retention.example.com'
let payload: Payload

async function lead(label: string, status: 'lost' | 'won' | 'new', monthsAgo: number) {
  const createdAt = new Date()
  createdAt.setUTCMonth(createdAt.getUTCMonth() - monthsAgo)
  return payload.create({
    collection: 'quote-requests',
    overrideAccess: true,
    data: {
      status,
      projectType: 'automation',
      timeline: 'exploring',
      stage: 'idea',
      name: `Retention ${label}`,
      email: `${label}@${EMAIL_DOMAIN}`,
      description: 'Created by the retention integration test.',
      createdAt: createdAt.toISOString(),
    },
  })
}

async function cleanup() {
  await payload.delete({
    collection: 'quote-requests',
    where: { email: { contains: `@${EMAIL_DOMAIN}` } },
    overrideAccess: true,
  })
}

describe('retentionCutoff', () => {
  it('is 12 months before now', () => {
    expect(retentionCutoff(new Date('2026-09-17T03:00:00Z')).toISOString()).toBe(
      '2025-09-17T03:00:00.000Z',
    )
  })
})

// Needs a real database; skipped until DATABASE_URL is set.
describe.skipIf(!process.env.DATABASE_URL)('purgeLostLeads', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await cleanup()
  })

  afterAll(async () => {
    await cleanup()
  })

  it('deletes only lost requests older than 12 months', async () => {
    const oldLost = await lead('old-lost', 'lost', 13)
    const recentLost = await lead('recent-lost', 'lost', 11)
    const oldWon = await lead('old-won', 'won', 13)
    expect(new Date(oldLost.createdAt).getTime()).toBeLessThan(retentionCutoff().getTime())

    await purgeLostLeads(payload)

    const { docs } = await payload.find({
      collection: 'quote-requests',
      where: { email: { contains: `@${EMAIL_DOMAIN}` } },
      overrideAccess: true,
    })
    const remaining = docs.map((doc) => doc.id).sort()
    expect(remaining).toEqual([recentLost.id, oldWon.id].sort())
  })
})
