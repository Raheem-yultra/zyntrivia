import { APIError, type CollectionBeforeOperationHook, type CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { sanitizeSvg } from '../lib/svg'

const sanitizeSvgUpload: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation !== 'create' && operation !== 'update') return args
  const file = args.req?.file
  if (!file || file.mimetype !== 'image/svg+xml') return args

  const clean = sanitizeSvg(file.data.toString('utf8'))
  if (!clean.includes('<svg')) throw new APIError('This SVG could not be sanitized safely.', 400)

  file.data = Buffer.from(clean, 'utf8')
  file.size = file.data.length
  return args
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeOperation: [sanitizeSvgUpload],
  },
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: false,
    crop: false,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows for someone who can’t see it. For purely decorative video loops, describe what happens on screen.',
      },
      validate: (value: unknown) =>
        (typeof value === 'string' && value.trim().length > 0) || 'Alt text is required.',
    },
    { name: 'caption', type: 'text' },
  ],
}
