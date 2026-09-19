import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'
import { TAGS } from '../lib/cms/tags'

const httpsUrl = (value: unknown): true | string => {
  if (!value) return true
  try {
    return new URL(String(value)).protocol === 'https:' || 'Use a full https:// URL.'
  } catch {
    return 'Use a full https:// URL.'
  }
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Admin',
    description:
      'Contact details and proof. Anything left empty is simply not shown on the site — never add placeholder values.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: revalidateGlobal([TAGS.siteSettings, TAGS.home]),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'contactEmail',
          type: 'email',
          required: true,
          defaultValue: 'hello@zyntrivia.com',
        },
        {
          name: 'responseTime',
          type: 'text',
          defaultValue: 'Replies within one business day',
          admin: { description: 'Shown under the hero CTAs. Only keep it if it’s true.' },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'e.g. "Karachi (UTC+5), overlapping EU and US Eastern hours"' },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedinUrl', type: 'text', validate: httpsUrl },
        { name: 'githubUrl', type: 'text', validate: httpsUrl },
        {
          name: 'githubUsername',
          type: 'text',
          admin: {
            description:
              'Public GitHub user or organisation. Enables the contribution graph in the proof strip.',
          },
        },
      ],
    },
    {
      name: 'review',
      type: 'group',
      admin: {
        description:
          'Only fill in if a real public rating exists (e.g. Clutch, Google). All four fields are required to show it.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'platform', type: 'text' },
            { name: 'rating', type: 'number', min: 0, max: 5 },
            { name: 'count', type: 'number', min: 0 },
          ],
        },
        { name: 'url', type: 'text', validate: httpsUrl },
      ],
    },
  ],
}
