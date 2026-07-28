"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import Reveal from "@components/Reveal";
import { SITE_SETTINGS } from "@/lib/siteContent";

export default function Footer({
	settings = SITE_SETTINGS,
}: {
	settings?: typeof SITE_SETTINGS;
}) {
	const LINK_GROUPS = settings.footerGroups;
	return (
		<footer className="relative w-full overflow-hidden bg-canvas px-6 pt-24 pb-8 md:px-16">
			<div className="relative z-10 mx-auto max-w-7xl">
				<Reveal className="flex flex-col gap-16 md:flex-row md:justify-between">
					<div className="flex flex-col gap-4">
						<Link
							href="/"
							className="group w-fit font-instrument text-2xl font-normal text-ink"
						>
							<span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-1.5">
								find
							</span>{" "}
							<span className="inline-block text-brand transition-transform duration-300 ease-out group-hover:rotate-90">
								&amp;
							</span>{" "}
							<span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5">
								hire
							</span>
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
						<div className="mt-2 flex items-center gap-6 text-xs text-ink/60">
							{settings.socials.map((s) => (
								<Link
									key={s.label}
									href={s.href}
									className="transition-colors hover:text-ink"
								>
									{s.label}
								</Link>
							))}
						</div>

						<div className="mt-4 flex max-w-xs flex-col gap-3">
							<span className="text-sm font-medium tracking-widest text-ink/60 uppercase">
								Newsletter
							</span>
							<form className="flex items-center border-b border-ink/20 focus-within:border-ink/50">
								<input
									type="email"
									placeholder="you@company.com"
									className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-ink/30 focus:outline-none"
								/>
								<button
									type="submit"
									aria-label="Subscribe"
									className="text-ink/60 transition-colors hover:text-ink"
								>
									<ArrowRight className="h-4 w-4" />
								</button>
							</form>
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
								English (US)
							</span>
						</div>
					</div>
				</Reveal>

				<div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 text-xs text-ink/55 sm:flex-row sm:items-center">
					<span>© 2026 find &amp; hire, a Bytewave company. All rights reserved.</span>
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
