import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { CaseStudies } from './collections/CaseStudies'
import { Faqs } from './collections/Faqs'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { QuoteRequests } from './collections/QuoteRequests'
import { RateLimitHits } from './collections/RateLimitHits'
import { Services } from './collections/Services'
import { Topics } from './collections/Topics'
import { Users } from './collections/Users'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { purgeLostLeadsTask } from './jobs/purgeLostLeads'
import { databasePoolConfig } from './lib/database'
import { simpleEditor } from './lib/editor'
import { SITE_URL } from './lib/site'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3 = {
  bucket: process.env.S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
}
// Without storage credentials (local dev), uploads are written to ./media instead.
const useS3 = Boolean(s3.bucket && s3.endpoint && s3.accessKeyId && s3.secretAccessKey)

export default buildConfig({
  serverURL: SITE_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Zyntrivia admin',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Posts,
    Topics,
    CaseStudies,
    Services,
    Faqs,
    Media,
    QuoteRequests,
    RateLimitHits,
    Users,
  ],
  globals: [Homepage, SiteSettings],
  editor: simpleEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    disablePlaygroundInProduction: true,
  },
  db: postgresAdapter({
    // Own schema, not `public`: Supabase exposes `public` through its Data API, and it
    // keeps Payload's tables apart from anything else in the project.
    schemaName: 'payload',
    pool: databasePoolConfig(),
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema changes always go through committed migrations, in dev too, so a dev
    // database can never be silently altered (or have unknown tables dropped).
    push: false,
  }),
  // Admin emails (password resets). Without a key, Payload logs emails to the console.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'hello@zyntrivia.com',
        defaultFromName: 'Zyntrivia',
      })
    : undefined,
  jobs: {
    // Scheduled publishing and lead retention. On Vercel, the cron in vercel.json calls
    // /api/payload-jobs/run?allQueues=true, which queues due schedules and runs pending jobs.
    tasks: [purgeLostLeadsTask],
    access: {
      run: ({ req }) => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
      },
    },
  },
  sharp,
  plugins: useS3
    ? [
        s3Storage({
          collections: { media: true },
          bucket: s3.bucket ?? '',
          config: {
            endpoint: s3.endpoint,
            region: s3.region || 'us-east-1',
            forcePathStyle: true,
            credentials: {
              accessKeyId: s3.accessKeyId ?? '',
              secretAccessKey: s3.secretAccessKey ?? '',
            },
          },
        }),
      ]
    : [],
})
