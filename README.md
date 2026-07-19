# Zyntrivia — Engineering Studio Website

Marketing and lead-generation site for Zyntrivia, an engineering studio
(internal tools · AI workflow automation · full-stack applications).

## Repository layout

| Path | What it is |
|---|---|
| [`zyntrivia/`](zyntrivia) | The website — Next.js 14 App Router · TypeScript · Tailwind · Framer Motion · MDX. See [`zyntrivia/README.md`](zyntrivia/README.md) for setup, env vars, and the pre-launch checklist. |
| [`zyntrivia-implementation-plan_2.md`](zyntrivia-implementation-plan_2.md) | The implementation plan the site was built from. |
| [`stitch_zyntrivia_engineering_studio_website/`](stitch_zyntrivia_engineering_studio_website) | Stitch design source — the "Neo-Minimalist Engineering" design system and per-page HTML/PNG references. |

## Quick start

```bash
cd zyntrivia
npm install
npm run dev     # http://localhost:3000
```

Runs with zero environment variables — every integration (Supabase, Anthropic,
Resend, Upstash, n8n, Cal.com) degrades gracefully when unconfigured. See
[`zyntrivia/README.md`](zyntrivia/README.md) for details.
