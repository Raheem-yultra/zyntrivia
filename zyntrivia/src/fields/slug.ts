import type { TextField } from 'payload'

import { slugify } from '../lib/slugify'

/** Unique slug, generated from `title` when left empty, editable afterwards. */
export function slugField(sourceField = 'title'): TextField {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Used in the URL. Generated from the title if left empty.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.trim()) return slugify(value)
          const source = data?.[sourceField]
          return typeof source === 'string' ? slugify(source) : value
        },
      ],
    },
  }
}
