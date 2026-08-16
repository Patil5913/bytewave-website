"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center">
      {/* blueprint grid — same language as the 404 page */}
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

      <span
        aria-hidden
        className="pointer-events-none absolute font-instrument text-[42vw] leading-none font-medium text-ink/[0.035] select-none sm:text-[34vw]"
      >
        500
      </span>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="text-xs tracking-widest text-ink/50 uppercase">
          Error <span className="text-brand">{"//"}</span> 500
        </span>

        <h1 className="font-instrument text-6xl leading-none font-medium text-ink sm:text-7xl">
          Something broke.
        </h1>

        <p className="max-w-md text-base leading-relaxed text-ink/55">
          This one is on us. Try again — if it keeps happening, tell us and
          we&apos;ll dig in.
        </p>

        {error.digest && (
          <p className="text-sm text-ink/35">
            Reference <span className="text-ink/55">{error.digest}</span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={reset}
            className="bg-ink px-6 py-2.5 font-medium text-canvas transition-colors hover:bg-ink/90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-ink/10 px-6 py-2.5 text-ink backdrop-blur-md transition-colors hover:bg-ink/20"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
