import { ValidationError, type CollectionBeforeOperationHook, type CollectionConfig } from 'payload'

import { authenticated } from '../access'

const MIN_PASSWORD_LENGTH = 12

const enforcePasswordLength: CollectionBeforeOperationHook = ({ args, operation, collection }) => {
  if (operation !== 'create' && operation !== 'update' && operation !== 'resetPassword') {
    return args
  }
  const password = (args.data as { password?: unknown } | undefined)?.password
  if (typeof password === 'string' && password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError({
      collection: collection.slug,
      errors: [
        {
          path: 'password',
          message: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
        },
      ],
    })
  }
  return args
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  hooks: {
    beforeOperation: [enforcePasswordLength],
  },
  fields: [],
}
