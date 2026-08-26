"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";

import Honeypot from "@components/Honeypot";

type Status = "idle" | "sending" | "done" | "error";

export default function ReferralSignup({
  reward,
  currency,
  terms,
}: {
  reward: number;
  currency: string;
  terms?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [renderedAt] = useState(() => Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          companyUrl: String(form.get("companyUrl") ?? ""),
          renderedAt,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.message ?? "Submission failed.");
      }
      setLink(data?.link ?? "");
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setStatus("error");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (status === "done" && link) {
    return (
      <div className="flex w-full max-w-md flex-col gap-3">
        <p className="flex items-center gap-2 text-sm text-ink/70">
          <Check className="h-4 w-4 text-brand" />
          Your referral link is ready.
        </p>
        <div className="flex items-center gap-2 border border-ink/20 bg-ink/5 px-4 py-3">
          <code className="flex-1 truncate text-sm text-ink">{link}</code>
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy referral link"
            className="shrink-0 text-ink/60 transition-colors hover:text-ink"
          >
            {copied ? (
              <Check className="h-4 w-4 text-brand" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-ink/45">
          {reward > 0
            ? `You earn ${reward} ${currency} for every referral that qualifies.`
            : "Rewards are confirmed once a referral qualifies."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3"
    >
      <Honeypot />
      <label htmlFor="referral-name" className="sr-only">
        Your name
      </label>
      <input
        id="referral-name"
        name="name"
        type="text"
        required
        maxLength={120}
        placeholder="Your name"
        className="w-full border-b border-ink/20 bg-transparent py-2 text-sm max-sm:text-base text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none"
      />
      <label htmlFor="referral-email" className="sr-only">
        Your email
      </label>
      <input
        id="referral-email"
        name="email"
        type="email"
        required
        maxLength={254}
        placeholder="you@company.com"
        className="w-full border-b border-ink/20 bg-transparent py-2 text-sm max-sm:text-base text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-2 flex w-fit items-center gap-2 bg-ink/10 px-6 py-3 text-sm text-ink transition-colors hover:bg-ink/20 disabled:opacity-50"
      >
        {status === "sending" ? "Creating…" : "Get your referral link"}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      {status === "error" && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
      {terms && <p className="text-xs text-ink/40">{terms}</p>}
    </form>
  );
}
