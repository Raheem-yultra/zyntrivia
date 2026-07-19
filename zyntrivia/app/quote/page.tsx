import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Three short steps. Fixed scope, fixed price, and a ship date within 24 hours — from an engineer, not a salesperson.",
};

export default function QuotePage() {
  return (
    <main className="section-x mx-auto min-h-screen max-w-3xl py-16 md:py-24">
      <QuoteForm />
    </main>
  );
}
