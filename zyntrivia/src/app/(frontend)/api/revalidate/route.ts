import { revalidateTag } from 'next/cache'

import { TAGS } from '@/lib/cms/tags'
import { isValidRevalidateToken } from '@/lib/revalidate-token'

/** Expires every cached CMS query. Used after bulk changes made outside the admin (seeding). */
export async function POST(request: Request) {
  if (!isValidRevalidateToken(request.headers.get('authorization'))) {
    return new Response('Unauthorized', { status: 401 })
  }
  revalidateTag(TAGS.all, { expire: 0 })
  return Response.json({ revalidated: true })
}
