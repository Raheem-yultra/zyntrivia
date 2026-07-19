import { z } from "zod";

export const leadSchema = z.object({
  source: z.enum(["quote", "calculator", "contact"]),
  services: z.array(z.string().max(80)).max(8).optional(),
  problem: z.string().max(5000).optional(),
  timeline: z.string().max(80).optional(),
  companySize: z.string().max(80).optional(),
  currentState: z.string().max(120).optional(),
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  website: z.string().max(500).optional(),
  wantsCall: z.boolean().optional(),
  calculator: z
    .object({
      people: z.number(),
      hours: z.number(),
      rate: z.number(),
      currency: z.string().max(3),
      annualLeak: z.number(),
      weeklyHours: z.number(),
    })
    .optional(),
  utm: z.record(z.string().max(500)).optional(),
  // Anti-bot: when the form was first rendered (timing check)…
  startedAt: z.number(),
  // …and a honeypot that must stay empty.
  website_hp: z.string().max(0),
});

export type LeadInput = z.infer<typeof leadSchema>;
