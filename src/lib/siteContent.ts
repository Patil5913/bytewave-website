// Default site content — the single source of truth used three ways:
//  1. component defaults (so the site renders with zero CMS data),
//  2. CMS fallbacks in content.ts,
//  3. seed data (bun src/seed.ts) to populate Payload initially.
// Plain data only (no React) so it's safe to import anywhere, incl. the seed.

export const HOMEPAGE = {
  heroBadge: "Now live: verified hiring, no noise",
  heroHeadline: "The frictionless way to hire and get hired.",
  heroSub:
    "Skip the endless resume reviews and generic job boards. We connect verified candidates directly with companies actively looking for their exact skills.",
  heroPrimaryLabel: "Advance Your Career",
  heroPrimaryHref: "/professionals",
  heroSecondaryLabel: "Build Your Team",
  heroSecondaryHref: "/companies",
  heroMarqueeNote: "Compatible with your existing hiring stack",

  manifestoHeadline:
    "The traditional hiring loop is broken. We built a better mechanism.",
  manifestoBody:
    "Most staffing agencies rely on keyword matching and endless resume piles, frustrating companies and candidates alike. We see hiring as a matching problem — connecting real needs directly with a network of verified professionals, cutting out the noise.",
  manifestoPoints: [
    {
      title: "No Guesswork",
      body: "Every match is backed by verified skills, not a keyword-stuffed resume.",
    },
    {
      title: "Straight to the Point",
      body: "Skip the application black hole and talk directly to the people making the hire.",
    },
  ],

  // Wrap the brand name in **double asterisks** to brand-colour it.
  agentParagraphs: [
    {
      text: "Hiring still runs on noise. Job boards bury you under 400 applicants, recruiters push roles that never fit, and by the time the right opening surfaces, it’s already gone.",
    },
    {
      text: "**find & hire** works differently. We verify every professional, learn what teams actually need, and connect the two directly — so the right match happens in days, not months.",
    },
  ],

  storyPanels: [
    {
      eyebrow: "The Shift",
      line1: "The résumé pile is where",
      line2: "good people disappear.",
      detail:
        "The average role draws 400+ applicants. Great candidates get buried under keywords, and teams settle for whoever surfaces first.",
    },
    {
      eyebrow: "",
      line1: "We replaced it with",
      line2: "**proof** you can trust.",
      detail:
        "Every professional is skill-verified before they enter the network — so what you see is demonstrated ability, not a self-reported list.",
    },
    {
      eyebrow: "",
      line1: "Real talent, matched",
      line2: "directly to real needs.",
      detail:
        "We connect verified people to the teams actively hiring for their exact strengths. Intros happen direct, and offers close in days.",
    },
  ],

  ctaHeadline: "Hiring for **scale**? Let’s talk.",
  ctaBody:
    "Whether you’re scaling your workforce or advancing your career, connect with us to bypass the noise and find your exact match.",
  ctaResponseNote: "Avg. response under 4 hours",
};

export const SITE_SETTINGS = {
  tagline: "Connecting verified professionals with the teams that need them.",
  legalLine: "find & hire is the trading name of Bytewave, Inc.",
  address: "548 Market St, Suite 95000\nSan Francisco, CA 94104",
  navCtaLabel: "Get Started",
  region: "English (US)",
  footerGroups: [
    { title: "Product", links: [ { label: "For Companies", href: "/companies" }, { label: "For Professionals", href: "/professionals" }, { label: "Pricing", href: "/pricing" } ] },
    { title: "Company", links: [ { label: "About", href: "/about" }, { label: "Insights", href: "/insights" }, { label: "Careers", href: "/careers" }, { label: "Refer & Earn", href: "/refer" } ] },
    { title: "Resources", links: [ { label: "Help Center", href: "/help" }, { label: "Case Studies", href: "/case-studies" }, { label: "API Docs", href: "/docs" } ] },
    { title: "Talent", links: [ { label: "Job Placement", href: "/placement" }, { label: "IT Skills Training", href: "/training" }, { label: "Resume & Interview Prep", href: "/prep" } ] },
    { title: "Enterprise", links: [ { label: "Technical Staffing", href: "/staffing" }, { label: "Talent Acquisition", href: "/acquisition" }, { label: "Background Verification", href: "/verification" }, { label: "Payroll & Compliance", href: "/payroll" } ] },
    { title: "Legal", links: [ { label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Refund Policy", href: "/refunds" } ] },
  ],
  socials: [
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],
};

export const FAQS_COMPANIES = [
  { question: "How is a candidate verified before we see them?", answer: "Every specialist completes a domain-specific assessment and a strategy call before we ever route them. You only see profiles that have already cleared our bar." },
  { question: "What does it cost to hire through Bytewave?", answer: "A single success fee on the hire's first-year base salary, billed only once they start. High-volume teams can move to a flat monthly retainer instead. No job board fees, no per-post charges." },
  { question: "Do you place contractors or only full-time roles?", answer: "Permanent, full-time roles only. We're built for teams making long-term hires, not staffing short-term gaps." },
  { question: "What happens if a hire doesn't work out?", answer: "Every placement includes a 90-day replacement window. If it's not the right fit, we source a replacement at no additional cost." },
  { question: "How fast can you fill a role?", answer: "Because candidates are pre-verified, most roles receive a first qualified introduction within a few business days, with an average time-to-hire of 12 days." },
];

export const FAQS_PROFESSIONALS = [
  { question: "How does verification work?", answer: "We replace keyword screening with peer-level validation. You complete a domain-specific assessment and a strategy call, so your capabilities are proven before any company ever sees your profile." },
  { question: "Does it cost anything for professionals?", answer: "No. Bytewave is free for verified professionals. Our partner organizations cover the cost of placement — you keep 100% of your negotiated compensation." },
  { question: "What kind of roles do you place?", answer: "Permanent, full-time roles only. We don't dilute your options with short-term contract work — every match is a stable position with a verified organization actively hiring for your exact stack." },
  { question: "How are my details routed to companies?", answer: "We bypass public job boards entirely. Your optimized profile is routed directly to the decision-makers who need your skills — never scraped, listed, or shared without your explicit approval." },
  { question: "How fast is placement?", answer: "Because you're matched against roles that are already open and waiting, most verified professionals receive their first direct introduction within 48 to 72 hours of completing verification." },
];

export const CERTIFICATIONS = [
  { code: "ISO 9001", ref: "QMS-9001", year: "2026", label: "Quality Management", description: "Aligned with global quality standards for consistent, reliable workforce solutions.", logoName: "iso" },
  { code: "ISO 27001", ref: "ISMS-27001", year: "2026", label: "Information Security", description: "Advanced data security and strict protection across every system we run.", logoName: "iso" },
  { code: "GDPR", ref: "EU-2016/679", year: "2026", label: "Data Privacy", description: "Transparent, privacy-first handling of candidate and client data end to end.", logoName: "gdpr" },
  { code: "E-Verify", ref: "US-DHS", year: "2023", label: "Employment Eligibility", description: "Compliant with U.S. employment standards for a fully verified workforce.", logoName: "e-verify" },
];

export const TESTIMONIAL_QUOTES = [
  { name: "Priya N.", title: "VP Engineering", company: "Stripe", domain: "stripe.com", quote: "We filled a platform lead role in under two weeks, with a candidate who was already screened to our exact bar.", row: "one" },
  { name: "Tom R.", title: "Head of Talent", company: "Notion", domain: "notion.so", quote: "The screening quality meant every interview we ran actually went somewhere. No more wasted loops.", row: "one" },
  { name: "Alicia F.", title: "COO", company: "Vercel", domain: "vercel.com", quote: "Bytewave handled the entire back office. We just met candidates and made decisions.", row: "one" },
  { name: "Derek M.", title: "Engineering Manager", company: "Figma", domain: "figma.com", quote: "Every profile that reached us was a real fit. That never happened with job boards.", row: "one" },
  { name: "Nina W.", title: "Director of Operations", company: "Linear", domain: "linear.app", quote: "The replacement guarantee gave us the confidence to move fast on a critical hire.", row: "one" },
  { name: "Marcus B.", title: "CTO", company: "Ramp", domain: "ramp.com", quote: "We closed three senior backend seats in a month — each one pre-vetted to a standard our own loops rarely hit.", row: "two" },
  { name: "Sofia L.", title: "Head of People", company: "Retool", domain: "retool.com", quote: "Fast, precise, and genuinely low-effort on our side. The shortlist just showed up ready.", row: "two" },
  { name: "Ken A.", title: "VP Product", company: "Airtable", domain: "airtable.com", quote: "Every candidate came context-ready. Interviews turned into decisions, not screening.", row: "two" },
  { name: "Dara O.", title: "Founder", company: "Neon", domain: "neon.tech", quote: "We hired our first two platform engineers here before our own pipeline produced a single qualified lead.", row: "two" },
  { name: "Lena K.", title: "Head of Eng", company: "Resend", domain: "resend.com", quote: "The bar was consistently high. No noise, no filler — just people who could do the work.", row: "two" },
];

export const TESTIMONIAL_VIDEOS = [
  { name: "David K.", role: "Backend Developer", company: "Stripe", domain: "stripe.com", duration: "02:45", thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop", row: "one" },
  { name: "Sarah M.", role: "Cloud Engineer", company: "Notion", domain: "notion.so", duration: "03:12", thumbnail: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop", row: "one" },
  { name: "Marcus T.", role: "Operations Manager", company: "Vercel", domain: "vercel.com", duration: "01:58", thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop", row: "one" },
  { name: "Elena R.", role: "Data Analyst", company: "Figma", domain: "figma.com", duration: "02:20", thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop", row: "one" },
  { name: "James O.", role: "Frontend Developer", company: "Linear", domain: "linear.app", duration: "03:40", thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", row: "one" },
];

export const PARTNERS_HERO = [
  "workday", "greenhouse", "lever", "ashby", "indeed", "glassdoor", "bamboohr", "paylocity", "smartrecruiters", "icims", "workable", "paycom", "ziprecruiter", "successfactors", "personio",
].map((slug, i) => ({
  name: slug.charAt(0).toUpperCase() + slug.slice(1),
  slug,
  group: "hiring-stack" as const,
  order: i,
}));

/** Splits a string on **double asterisks** into plain/brand segments. */
export function splitBrand(text: string): { text: string; brand: boolean }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**") && part.endsWith("**")
        ? { text: part.slice(2, -2), brand: true }
        : { text: part, brand: false },
    );
}
