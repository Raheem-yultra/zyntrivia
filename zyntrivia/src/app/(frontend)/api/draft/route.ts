import { timingSafeEqual } from 'node:crypto'

import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/cms/client'
import { publicPath, type PreviewCollection } from '@/lib/preview'

const COLLECTIONS: PreviewCollection[] = ['posts', 'case-studies']

function secretMatches(provided: string | null): boolean {
  const expected = process.env.DRAFT_SECRET
  if (!expected || !provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Enables draft mode for a signed-in admin with the preview secret, then opens the page. */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const collection = url.searchParams.get('collection') as PreviewCollection | null
  const slug = url.searchParams.get('slug') ?? ''

  if (!secretMatches(url.searchParams.get('secret'))) {
    return new Response('Invalid preview secret', { status: 401 })
  }
  if (!collection || !COLLECTIONS.includes(collection) || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response('Unknown document', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) {
    return new Response('Sign in to the admin to preview drafts', { status: 403 })
  }

  ;(await draftMode()).enable()
  redirect(publicPath(collection, slug))
}
