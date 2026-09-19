import type { Access } from 'payload'

export const anyone: Access = () => true

export const nobody: Access = () => false

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Public readers only see published documents; signed-in editors see drafts too. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
