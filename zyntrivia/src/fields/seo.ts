import type { GroupField } from 'payload'

export const seoField: GroupField = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Optional. Falls back to the title and summary when empty.',
  },
  fields: [
    { name: 'metaTitle', type: 'text', maxLength: 70 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    {
      name: 'canonical',
      type: 'text',
      admin: { description: 'Full URL. Only set when this content lives elsewhere first.' },
      validate: (value: unknown) => {
        if (!value) return true
        try {
          const url = new URL(String(value))
          return url.protocol === 'https:' || 'Use a full https:// URL.'
        } catch {
          return 'Use a full https:// URL.'
        }
      },
    },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
  ],
}
