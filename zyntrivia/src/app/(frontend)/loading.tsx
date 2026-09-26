import { PageLoading } from '@/components/sections/PageLoading'

// The fallback for every route without its own loading.tsx, so there is no page shape to
// mirror. /work, /blog and /quote keep their shaped skeletons.
export default function Loading() {
  return <PageLoading variant="brand" />
}
