import type { CollectionConfig } from 'payload'

import { authenticated, nobody } from '../access'
import {
  LEAD_STATUSES,
  PROJECT_TYPES,
  SOURCES,
  STAGES,
  TIMELINES,
} from '../lib/validation/quote-options'

const options = (list: readonly { value: string; label: string }[]) =>
  list.map(({ value, label }) => ({ value, label }))

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  labels: { singular: 'Quote request', plural: 'Quote requests' },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'name', 'projectType', 'status'],
    listSearchableFields: ['name', 'email', 'company'],
    description:
      'Created only by the /quote form. Requests marked Lost are deleted automatically 12 months after they arrive.',
  },
  // Public creation happens only through the server action (Local API, overrideAccess).
  access: {
    create: nobody,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: options(LEAD_STATUSES),
        },
        { name: 'projectType', type: 'select', required: true, options: options(PROJECT_TYPES) },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'timeline', type: 'select', required: true, options: options(TIMELINES) },
        { name: 'stage', type: 'select', required: true, options: options(STAGES) },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'company', type: 'text' },
      ],
    },
    { name: 'description', type: 'textarea', required: true },
    { name: 'source', type: 'select', options: options(SOURCES) },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal only. Never shown to the requester.' },
    },
    {
      name: 'meta',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'utmSource', type: 'text' },
            { name: 'utmMedium', type: 'text' },
            { name: 'utmCampaign', type: 'text' },
          ],
        },
        { name: 'landingPage', type: 'text' },
        { name: 'referrer', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'country', type: 'text' },
            { name: 'userAgentHash', type: 'text' },
          ],
        },
      ],
    },
  ],
}
