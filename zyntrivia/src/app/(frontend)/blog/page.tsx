import type { Metadata } from 'next'

import { BlogIndexView } from '@/components/blog/BlogIndexView'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description: 'Notes on building software, automating work, and running projects well.',
  path: '/blog',
})

export default function BlogPage() {
  return <BlogIndexView page={1} />
}
