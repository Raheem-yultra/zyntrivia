import { config } from 'dotenv'

/**
 * Same precedence as `next dev`: .env.development.local, then .env.local, then .env.
 * Earlier files win, so a local database URL overrides the shared default.
 */
export function loadTestEnv(): void {
  config({ path: ['.env.development.local', '.env.local', '.env'], quiet: true })
}
