/** The engagement sequence from docs/01-PRD.md §5. Shared by the homepage and /process. Plain language only. */
export const PROCESS_STEPS = [
  {
    title: 'A 30-minute call',
    duration: '30 minutes',
    summary: 'We learn how the work gets done today and where it goes wrong.',
    detail:
      'A 30-minute call about how your team works today: the apps you use, the hand-offs, and the part everyone dreads. No slides and no pitch.',
  },
  {
    title: 'A fixed price',
    duration: 'Within 3 business days',
    summary: 'A written plan and a fixed price, within 3 business days.',
    detail:
      'Within 3 business days you get a written plan, a fixed price, and a payment schedule tied to milestones. The price only changes if the plan does, and only with your sign-off.',
  },
  {
    title: 'Progress every week',
    duration: null,
    summary: 'Every week you try the real thing, not a status report.',
    detail:
      'Every week you see the real thing working, not a status report. Your feedback goes straight into the next week’s work.',
  },
  {
    title: 'Launch, and it’s yours',
    duration: null,
    summary: 'We set it up, show your team around, and hand everything over.',
    detail:
      'We launch it, walk your team through it, and hand over the software, the instructions, and every login. Nothing stays locked behind us.',
  },
] as const

export const HANDOVER_ITEMS = [
  {
    title: 'You own the software',
    summary: 'It sits in your company’s account from day one, not handed over at the end.',
  },
  {
    title: 'Clear instructions',
    summary: 'How it works and how to use it, written for your team.',
  },
  {
    title: 'Checked before launch',
    summary: 'The important parts are tested, so later changes don’t quietly break them.',
  },
  {
    title: 'Easy for anyone to take over',
    summary: 'Step-by-step notes, so any developer can keep it running.',
  },
  {
    title: '30 days of support',
    summary: 'Fixes and questions after launch are covered for a month.',
  },
] as const
