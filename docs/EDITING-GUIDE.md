# Editing guide

How to publish and maintain content on zyntrivia.com. You don't need to know how the site is built to follow this guide.

Sign in at **zyntrivia.com/admin**. The left sidebar groups everything you can edit:

| Group | What's in it |
|---|---|
| **Blog** | Posts, Topics |
| **Work** | Case studies, Services, FAQs |
| **Content** | Media (images and videos) |
| **Leads** | Quote requests from the website form |
| **Admin** | Homepage, Site settings, Users |

Changes appear on the live site within a few seconds of publishing. You never need a developer to redeploy.

---

## 1. Write and publish a blog post

1. Go to **Blog → Posts** and click **Create new**.
2. Fill in the main fields:
   - **Title**: say what the reader will learn. Sentence case, no exclamation marks, 90 characters max.
   - **Excerpt**: one or two sentences, 25 words max. It appears on the blog index and in Google results.
   - **Content**: the body of the post (see [Writing the body](#writing-the-body)).
3. Fill in the sidebar:
   - **Slug**: filled in from the title. This becomes the address, `zyntrivia.com/blog/your-slug`. Don't change it after publishing, because old links would break.
   - **Topics**: pick at least one.
   - **Featured**: tick it to show this post large at the top of `/blog`. The newest featured post wins.
   - **Author**: leave as "Zyntrivia team". We don't publish personal names.
   - **Related case studies**: optional.
4. Open the **SEO** section only if you want a different title or description in Google than the post's own. Leave **noindex** off unless the post should be hidden from search engines.
5. Click **Publish changes**.

The post is now live at `/blog/your-slug`, on the blog index, in the RSS feed, and in the sitemap.

### Saving drafts

The editor saves a draft automatically as you type. Drafts are never visible on the public site. Come back to it any time from **Blog → Posts**. Drafts show a "Draft" status.

### Previewing before you publish

- Click **Live Preview** (the eye icon at the top of the editor) to see the post as it will look, side by side with the editor. Switch between **Mobile** and **Desktop** at the top of the preview. It updates as you type.
- Or click **Preview** to open the draft in a new tab. A yellow "Draft preview" bar shows at the top. Click **Exit preview** when you're done.

Preview only works while you're signed in to the admin.

### Scheduling a post

1. Write the post and leave it as a draft.
2. Click the arrow next to **Publish changes** and choose **Schedule Publish**.
3. Pick the date and time, then confirm.

Scheduled posts are published by a background job. On the current hosting plan it runs once a day (see `docs/LAUNCH-CHECKLIST.md`), so a post scheduled for 10:00 may go live a few hours later. If timing matters, publish it manually.

### Editing a published post

Open it, make your changes, and click **Publish changes** again. The live page updates within seconds. Until you publish, your edits are saved as a draft and the live page keeps showing the previous version.

### Unpublishing or deleting

- To take a post offline but keep it: open it, click the arrow next to **Publish changes**, and choose **Unpublish**.
- To delete it for good: use the **⋯** menu → **Delete**. This can't be undone.

---

## Writing the body

The content editor works like a simple word processor. Type `/` on an empty line to see everything you can insert.

### Headings

- Use **Heading 2** for the main sections and **Heading 3** for sub-points inside a section. Never skip from H2 to H4.
- Don't use a heading for the post title. The title field already becomes the page's main heading.
- H2 headings build the table of contents on desktop, so make them short and descriptive.

### Blocks

Insert these with `/` or the **+** button:

| Block | Use it for |
|---|---|
| **Code** | Code samples. Pick the language so it's highlighted, and add a filename if it helps. Readers get a copy button. |
| **Callout** | A note, tip, or warning the reader shouldn't miss. Keep it to one or two sentences. |
| **Image with caption** | A screenshot or diagram. Choose "Wide" to let it extend past the text column on desktop. |
| **Video** | A short screen recording. Upload a poster image too. |
| **Table** | Small comparisons. One row per line, cells separated by `|`. The first line is the header row. |
| **Comparison** | "Before / after" or "option A / option B" lists. One point per line. |
| **Quote CTA** | The "Request a quote" box. See below. |
| **Case study card** | A link card to one of our case studies. |
| **Feature screenshot** | A product screenshot with a longer caption (240 characters max). |

### Quote CTA placement

Every post gets a "Request a quote" box at the end automatically. Add one **Quote CTA** block about 60% of the way through the post, at a natural pause: after you've described the problem, before the detailed how-to.

If you don't add one, the site inserts one about 60% of the way through for you, always before a heading and never directly after one. Add it yourself when you want control over where it lands. Use one inline CTA per post at most.

### Links

Select text and press the link button. Choose **Internal link** to link to another post, case study, or service. These keep working if a slug changes. Use **Custom URL** for other websites.

---

## 2. Images and video

Upload files in **Content → Media**, or directly from any image field.

### Alt text (required)

Every upload needs alt text, and the admin won't save without it. Write it for someone who can't see the image:

- Describe what the image shows and why it's there: "Stock dashboard showing three items below their reorder point", not "dashboard screenshot".
- Don't start with "Image of" or "Screenshot of".
- Keep it under about 125 characters. Put longer explanations in the caption.
- For a video loop, describe what happens on screen: "An order email arrives and the inventory count updates".
- Include any text in the image that matters to understanding it.

### Sizes and formats

| Use | Size | Format | Limit |
|---|---|---|---|
| Blog cover image | 1600 × 900 px (16:9) | JPG or WebP for photos, PNG for UI | 4 MB |
| Screenshots in a post | At least 1600 px wide | PNG or WebP | 4 MB |
| Case study cover | 1600 × 1000 px (16:10) | PNG or WebP | 4 MB |
| Case study video loop | 1600 × 1000 px, 8 seconds or less, muted | WebM and MP4 | 1.5 MB |
| Video poster frame | Same size as the video | JPG or WebP | 60 KB |
| Diagrams | Any | SVG | 4 MB |

- Uploads larger than about 4.5 MB fail on our hosting. Compress first (for example with squoosh.app).
- The site automatically resizes images for each screen, so upload one good-quality version.
- Crop screenshots to what matters. Blur or remove any real customer names, emails, or figures before uploading.
- SVG files are cleaned automatically on upload; scripts and embedded content are removed.

---

## 3. Case studies

**Work → Case studies.** Only publish what's true and verifiable. If you don't have a real number, leave the field empty and that part of the page won't show.

| Tab | Fields | Limits |
|---|---|---|
| Overview | Title, summary, problem line, outcome line, demo and repo links, cover | Problem line 12 words; outcome line 20 words |
| At a glance | Problem, solution, result | 20 words each |
| Story | The problem (text + diagram), "What we built" feature shots | Problem 120 words; captions 40 words |
| Architecture | Diagram tiers or an uploaded SVG, plus question-and-answer notes | |
| Results & stack | Results (value + label) and the tech stack | Real, measured results only |

Case studies appear on `/work`, not on the homepage. In the sidebar, **Order** sets their sequence there. Case studies support drafts and preview like posts.

---

## 4. Services and FAQs

- **Work → Services**: title, outcome line (12 words), summary (22 words), the problem section (headline 10 words, body 45 words), and 2–4 capabilities. **Featured on homepage** gives a service the large tile. Only one should be ticked. Keep the title plain ("Tools for your team", not "Internal tools and dashboards"); put the terms people search for in the service’s **SEO → Meta title**.
- **Work → FAQs**: question and answer. Tick **Show on homepage** for the 5–6 most important. **Order** sets the sequence. FAQs can also be attached to a service page.

---

## 5. Homepage and site settings

**Admin → Homepage**

The homepage is a sales funnel for business owners, not developers. Write every line in plain language: name the problem the visitor feels ("copying data between apps"), never the technology ("API integration", "LLM", "MVP").

- **Hero headline**: the hook, 10 words max. Ask the question the visitor answers in their head, e.g. "What’s wasting your team’s time?"
- **Subhead**: 22 words max. Name the time-wasters, then the promise.
- **Before / after**: two short lines, 30 words total.
- **Final CTA headline**: 8 words max.

Case studies and blog posts don’t appear on the homepage; they have their own pages.

**Admin → Site settings**

- Contact email, response time ("Replies within one business day"), and location.
- LinkedIn and GitHub links. Add the **GitHub username** to show the public contribution graph on the homepage.
- **Review**: fill in platform, rating, count, and link **only for a real, public review profile**. If any of these are empty, no rating is shown anywhere.

Word limits are enforced when you save. If a field is over budget, the admin tells you how many words it has. Cut words rather than working around the limit.

---

## 6. Quote requests

**Leads → Quote requests** lists every request from the website form, newest first. Open one to see the details, the page the person landed on, and campaign tags.

Move each request through **Status** as it progresses: New → Contacted → Call booked → Quoted → Won or Lost. Use **Notes** for anything internal; it's never shown to the requester.

Requests marked **Lost** are deleted automatically 12 months after they came in, as our privacy policy promises. To delete someone's data sooner on request, delete the quote request manually.

---

## 7. House style checklist

Before you publish anything, check:

- [ ] Sentence case in titles and headings. No exclamation marks.
- [ ] No "cutting-edge", "seamless", "leverage", "empower", or "unlock".
- [ ] "We", never a personal name.
- [ ] No prices, rates, or budgets.
- [ ] No claims we can't back up: no invented logos, testimonials, or metrics.
- [ ] Every image has meaningful alt text.
- [ ] Paragraphs of two sentences at most on marketing pages.
- [ ] You've looked at the preview on mobile.
