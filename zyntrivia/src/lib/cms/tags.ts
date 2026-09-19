/** Cache tags shared by CMS fetchers (lib/cms) and Payload revalidation hooks. */
export const TAGS = {
  /** On every CMS query, so bulk changes (seeding, imports) can expire everything at once. */
  all: 'cms',
  home: 'home',
  siteSettings: 'site-settings',
  posts: 'posts',
  post: (slug: string) => `post:${slug}`,
  topics: 'topics',
  caseStudies: 'case-studies',
  caseStudy: (slug: string) => `case-study:${slug}`,
  services: 'services',
  service: (slug: string) => `service:${slug}`,
  faqs: 'faqs',
} as const
