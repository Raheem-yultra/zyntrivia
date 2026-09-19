import { testPayload } from './payload'

export const testUser = {
  email: 'e2e-admin@zyntrivia.test',
  // Meets the 12-character minimum enforced on the users collection.
  password: 'e2e-admin-password-2026',
}

/** Recreates the admin used by e2e tests. */
export async function seedTestUser(): Promise<void> {
  const payload = await testPayload()
  await payload.delete({ collection: 'users', where: { email: { equals: testUser.email } } })
  await payload.create({ collection: 'users', data: testUser })
}

export async function cleanupTestUser(): Promise<void> {
  const payload = await testPayload()
  await payload.delete({ collection: 'users', where: { email: { equals: testUser.email } } })
}
