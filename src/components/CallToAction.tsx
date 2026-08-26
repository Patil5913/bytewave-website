"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Honeypot from "@components/Honeypot";
import Reveal from "@components/Reveal";
import { HOMEPAGE, splitBrand } from "@/lib/siteContent";

type Status = "idle" | "sending" | "done" | "error";

export default function CallToAction({
  content = HOMEPAGE,
}: {
  content?: typeof HOMEPAGE;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [renderedAt] = useState(() => Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    try {
      const res = await fetch("/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead",
          email,

          surface: "cta",
          companyUrl: String(form.get("companyUrl") ?? ""),
          renderedAt,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.errors?.[0]?.message ?? "Submission failed.");
      }
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setStatus("error");
    }
  }

  return (
    <section
      id="cta"
      className="relative flex min-h-svh w-full scroll-mt-24 flex-col justify-center overflow-hidden bg-canvas px-6 py-32 max-sm:py-16 md:px-16"
    >
      <Reveal className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="mb-6 font-instrument max-sm:text-4xl text-5xl leading-[1.05] font-medium text-balance text-ink md:text-7xl">
          {splitBrand(content.ctaHeadline).map((seg, i) =>
            seg.brand ? (
              <span key={i} className="text-brand">
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </h2>

        <p className="mb-12 max-sm:mb-8 max-w-xl text-lg leading-relaxed text-ink/70">
          {content.ctaBody}
        </p>

        {status === "done" ? (
          <div className="flex flex-col items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand">
              <Check className="h-5 w-5" />
            </span>
            <p className="text-base text-ink">
              Thanks — we&apos;ll be in touch within four hours.
            </p>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
            >
              <Honeypot />
              <label htmlFor="cta-email" className="sr-only">
                Work email
              </label>
              <input
                id="cta-email"
                name="email"
                type="email"
                required
                size={16}
                placeholder="you@company.com"
                className="w-full border-b border-ink/20 bg-transparent py-3 text-center text-base text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none sm:w-auto sm:text-left"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="group flex shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-ink px-6 py-3 max-sm:w-full font-medium text-canvas transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Book a Strategy Call"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-4 text-sm text-ink/60">
              Looking for a role instead?{" "}
              <Link
                href="/professionals"
                className="text-ink underline underline-offset-4 transition-colors hover:text-ink/70"
              >
                Join as a professional
              </Link>
            </p>

            {status === "error" && (
              <p role="alert" className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}
          </>
        )}

        <span className="mt-8 flex items-center gap-2 text-xs tracking-wider text-ink/60 uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          {content.ctaResponseNote}
        </span>
      </Reveal>
    </section>
  );
}
