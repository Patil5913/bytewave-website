"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Globe } from "lucide-react";
import Honeypot from "@components/Honeypot";
import Reveal from "@components/Reveal";
import { SITE_SETTINGS } from "@/lib/siteContent";

type NlStatus = "idle" | "sending" | "done" | "error";

export default function Footer({
  settings = SITE_SETTINGS,
}: {
  settings?: typeof SITE_SETTINGS;
}) {
  const LINK_GROUPS = settings.footerGroups;
  const [nlStatus, setNlStatus] = useState<NlStatus>("idle");

  const [renderedAt] = useState(() => Date.now());

  async function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nlStatus === "sending" || nlStatus === "done") return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNlStatus("error");
      return;
    }
    setNlStatus("sending");
    try {
      const res = await fetch("/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          email,

          surface: "footer",
          companyUrl: String(form.get("companyUrl") ?? ""),
          renderedAt,
        }),
      });
      if (!res.ok) throw new Error();
      setNlStatus("done");
    } catch {
      setNlStatus("error");
    }
  }

  return (
    <footer className="relative w-full overflow-hidden bg-canvas px-6 pt-24 max-sm:px-5 max-sm:pt-14 pb-8 md:px-16">
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-16 max-sm:gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="w-fit font-instrument text-2xl font-normal text-ink"
            >
              find <span className="text-brand">&amp;</span> hire
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink/60">
              {settings.tagline}
            </p>
            <p className="text-xs text-ink/50">{settings.legalLine}</p>
            <address className="max-w-xs text-sm leading-relaxed text-ink/55 not-italic">
              {settings.address.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </address>
            {settings.socials.length > 0 && (
              <div className="mt-2 flex items-center gap-6 text-xs text-ink/60">
                {settings.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 flex max-w-xs flex-col gap-3">
              <span
                id="newsletter-label"
                className="text-sm font-medium tracking-widest text-ink/60 uppercase"
              >
                Newsletter
              </span>
              {nlStatus === "done" ? (
                <p className="flex items-center gap-2 py-2 text-sm text-ink/70">
                  <Check className="h-4 w-4 text-brand" />
                  You&apos;re subscribed.
                </p>
              ) : (
                <form
                  onSubmit={handleNewsletter}
                  className="flex items-center border-b border-ink/20 focus-within:border-ink/50"
                >
                  <Honeypot />
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    aria-labelledby="newsletter-label"
                    placeholder="you@company.com"
                    className="w-full bg-transparent py-2 text-sm max-sm:text-base text-ink placeholder:text-ink/30 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    disabled={nlStatus === "sending"}
                    className="text-ink/60 transition-colors hover:text-ink disabled:opacity-50"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
              {nlStatus === "error" && (
                <p role="alert" className="text-xs text-red-400">
                  Something went wrong. Try again.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {LINK_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                <span className="text-sm font-medium tracking-widest text-ink/60 uppercase">
                  {group.title}
                </span>
                <div className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-ink/60 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-4">
              <span className="text-sm font-medium tracking-widest text-ink/60 uppercase">
                Status
              </span>
              <span className="flex items-center gap-2 text-sm text-ink/60">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
                All systems operational
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-sm font-medium tracking-widest text-ink/60 uppercase">
                Region
              </span>
              <span className="flex items-center gap-2 text-sm text-ink/60">
                <Globe className="h-4 w-4" />
                {settings.region}
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 max-sm:mt-12 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 text-xs text-ink/55 sm:flex-row sm:items-center">
          <span>
            © 2026 find &amp; hire, a Bytewave company. All rights reserved.
          </span>
          <a
            href="https://rudr.me"
            target="_blank"
            rel="noopener noreferrer"
            className="lowercase"
          >
            crafted by{" "}
            <span className="text-ink transition-colors hover:text-ink/70">
              rudr
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
