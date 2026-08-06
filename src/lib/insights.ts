export type Span = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  highlight?: boolean;
  href?: string;
};

export type Block =
  | { type: "paragraph"; spans: Span[] }
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "code"; language: string; code: string }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "divider" };

export type Post = {
  id: string;
  date: string;
  updated?: boolean;
  tag: string;
  title: string;
  author: string;
  authorTitle: string;
  authorBio: string;
  authorLinkedIn?: string;
  authorAvatar?: string;
  readTime: string;
  cover: string;
  excerpt: string;
  content: Block[];
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function trimTitleSlug(title: string, maxWords = 6) {
  return slugify(title).split("-").slice(0, maxWords).join("-");
}

export function topicSlug(post: { tag: string }) {
  return slugify(post.tag);
}

export function articleSlug(post: { id: string; title: string }) {
  return `${post.id}-${trimTitleSlug(post.title)}`;
}

export function buildHref(post: { id: string; title: string; tag: string }) {
  return `/insights/${topicSlug(post)}/${articleSlug(post)}`;
}

export function findPost(topic: string, slug: string): Post | undefined {
  return ALL_POSTS.find(
    (post) =>
      topicSlug(post) === topic &&
      (slug === post.id || slug.startsWith(`${post.id}-`)),
  );
}

export function postsByTopic(topic: string) {
  return ALL_POSTS.filter((post) => topicSlug(post) === topic);
}

export const ALL_POSTS: Post[] = [
  {
    id: "article-1",
    date: "October 12, 2026",
    tag: "Market Analysis",
    title: "The changing baseline for senior DevOps compensation in Q4.",
    author: "R. Fischer",
    authorTitle: "Senior Analyst",
    authorBio:
      "R. Fischer covers compensation trends and hiring data across engineering and infrastructure roles.",
    readTime: "6 min read",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    excerpt:
      "Compensation bands are shifting fast as demand for platform engineers outpaces supply across every major market.",
    content: [
      {
        type: "paragraph",
        spans: [
          {
            text: "Compensation bands are shifting fast as demand for platform engineers outpaces supply across every major market. ",
          },
          {
            text: "Over the last two quarters",
            bold: true,
          },
          {
            text: ", we've tracked a consistent upward drift in senior DevOps offers, with the steepest gains concentrated in organizations running multi-cloud infrastructure at scale.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Why the baseline moved",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Three forces are compounding at once: a shrinking pool of engineers with production ",
          },
          { text: "Kubernetes", code: true },
          {
            text: " experience, a wave of cost-optimization mandates pushing companies to hire fewer but ",
          },
          { text: "more senior", italic: true },
          {
            text: " operators, and a growing willingness among candidates to hold out for roles that match their leverage.",
          },
        ],
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1800&auto=format&fit=crop",
        alt: "Compensation trend chart mockup",
        caption:
          "Trailing 90-day offer data across platform and infrastructure roles.",
      },
      {
        type: "quote",
        text: "The candidates who understand their own leverage are the ones setting the new floor for everyone else.",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "What we're seeing in live placements confirms this. Base salary alone is no longer the full picture — ",
          },
          {
            text: "sign-on bonuses, accelerated equity vesting, and remote-first flexibility",
            highlight: true,
          },
          {
            text: " are all being used as levers to close offers that would have gone uncontested a year ago. For a breakdown of how we source this data, see our ",
          },
          {
            text: "methodology page",
            href: "/insights",
          },
          { text: "." },
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "A sample band, for context",
      },
      {
        type: "code",
        language: "text",
        code: "Platform Engineer, Senior (5-8 yrs)\nBase:    $155k – $195k\nEquity:  0.02% – 0.08%\nBonus:   10% – 15% target",
      },
      {
        type: "divider",
      },
      {
        type: "heading",
        level: 2,
        text: "What this means for your next negotiation",
      },
      {
        type: "list",
        items: [
          "Anchor to trailing 90-day data, not last year's range.",
          "Treat equity and flexibility as negotiable line items, not fixed perks.",
          "Expect longer close cycles for senior platform roles — scarcity cuts both ways.",
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Pull the current band for your exact role and seniority.",
          "Separate your ask into base, equity, and flexibility — negotiate each on its own terms.",
          "Walk in prepared to justify the number with data, not sentiment.",
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The takeaway isn't that every offer will land at the top of the range. It's that walking into the conversation with real, current data changes the shape of the negotiation entirely.",
          },
        ],
      },
    ],
  },
  {
    id: "article-2",
    date: "October 08, 2026",
    tag: "Operations",
    title:
      "Why traditional HR screening fails at identifying actual engineering talent.",
    author: "L. Marsh",
    authorTitle: "Operations Lead",
    authorBio:
      "L. Marsh writes about hiring operations and screening process design.",
    readTime: "5 min read",
    cover:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop",
    excerpt:
      "Keyword filters and resume scoring miss the signals that actually predict on-the-job performance.",
    content: [
      {
        type: "paragraph",
        spans: [
          {
            text: "Keyword filters and resume scoring miss the signals that actually predict on-the-job performance.",
          },
        ],
      },
    ],
  },
  {
    id: "article-3",
    date: "September 29, 2026",
    tag: "Infrastructure",
    title: "Structuring your data science team for early-stage scaling.",
    author: "T. Nakamura",
    authorTitle: "Infrastructure Analyst",
    authorBio:
      "T. Nakamura covers team structure and scaling decisions for technical orgs.",
    readTime: "5 min read",
    cover:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop",
    excerpt:
      "The right ratio of generalists to specialists changes at every stage of growth — here's how to plan for it.",
    content: [
      {
        type: "paragraph",
        spans: [
          {
            text: "The right ratio of generalists to specialists changes at every stage of growth — here's how to plan for it.",
          },
        ],
      },
    ],
  },
  {
    id: "article-4",
    date: "Apr 23, 2026",
    updated: true,
    tag: "Immigration",
    title: "How to File Your E-3 Visa in 1 Business Day with Migrate Mate",
    author: "Mihailo Bozic",
    authorTitle: "Founder & CEO @ Migrate Mate",
    authorBio:
      "I moved from Australia to the United States in 2023. I have had 3 jobs, and 3 different visas. I started Migrate Mate to help people like me find their dream job in the USA & help them get visa sponsorship.",
    authorLinkedIn: "#",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    readTime: "8 min read",
    cover:
      "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?q=80&w=2000&auto=format&fit=crop",
    excerpt:
      "Migrate Mate files your E-3 within 1 business day of receiving your documents. Here's what the commitment covers and how to prepare for your 4-6 week timeline.",
    content: [
      {
        type: "paragraph",
        spans: [
          {
            text: "E-3 visa processing time runs four to six weeks end-to-end for most applicants, from LCA filing to visa stamp in hand. The filing step itself is where Migrate Mate compresses the timeline. Your E-3 visa application is filed within ",
          },
          { text: "one business day", bold: true },
          {
            text: " of receiving your complete document package.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Key takeaways",
      },
      {
        type: "list",
        items: [
          "Migrate Mate files your E-3 DS-160 within one business day of receiving all required documents. The clock starts when your documents are complete, not when you first engage.",
          "Your total timeline to visa in hand is still 4-6 weeks. Consulate interview availability is the main variable Migrate Mate cannot compress.",
          "Gather your documents in parallel with your employer's LCA (about 7 business days to certify) to unlock the fastest filing date.",
          "For complex cases (prior visa denials, ambiguous specialty occupation, change-of-status with dependents), consult an immigration attorney.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: 'What "filed in 1 business day" actually covers',
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Migrate Mate files your E-3 visa application, meaning the ",
          },
          { text: "DS-160", code: true },
          {
            text: " nonimmigrant visa application, within one business day of receiving your complete document package. The clock starts when every required document is in hand, not when you first engage the service.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [{ text: "A few things worth being explicit about:" }],
      },
      {
        type: "list",
        items: [
          "The 1 business day refers to the DS-160 filing. Your employer's Labor Condition Application (LCA) still takes about seven business days for the DOL to certify, and that happens on a separate track.",
          "Your total timeline to a stamped visa still runs four to six weeks. The consulate interview wait time at Sydney, Melbourne, or Perth is the biggest variable, and Migrate Mate cannot compress that.",
          "1 business day means one business day. Submit Friday afternoon, expect filing Monday.",
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The point of the commitment is removing the filing-side delays that traditional services build in for review cycles, document back-and-forth, and internal process. If your documents are in order, the application goes in.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "What you need to have ready",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The 1-business-day commitment depends on your documents. Migrate Mate files within one business day of having everything in hand, so how fast you gather your documents directly affects your filing date.",
          },
        ],
      },
      {
        type: "heading",
        level: 4,
        text: "From you",
      },
      {
        type: "list",
        items: [
          "Valid Australian passport with at least six months of validity remaining",
          "Degree certificate and official transcripts (or documentation of equivalent work experience)",
          "Resume or CV",
          "Any prior U.S. visa history, including refusals",
          "Passport-style photo to current State Department specs",
        ],
      },
      {
        type: "heading",
        level: 4,
        text: "From your employer",
      },
      {
        type: "list",
        items: [
          "Signed job offer letter with role, duties, salary, and work location clearly stated",
          "Confirmation the LCA has been filed or is in process",
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Gather these in parallel with your employer's LCA process, not after it. Migrate Mate reviews your documents as they come in and flags anything that would cause a delay at the consulate, so issues get fixed before the LCA is even certified.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "You will also need a credit or debit card handy to pay the ",
          },
          { text: "$315 MRV fee", highlight: true },
          {
            text: " directly to the U.S. government when you book your consulate interview. That step happens after Migrate Mate has filed your DS-160.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "How Migrate Mate files your E-3 in 1 business day",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The three-step filing process is designed to eliminate the delays that typically extend E-3 filings by one to two weeks.",
          },
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "Step 1: Eligibility check",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Before your case enters the filing queue, Migrate Mate confirms you qualify. The E-3 has four non-negotiable requirements:",
          },
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Australian citizenship",
          "A bachelor's degree or equivalent work experience",
          "A valid U.S. job offer",
          "A role that qualifies as a specialty occupation",
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "If your case has a wrinkle that needs attorney involvement (prior visa denial, criminal history, ambiguous specialty occupation argument), Migrate Mate tells you up front rather than filing and hoping.",
          },
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "Step 2: DS-160 and LCA alignment check",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Migrate Mate prepares your DS-160 nonimmigrant visa application and runs it against your employer's Labor Condition Application line by line. The two documents have to agree on job title, job description, and wage. A mismatch is the single most common reason E-3 cases get delayed at the consulate.",
          },
        ],
      },
      {
        type: "quote",
        text: 'If your DS-160 says "Software Engineer" and your LCA says "Senior Software Developer," a consular officer pulls up both documents at the interview and sees a discrepancy. That can trigger a 221(g) administrative processing request, which adds weeks to your timeline and forces a second consulate visit.',
      },
      {
        type: "heading",
        level: 3,
        text: "Step 3: Application submitted within 1 business day",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Once Migrate Mate has every required document and confirmation, the DS-160 goes in within one business day. The clock does not start until everything is in hand, so document gathering speed is the variable that most affects your actual filing date.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Most cases clear all three steps within three to four business days from first contact, assuming responsive document collection on your side.",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "heading",
        level: 2,
        text: "What this means for your total timeline",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Filing quickly compresses your overall timeline. Here's how the four-to-six-week end-to-end picture typically breaks down:",
          },
        ],
      },
      {
        type: "list",
        items: [
          "Days 1-3: You gather documents and Migrate Mate files your DS-160",
          "Week 1-2: Your employer's LCA is certified by DOL (about seven business days)",
          "Weeks 2-5: You book and attend your E-3 visa interview at Sydney, Melbourne, or Perth",
          "Week 5-6: Your visa is stamped and returned",
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The consulate interview wait time is where most of the variability lives. Wait times differ meaningfully between the three consulates and change week to week.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Migrate Mate monitors availability across all three and books the earliest appointment that works for your schedule. Check ",
          },
          {
            text: "E-3 visa appointment availability",
            href: "#",
          },
          { text: " across all consulates to understand current wait times." },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Your employer's role",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Your employer has one job: file the Labor Condition Application with the Department of Labor. It is a free form submitted through the DOL's online system, certified in about seven business days. No USCIS involvement, no fees, no lottery.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Migrate Mate gives your employer's HR team a step-by-step checklist so they know what to submit. If they have filed LCAs before, the whole thing is a thirty-minute task for them. If they have not, the checklist walks them through every attestation so nothing stalls.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Get your E-3 visa filed",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "If your documents are ready and your employer has signed your offer letter, you can have your E-3 application filed within one business day.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Ready to file your E-3? Migrate Mate handles everything for ",
          },
          { text: "$499", bold: true },
          { text: "." },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Frequently asked questions",
      },
      {
        type: "faq",
        items: [
          {
            question: "How does Migrate Mate E-3 visa filing work?",
            answer:
              "Migrate Mate assigns a dedicated E-3 visa expert to your case, prepares and reviews your DS-160, checks LCA alignment, and files the application within 1 business day of receiving everything. The service also covers interview prep and consulate appointment monitoring. The cost is $499 flat plus the $315 government MRV fee.",
          },
          {
            question: "Is Migrate Mate legit for E-3 visa filing?",
            answer:
              "Yes. Migrate Mate is a document preparation and filing service that specializes in E-3 visas for Australian professionals, with a 100% approval rate on cases accepted.",
          },
          {
            question: "How long does the E-3 process take with Migrate Mate?",
            answer:
              "Migrate Mate files within 1 business day of having all your documents. Total time from starting to visa stamp is four to six weeks, with consulate interview appointment availability as the main variable.",
          },
          {
            question:
              "Does my employer need visa experience to use Migrate Mate?",
            answer:
              "No. Migrate Mate guides inexperienced employers through every step of the LCA filing. The employer submits the LCA (not Migrate Mate), and it's free to file and certified in about seven working days.",
          },
          {
            question: "What does the $499 fee include?",
            answer:
              "The $499 includes a dedicated E-3 visa expert, DS-160 preparation and review, LCA alignment check, document verification, interview prep, and appointment monitoring. It doesn't include the $315 government MRV fee, which you pay directly to the U.S. government. Total cost end to end is $814.",
          },
        ],
      },
    ],
  },
];
