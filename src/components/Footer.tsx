"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import PixelBackdrop from "@components/PixelBackdrop";
import Reveal from "@components/Reveal";

const LINK_GROUPS = [
	{
		title: "Product",
		links: [
			{ label: "For Companies", href: "/companies" },
			{ label: "For Professionals", href: "/professionals" },
			{ label: "Pricing", href: "/pricing" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "/about" },
			{ label: "Insights", href: "/insights" },
			{ label: "Careers", href: "/careers" },
			{ label: "Refer & Earn", href: "/refer" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Help Center", href: "/help" },
			{ label: "Case Studies", href: "/case-studies" },
			{ label: "API Docs", href: "/docs" },
		],
	},
	{
		title: "Talent",
		links: [
			{ label: "Job Placement", href: "/placement" },
			{ label: "IT Skills Training", href: "/training" },
			{ label: "Resume & Interview Prep", href: "/prep" },
		],
	},
	{
		title: "Enterprise",
		links: [
			{ label: "Technical Staffing", href: "/staffing" },
			{ label: "Talent Acquisition", href: "/acquisition" },
			{ label: "Background Verification", href: "/verification" },
			{ label: "Payroll & Compliance", href: "/payroll" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Privacy Policy", href: "/privacy" },
			{ label: "Terms of Service", href: "/terms" },
			{ label: "Refund Policy", href: "/refunds" },
		],
	},
];

export default function Footer() {
	return (
		<footer className="relative w-full overflow-hidden bg-black px-6 pt-24 pb-8 md:px-16">
			<PixelBackdrop variant="grid" className="absolute inset-0 z-0" intensity={0.6} />
			<div className="relative z-10 mx-auto max-w-7xl">
				<Reveal className="flex flex-col gap-16 md:flex-row md:justify-between">
					<div className="flex flex-col gap-4">
						<Link
							href="/"
							className="group flex w-fit items-end gap-1 font-instrument text-2xl font-bold text-brand transition-transform duration-200 hover:scale-105 hover:text-brand/80 active:scale-95"
						>
							find &amp; hire
							<span
								aria-hidden
								className="mb-1.5 h-0.5 w-2.5 animate-blink bg-brand backdrop-blur-md"
							/>
						</Link>
						<p className="max-w-xs text-sm leading-relaxed text-white/40">
							Connecting verified professionals with the teams that need them.
						</p>
						<p className="text-xs text-white/30">
							find &amp; hire is the trading name of Bytewave, Inc.
						</p>
						<address className="max-w-xs text-sm leading-relaxed text-white/40 not-italic">
							548 Market St, Suite 95000
							<br />
							San Francisco, CA 94104
						</address>
						<div className="mt-2 flex items-center gap-6 text-xs text-white/40">
							<Link href="#" className="transition-colors hover:text-white">
								Twitter
							</Link>
							<Link href="#" className="transition-colors hover:text-white">
								LinkedIn
							</Link>
							<Link href="#" className="transition-colors hover:text-white">
								Instagram
							</Link>
						</div>

						<div className="mt-4 flex max-w-xs flex-col gap-3">
							<span className="text-xs font-medium tracking-widest text-white/50 uppercase">
								Newsletter
							</span>
							<form className="flex items-center border-b border-white/20 focus-within:border-white/50">
								<input
									type="email"
									placeholder="you@company.com"
									className="w-full bg-transparent py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
								/>
								<button
									type="submit"
									aria-label="Subscribe"
									className="text-white/60 transition-colors hover:text-white"
								>
									<ArrowRight className="h-4 w-4" />
								</button>
							</form>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
						{LINK_GROUPS.map((group) => (
							<div key={group.title} className="flex flex-col gap-4">
								<span className="text-xs font-medium tracking-widest text-white/50 uppercase">
									{group.title}
								</span>
								<div className="flex flex-col gap-3">
									{group.links.map((link) => (
										<Link
											key={link.label}
											href={link.href}
											className="text-sm text-white/60 transition-colors hover:text-white"
										>
											{link.label}
										</Link>
									))}
								</div>
							</div>
						))}

						<div className="flex flex-col gap-4">
							<span className="text-xs font-medium tracking-widest text-white/50 uppercase">
								Status
							</span>
							<span className="flex items-center gap-2 text-sm text-white/60">
								<span className="relative flex h-1.5 w-1.5">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
									<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
								</span>
								All systems operational
							</span>
						</div>

						<div className="flex flex-col gap-4">
							<span className="text-xs font-medium tracking-widest text-white/50 uppercase">
								Region
							</span>
							<span className="flex items-center gap-2 text-sm text-white/60">
								<Globe className="h-4 w-4" />
								English (US)
							</span>
						</div>
					</div>
				</Reveal>

				<div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center">
					<span>© 2026 find &amp; hire, a Bytewave company. All rights reserved.</span>
					<a
						href="https://rudr.me"
						target="_blank"
						rel="noopener noreferrer"
						className="lowercase"
					>
						crafted by{" "}
						<span className="text-white transition-colors hover:text-white/70">
							rudr
						</span>
					</a>
				</div>
			</div>
		</footer>
	);
}
