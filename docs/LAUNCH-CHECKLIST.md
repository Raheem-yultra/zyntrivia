# Launch checklist (P7-4)

The v2 site lives on the `redesign/v2` branch. Production keeps serving v1 from `main` until this list is done and the branch is merged.

Work through the sections in order. Items marked ⚠️ are security-sensitive.

---

## 1. Content sign-off

- [ ] Every item in `docs/CONTENT-REVIEW.md` has a decision, and the changes are made.
- [ ] GitHub URL and username added in Site settings, or deliberately left empty.
- [ ] Privacy policy updated with the Supabase region (section 2) and the legal entity name.

## 2. Supabase (production project)

Use a **separate Supabase project** for production. Never point local development or Vercel preview deployments at it.

- [ ] **Region.** Choose based on where most leads are: `eu-central-1` (Frankfurt) if most are EU, otherwise `us-east-1`. Architecture §8 asks for EU if EU leads dominate. Note the choice in the privacy policy.
- [ ] **Database password.** Generate a long random password. Store it only in the password manager and in Vercel.
- [ ] **Connection string.** Dashboard → Connect → **Session pooler** URI (IPv4-compatible). Percent-encode special characters in the password. This is `DATABASE_URL`.
- [ ] ⚠️ **SSL.** Database → Settings → SSL configuration → turn on **Enforce SSL** and download the CA certificate. Its contents are `DATABASE_CA_CERT`. The app verifies the server certificate against it.
- [ ] **Storage.** Create a bucket named `media` and set it to **public**. Storage → S3 connection → create an access key. Fill in `S3_ENDPOINT` (`https://<project-ref>.supabase.co/storage/v1/s3`), `S3_BUCKET=media`, `S3_REGION` (the project region), `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`.
- [ ] **Connection limits.** After launch, watch Database → Connections. If the session pooler runs out of connections under load, lower the pool size or test the transaction pooler (port 6543) on a preview deployment first.
- [ ] **Backups.** Confirm daily backups are on (Pro plan), or schedule a `pg_dump`.

## 3. Third-party services

### Resend (email)

- [ ] Add and verify the `zyntrivia.com` domain. Add the SPF, DKIM, and DMARC records it lists.
- [ ] Create an API key with send-only access → `RESEND_API_KEY`.
- [ ] `EMAIL_FROM_ADDRESS=hello@zyntrivia.com`, or another address on the verified domain.
- [ ] `QUOTE_NOTIFY_TO`: the inbox that should receive new leads.

### Cloudflare Turnstile (spam protection)

- [ ] Create a **Managed** widget. Add hostnames `zyntrivia.com` and `www.zyntrivia.com`.
- [ ] `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
- [ ] ⚠️ Both must be set in production. Without the secret, the form logs an error and **skips the spam check**. Test keys are only used outside production.
- [ ] For preview deployments, either add the `*.vercel.app` preview hostname to the widget or use Cloudflare's test keys in the Preview environment.

### Plausible (analytics)

- [ ] Add the site `zyntrivia.com`. Set `PLAUSIBLE_DOMAIN=zyntrivia.com`. The script only loads in production.
- [ ] Add these **custom event goals** (names must match exactly): `cta_click`, `secondary_cta_click`, `quote_step_view`, `quote_step_complete`, `quote_submit`, `quote_error`, `case_study_view`, `demo_open`, `repo_open`, `blog_read_75`, `faq_open`.
- [ ] Register **custom properties**: `location`, `label`, `step`, `type`, `timeline`, `kind`, `slug`, `question_id`.
- [ ] Create the **funnel** "Quote": `cta_click` → `quote_step_view` → `quote_step_complete` → `quote_submit`.
- [ ] Mark `quote_submit` as the primary conversion.

## 4. Vercel

The project is already connected for v1. Update its settings before merging.

- [ ] **Root directory**: `zyntrivia`.
- [ ] **Build command**: comes from `zyntrivia/vercel.json` (`pnpm run build:deploy`), which runs database migrations and then `next build`. Don't override it in the dashboard.
  - Note: `pnpm ci` is a built-in pnpm command, which is why the script is named `build:deploy`.
- [ ] **Node.js version**: 22.x or 24.x (local development used 24).
- [ ] **pnpm version**: the lockfile was written by pnpm 11. If the Vercel install fails on the lockfile, add `"packageManager": "pnpm@11.8.0"` to `package.json` and set the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1`.
- [ ] **Function region**: match the Supabase region (`fra1` for Frankfurt, `iad1` for us-east-1). Settings → Functions.
- [ ] **Plan**: Vercel's Hobby plan is for non-commercial use only. Use Pro for the studio site.

### Environment variables

Set these for **Production**, from `zyntrivia/.env.example`:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Session pooler URI (section 2) |
| `DATABASE_CA_CERT` | CA certificate PEM (section 2) |
| `PAYLOAD_SECRET` | ⚠️ New 64-character random hex. Never reuse the development value. |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Section 2 |
| `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `QUOTE_NOTIFY_TO` | Section 3 |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Section 3 |
| `NEXT_PUBLIC_SITE_URL` | `https://zyntrivia.com` (no trailing slash) |
| `DRAFT_SECRET` | ⚠️ New random string |
| `CRON_SECRET` | ⚠️ New random string. Vercel sends it automatically on cron calls. |
| `PLAUSIBLE_DOMAIN` | `zyntrivia.com` |

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For **Preview**, use a separate Supabase project or branch (the build runs migrations against whatever `DATABASE_URL` points to) and separate secrets.

- [ ] Remove the v1 Sanity environment variables once v2 is live.

### Cron

`vercel.json` calls `/api/payload-jobs/run?allQueues=true` daily at 03:30 UTC. That job:

- publishes posts scheduled with **Schedule Publish**, and
- deletes **Lost** quote requests older than 12 months (the privacy policy promise).

Daily is the most frequent schedule the Hobby plan allows. On Pro, changing the schedule to `*/15 * * * *` makes scheduled posts go live within 15 minutes. Update `docs/EDITING-GUIDE.md` if you do.

- [ ] After the first production deploy, check Settings → Cron Jobs shows the job, and that a manual run returns 200.

## 5. First deploy

Do this on a preview deployment of `redesign/v2` connected to the **production** database, before switching the domain. Temporarily set the Preview environment variables to production values for this one deployment, then change them back.

1. [ ] Deploy. Confirm the build log shows the migrations running (`Migrating: 20260916_234143_initial`, `20260917_141134_retention_job`).
2. [ ] ⚠️ **Create the admin user immediately.** Until a user exists, anyone who opens `/admin` can create the first account. Open `<deployment-url>/admin` straight after the deploy finishes, create the account with a password of at least 12 characters, and store it in the password manager.
3. [ ] Load seed content from your machine against production. Put the production values in a temporary `zyntrivia/.env.production.local`, then run the seed with `NODE_ENV=production`. Without it, the Payload CLI reads the development env files and seeds your development database instead.
   ```bash
   NODE_ENV=production pnpm seed
   ```
   In PowerShell, set `$env:NODE_ENV='production'` first, and remove it afterwards. Then **delete `.env.production.local`**. The seed is idempotent, and it uploads the StockSense screenshots to Supabase Storage.
4. [ ] Apply the content decisions from `docs/CONTENT-REVIEW.md` in the admin.

## 6. Pre-launch QA on the preview URL

- [ ] `pnpm lint && pnpm typecheck && pnpm test` pass locally.
- [ ] `pnpm test:e2e` passes against a local copy seeded with the same content (`PW_CHANNEL=chrome` uses installed Chrome).
- [ ] Submit a real quote request. Check that the lead appears in **Leads → Quote requests**, the notification email arrives at `QUOTE_NOTIFY_TO`, and the confirmation email arrives in Gmail and Outlook, in light and dark mode.
- [ ] Turnstile shows on step 3 of `/quote`. Submitting without completing it is refused.
- [ ] Publish a test post. It appears on `/blog` within seconds. Delete it.
- [ ] Preview a draft from the admin. The yellow draft bar shows.
- [ ] Upload an image. It is stored in Supabase Storage and renders on the page.
- [ ] Lighthouse (mobile) on `/`, `/work/stocksense`, a blog post, and `/quote`: Performance ≥ 90, Accessibility 100, SEO 100.
- [ ] Cross-browser: Chrome, Firefox, and Safari on iOS. Test the homepage, `/quote` end to end, the mobile menu, and the before/after slider.
- [ ] `https://<preview>/dev/tokens` shows the "This page doesn't exist" page, not the token
      sheet (dev pages are disabled in production). The HTTP status is 200, not 404: the site
      layout reads the CMS, so the response has already started streaming when `notFound()`
      runs and Next can no longer change the status. Next marks these responses
      `<meta name="robots" content="noindex">`, which is also true of unknown `/work`,
      `/blog`, and `/services` slugs.
- [ ] `/robots.txt` lists the production sitemap URL.

## 7. Go live

- [ ] Merge `redesign/v2` into `main`. Production deploys automatically.
- [ ] Revert the Preview environment variables if you changed them in section 5.
- [ ] Check v1 URLs still resolve: `/work`, `/work/stocksense`, `/services`, `/process`, `/about`, `/quote`, `/privacy`, `/terms`, `/projects/stocksense-demo`. `/studio` redirects to `/admin`, and `/home` to `/`.
- [ ] Response headers on `/` include `Content-Security-Policy` and `Strict-Transport-Security`.
- [ ] Plausible shows live visitors, and a test `cta_click` appears.

## 8. After launch

- [ ] **Google Search Console**: verify `zyntrivia.com` with a DNS record, submit `https://zyntrivia.com/sitemap.xml`, and request indexing for `/`.
- [ ] **Uptime monitoring** (Better Stack, UptimeRobot, or similar): check `https://zyntrivia.com/` and `https://zyntrivia.com/quote` every 5 minutes, and alert the studio inbox.
- [ ] Remove the v1 Sanity project once nothing references it.
- [ ] One week after launch, review the Plausible funnel against the goals and metrics in `docs/01-PRD.md` §1.
