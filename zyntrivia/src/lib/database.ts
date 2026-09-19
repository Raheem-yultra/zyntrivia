import type { postgresAdapter } from '@payloadcms/db-postgres'

type PoolConfig = Parameters<typeof postgresAdapter>[0]['pool']

// pg merges parameters parsed from the URL over the `ssl` option, so any of these
// left in DATABASE_URL would silently replace the CA configured below.
const URL_SSL_PARAMS = ['ssl', 'sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'uselibpqcompat']

/**
 * Supabase's Postgres certificates chain to Supabase's own root CA, which is not in
 * Node's trust store. Verify against DATABASE_CA_CERT instead of disabling verification.
 */
export function databasePoolConfig(
  env: Record<string, string | undefined> = process.env,
): PoolConfig {
  const connectionString = env.DATABASE_URL ?? ''
  // Accept the PEM either multi-line or with escaped newlines (single-line env UIs).
  const ca = env.DATABASE_CA_CERT?.replace(/\\n/g, '\n').trim()

  if (!ca) return { connectionString }

  return {
    connectionString: stripSslParams(connectionString),
    ssl: { ca, rejectUnauthorized: true },
  }
}

function stripSslParams(connectionString: string): string {
  let url: URL
  try {
    url = new URL(connectionString)
  } catch {
    return connectionString
  }
  for (const param of URL_SSL_PARAMS) url.searchParams.delete(param)
  return url.toString()
}
