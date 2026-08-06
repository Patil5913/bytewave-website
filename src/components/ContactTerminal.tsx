"use client";

import { useState } from "react";
import Reveal from "@components/Reveal";
import { ArrowRight, Check } from "lucide-react";

const TALENT_FIELDS = [
  { id: "name", label: "Full Name", type: "text", placeholder: "Jordan Lee" },
  { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
  {
    id: "role",
    label: "Target Role",
    type: "text",
    placeholder: "Backend Developer",
  },
  {
    id: "experience",
    label: "Years of Experience",
    type: "text",
    placeholder: "5",
  },
];

const ENTERPRISE_FIELDS = [
  {
    id: "company",
    label: "Company Name",
    type: "text",
    placeholder: "Acme Inc.",
  },
  {
    id: "email",
    label: "Work Email",
    type: "email",
    placeholder: "you@company.com",
  },
  { id: "headcount", label: "Roles to Fill", type: "text", placeholder: "3" },
  {
    id: "stack",
    label: "Primary Stack / Domain",
    type: "text",
    placeholder: "Platform, K8s",
  },
];

const COPY = {
  talent: {
    tag: "Talent Intake",
    eyebrow: "For Professionals",
    blurb: "Get verified once and let direct-routed introductions come to you.",
    fields: TALENT_FIELDS,
    messageLabel: "Anything else we should know?",
    messagePlaceholder: "Preferred remote/hybrid, notice period, etc.",
    cta: "Apply for Verification",
  },
  enterprise: {
    tag: "Enterprise Intake",
    eyebrow: "For Companies",
    blurb:
      "Tell us what you're hiring for and we'll route verified specialists directly.",
    fields: ENTERPRISE_FIELDS,
    messageLabel: "What are you hiring for?",
    messagePlaceholder: "Role scope, timeline, team context, etc.",
    cta: "Request Talent",
  },
};

type Props = {
  mode?: "talent" | "enterprise";
};

type Status = "idle" | "sending" | "done" | "error";

export default function ContactTerminal({ mode = "talent" }: Props) {
  const copy = COPY[mode];
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = { type: mode };
    for (const field of copy.fields) {
      const v = data.get(field.id);
      if (v) payload[field.id] = String(v);
    }
    const message = data.get("message");
    if (message) payload.message = String(message);
    payload.source =
      typeof window !== "undefined" ? window.location.pathname : "unknown";

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.errors?.[0]?.message ?? "Submission failed.");
      }
      form.reset();
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setStatus("error");
    }
  }

  return (
    <section className="w-full bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col gap-4 md:max-w-2xl">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Get In Touch
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-ink lg:text-5xl">
            Start your intake.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/50">
            {mode === "talent"
              ? "Get verified and routed to companies actively hiring for your exact stack."
              : "Tell us what you need and we'll route pre-verified specialists to your team."}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-4">
            <span className="flex w-fit items-center gap-2 bg-ink/5 px-4 py-2 text-sm font-medium text-ink">
              {copy.tag}
            </span>

            <div className="flex flex-col gap-4">
              <span className="text-xs tracking-widest text-ink/40 uppercase">
                {copy.eyebrow}
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-ink/50">
                {copy.blurb}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            {status === "done" ? (
              <div className="flex flex-col items-start gap-4 border border-ink/10 bg-ink/[0.03] p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="h-5 w-5" />
                </span>
                <h3 className="font-instrument text-2xl font-medium text-ink">
                  Intake received.
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-ink/60">
                  Thanks — our team reviews every submission and typically
                  responds within four hours during business days.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="text-xs tracking-wider text-ink/60 uppercase transition-colors hover:text-ink"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                {copy.fields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-2">
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium tracking-widest text-ink/60 uppercase"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required={field.id === "email"}
                      placeholder={field.placeholder}
                      className="w-full border-b border-ink/15 bg-transparent py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-ink/40 focus:outline-none"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium tracking-widest text-ink/60 uppercase"
                  >
                    {copy.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder={copy.messagePlaceholder}
                    className="w-full resize-none border-b border-ink/15 bg-transparent py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-ink/40 focus:outline-none"
                  />
                </div>

                {status === "error" && (
                  <p
                    role="alert"
                    className="text-sm text-red-400 sm:col-span-2"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group mt-2 flex w-fit items-center justify-center gap-2 bg-ink/10 px-6 py-3 text-sm text-ink backdrop-blur-md transition-colors hover:bg-ink/20 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
                >
                  {status === "sending" ? "Sending…" : copy.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
