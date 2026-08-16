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
  // Every href here must resolve to a real route or a section that exists —
  // these links also feed sitemap.xml.
  footerGroups: [
    {
      title: "Product",
      links: [
        { label: "For Companies", href: "/companies" },
        { label: "For Professionals", href: "/professionals" },
        { label: "Enterprise Services", href: "/services#enterprise" },
        { label: "Talent Services", href: "/services#talent" },
        { label: "Pricing", href: "/services#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Insights", href: "/insights" },
        { label: "Refer & Earn", href: "/services#referral" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/legal#privacy" },
        { label: "Terms of Service", href: "/legal#terms" },
        { label: "Refund Policy", href: "/legal#refunds" },
      ],
    },
  ],
  // Add real profile URLs in the admin (Global → Site Settings → Social
  // Links). Empty means the footer hides the row rather than shipping dead
  // links.
  socials: [] as { label: string; href: string }[],
  seo: {
    // The network runs both ways — hiring teams and professionals — so the
    // default title must not read as company-only.
    metaTitle: "find & hire — hire verified, or get verified and hired",
    metaDescription:
      "Both sides of the hire. Companies get pre-verified specialists instead of resume piles; professionals get verified once and routed straight to the teams that need them.",
    keywords: "",
    ogImage: null as unknown,
  },
};

// Illustrative until the real figures are entered in the admin (Global →
// Track Record). Kept deliberately round — precise-looking numbers read as
// audited claims.
export const TRACK_RECORD = {
  stats: [
    { value: "10+", label: "Years Experience" },
    { value: "1k+", label: "Total Placements" },
    { value: "9 in 10", label: "Success Rate" },
    { value: "500+", label: "Partner Orgs" },
  ],
  growth: [
    { year: "2021", value: 130 },
    { year: "2022", value: 188 },
    { year: "2023", value: 234 },
    { year: "2024", value: 376 },
    { year: "2025", value: 385 },
    { year: "2026", value: 437, label: "YTD" },
  ],
};

export const FAQS_COMPANIES = [
  {
    question: "How is a candidate verified before we see them?",
    answer:
      "Every specialist completes a domain-specific assessment and a strategy call before we ever route them. You only see profiles that have already cleared our bar.",
  },
  {
    question: "What does it cost to hire through Bytewave?",
    answer:
      "A single success fee on the hire's first-year base salary, billed only once they start. High-volume teams can move to a flat monthly retainer instead. No job board fees, no per-post charges.",
  },
  {
    question: "Do you place contractors or only full-time roles?",
    answer:
      "Permanent, full-time roles only. We're built for teams making long-term hires, not staffing short-term gaps.",
  },
  {
    question: "What happens if a hire doesn't work out?",
    answer:
      "Every placement includes a 90-day replacement window. If it's not the right fit, we source a replacement at no additional cost.",
  },
  {
    question: "How fast can you fill a role?",
    answer:
      "Because candidates are pre-verified, most roles receive a first qualified introduction within a few business days, with an average time-to-hire of 12 days.",
  },
];

export const FAQS_PROFESSIONALS = [
  {
    question: "How does verification work?",
    answer:
      "We replace keyword screening with peer-level validation. You complete a domain-specific assessment and a strategy call, so your capabilities are proven before any company ever sees your profile.",
  },
  {
    question: "Does it cost anything for professionals?",
    answer:
      "No. Bytewave is free for verified professionals. Our partner organizations cover the cost of placement — you keep 100% of your negotiated compensation.",
  },
  {
    question: "What kind of roles do you place?",
    answer:
      "Permanent, full-time roles only. We don't dilute your options with short-term contract work — every match is a stable position with a verified organization actively hiring for your exact stack.",
  },
  {
    question: "How are my details routed to companies?",
    answer:
      "We bypass public job boards entirely. Your optimized profile is routed directly to the decision-makers who need your skills — never scraped, listed, or shared without your explicit approval.",
  },
  {
    question: "How fast is placement?",
    answer:
      "Because you're matched against roles that are already open and waiting, most verified professionals receive their first direct introduction within 48 to 72 hours of completing verification.",
  },
];

export const CERTIFICATIONS = [
  {
    code: "ISO 9001",
    ref: "QMS-9001",
    year: "2026",
    label: "Quality Management",
    description:
      "Aligned with global quality standards for consistent, reliable workforce solutions.",
    logoName: "iso",
  },
  {
    code: "ISO 27001",
    ref: "ISMS-27001",
    year: "2026",
    label: "Information Security",
    description:
      "Advanced data security and strict protection across every system we run.",
    logoName: "iso",
  },
  {
    code: "GDPR",
    ref: "EU-2016/679",
    year: "2026",
    label: "Data Privacy",
    description:
      "Transparent, privacy-first handling of candidate and client data end to end.",
    logoName: "gdpr",
  },
  {
    code: "E-Verify",
    ref: "US-DHS",
    year: "2023",
    label: "Employment Eligibility",
    description:
      "Compliant with U.S. employment standards for a fully verified workforce.",
    logoName: "e-verify",
  },
];

export const TESTIMONIAL_QUOTES = [
  {
    name: "Priya N.",
    title: "VP Engineering",
    company: "Stripe",
    domain: "stripe.com",
    quote:
      "We filled a platform lead role in under two weeks, with a candidate who was already screened to our exact bar.",
    row: "one",
  },
  {
    name: "Tom R.",
    title: "Head of Talent",
    company: "Notion",
    domain: "notion.so",
    quote:
      "The screening quality meant every interview we ran actually went somewhere. No more wasted loops.",
    row: "one",
  },
  {
    name: "Alicia F.",
    title: "COO",
    company: "Vercel",
    domain: "vercel.com",
    quote:
      "Bytewave handled the entire back office. We just met candidates and made decisions.",
    row: "one",
  },
  {
    name: "Derek M.",
    title: "Engineering Manager",
    company: "Figma",
    domain: "figma.com",
    quote:
      "Every profile that reached us was a real fit. That never happened with job boards.",
    row: "one",
  },
  {
    name: "Nina W.",
    title: "Director of Operations",
    company: "Linear",
    domain: "linear.app",
    quote:
      "The replacement guarantee gave us the confidence to move fast on a critical hire.",
    row: "one",
  },
  {
    name: "Marcus B.",
    title: "CTO",
    company: "Ramp",
    domain: "ramp.com",
    quote:
      "We closed three senior backend seats in a month — each one pre-vetted to a standard our own loops rarely hit.",
    row: "two",
  },
  {
    name: "Sofia L.",
    title: "Head of People",
    company: "Retool",
    domain: "retool.com",
    quote:
      "Fast, precise, and genuinely low-effort on our side. The shortlist just showed up ready.",
    row: "two",
  },
  {
    name: "Ken A.",
    title: "VP Product",
    company: "Airtable",
    domain: "airtable.com",
    quote:
      "Every candidate came context-ready. Interviews turned into decisions, not screening.",
    row: "two",
  },
  {
    name: "Dara O.",
    title: "Founder",
    company: "Neon",
    domain: "neon.tech",
    quote:
      "We hired our first two platform engineers here before our own pipeline produced a single qualified lead.",
    row: "two",
  },
  {
    name: "Lena K.",
    title: "Head of Eng",
    company: "Resend",
    domain: "resend.com",
    quote:
      "The bar was consistently high. No noise, no filler — just people who could do the work.",
    row: "two",
  },
];

export const TESTIMONIAL_VIDEOS = [
  {
    name: "David K.",
    role: "Backend Developer",
    company: "Stripe",
    domain: "stripe.com",
    duration: "02:45",
    thumbnail:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop",
    row: "one",
  },
  {
    name: "Sarah M.",
    role: "Cloud Engineer",
    company: "Notion",
    domain: "notion.so",
    duration: "03:12",
    thumbnail:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop",
    row: "one",
  },
  {
    name: "Marcus T.",
    role: "Operations Manager",
    company: "Vercel",
    domain: "vercel.com",
    duration: "01:58",
    thumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
    row: "one",
  },
  {
    name: "Elena R.",
    role: "Data Analyst",
    company: "Figma",
    domain: "figma.com",
    duration: "02:20",
    thumbnail:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    row: "one",
  },
  {
    name: "James O.",
    role: "Frontend Developer",
    company: "Linear",
    domain: "linear.app",
    duration: "03:40",
    thumbnail:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    row: "one",
  },
];

export const PARTNERS_HERO = [
  "workday",
  "greenhouse",
  "lever",
  "ashby",
  "indeed",
  "glassdoor",
  "bamboohr",
  "paylocity",
  "smartrecruiters",
  "icims",
  "workable",
  "paycom",
  "ziprecruiter",
  "successfactors",
  "personio",
].map((slug, i) => ({
  name: slug.charAt(0).toUpperCase() + slug.slice(1),
  slug,
  group: "hiring-stack" as const,
  order: i,
}));

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

export type LegalParagraph = { text: string };
export type LegalClause = {
  n: string;
  heading: string;
  paragraphs: LegalParagraph[];
};
export type LegalDocument = {
  id: string;
  ref: string;
  eyebrow: string;
  title: string;
  summary: string;
  clauses: LegalClause[];
};

export const LEGAL_PAGE: {
  entity: string;
  version: string;
  effective: string;
  governingLaw: string;
  documents: LegalDocument[];
} = {
  entity: "Bytewave, Inc.",
  version: "2026.08",
  effective: "15 August 2026",
  governingLaw: "State of Delaware, USA",
  documents: [
  {
    id: "privacy",
    ref: "DOC-01",
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    summary:
      "How find & hire collects, uses, shares and retains personal data submitted through this site.",
    clauses: [
      {
        n: "1.1",
        heading: "Data we collect",
        paragraphs: [
          { text: "We collect the information you enter into an intake form: your name and email address and, depending on the form, your target role and years of experience, or your company name, the number of roles you are filling and your primary stack. Free-text entered in a message field is stored as submitted." },
          { text: "Newsletter subscription collects an email address only. For every submission we also record the page path it originated from, in order to measure which parts of the site are effective." },
        ],
      },
      {
        n: "1.2",
        heading: "Purpose of processing",
        paragraphs: [
          { text: "Professional submissions are processed to verify your background and route you to matching roles. Company submissions are processed to scope the role and produce shortlists. Newsletter addresses are processed solely to send the newsletter." },
          { text: "We do not sell personal data and we do not disclose it to advertising networks." },
        ],
      },
      {
        n: "1.3",
        heading: "Disclosure to third parties",
        paragraphs: [
          { text: "A candidate profile is disclosed to a hiring company only after the role has been discussed with the candidate. Company details are disclosed to a candidate only at the point of introduction." },
        ],
      },
      {
        n: "1.4",
        heading: "Retention",
        paragraphs: [
          { text: "Intake submissions are retained while a search is active and for 24 months thereafter, so an engagement can be resumed. Newsletter subscriptions are retained until the subscriber opts out." },
        ],
      },
      {
        n: "1.5",
        heading: "Your rights",
        paragraphs: [
          { text: "You may request a copy of the personal data we hold about you, request correction of inaccurate data, or request deletion. Requests are actioned within 30 days of verification of identity. Contact us through the intake form or by email to exercise any of these rights." },
        ],
      },
    ],
  },
  {
    id: "terms",
    ref: "DOC-02",
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    summary:
      "The terms on which find & hire provides recruitment and related services, and the terms on which this site may be used.",
    clauses: [
      {
        n: "2.1",
        heading: "Scope of services",
        paragraphs: [
          { text: "find & hire sources, verifies and introduces candidates for permanent, full-time positions, and verifies and routes professionals to hiring teams. It is not a job board. No representation is made that any given search will result in a hire." },
        ],
      },
      {
        n: "2.2",
        heading: "Acceptable use",
        paragraphs: [
          { text: "Information submitted must be accurate. Misrepresentation of experience, employment history or corporate identity is grounds for termination of the engagement and removal from the network." },
          { text: "Automated scraping of the site, attempts to access the administrative interface, and automated form submission are prohibited." },
        ],
      },
      {
        n: "2.3",
        heading: "Fees and invoicing",
        paragraphs: [
          { text: "Companies pay a success fee calculated on the hire's first-year base salary, invoiced on the hire's start date, or a flat monthly retainer where agreed in writing. Invoices are payable within 30 days." },
          { text: "Professionals are never charged for verification, routing or placement. Training and interview preparation are optional, quoted in advance and agreed before any work begins." },
        ],
      },
      {
        n: "2.4",
        heading: "Placement guarantee",
        paragraphs: [
          { text: "Each placement carries a 90-day replacement window measured from the hire's start date. If the hire departs or is terminated within that window, a replacement search is provided at no additional fee. The guarantee provides a replacement search rather than a cash refund, except as set out in clause 3.1." },
        ],
      },
      {
        n: "2.5",
        heading: "Limitation of liability",
        paragraphs: [
          { text: "Candidates are verified with reasonable care, but hiring decisions rest with the client. We are not liable for the subsequent performance of any hire. Aggregate liability in connection with an engagement is limited to the fees paid to us for that engagement." },
        ],
      },
      {
        n: "2.6",
        heading: "Governing law",
        paragraphs: [
          { text: "These terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law principles. Bytewave, Inc. may update these terms; the effective date above reflects the current version." },
        ],
      },
    ],
  },
  {
    id: "refunds",
    ref: "DOC-03",
    eyebrow: "Refund Policy",
    title: "Refund Policy",
    summary:
      "When fees are refundable, on what timeline, and how to request a refund.",
    clauses: [
      {
        n: "3.1",
        heading: "Success fees",
        paragraphs: [
          { text: "If a placed hire departs within 30 days of the start date, the client may elect a full refund of the success fee in place of a replacement search. Between day 31 and day 90, a replacement search is provided; a pro-rated refund is available if the client elects not to continue." },
          { text: "After 90 days the success fee is non-refundable." },
        ],
      },
      {
        n: "3.2",
        heading: "Retainers",
        paragraphs: [
          { text: "Monthly retainers may be cancelled on 30 days' written notice. The current month is non-refundable once sourcing work has commenced. Any unused portion of a prepaid period is issued as credit rather than returned." },
        ],
      },
      {
        n: "3.3",
        heading: "Training and preparation",
        paragraphs: [
          { text: "Sessions cancelled at least 24 hours in advance are refunded in full. Sessions missed without notice are not refundable. Multi-session packages are refundable pro rata for sessions not yet delivered." },
        ],
      },
      {
        n: "3.4",
        heading: "Requesting a refund",
        paragraphs: [
          { text: "Submit the invoice reference and the circumstances in writing. Approved refunds are returned to the original payment method within 10 business days of approval." },
        ],
      },
    ],
  },
],
};
