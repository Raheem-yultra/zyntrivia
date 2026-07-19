import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/schema";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { storeLead, notifyLead, toStoredLead } from "@/lib/leads";

export const runtime = "nodejs";

const MIN_FILL_MS = 4_000; // faster than any human fills three steps

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const lead = parsed.data;

  // Bot checks: honeypot is enforced by the schema (max(0)); timing here.
  if (Date.now() - lead.startedAt < MIN_FILL_MS) {
    // Pretend success — no signal for the bot author.
    return NextResponse.json({ ok: true });
  }

  const ok = await rateLimit("quote", clientIp(req), 5, 60 * 60);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const stored = toStoredLead(lead);
  try {
    await storeLead(stored);
  } catch (err) {
    console.error("Lead storage failed:", err);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please email hello@zyntrivia.com." },
      { status: 500 },
    );
  }

  // Fire-and-forget — notification failures never lose the lead.
  notifyLead(stored).catch((err) => console.error("Lead notify failed:", err));

  return NextResponse.json({ ok: true });
}
