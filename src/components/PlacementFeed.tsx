"use client";

import Reveal from "@components/Reveal";

const STATUS_COLORS: Record<string, string> = {
  Placed: "bg-brand",
  Interviewing: "bg-amber-400",
  Offer: "bg-sky-400",
  Negotiating: "bg-violet-400",
};

type PlacementItem = {
  role: string;
  stack: string;
  candidate: string;
  company: string;
  companyName: string;
  location: string;
  pay: string;
  status: string;
};

export default function PlacementFeed({ items }: { items: PlacementItem[] }) {
  const PLACEMENTS = items;
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-canvas px-5 py-16 sm:px-6 md:px-16 md:py-24">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-8 flex md:mb-12 max-sm:mb-8 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-instrument text-3xl sm:text-4xl leading-tight font-medium text-balance text-ink lg:text-5xl">
            Recent placements.
          </h2>
          <span className="text-xs tracking-wider text-ink/65 uppercase">
            {PLACEMENTS.length} of 1,240+ this year
          </span>
        </div>

        <Reveal stagger={0.08} y={20} className="border-t border-ink/10">
          {PLACEMENTS.map((item) => (
            <div
              key={item.candidate}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-4 border-b border-ink/10 py-6 sm:gap-x-6 lg:grid-cols-12 lg:items-baseline lg:py-8"
            >
              <div className="col-start-1 row-start-1 flex min-w-0 flex-col gap-2 lg:col-span-5">
                <h3 className="font-instrument text-xl leading-tight font-medium text-ink sm:text-2xl lg:text-3xl">
                  {item.role}
                </h3>
                <p className="text-xs text-ink/60">{item.stack}</p>
              </div>

              <div className="col-span-2 row-start-2 flex min-w-0 flex-col gap-1 lg:col-span-4 lg:col-start-auto lg:row-start-1">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-ink/70">
                  <span className="min-w-0 truncate">{item.candidate}</span>
                  <span className="shrink-0 text-ink/55">→</span>
                  <img
                    src={`https://img.logo.dev/${item.company}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&size=40&format=png&theme=dark`}
                    alt={item.companyName}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-4 w-4 shrink-0 object-contain opacity-80"
                  />
                  <span className="min-w-0 truncate text-ink">
                    {item.companyName}
                  </span>
                </div>
                <span className="text-xs text-ink/60">{item.location}</span>
              </div>

              <div className="col-start-2 row-start-1 flex items-start justify-end lg:col-span-3 lg:col-start-auto lg:items-center lg:justify-end">
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-instrument text-lg tabular-nums whitespace-nowrap text-ink sm:text-xl lg:text-2xl">
                    {item.pay}
                  </span>
                  <span className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-widest text-ink/60 uppercase">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_COLORS[item.status]}`}
                    />
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
