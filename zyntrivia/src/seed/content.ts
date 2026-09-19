/**
 * Seed content. Case studies are transcribed from the v1 site (docs/reference/v1-case-studies);
 * process claims follow docs/01-PRD.md. Unmeasured v1 benchmarks are deliberately left out:
 * `results` stays empty until real numbers exist. Review items: docs/CONTENT-REVIEW.md.
 */
import { block, doc, h2, link, p, ul } from './lexical'

type Tier = { nodes: Array<{ label: string; detail?: string; highlight?: boolean }> }
const tier = (...nodes: Tier['nodes']): Tier => ({ nodes })

export const TOPICS = [
  {
    slug: 'automation',
    title: 'Automation',
    description: 'Workflows, integrations, and the engineering that keeps them running.',
  },
  {
    slug: 'internal-tools',
    title: 'Internal tools',
    description: 'Replacing spreadsheets and copy-paste with software your team runs on.',
  },
  {
    slug: 'engineering',
    title: 'Engineering notes',
    description: 'How and why we build the way we do.',
  },
]

export const SERVICES = [
  {
    slug: 'web-apps',
    order: 1,
    featuredOnHome: false,
    title: 'Apps for your customers',
    outcomeLine: 'Give customers an app or portal that grows with your business.',
    seo: { metaTitle: 'Custom web apps and customer portals' },
    summary:
      'Customer portals, booking systems, and apps you can sell, with sign-up, payments, and an admin area that work from day one.',
    heroVisual: 'filter-panel',
    problem: {
      headline: 'The demo works. Everything after it doesn’t.',
      body: 'A listings page and a checkout button take a weekend. Sign-ups, payments, refunds, and reports your team can trust take real work, and that’s where most projects stall.',
      visual: 'table',
    },
    capabilities: [
      {
        title: 'Accounts and payments',
        body: 'Sign-up, logins for different roles, and subscriptions or split payments, built on trusted payment providers instead of from scratch.',
        visual: 'kpi-tiles',
      },
      {
        title: 'Marketplaces and portals',
        body: 'Products where two sides meet, like customers and providers, with sign-up checks, bookings, and a dashboard for each side.',
        visual: 'filter-panel',
      },
      {
        title: 'An admin area you’ll actually use',
        body: 'Support, refunds, and reports are ready at launch, not left for later.',
        visual: 'table',
      },
    ],
    faqs: ['who-owns-the-code', 'how-do-quotes-work', 'how-long-does-a-build-take'],
    caseStudies: ['resourceable', 'stocksense'],
  },
  {
    slug: 'automation',
    order: 2,
    featuredOnHome: true,
    title: 'Automation',
    outcomeLine: 'Stop re-typing orders into three systems.',
    seo: { metaTitle: 'Business process automation' },
    summary:
      'We connect the apps you already use, so orders and updates move on their own, and anything that gets stuck is flagged.',
    heroVisual: 'workflow-node',
    problem: {
      headline: 'Automations fail quietly, then expensively',
      body: 'Most first automations are a string of quick fixes that works for three months and then stops. Nobody notices until a customer does.',
      visual: 'slack-message',
    },
    capabilities: [
      {
        title: 'It keeps trying when something fails',
        body: 'If an app is down, the step tries again later. Anything that still can’t finish waits safely instead of disappearing.',
        visual: 'workflow-node',
      },
      {
        title: 'Emails and PDFs turned into records',
        body: 'Orders, invoices, and forms are read and filed for you, and anything unclear goes to a person to check.',
        visual: 'email-row',
      },
      {
        title: 'Clear alerts when a person is needed',
        body: 'The message says what happened and where it stopped, so your team knows exactly what to do.',
        visual: 'slack-message',
      },
    ],
    faqs: ['how-do-quotes-work', 'what-happens-after-launch', 'can-you-work-with-our-stack'],
    caseStudies: ['workflowai'],
  },
  {
    slug: 'internal-tools',
    order: 3,
    featuredOnHome: false,
    title: 'Tools for your team',
    outcomeLine: 'Replace the spreadsheet nobody trusts with a tool your team runs on.',
    seo: { metaTitle: 'Internal tools and dashboards for your team' },
    summary:
      'Order systems, stock trackers, and dashboards built around how your team actually works.',
    heroVisual: 'kpi-tiles',
    problem: {
      headline: 'Version FINAL_v4 isn’t a system',
      body: 'When numbers live in copies of copies, every decision starts with an argument about which sheet is right. Nobody can see what changed, or who changed it.',
      visual: 'ledger',
    },
    capabilities: [
      {
        title: 'A record of every change',
        body: 'Every change is saved with who made it, so any number on screen can be explained.',
        visual: 'ledger',
      },
      {
        title: 'Dashboards that update themselves',
        body: 'Live numbers and reports replace the Friday spreadsheet and the copy-paste behind it.',
        visual: 'chart',
      },
      {
        title: 'Built around how your team works',
        body: 'Approvals, transfers, and hand-offs follow the way work really moves, and each person sees only what they need.',
        visual: 'table',
      },
    ],
    faqs: ['who-owns-the-code', 'can-you-work-with-our-stack', 'what-happens-after-launch'],
    caseStudies: ['stocksense'],
  },
  {
    slug: 'ai-agents',
    order: 4,
    featuredOnHome: false,
    title: 'AI assistants',
    outcomeLine: 'Answer common questions and draft replies, with a person approving.',
    seo: { metaTitle: 'AI assistants for customer requests' },
    summary:
      'AI that answers questions and drafts replies using your own information, with a person approving anything important.',
    heroVisual: 'agent-trace',
    problem: {
      headline: 'A chatbot that guesses is a liability',
      body: 'An AI that makes up answers, or fills in the wrong details, puts mistakes straight into your records. Everything it produces has to be checked before it’s used.',
      visual: 'agent-trace',
    },
    capabilities: [
      {
        title: 'Answers from your own information',
        body: 'Replies come from your own documents and records, with sources you can check.',
        visual: 'email-row',
      },
      {
        title: 'Checked before anything happens',
        body: 'Every answer is checked for the right details. If something’s missing or wrong, it tries again instead of saving a mistake.',
        visual: 'agent-trace',
      },
      {
        title: 'People approve what matters',
        body: 'Refunds, replies, and record changes can wait for a person to approve before they go out.',
        visual: 'slack-message',
      },
    ],
    faqs: ['how-do-quotes-work', 'will-you-sign-an-nda', 'what-happens-after-launch'],
    caseStudies: ['workflowai'],
  },
]

export const FAQS = [
  {
    key: 'time-zones',
    order: 1,
    showOnHome: true,
    category: 'communication',
    question: 'How do you work with teams in the US and Europe?',
    answer: doc(
      p(
        'We work from Karachi, and our hours overlap the European working day and the US East Coast morning. You see real progress every week and get replies within one business day.',
      ),
    ),
  },
  {
    key: 'who-owns-the-code',
    order: 2,
    showOnHome: true,
    category: 'ownership',
    question: 'Who owns what you build?',
    answer: doc(
      p(
        'You do. The software lives in your company’s account from day one, and the rights to it are signed over to you in writing. There are no licence fees and nothing you can’t take elsewhere.',
      ),
    ),
  },
  {
    key: 'will-you-sign-an-nda',
    order: 3,
    showOnHome: true,
    category: 'ownership',
    question: 'Will you sign an NDA?',
    answer: doc(
      p(
        'Yes. We’re happy to sign your NDA before our first call, or send ours. Clients in the EU can also get a data processing agreement.',
      ),
    ),
  },
  {
    key: 'how-do-quotes-work',
    order: 4,
    showOnHome: true,
    category: 'process',
    question: 'How do quotes work if you don’t publish prices?',
    answer: doc(
      p(
        'Every project is priced on its own. After a 30-minute call, you get a written plan and a fixed price within 3 business days. The price only changes if the plan does.',
      ),
    ),
  },
  {
    key: 'payments',
    order: 5,
    showOnHome: true,
    category: 'payments',
    question: 'How are payments structured?',
    answer: doc(
      p(
        'Payment milestones are set out in your quote before any work starts, so you know what’s due and when. We invoice in USD or EUR.',
      ),
    ),
  },
  {
    key: 'what-happens-after-launch',
    order: 6,
    showOnHome: true,
    category: 'support',
    question: 'What happens after launch?',
    answer: doc(
      p(
        'Everything is handed over: the software, clear instructions, and every login, plus 30 days of support for fixes and questions. Ongoing help is available, but you never need us to keep it running.',
      ),
    ),
  },
  {
    key: 'how-long-does-a-build-take',
    order: 7,
    showOnHome: false,
    category: 'process',
    question: 'How long does a typical build take?',
    answer: doc(
      p(
        'It depends on the size of the job. As a guide, a first automation usually takes 2–5 weeks, and a larger team tool or customer app 4–8 weeks. Your quote includes the timeline before any work starts.',
      ),
    ),
  },
  {
    key: 'can-you-work-with-our-stack',
    order: 8,
    showOnHome: false,
    category: 'process',
    question: 'Can you work with our existing tools?',
    answer: doc(
      p(
        'Yes. Most of our work builds on something you already have: spreadsheets, simple automations, older customer databases, or half-finished apps. We keep what works and replace what doesn’t.',
      ),
    ),
  },
  {
    key: 'who-does-the-work',
    order: 9,
    showOnHome: false,
    category: 'communication',
    question: 'Who actually does the work?',
    answer: doc(
      p(
        'The people who scope your project build it. There are no account managers, no hand-offs, and no outsourcing chain behind the scenes.',
      ),
    ),
  },
]

export const CASE_STUDIES = [
  {
    slug: 'stocksense',
    order: 1,
    title: 'StockSense',
    industry: 'retail-distribution',
    services: ['internal-tools'],
    summary:
      'A multi-location inventory system built around batches, with expiry tracking, an append-only ledger, and audited transfers between branches.',
    problemLine: 'Perishable stock tracked in a separate spreadsheet per branch.',
    outcomeLine: 'You can see exactly where every stock number came from.',
    demoUrl: '/projects/stocksense-demo',
    coverVisual: 'ledger',
    atAGlance: {
      problem:
        'Each branch kept its own spreadsheet, so nobody saw total stock or what was about to expire.',
      solution:
        'Batch-level inventory with expiry horizons, an append-only movement ledger, and two-click transfers between branches.',
      result:
        'Stock is derived from the ledger, so every number is explainable and nothing can silently drift.',
    },
    problem: doc(
      p(
        'Multi-location businesses that hold perishable or batch-tracked stock, such as pharmacies, clinics, food distributors, and specialty retail, almost always run on a spreadsheet per location.',
      ),
      p(
        'Nobody can see total stock across sites, nobody knows what’s about to expire until it has, and a transfer between two branches is a phone call and a hope. The cost isn’t dramatic: it’s a slow bleed of written-off stock and emergency reorders.',
      ),
    ),
    problemDiagram: [
      tier({ label: 'Branch 1 sheet' }, { label: 'Branch 2 sheet' }, { label: 'Branch 3 sheet' }),
      tier({ label: 'Transfers by phone', detail: 'No record on either side' }),
      tier({
        label: 'Expiry found too late',
        detail: 'Written-off stock, emergency reorders',
        highlight: true,
      }),
    ],
    featureShots: [
      {
        title: 'Batch-level tracking',
        caption:
          'Every unit carries its lot number, expiry date, cost, and location. Stock is a set of dated batches, not a single number.',
        visual: 'ledger',
        asset: 'stocksense-inventory',
      },
      {
        title: 'Expiry intelligence',
        caption:
          'A rolling 90-day expiry horizon per location with alert thresholds, and first-expired-first-out picking suggested by default.',
        visual: 'kpi-tiles',
        asset: 'stocksense-expiry',
      },
      {
        title: 'A ledger behind every number',
        caption:
          'Receipts, sales, transfers, adjustments, and write-offs are immutable, attributed rows. You can always answer how a figure was reached.',
        visual: 'ledger',
        asset: 'stocksense-ledger',
      },
      {
        title: 'Transfers with an audit trail',
        caption:
          'Moving stock between branches is a two-click flow, recorded on both sides with who did it and when.',
        visual: 'table',
        asset: 'stocksense-transfers',
      },
    ],
    architecture: [
      tier({ label: 'Client', detail: 'React and Vite SPA, TanStack Query and Table' }),
      tier(
        { label: 'API', detail: 'Express and Drizzle, transactional writes' },
        { label: 'Reads', detail: 'Stock derived on read from the ledger' },
      ),
      tier({ label: 'Data', detail: 'PostgreSQL, append-only ledger entries', highlight: true }),
    ],
    architectureNotes: [
      {
        question: 'Why an append-only ledger instead of a quantity column?',
        answer:
          'Inventory disputes are the reason these systems get replaced. A mutable column can’t tell you who changed what, but a ledger can, forever, at almost no cost.',
      },
      {
        question: 'Why Postgres instead of a document store?',
        answer:
          'Batches, locations, and movements are deeply relational, and expiry reporting is a set of range queries. That is exactly the shape SQL handles well.',
      },
      {
        question: 'Why calculate stock on read?',
        answer:
          'A stored running total is one more thing that can disagree with the ledger. Summing signed quantities on read means the number can never contradict the movements behind it.',
      },
    ],
    stack: ['React', 'Vite', 'Express', 'Drizzle ORM', 'PostgreSQL'],
    cover: 'stocksense-dashboard',
  },
  {
    slug: 'resourceable',
    order: 2,
    title: 'ResourceAble',
    industry: 'marketplaces',
    services: ['web-apps'],
    summary:
      'A multi-category service marketplace with the full provider lifecycle: onboarding, verification, split payments, refunds, and dashboards.',
    problemLine: 'A marketplace that demos well, then stalls at payments.',
    outcomeLine: 'Bookings and payments hold up even when customers close the tab or click twice.',
    coverVisual: 'filter-panel',
    atAGlance: {
      problem:
        'The storefront takes a weekend. Onboarding, split payments, and refunds are where marketplace builds stall.',
      solution:
        'Stripe Connect onboarding, a webhook-driven booking lifecycle, and dashboards for providers and admins.',
      result:
        'Payment state changes only on verified webhooks, so a closed tab never loses a booking.',
    },
    problem: doc(
      p(
        'Marketplace MVPs are easy to fake and hard to ship. A grid of listings and a checkout button takes a weekend.',
      ),
      p(
        'The real product is everything after: onboarding and verifying providers, splitting payments, refunding after a provider was paid, and a dashboard both sides can trust. That’s where marketplace builds die, and it’s the part most agencies leave for phase two.',
      ),
    ),
    problemDiagram: [
      tier({ label: 'Listings grid' }, { label: 'Checkout button' }),
      tier({
        label: 'Onboarding, payouts, refunds',
        detail: 'Left for phase two',
        highlight: true,
      }),
    ],
    featureShots: [
      {
        title: 'Provider onboarding',
        caption:
          'Self-serve sign-up, profile, and verification, with Stripe Connect onboarding embedded so providers can start taking payments quickly.',
        visual: 'table',
      },
      {
        title: 'Categories as configuration',
        caption:
          'Categories, sub-categories, and per-category attributes, so a new vertical is a configuration change rather than a migration.',
        visual: 'filter-panel',
      },
      {
        title: 'Booking and payment',
        caption:
          'Funds are held, split at completion, and paid out net of the platform fee. Refunds and disputes are handled in Connect.',
        visual: 'kpi-tiles',
      },
      {
        title: 'Two honest dashboards',
        caption:
          'Providers see bookings, earnings, and payouts. Admins see providers, transactions, disputes, and platform revenue.',
        visual: 'chart',
      },
    ],
    architecture: [
      tier({ label: 'Client', detail: 'Next.js App Router' }),
      tier(
        { label: 'Booking lifecycle', detail: 'Webhook-driven state machine' },
        { label: 'Payments', detail: 'Stripe Connect, Express accounts' },
      ),
      tier({ label: 'Data', detail: 'PostgreSQL and Prisma', highlight: true }),
    ],
    architectureNotes: [
      {
        question: 'Why webhook-driven state instead of client callbacks?',
        answer:
          'A customer closing the tab after paying is a normal event, and a marketplace that loses that booking is broken. Verified webhooks are the source of truth the network can’t drop.',
      },
      {
        question: 'Why Stripe Connect instead of building payouts?',
        answer:
          'Money transmission, identity checks, and tax reporting are not places to be original. Connect absorbs that compliance surface.',
      },
      {
        question: 'Why make every payment handler idempotent?',
        answer:
          'Stripe will eventually deliver the same webhook twice. Every payment-related handler is keyed and safe to replay.',
      },
    ],
    stack: ['Next.js', 'Stripe Connect', 'PostgreSQL', 'Prisma'],
  },
  {
    slug: 'workflowai',
    order: 3,
    title: 'WorkflowAI',
    industry: 'cross-industry',
    services: ['automation', 'ai-agents'],
    summary:
      'A workflow automation layer where every job can fail and recover: durable queues, idempotent steps, validated LLM output, and run traces.',
    problemLine: 'Automations that fail silently until a customer complains.',
    outcomeLine: 'The same order arriving twice is only ever processed once.',
    coverVisual: 'workflow-node',
    atAGlance: {
      problem:
        'Cheap automations break quietly, and by the time anyone notices, the damage outweighs the savings.',
      solution:
        'n8n orchestration over durable Node workers with retries, a dead-letter queue, validated LLM steps, and traces.',
      result:
        'Jobs survive a downstream outage and complete once the service returns, tested by stopping it mid-run.',
    },
    problem: doc(
      p(
        'Most businesses’ first automation is a chain of no-code triggers that works for three months and then silently stops. Nobody notices until a customer complains.',
      ),
      p('The failure mode of cheap automation isn’t that it breaks. It’s that it breaks quietly.'),
      p(
        'Anyone can wire up the happy path. The engineering is in what happens when a third-party API returns an error at 2am.',
      ),
    ),
    problemDiagram: [
      tier({ label: 'Webhook arrives' }),
      tier({ label: 'Chain of triggers', detail: 'No retries, no record' }),
      tier({ label: 'API error at 2am' }),
      tier({ label: 'Silent failure', detail: 'Found when a customer complains', highlight: true }),
    ],
    featureShots: [
      {
        title: 'A durable job queue',
        caption:
          'Every step is a job with a retry policy and exponential backoff, and a dead-letter queue catches anything that exhausts its retries.',
        visual: 'workflow-node',
      },
      {
        title: 'LLM steps with validated output',
        caption:
          'Classification, extraction, and drafting are schema-checked. A malformed model response is a retry, not a corrupt record downstream.',
        visual: 'agent-trace',
      },
      {
        title: 'Alerts with the full trace',
        caption:
          'Failures that exhaust their retries notify a person with the complete run trace attached, not a generic workflow error.',
        visual: 'slack-message',
      },
      {
        title: 'People in the loop',
        caption:
          'Any step can require approval. The job waits, notifies someone, and resumes once it’s approved.',
        visual: 'table',
      },
    ],
    architecture: [
      tier({ label: 'Ingress', detail: 'Webhooks, signature-verified' }),
      tier(
        { label: 'Orchestration', detail: 'n8n and third-party connectors' },
        { label: 'Durable workers', detail: 'Node.js, Bull, LLM steps' },
      ),
      tier({ label: 'State', detail: 'Redis queue, Postgres run traces', highlight: true }),
    ],
    architectureNotes: [
      {
        question: 'Why not only n8n or Zapier?',
        answer:
          'No-code orchestrators are excellent at connecting things and weak at retries, idempotency, and observability, which is exactly where automations fail in production.',
      },
      {
        question: 'Why a dead-letter queue?',
        answer:
          '“It failed and we lost it” isn’t acceptable. “It failed and it’s waiting for you” is manageable.',
      },
      {
        question: 'Why validate LLM output against a schema?',
        answer:
          'A model that returns prose where you expected structured data should fail loudly and retry, not write garbage into your CRM.',
      },
    ],
    stack: ['n8n', 'Bull', 'Redis', 'Node.js', 'PostgreSQL'],
  },
]

const QUEUE_CODE = `import { Queue } from 'bullmq'

export const orderSync = new Queue('order-sync', { connection })

export async function enqueueOrderSync(orderId: string) {
  await orderSync.add(
    'sync',
    { orderId },
    {
      // Same order, same job id: adding it twice is a no-op.
      jobId: \`order-sync-\${orderId}\`,
      attempts: 5,
      backoff: { type: 'exponential', delay: 2_000 },
      removeOnComplete: 1_000,
      // Keep failed jobs so they can be inspected and replayed.
      removeOnFail: false,
    },
  )
}`

const WORKER_CODE = `import { Queue, Worker } from 'bullmq'

const deadLetters = new Queue('order-sync-dead-letter', { connection })
const worker = new Worker('order-sync', syncOrder, { connection })

worker.on('failed', async (job, error) => {
  if (!job || job.attemptsMade < (job.opts.attempts ?? 1)) return

  await deadLetters.add('failed-sync', {
    jobId: job.id,
    data: job.data,
    error: error.message,
    attempts: job.attemptsMade,
  })
  await notifyOps(\`Order sync failed after \${job.attemptsMade} attempts\`, job.id)
})`

export const POSTS = [
  {
    slug: 'when-to-replace-a-spreadsheet-with-an-internal-tool',
    title: 'When to replace a spreadsheet with an internal tool',
    excerpt:
      'Spreadsheets are the right tool until they aren’t. Five signs yours has become a system, and what replacing it involves.',
    topics: ['internal-tools'],
    featured: true,
    publishedAt: '2026-09-08T09:00:00.000Z',
    relatedCaseStudies: ['stocksense'],
    content: (ids: Record<string, number>) =>
      doc(
        p(
          'Most internal tools start life as a spreadsheet, and that isn’t a mistake. A spreadsheet is the fastest way to find out what a process needs. The trouble starts when the sheet stops being a draft and quietly becomes the system your business runs on.',
        ),
        h2('Five signs the spreadsheet has become a system'),
        ul(
          [
            { text: 'Nobody trusts the number.', bold: true },
            ' If the first ten minutes of a meeting go to working out which copy is current, the sheet has stopped doing its job.',
          ],
          [
            { text: 'People copy data between tools by hand.', bold: true },
            ' Every re-typed order or stock count is a place for errors to enter, and nobody notices until a customer does.',
          ],
          [
            { text: 'You can’t answer “who changed this?”', bold: true },
            ' Spreadsheets store values, not history. When a figure is wrong, there’s no trail back to the change that caused it.',
          ],
          [
            { text: 'Access is all or nothing.', bold: true },
            ' Someone who needs to update one column can also overwrite every other one.',
          ],
          [
            { text: 'One person holds it together.', bold: true },
            ' If the formulas only make sense to whoever built them, the process is one resignation away from breaking.',
          ],
        ),
        p(
          'One of these is an irritation. Three or more usually means the spreadsheet costs more in rework than a proper tool would cost to build.',
        ),
        block('comparison', {
          leftTitle: 'Keep the spreadsheet',
          leftItems:
            'The process still changes every week\nOne or two people use it\nMistakes are cheap and easy to spot\nNothing else depends on the data',
          rightTitle: 'Build an internal tool',
          rightItems:
            'The process is stable and repeated daily\nSeveral teams or locations edit it\nErrors cost money or customer trust\nOther tools need the same data',
        }),
        h2('What replacing it actually involves'),
        p(
          'A good internal tool isn’t a spreadsheet with a nicer skin. The value comes from what a spreadsheet can’t do:',
        ),
        ul(
          [
            { text: 'A single source of truth.', bold: true },
            ' One database, so every screen shows the same number.',
          ],
          [
            { text: 'History by default.', bold: true },
            ' Every change is recorded with who made it and when. In StockSense, current stock is calculated from an append-only ledger, so any figure traces back to the receipts, sales, and transfers behind it.',
          ],
          [
            { text: 'Permissions that match roles.', bold: true },
            ' Branch staff see their branch. Managers see everything.',
          ],
          [
            { text: 'Integrations instead of copy-paste.', bold: true },
            ' Orders arrive by email or web form and land in the right place without anyone re-typing them.',
          ],
        ),
        h2('How to start without a big-bang rewrite'),
        p(
          'The safest migrations replace one painful workflow first, not the whole spreadsheet. Pick the process that causes the most rework, build that, and run it alongside the sheet until the numbers agree.',
        ),
        block('callout', {
          tone: 'tip',
          title: 'Keep the export',
          body: 'Teams switch more comfortably when they can still export to a spreadsheet. A CSV download costs little to build and removes a lot of anxiety.',
        }),
        p(
          'From there, each workflow moves across once the first one has earned trust. By the time the last tab is retired, nobody misses it.',
        ),
        block('caseStudyRef', { caseStudy: ids.stocksense }),
        h2('Questions to answer before you decide'),
        block('table', {
          caption: 'Worth answering before you build anything',
          rows: [
            'Question | Why it matters',
            'How many people edit the data each week? | More editors means more conflicts and overwritten work',
            'What does a single mistake cost? | It sets a sensible ceiling for fixing the problem',
            'Which other tools need this data? | Each one is a copy-paste step you can remove',
            'Who understands the current formulas? | That knowledge needs capturing before anything changes',
          ].join('\n'),
        }),
        p(
          'If most of the answers make you wince, it’s probably time. ',
          link('Here’s how we scope that kind of project', '/process'),
          '.',
        ),
      ),
  },
  {
    slug: 'automations-that-fail-loudly',
    title: 'Why good automations fail loudly',
    excerpt:
      'Most automations don’t break dramatically; they stop quietly. How we design workflows so failures retry, never double-send, and reach a person.',
    topics: ['automation', 'engineering'],
    featured: false,
    publishedAt: '2026-09-15T09:00:00.000Z',
    relatedCaseStudies: ['workflowai'],
    content: (ids: Record<string, number>) =>
      doc(
        p(
          'The first automation most businesses build is a chain of triggers in a no-code tool. It works on day one. Months later a third-party API returns an error at 2am, a step is skipped, and nobody finds out until a customer asks where their order went.',
        ),
        p(
          'The failure itself isn’t the problem. Every external API fails eventually. The problem is failing quietly. Here’s how we build automations so that doesn’t happen.',
        ),
        h2('Every step is a job that can be retried'),
        p(
          'Instead of calling services directly inside a trigger, each step becomes a job on a durable queue backed by Redis. If a call fails, the job retries with exponential backoff instead of giving up on the first error.',
        ),
        block('code', { language: 'ts', filename: 'queue.ts', code: QUEUE_CODE }),
        p(
          'Five attempts with backoff covers most transient trouble: a rate limit, a deploy on the other side, a network blip. The job waits longer between each try instead of hammering a service that’s already struggling.',
        ),
        h2('Retries are only safe if steps are idempotent'),
        p(
          'Retrying a step that already half-succeeded is how customers get charged twice. Every step with a side effect needs an idempotency key, so running it again produces the same result instead of a duplicate.',
        ),
        ul(
          [
            'Payments and emails carry a key derived from the job, so the provider rejects a second request with the same key.',
          ],
          ['Database writes are upserts keyed on the business identifier, not blind inserts.'],
          [
            'Incoming webhooks are recorded by event ID first, so a duplicate delivery is acknowledged and ignored.',
          ],
        ),
        p(
          'In WorkflowAI, a duplicate webhook delivery produces exactly one side effect. That property is tested directly, because providers do deliver the same event twice.',
        ),
        h2('When retries run out, a person finds out'),
        p(
          'Some failures won’t fix themselves: a revoked API key, a malformed record, a supplier who changed their PDF layout. Once a job exhausts its attempts, it moves to a dead-letter queue and someone is notified with the full trace attached.',
        ),
        block('code', { language: 'ts', filename: 'worker.ts', code: WORKER_CODE }),
        p(
          'The alert says what failed, what the job received, and where it stopped. “It failed and it’s waiting for you” is a manageable morning. “It failed and we lost it” is not.',
        ),
        h2('Model output is validated like any other input'),
        p(
          'When a step uses a language model to classify an email or extract line items, the response is checked against a schema before anything downstream uses it. Prose where the next step expects structured data triggers a retry, not a corrupt record in your CRM.',
        ),
        block('callout', {
          tone: 'note',
          title: 'No-code still has a place',
          body: 'Tools like n8n are excellent at connecting services. We use them for orchestration and put code underneath the steps that need retries, idempotency, and traces.',
        }),
        block('caseStudyRef', { caseStudy: ids.workflowai }),
        p(
          'None of this is exotic. It’s the difference between an automation that works in a demo and one that’s still working a year later.',
        ),
      ),
  },
]

/** Homepage funnel copy. Plain language: name the pain, not the technology. */
export const HOMEPAGE = {
  hero: {
    headline: 'What’s wasting your team’s time?',
    subhead:
      'Copying data between apps, chasing updates, rebuilding the same report every week. We build software that does it for you.',
  },
  beforeAfter: {
    before: 'Five tabs, two inboxes, and someone copying numbers at 6pm.',
    after: 'One screen that updates itself.',
  },
  finalCta: { headline: 'Tell us what’s slowing your team down.' },
}

export const SITE_SETTINGS = {
  contactEmail: 'hello@zyntrivia.com',
  responseTime: 'Replies within one business day',
  location: 'Karachi (UTC+5), overlapping EU and US Eastern hours',
  social: {
    linkedinUrl: 'https://www.linkedin.com/company/zyntrivia',
    githubUrl: null,
    githubUsername: null,
  },
  review: { platform: null, rating: null, count: null, url: null },
}
