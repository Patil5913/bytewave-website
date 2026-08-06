"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@components/Reveal";

const COMPANIES = [
  { name: "Amazon", domain: "amazon.com" },
  { name: "Stripe", domain: "stripe.com" },
  { name: "Modal", domain: "modal.com" },
  { name: "Snowflake", domain: "snowflake.com" },
  { name: "Notion", domain: "notion.so" },
  { name: "Cal.com", domain: "cal.com" },
  { name: "Linear", domain: "linear.app" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "Resend", domain: "resend.com" },
  { name: "Figma", domain: "figma.com" },
  { name: "Highlight", domain: "highlight.io" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Vercel", domain: "vercel.com" },
  { name: "Trigger.dev", domain: "trigger.dev" },
  { name: "Ramp", domain: "ramp.com" },
  { name: "Neon", domain: "neon.tech" },
  { name: "Airtable", domain: "airtable.com" },
  { name: "Braintrust", domain: "braintrust.dev" },
  { name: "Retool", domain: "retool.com" },
];

export default function EnterpriseHero() {
  return (
    <section
      data-hero
      className="relative flex min-h-svh w-full flex-col overflow-hidden"
    >
      <Image
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
        alt="Enterprise hero background"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover saturate-125 contrast-105"
      />
      <div className="absolute inset-0 bg-black/60" />
      <Reveal
        scroll={false}
        stagger={0.15}
        delay={0.2}
        y={20}
        className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 pt-28 pb-8 sm:gap-6 sm:pt-32"
      >
        <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          Now live: verified hiring, no noise
        </span>

        <h1 className="max-w-4xl text-center font-instrument text-4xl font-medium text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-8xl">
          Skip the pipeline. Hire the person.
        </h1>

        <h2 className="max-w-2xl text-center text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-base lg:text-lg">
          Stop sifting through hundreds of unqualified applications. Bytewave
          routes pre-verified specialists straight to your team, matched against
          the exact stack and seniority you need.
        </h2>

        <div className="mt-2 flex w-full max-w-xs flex-col items-center gap-3 text-sm sm:w-auto sm:max-w-none sm:flex-row sm:gap-4 sm:text-base">
          <a
            href="#"
            className="group flex w-full items-center justify-center gap-2 bg-white/10 px-4 py-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:w-auto sm:py-1.5"
          >
            Start Hiring
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#"
            className="border-b border-white/60 pb-1 text-white transition-colors duration-300 hover:border-white/20 hover:text-white/70"
          >
            See How It Works
          </a>
        </div>
      </Reveal>

      <Reveal
        scroll={false}
        delay={0.8}
        y={20}
        className="relative z-10 flex w-full flex-col items-center justify-center gap-2 pb-8 sm:pb-12"
      >
        <p className="px-6 text-center text-xs font-medium text-white/70 sm:text-sm lg:text-base">
          Trusted by teams of every size to fill their hardest roles
        </p>
        <div className="marquee-fade w-full sm:w-3/4">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
              {COMPANIES.concat(COMPANIES).map((company, i) => (
                <span
                  key={i}
                  className="group flex items-center gap-2.5 text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
                >
                  <img
                    src={`https://img.logo.dev/${company.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&size=40&format=png&theme=dark`}
                    alt={company.name}
                    className="h-5 w-5 shrink-0 object-contain opacity-70 grayscale transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
