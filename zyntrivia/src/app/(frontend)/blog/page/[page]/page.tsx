import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { BlogIndexView } from '@/components/blog/BlogIndexView'
import { getPostPage } from '@/lib/cms/posts'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ page: string }> }

function parsePage(value: string): number | null {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : null
}

export async function generateStaticParams() {
  const { totalPages } = await getPostPage(1)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePage((await params).page)
  return buildMetadata({
    title: `Blog, page ${page ?? ''}`,
    description: 'Notes on building software, automating work, and running projects well.',
    path: `/blog/page/${page ?? ''}`,
  })
}

export default async function BlogPaginatedPage({ params }: Props) {
  const page = parsePage((await params).page)
  if (!page) notFound()
  if (page === 1) redirect('/blog')
  return <BlogIndexView page={page} />
}
