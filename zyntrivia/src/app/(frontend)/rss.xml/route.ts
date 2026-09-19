import { getLatestPosts, postTopics } from '@/lib/cms/posts'
import { SITE, absoluteUrl } from '@/lib/site'

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char,
  )

export async function GET() {
  const posts = await getLatestPosts(20)
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`)
      const categories = postTopics(post)
        .map((topic) => `<category>${escapeXml(topic.title)}</category>`)
        .join('')
      return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(post.excerpt)}</description>${
        post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''
      }${categories}</item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE.name} blog</title><link>${absoluteUrl('/blog')}</link><description>Notes on building software, automating work, and running projects well.</description><language>en</language><atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
