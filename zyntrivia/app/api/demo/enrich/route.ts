import Anthropic from "@anthropic-ai/sdk";
import { load } from "cheerio";
import { createHash } from "crypto";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { validatePublicHttpsUrl, fetchPublicHtml } from "@/lib/ssrf";
import type { DemoEvent } from "@/lib/demo";

export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 5_000;
const CONTENT_CAP = 4_000;
const MAX_OUTPUT_TOKENS = 700;
const EST_COST_PER_RUN_USD = 0.01;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CachedRun = { summary: string; email: string; stageMs: number[]; at: number };
const cache = new Map<string, CachedRun>();
let costDay = "";
let costRuns = 0;

function underDailyCap(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (costDay !== today) {
    costDay = today;
    costRuns = 0;
  }
  const cap = Number(process.env.DEMO_DAILY_COST_CAP_USD || "5");
  return costRuns * EST_COST_PER_RUN_USD < cap;
}

function extractContent(html: string): string {
  const $ = load(html);
  $("script, style, noscript, svg, iframe, nav, footer, header").remove();
  const title = $("title").text().trim();
  const desc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const body = $("body").text().replace(/\s+/g, " ").trim();
  return [title, desc, body].filter(Boolean).join("\n").slice(0, CONTENT_CAP);
}

/** 503 tells the widget to play its canned replay — the prospect never sees an error. */
function unavailable(): Response {
  return new Response(JSON.stringify({ error: "demo unavailable" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !underDailyCap()) return unavailable();

  let rawUrl: string;
  try {
    const body = (await req.json()) as { url?: string };
    rawUrl = String(body.url ?? "");
  } catch {
    return unavailable();
  }

  const ok = await rateLimit("demo", clientIp(req), 3, 60 * 60);
  if (!ok) return unavailable();

  const url = await validatePublicHttpsUrl(rawUrl);
  if (!url) return unavailable();

  const urlHash = createHash("sha256").update(url.href).digest("hex");
  const cached = cache.get(urlHash);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (ev: DemoEvent) =>
        controller.enqueue(encoder.encode(JSON.stringify(ev) + "\n"));
      const t0 = Date.now();
      const stageMs: number[] = [];
      let stage = 0;

      const startStage = (i: number) => {
        stage = i;
        send({ type: "stage", index: i, status: "running" });
        return Date.now();
      };
      const endStage = (i: number, since: number) => {
        const ms = Date.now() - since;
        stageMs[i] = ms;
        send({ type: "stage", index: i, status: "ok", ms });
      };

      try {
        // Cached run: replay the recorded stages quickly with real data.
        if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
          for (let i = 0; i < 5; i++) {
            send({ type: "stage", index: i, status: "running" });
            await new Promise((r) => setTimeout(r, 150));
            send({ type: "stage", index: i, status: "ok", ms: cached.stageMs[i] ?? 100 });
          }
          send({ type: "result", summary: cached.summary, email: cached.email });
          send({
            type: "done",
            totalMs: cached.stageMs.reduce((a, b) => a + b, 0),
          });
          controller.close();
          return;
        }

        // [01] FETCH SITE
        let t = startStage(0);
        const html = await fetchPublicHtml(url, FETCH_TIMEOUT_MS);
        if (!html) throw new Error("fetch failed");
        endStage(0, t);

        // [02] EXTRACT CONTENT
        t = startStage(1);
        const content = extractContent(html);
        if (content.length < 100) throw new Error("no usable content");
        endStage(1, t);

        // [03..05] One Claude call, streamed; stages tick as sections arrive.
        costRuns++;
        const anthropic = new Anthropic({ apiKey });
        t = startStage(2);
        const msgStream = anthropic.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: MAX_OUTPUT_TOKENS,
          temperature: 0.2,
          system:
            "You are an automation consultant at Zyntrivia, an engineering studio that builds internal tools and AI workflow automation. You analyze a company's website text and identify realistic automation opportunities. Be concrete and specific to THIS business — never generic. Plain, confident, US-English prose. No markdown.",
          messages: [
            {
              role: "user",
              content: `Website content for ${url.hostname}:\n\n${content}\n\nRespond in EXACTLY this format:\nSUMMARY:\nOne short paragraph: what this business does, then the two workflows most likely worth automating for them and why those two.\nEMAIL:\nA short outreach email to this business (subject line first, then body under 120 words) offering to build one of those automations. Sign it "— Zyntrivia".`,
            },
          ],
        });

        let text = "";
        let identified = false;
        for await (const event of msgStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            text += event.delta.text;
            if (!identified && text.length > 250) {
              endStage(2, t); // IDENTIFY BUSINESS
              t = startStage(3); // FIND AUTOMATION GAPS
              identified = true;
            }
            if (stage === 3 && text.includes("EMAIL:")) {
              endStage(3, t);
              t = startStage(4); // DRAFT OUTREACH
            }
          }
        }
        if (stage === 2) {
          endStage(2, t);
          t = startStage(3);
        }
        if (stage === 3) {
          endStage(3, t);
          t = startStage(4);
        }
        endStage(4, t);

        const emailIdx = text.indexOf("EMAIL:");
        const summary = (emailIdx >= 0 ? text.slice(0, emailIdx) : text)
          .replace(/^SUMMARY:\s*/i, "")
          .trim();
        const email = emailIdx >= 0 ? text.slice(emailIdx + 6).trim() : "";
        if (!summary) throw new Error("empty model output");

        cache.set(urlHash, { summary, email, stageMs, at: Date.now() });
        send({ type: "result", summary, email });
        send({ type: "done", totalMs: Date.now() - t0 });
        controller.close();
      } catch (err) {
        // Mid-stream failure: abort the stream; the widget falls back to replay.
        console.error("demo/enrich failed:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
