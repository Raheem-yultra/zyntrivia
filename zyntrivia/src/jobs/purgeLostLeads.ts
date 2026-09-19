import type { Payload, TaskConfig } from 'payload'

/** /privacy promises that requests which don't go ahead are deleted within 12 months. */
export const LOST_LEAD_RETENTION_MONTHS = 12

export function retentionCutoff(now = new Date()): Date {
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - LOST_LEAD_RETENTION_MONTHS)
  return cutoff
}

export async function purgeLostLeads(payload: Payload, now = new Date()): Promise<number> {
  const { docs } = await payload.delete({
    collection: 'quote-requests',
    where: {
      and: [
        { status: { equals: 'lost' } },
        { createdAt: { less_than: retentionCutoff(now).toISOString() } },
      ],
    },
    overrideAccess: true,
  })
  return docs.length
}

export const purgeLostLeadsTask: TaskConfig<'purgeLostLeads'> = {
  slug: 'purgeLostLeads',
  label: 'Delete lost quote requests older than 12 months',
  // Queued by the daily Vercel cron (vercel.json), which calls /api/payload-jobs/run.
  schedule: [{ cron: '0 3 * * *', queue: 'maintenance' }],
  outputSchema: [{ name: 'deleted', type: 'number', required: true }],
  retries: 2,
  handler: async ({ req }) => {
    const deleted = await purgeLostLeads(req.payload)
    if (deleted > 0) req.payload.logger.info(`Retention: deleted ${deleted} lost quote requests`)
    return { output: { deleted } }
  },
}
