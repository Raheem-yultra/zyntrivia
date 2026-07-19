import { promises as fs } from "fs";
import path from "path";
import { Resend } from "resend";
import type { LeadInput } from "./schema";

export type StoredLead = Omit<LeadInput, "startedAt" | "website_hp"> & {
  status: "new";
  createdAt: string;
};

export function toStoredLead(input: LeadInput): StoredLead {
  const { startedAt: _s, website_hp: _h, ...rest } = input;
  return { ...rest, status: "new", createdAt: new Date().toISOString() };
}

/** Supabase REST insert when configured; local JSON file fallback in dev. */
export async function storeLead(lead: StoredLead): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        source: lead.source,
        services: lead.services ?? [],
        problem: lead.problem ?? null,
        timeline: lead.timeline ?? null,
        company_size: lead.companySize ?? null,
        current_state: lead.currentState ?? null,
        name: lead.name,
        email: lead.email,
        company: lead.company ?? null,
        country: lead.country ?? null,
        website: lead.website ?? null,
        wants_call: lead.wantsCall ?? false,
        calculator: lead.calculator ?? null,
        utm: lead.utm ?? null,
        status: lead.status,
      }),
    });
    if (!res.ok) {
      throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
    }
    return;
  }

  // Dev fallback: append to a local file so no lead is ever dropped.
  const file = path.join(process.cwd(), ".leads.local.json");
  let existing: StoredLead[] = [];
  try {
    existing = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    /* first lead */
  }
  existing.push(lead);
  await fs.writeFile(file, JSON.stringify(existing, null, 2), "utf8");
}

/** Best-effort notifications — never block or fail the lead capture. */
export async function notifyLead(lead: StoredLead): Promise<void> {
  const tasks: Promise<unknown>[] = [];

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL;
    if (notifyTo) {
      tasks.push(
        resend.emails.send({
          from: "Zyntrivia <leads@zyntrivia.com>",
          to: notifyTo,
          subject: `New ${lead.source} lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
          text: JSON.stringify(lead, null, 2),
        }),
      );
    }
    tasks.push(
      resend.emails.send({
        from: "Zyntrivia <hello@zyntrivia.com>",
        to: lead.email,
        subject: "Got it — your Zyntrivia quote request",
        text: [
          `Hi ${lead.name.split(" ")[0]},`,
          "",
          "We received your request. An engineer — not a salesperson — will reply",
          "within 24 hours with a fixed scope, a fixed price, and a ship date.",
          "",
          "In the meantime, you can see how we scope projects:",
          "https://zyntrivia.com/process",
          "",
          "— Zyntrivia",
        ].join("\n"),
      }),
    );
  }

  const webhook = process.env.N8N_WEBHOOK_URL;
  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      }),
    );
  }

  await Promise.allSettled(tasks);
}
