import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'
import { TAGS } from '../lib/cms/tags'
import { maxWords } from '../lib/words'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    group: 'Admin',
    description:
      'The homepage is a sales funnel. Plain language only: no technical terms. Word budgets are hard limits; if copy doesn’t fit, cut copy.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: revalidateGlobal([TAGS.home]),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
          defaultValue: 'What’s wasting your team’s time?',
          admin: { description: 'The hook. Name the pain, not the technology. 10 words max.' },
          validate: maxWords(10),
        },
        {
          name: 'subhead',
          type: 'textarea',
          required: true,
          defaultValue:
            'Copying data between apps, chasing updates, rebuilding the same report every week. We build software that does it for you.',
          validate: maxWords(22),
        },
      ],
    },
    {
      name: 'beforeAfter',
      type: 'group',
      admin: { description: '30 words total across both lines.' },
      fields: [
        {
          name: 'before',
          type: 'text',
          required: true,
          defaultValue: 'Five tabs, two inboxes, and someone copying numbers at 6pm.',
        },
        {
          name: 'after',
          type: 'text',
          required: true,
          defaultValue: 'One screen that updates itself.',
        },
      ],
      validate: (value: unknown) => {
        const group = value as { before?: string; after?: string } | undefined
        return maxWords(30)(`${group?.before ?? ''} ${group?.after ?? ''}`)
      },
    },
    {
      name: 'finalCta',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
          defaultValue: 'Tell us what’s slowing your team down.',
          validate: maxWords(8),
        },
      ],
    },
  ],
}
