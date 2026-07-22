"use client";

import Reveal from "@components/Reveal";
import { ArrowRight } from "lucide-react";

const TALENT_FIELDS = [
  { id: "name", label: "Full Name", type: "text", placeholder: "Jordan Lee" },
  { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
  { id: "role", label: "Target Role", type: "text", placeholder: "Backend Developer" },
  { id: "experience", label: "Years of Experience", type: "text", placeholder: "5" },
];

const ENTERPRISE_FIELDS = [
  { id: "company", label: "Company Name", type: "text", placeholder: "Acme Inc." },
  { id: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
  { id: "headcount", label: "Roles to Fill", type: "text", placeholder: "3" },
  { id: "stack", label: "Primary Stack / Domain", type: "text", placeholder: "Platform, K8s" },
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
    blurb: "Tell us what you're hiring for and we'll route verified specialists directly.",
    fields: ENTERPRISE_FIELDS,
    messageLabel: "What are you hiring for?",
    messagePlaceholder: "Role scope, timeline, team context, etc.",
    cta: "Request Talent",
  },
};

type Props = {
  mode?: "talent" | "enterprise";
};

export default function ContactTerminal({ mode = "talent" }: Props) {
  const copy = COPY[mode];

  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col gap-4 md:max-w-2xl">
          <span className="flex items-center gap-2 text-sm font-medium tracking-widest text-white/60">
            Get In Touch
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            Start your intake.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-white/50">
            {mode === "talent"
              ? "Get verified and routed to companies actively hiring for your exact stack."
              : "Tell us what you need and we'll route pre-verified specialists to your team."}
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12"
        >
          {/* Context column */}
          <div className="flex flex-col gap-8 lg:col-span-4">
            <span className="flex w-fit items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white">
              {copy.tag}
            </span>

            <div className="flex flex-col gap-4">
              <span className="text-xs tracking-widest text-white/40 uppercase">
                {copy.eyebrow}
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-white/50">
                {copy.blurb}
              </p>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-8">
            <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {copy.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium tracking-widest text-white/60 uppercase"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium tracking-widest text-white/60 uppercase"
                >
                  {copy.messageLabel}
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder={copy.messagePlaceholder}
                  className="w-full resize-none border-b border-white/15 bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="group mt-2 flex w-fit items-center justify-center gap-2 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-md transition hover:bg-white/20 sm:col-span-2"
              >
                {copy.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
