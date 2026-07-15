"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const STATUS_COLORS: Record<string, string> = {
  Placed: "bg-emerald-400",
  Interviewing: "bg-amber-400",
  Offer: "bg-sky-400",
  Negotiating: "bg-violet-400",
};

const PLACEMENTS = [
  {
    role: "Backend Developer",
    stack: "Python, FastAPI, SQLAlchemy",
    candidate: "M. Davis",
    company: "stripe.com",
    companyName: "Stripe",
    location: "New York, NY",
    pay: "$165k Base",
    status: "Placed",
  },
  {
    role: "Product Designer",
    stack: "Figma, Design Systems",
    candidate: "A. Chen",
    company: "notion.so",
    companyName: "Notion",
    location: "Remote",
    pay: "$140k Base",
    status: "Offer",
  },
  {
    role: "Frontend Engineer",
    stack: "React, TypeScript, Next.js",
    candidate: "J. Okafor",
    company: "linear.app",
    companyName: "Linear",
    location: "San Francisco, CA",
    pay: "$155k Base",
    status: "Interviewing",
  },
  {
    role: "Data Analyst",
    stack: "SQL, Python, Looker",
    candidate: "R. Patel",
    company: "figma.com",
    companyName: "Figma",
    location: "Austin, TX",
    pay: "$120k Base",
    status: "Placed",
  },
  {
    role: "DevOps Engineer",
    stack: "Kubernetes, Terraform, AWS",
    candidate: "S. Kim",
    company: "vercel.com",
    companyName: "Vercel",
    location: "Seattle, WA",
    pay: "$175k Base",
    status: "Negotiating",
  },
];

export default function PlacementFeed() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <span className="mb-12 flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
          <span className="text-emerald-400">[ 04 ]</span>
          Recent Placements
        </span>

        <div className="border-t border-white/10">
          {PLACEMENTS.map((item, i) => (
            <motion.div
              key={item.candidate}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="group -mx-4 grid grid-cols-2 gap-4 border-b border-white/10 px-4 py-6 transition-colors hover:bg-white/[0.03] md:grid-cols-12"
            >
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${STATUS_COLORS[item.status]}`}
                  />
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${STATUS_COLORS[item.status]}`}
                  />
                </span>
                <span className="text-xs tracking-widest text-white/60">
                  {item.status}
                </span>
              </div>

              <div className="col-span-2 flex flex-col justify-center md:col-span-3">
                <span className="font-medium text-white/80 transition-colors group-hover:text-white">
                  {item.role}
                </span>
                <span className="mt-1 text-xs text-white/40">
                  {item.stack}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-white/60 md:col-span-3">
                <span className="w-20 shrink-0 truncate text-right">{item.candidate}</span>
                <span className="shrink-0 text-white/30">→</span>
                <img
                  src={`https://img.logo.dev/${item.company}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&size=40&format=png&theme=dark`}
                  alt={item.companyName}
                  className="h-4 w-4 shrink-0 object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="truncate">{item.companyName}</span>
              </div>

              <div className="flex items-center text-xs text-white/40 md:col-span-2">
                {item.location}
              </div>

              <div className="flex items-center text-sm text-white/70 md:col-span-2 md:justify-end">
                {item.pay}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
