import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Expire tags immediately so an edit shows on the next request (build plan P1-4).
 * Outside a Next.js request (seed script, CLI) there is no cache to expire.
 */
export function expireTags(tags: string[]): void {
  for (const tag of new Set(tags)) {
    try {
      revalidateTag(tag, { expire: 0 })
    } catch {
      // Not running inside Next.js.
    }
  }
}

type SluggedDoc = { slug?: string | null }

export function revalidateCollection(tagsFor: (doc: SluggedDoc) => string[]): {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} {
  return {
    afterChange: [
      ({ doc, previousDoc, context }) => {
        if (context.disableRevalidate) return doc
        const tags = tagsFor(doc)
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) tags.push(...tagsFor(previousDoc))
        expireTags(tags)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, context }) => {
        if (!context.disableRevalidate) expireTags(tagsFor(doc))
        return doc
      },
    ],
  }
}

export function revalidateGlobal(tags: string[]): GlobalAfterChangeHook[] {
  return [
    ({ doc, context }) => {
      if (!context.disableRevalidate) expireTags(tags)
      return doc
    },
  ]
}
