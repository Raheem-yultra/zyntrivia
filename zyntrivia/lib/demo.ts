/** Shared contract between the LiveDemo widget and /api/demo/enrich. */

export const DEMO_STAGES = [
  "FETCH SITE",
  "EXTRACT CONTENT",
  "IDENTIFY BUSINESS",
  "FIND AUTOMATION GAPS",
  "DRAFT OUTREACH",
] as const;

export type DemoEvent =
  | { type: "stage"; index: number; status: "running" }
  | { type: "stage"; index: number; status: "ok"; ms: number }
  | { type: "replay" }
  | { type: "result"; summary: string; email: string }
  | { type: "done"; totalMs: number };

/**
 * Canned replay of a prior run, used whenever the live pipeline is
 * unavailable (no API key, rate limit, cost cap, fetch failure).
 * The prospect never sees an error — they see this, labeled REPLAY.
 * NOTE: replace with a recording of a real run before launch.
 */
export const REPLAY = {
  url: "https://hartleysupply.example.com",
  stageMs: [412, 180, 1240, 2110, 460],
  totalMs: 4402,
  summary:
    "Hartley Supply is a regional plumbing-parts distributor selling to trade contractors through a phone-and-email order desk, with stock spread across three branch warehouses. The two workflows most likely worth automating: (1) order intake — parsing emailed and phoned-in orders straight into the inventory system instead of double-keying them, and (2) stock-level alerts — automatic low-stock and slow-mover notifications per branch, so reordering stops depending on someone remembering to check.",
  email: `Subject: The order desk double-keying at Hartley Supply

Hi —

We took a look at how Hartley Supply handles trade orders. If your team
is still re-typing emailed orders into your stock system, that's an
automation that usually ships in 2–5 weeks: parsed intake straight to
inventory, with low-stock alerts per branch as a second step.

If that's a real pain point, reply and we'll send a fixed-scope quote.

— Zyntrivia`,
} as const;
