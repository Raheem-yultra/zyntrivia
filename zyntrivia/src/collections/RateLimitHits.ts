import type { CollectionConfig } from 'payload'

import { nobody } from '../access'

/** Postgres-backed rate limit counter for the quote form (docs/03-ARCHITECTURE.md §5). */
export const RateLimitHits: CollectionConfig = {
  slug: 'rate-limit-hits',
  admin: { hidden: true },
  access: {
    create: nobody,
    read: nobody,
    update: nobody,
    delete: nobody,
  },
  timestamps: true,
  fields: [
    // HMAC of the client IP — the raw address is never stored.
    { name: 'key', type: 'text', required: true, index: true },
    { name: 'bucket', type: 'text', required: true, index: true },
  ],
}
