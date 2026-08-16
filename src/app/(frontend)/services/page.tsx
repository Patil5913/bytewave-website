import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ContactTerminal from "@components/ContactTerminal";
import Reveal from "@components/Reveal";
import { getSiteSettingsContent } from "@/lib/content";
import { metadataFromSettings } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent();
  return metadataFromSettings(settings.seo, {
    title: "Services · find & hire",
    description:
      "Enterprise staffing, verification and payroll, plus placement, training and interview prep for professionals — and exactly what each one costs.",
    path: "/services",
  });
}

type Service = {
  id: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
};

const ENTERPRISE: Service[] = [
  {
    id: "01",
    title: "Technical Staffing",
    metric: "100%",
    metricLabel: "Full-time seats",
    description:
      "Permanent engineering and product roles filled from a pool that has already cleared a domain assessment. You review shortlists, not resume piles.",
  },
  {
    id: "02",
    title: "Talent Acquisition",
    metric: "End-to-end",
    metricLabel: "Funnel ownership",
    description:
      "For teams hiring at volume: role definition, sourcing, screening and scheduling run by us, so your panel only meets candidates worth their time.",
  },
  {
    id: "03",
    title: "Background Verification",
    metric: "Pre-intro",
    metricLabel: "Checks complete",
    description:
      "Employment history, education and references confirmed before a profile is routed, so an offer never unravels at the final step.",
  },
  {
    id: "04",
    title: "Payroll & Compliance",
    metric: "Multi-state",
    metricLabel: "Coverage",
    description:
      "Onboarding paperwork, worker classification and ongoing payroll handled for placed hires, including remote arrangements.",
  },
];

const TALENT: Service[] = [
  {
    id: "01",
    title: "Job Placement",
    metric: "$0",
    metricLabel: "Cost to you",
    description:
      "Get verified once, then get routed directly to teams hiring for your exact stack. No applications into the void, no recruiter spray.",
  },
  {
    id: "02",
    title: "IT Skills Training",
    metric: "Hands-on",
    metricLabel: "Per stack",
    description:
      "Training in the tools and workflows your target role actually uses, so nothing catches you off guard in the final rounds.",
  },
  {
    id: "03",
    title: "Resume & Interview Prep",
    metric: "1-on-1",
    metricLabel: "With operators",
    description:
      "A rebuilt resume and portfolio that clears automated filters, plus mock interviews with people who have worked the role.",
  },
];

const LINE_ITEMS = [
  {
    title: "Success fee",
    price: "On start date",
    description:
      "A single fee on the hire's first-year base salary, charged only once they actually start.",
  },
  {
    title: "Monthly retainer",
    price: "Flat rate",
    description:
      "For high-volume teams: continuous sourcing and screening instead of per-hire pricing.",
  },
  {
    title: "Replacement window",
    price: "90 days",
    description:
      "If the hire doesn't work out inside the window, we source a replacement at no extra fee.",
  },
  {
    title: "Candidate placement",
    price: "$0.00",
    description:
      "Verification, routing and placement are always free for professionals.",
  },
];

const TORN_TOP: React.CSSProperties = {
  maskImage: "radial-gradient(7px at 12px 3px, transparent 96%, black 100%)",
  maskSize: "24px 100%",
  maskRepeat: "repeat-x",
  WebkitMaskImage:
    "radial-gradient(7px at 12px 3px, transparent 96%, black 100%)",
  WebkitMaskSize: "24px 100%",
  WebkitMaskRepeat: "repeat-x",
};
const TORN_BOTTOM: React.CSSProperties = {
  maskImage: "radial-gradient(7px at 12px 9px, transparent 96%, black 100%)",
  maskSize: "24px 100%",
  maskRepeat: "repeat-x",
  WebkitMaskImage:
    "radial-gradient(7px at 12px 9px, transparent 96%, black 100%)",
  WebkitMaskSize: "24px 100%",
  WebkitMaskRepeat: "repeat-x",
};

function ServiceTrack({
  id,
  eyebrow,
  title,
  blurb,
  badge,
  items,
}: {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  badge: string;
  items: Service[];
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen w-full scroll-mt-24 flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex flex-col gap-6 lg:sticky lg:top-32 lg:col-span-4">
          <span className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
            {eyebrow}
          </span>
          <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
            {title}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/50">
            {blurb}
          </p>
          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.02] px-3 py-1.5 text-xs tracking-wider text-ink/50 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {badge}
          </span>
        </Reveal>

        <Reveal stagger={0.08} className="border-t border-ink/10 lg:col-span-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group grid grid-cols-1 gap-x-6 gap-y-4 border-b border-ink/10 py-8 md:grid-cols-12 md:items-start"
            >
              <div className="flex items-baseline gap-4 md:col-span-5">
                <span className="font-instrument text-lg text-ink/25 tabular-nums transition-colors duration-500 group-hover:text-ink/50">
                  {item.id}
                </span>
                <h3 className="font-instrument text-xl leading-tight font-medium text-ink lg:text-2xl">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-ink/50 md:col-span-4">
                {item.description}
              </p>

              <div className="flex items-baseline justify-between gap-2 md:col-span-3 md:flex-col md:items-end md:justify-start md:text-right">
                <span className="font-instrument text-2xl font-medium text-ink tabular-nums">
                  {item.metric}
                </span>
                <span className="text-[11px] tracking-wider text-ink/40 uppercase">
                  {item.metricLabel}
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export default async function Services() {
  const settings = await getSiteSettingsContent();

  return (
    <>
      <Navbar ctaLabel={settings.navCtaLabel} />

      {/* Header — no hero image, so the bar stays in its solid state. */}
      <section className="relative flex w-full flex-col justify-center overflow-hidden bg-canvas px-6 pt-36 pb-16 md:px-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-6 lg:col-span-7">
            <span className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
              Services
            </span>
            <h1 className="font-instrument text-5xl leading-[1.05] font-medium text-balance text-ink lg:text-7xl">
              Everything we run, and what it costs.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-ink/50">
              Two sides of one network: teams that need verified specialists,
              and specialists who would rather be routed than rejected.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="flex gap-10 lg:col-span-5 lg:justify-end"
          >
            {[
              { value: "07", label: "Services" },
              { value: "90d", label: "Guarantee" },
              { value: "$0", label: "Candidate cost" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-instrument text-3xl font-medium text-ink tabular-nums lg:text-4xl">
                  {stat.value}
                </span>
                <span className="text-[11px] tracking-wider text-ink/40 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <ServiceTrack
        id="enterprise"
        eyebrow="Enterprise Services"
        title="Hiring support that outlasts the offer."
        blurb="Sourcing, screening, verification and payroll run as one pipeline — your team touches the decision, not the admin."
        badge="For companies"
        items={ENTERPRISE}
      />

      <ServiceTrack
        id="talent"
        eyebrow="Talent Services"
        title="Verified once. Routed for good."
        blurb="Placement is free and always will be. Training and prep exist only to close a real gap between where you are and the offer you want."
        badge="For professionals"
        items={TALENT}
      />

      {/* Pricing — mirrors the hiring-statement receipt on /companies. */}
      <section
        id="pricing"
        className="relative flex min-h-screen w-full scroll-mt-24 flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col gap-6">
            <span className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
              Pricing
            </span>
            <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-6xl">
              You pay when it works.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-ink/50">
              No listing fees, no per-post charges, and nothing owed for a
              search that never ends in a hire.
            </p>
            <Link
              href="#intake"
              className="group mt-2 flex w-fit items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-canvas transition-colors hover:bg-ink/90"
            >
              Talk through your requirement
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal x={24} y={0}>
            <div className="ml-auto w-full max-w-md font-mono text-sm">
              <div aria-hidden className="h-3 bg-ink/[0.04]" style={TORN_TOP} />

              <div className="bg-ink/[0.04] px-7 py-6">
                <div className="flex items-center justify-between border-b border-dashed border-ink/20 pb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-base tracking-tight text-ink/70 lowercase">
                      find <span className="text-brand">&amp;</span> hire
                    </span>
                    <span className="text-[9px] tracking-normal whitespace-nowrap text-ink/35 lowercase">
                      a bytewave company
                    </span>
                  </div>
                  <span className="text-right text-[9px] tracking-[0.25em] text-ink/40 uppercase">
                    Rate Card
                  </span>
                </div>

                <div className="flex flex-col gap-4 py-6">
                  {LINE_ITEMS.map((item) => (
                    <div key={item.title} className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        <span className="text-ink/80">{item.title}</span>
                        <span className="mb-[5px] flex-1 border-b border-dotted border-ink/25" />
                        <span className="shrink-0 text-ink tabular-nums">
                          {item.price}
                        </span>
                      </div>
                      <p className="max-w-[40ch] font-sans text-xs leading-relaxed text-ink/45">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-ink/20 pt-5">
                  <span className="tracking-widest text-ink/50 uppercase">
                    Due today
                  </span>
                  <span className="font-instrument text-3xl font-medium text-brand tabular-nums">
                    $0.00
                  </span>
                </div>

                <p className="mt-5 text-center font-sans text-[11px] leading-relaxed text-ink/40">
                  — Nothing is billed until a hire starts —
                </p>
              </div>

              <div
                aria-hidden
                className="h-3 bg-ink/[0.04]"
                style={TORN_BOTTOM}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Referral */}
      <section
        id="referral"
        className="relative flex w-full scroll-mt-24 flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          <Reveal className="flex flex-col gap-8 border-t border-ink/10 pt-12 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-xl flex-col gap-5">
              <span className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
                Refer &amp; Earn
              </span>
              <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
                Know someone worth hiring?
              </h2>
              <p className="text-base leading-relaxed text-ink/50">
                Refer a professional or a hiring team and the payout lands once
                the placement clears its 90-day window. Tell us who you have in
                mind and we&apos;ll send your link.
              </p>
            </div>
            <Link
              href="#intake"
              className="group flex w-fit shrink-0 items-center gap-2 bg-ink/10 px-6 py-3 text-sm text-ink backdrop-blur-md transition-colors hover:bg-ink/20"
            >
              Request your referral link
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <ContactTerminal mode="enterprise" />
      <Footer settings={settings} />
    </>
  );
}
