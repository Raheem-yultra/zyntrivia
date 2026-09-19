'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/** Mounted only in draft mode: refreshes server-rendered content when an editor saves. */
export function LivePreviewListener({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
}
