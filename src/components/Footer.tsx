"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

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
		title: "Community",
		links: [
			{ label: "Discord", href: "/discord" },
			{ label: "Events", href: "/events" },
			{ label: "Partners", href: "/partners" },
		],
	},
	{
		title: "Support",
		links: [
			{ label: "Contact Us", href: "/contact" },
			{ label: "System Status", href: "/status" },
			{ label: "Report a Bug", href: "/bug-report" },
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
		<footer className="w-full bg-black px-6 pt-24 pb-8 md:px-16">
			<div className="mx-auto max-w-7xl">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeUp}
					className="flex flex-col gap-16 md:flex-row md:justify-between"
				>
					<div className="flex flex-col gap-4">
						<span className="text-lg font-archivo font-bold text-white/70 uppercase tracking-tighter">
							BW_
						</span>
						<p className="max-w-xs text-sm leading-relaxed text-white/40">
							Connecting verified professionals with the teams that need them.
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
				</motion.div>

				<div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center">
					<span>© 2026 Bytewave. All rights reserved.</span>
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
