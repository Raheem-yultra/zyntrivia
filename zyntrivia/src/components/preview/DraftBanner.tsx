import { SITE_URL } from '@/lib/site'

import { LivePreviewListener } from './LivePreviewListener'

export function DraftBanner({ path }: { path: string }) {
  return (
    <>
      <LivePreviewListener serverURL={SITE_URL} />
      <div role="status" className="border-b border-warn bg-surface-2">
        <div className="page-x type-small flex flex-wrap items-center justify-between gap-2 py-2 font-normal text-warn">
          <span>Draft preview. Changes you save in the admin appear here.</span>
          <a
            href={`/api/draft/disable?path=${encodeURIComponent(path)}`}
            className="text-text underline underline-offset-4"
          >
            Exit preview
          </a>
        </div>
      </div>
    </>
  )
}
