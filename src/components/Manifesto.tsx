"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BadgeCheck, Building2, Check, MapPin } from "lucide-react";
import Reveal from "@components/Reveal";
import { HOMEPAGE } from "@/lib/siteContent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type View = "candidate" | "enterprise";

const SKILLS = [
  { name: "React", verified: true },
  { name: "TypeScript", verified: true },
  { name: "System Design", verified: true },
  { name: "Node.js", verified: true },
  { name: "GraphQL", verified: false },
];
const OVERALL = 93;

const ROLES = [
  {
    role: "Senior Backend",
    verified: 18,
    status: "Shortlist",
    tone: "text-brand",
  },
  {
    role: "Product Designer",
    verified: 12,
    status: "Interviewing",
    tone: "text-amber-400",
  },
  {
    role: "DevOps Lead",
    verified: 9,
    status: "Screening",
    tone: "text-sky-400",
  },
];
const FILLED = 92;

function CandidateBody() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="rise flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 font-medium text-brand">
              JR
            </div>
            <BadgeCheck className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-canvas text-brand" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-ink">Jordan Rivera</span>
            <span className="text-sm text-ink/50">
              Senior Frontend Engineer
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-ink/40">
              <MapPin className="h-3 w-3" />
              Remote · San Francisco
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-instrument text-3xl leading-none font-medium text-brand">
            <span className="score-num">{OVERALL}</span>%
          </div>
          <div className="mt-1 text-xs text-ink/40">match</div>
        </div>
      </div>

      <div className="rise flex flex-col gap-2">
        <span className="text-xs tracking-wider text-ink/40 uppercase">
          Verified skills
        </span>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span
              key={s.name}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                s.verified
                  ? "border-brand/30 bg-brand/10 text-brand"
                  : "border-ink/10 text-ink/50"
              }`}
            >
              {s.verified && <Check className="h-3 w-3" />}
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <div className="rise flex flex-col gap-2">
        <span className="text-xs tracking-wider text-ink/40 uppercase">
          Recent experience
        </span>
        <div className="flex flex-col divide-y divide-ink/5 rounded-lg border border-ink/10">
          {[
            { c: "Stripe", r: "Senior Frontend Engineer", y: "2021 — 24" },
            { c: "Airbnb", r: "Frontend Engineer", y: "2018 — 21" },
          ].map((e) => (
            <div
              key={e.c}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex flex-col">
                <span className="text-sm text-ink/90">{e.r}</span>
                <span className="text-xs text-ink/40">{e.c}</span>
              </div>
              <span className="text-xs text-ink/40">{e.y}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rise grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
        {[
          { k: "Experience", v: "8 yrs" },
          { k: "Notice", v: "2 weeks" },
          { k: "Target", v: "$180k" },
        ].map((f) => (
          <div key={f.k} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">{f.v}</span>
            <span className="text-xs text-ink/40">{f.k}</span>
          </div>
        ))}
      </div>

      <div className="rise flex items-center gap-3">
        <button className="group flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-canvas transition-colors hover:bg-ink/90">
          Request intro
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-ink/5">
          View profile
        </button>
      </div>
    </div>
  );
}

function EnterpriseBody() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="rise flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink/10 text-ink">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-ink">Northwind Labs</span>
            <span className="text-sm text-ink/50">Series B · 6 open roles</span>
            <span className="mt-0.5 text-xs text-ink/40">
              Avg. time-to-hire 14 days
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-instrument text-3xl leading-none font-medium text-ink">
            <span className="score-num">{FILLED}</span>%
          </div>
          <div className="mt-1 text-xs text-ink/40">roles filled</div>
        </div>
      </div>

      <div className="rise flex flex-col gap-2">
        <span className="text-xs tracking-wider text-ink/40 uppercase">
          Open roles
        </span>
        <div className="flex flex-col divide-y divide-ink/5 rounded-lg border border-ink/10">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex flex-col">
                <span className="text-sm text-ink/90">{r.role}</span>
                <span className="text-xs text-ink/40">
                  {r.verified} verified candidates
                </span>
              </div>
              <span className={`text-xs font-medium ${r.tone}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rise flex flex-col gap-2">
        <span className="text-xs tracking-wider text-ink/40 uppercase">
          Skills in demand
        </span>
        <div className="flex flex-wrap gap-2">
          {["React", "Go", "Kubernetes", "Rust", "ML"].map((s) => (
            <span
              key={s}
              className="rounded-full border border-ink/10 px-2.5 py-1 text-xs text-ink/60"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="rise grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
        {[
          { k: "Time-to-hire", v: "14 d" },
          { k: "Offer accept", v: "89%" },
          { k: "Avg tenure", v: "3.1 y" },
        ].map((f) => (
          <div key={f.k} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">{f.v}</span>
            <span className="text-xs text-ink/40">{f.k}</span>
          </div>
        ))}
      </div>

      <div className="rise flex items-center gap-3">
        <button className="group flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-canvas transition-colors hover:bg-ink/90">
          Review shortlist
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-ink/5">
          Post a role
        </button>
      </div>
    </div>
  );
}

function MatchWindow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("candidate");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setView((v) => (v === "candidate" ? "enterprise" : "candidate"));
    }, 4800);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scoreEl = root.querySelector<HTMLElement>(".score-num");
        const target = view === "candidate" ? OVERALL : FILLED;
        const proxy = { val: 0 };

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".view-content .rise", {
          opacity: 0,
          y: 12,
          duration: 0.45,
          stagger: 0.06,
        });
        if (scoreEl) {
          scoreEl.textContent = "0";
          tl.to(
            proxy,
            {
              val: target,
              duration: 0.8,
              ease: "power2.out",
              onUpdate: () => {
                scoreEl.textContent = Math.round(proxy.val).toString();
              },
            },
            0.05,
          );
        }
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [view] },
  );

  const tab = (v: View, label: string) => (
    <button
      onClick={() => setView(v)}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        view === v ? "bg-ink/10 text-ink" : "text-ink/40 hover:text-ink/70"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-ink/10 bg-ink/[0.04] p-1.5 backdrop-blur-sm"
    >
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-canvas/50">
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-ink/[0.02] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-1 rounded-full bg-canvas/40 p-0.5">
            {tab("candidate", "Professional")}
            {tab("enterprise", "Company")}
          </div>
        </div>

        <div key={view} className="view-content min-h-[520px]">
          {view === "candidate" ? <CandidateBody /> : <EnterpriseBody />}
        </div>
      </div>
    </div>
  );
}

export default function Manifesto({
  content = HOMEPAGE,
}: {
  content?: typeof HOMEPAGE;
}) {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="flex flex-col gap-6 md:col-span-6">
            <h2 className="font-instrument text-4xl leading-tight font-medium text-balance text-ink lg:text-5xl xl:text-6xl">
              {content.manifestoHeadline}
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-ink/70 md:text-lg">
              {content.manifestoBody}
            </p>
          </Reveal>

          <Reveal className="md:col-span-6">
            <MatchWindow />
          </Reveal>
        </div>

        <Reveal className="grid grid-cols-1 gap-8 border-t border-ink/10 pt-8 sm:grid-cols-2 md:gap-16">
          {content.manifestoPoints.map((point, i) => (
            <div key={i}>
              <h4 className="mb-2 text-sm font-medium tracking-wider text-ink uppercase">
                {String(i + 1).padStart(2, "0")}. {point.title}
              </h4>
              <p className="text-sm leading-snug text-ink/70">{point.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
