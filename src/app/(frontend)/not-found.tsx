import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center">
      {/* blueprint grid — same language as the on-site charts */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(247,246,243,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(247,246,243,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 45%, #000 30%, transparent 78%)",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 45%, #000 30%, transparent 78%)",
        }}
      />

      {/* ghost numeral — echoes the section numerals across the site */}
      <span
        aria-hidden
        className="pointer-events-none absolute font-instrument text-[42vw] leading-none font-medium text-ink/[0.035] select-none sm:text-[34vw]"
      >
        404
      </span>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="text-xs tracking-widest text-ink/50 uppercase">
          Error <span className="text-brand">//</span> 404
        </span>

        <h1 className="font-instrument text-6xl leading-none font-medium text-ink sm:text-7xl">
          No match found.
        </h1>

        <p className="max-w-md text-base leading-relaxed text-ink/55">
          We couldn&apos;t source this page. Let&apos;s get you back to the
          search.
        </p>

        {/* terminal path line with the site's blinking brand caret */}
        <p className="flex items-center gap-2 text-sm text-ink/40">
          <span className="text-ink/30">~/</span>
          0 results
          <span
            aria-hidden
            className="inline-block h-[2px] w-2.5 bg-brand animate-[blink_1.1s_steps(1,end)_infinite]"
          />
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            className="bg-ink px-6 py-2.5 font-medium text-canvas transition-colors hover:bg-ink/90"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="bg-ink/10 px-6 py-2.5 text-ink backdrop-blur-md transition-colors hover:bg-ink/20"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
