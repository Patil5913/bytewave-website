import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh w-full flex-col md:flex-row">
      <div className="relative h-64 w-full md:h-auto md:w-1/2">
        <Image
          src="https://images.pexels.com/photos/13599309/pexels-photo-13599309.jpeg"
          alt=""
          fill
          quality={85}
          sizes="50vw"
          className="object-cover saturate-125 contrast-105"
        />
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-6 px-6 py-16 text-center md:w-1/2 md:px-16">
        <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
          <span className="text-emerald-400">[ 404 ]</span>
          Page Not Found
        </span>

        <h1 className="font-instrument text-6xl leading-none font-medium text-white sm:text-7xl">
          Lost the thread.
        </h1>

        <p className="max-w-md text-base text-white/50">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            className="bg-white px-6 py-2.5 font-medium text-black transition-colors hover:bg-white/90"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="bg-white/10 px-6 py-2.5 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
