// Single-column, modern software-engineer résumé. Plain rem-based Tailwind
// spacing — same approach as the rest of the site, no container queries.

function Bar({ w, tone = "line" }: { w: string; tone?: "line" | "faint" | "accent" }) {
  const bg =
    tone === "accent"
      ? "bg-emerald-400"
      : tone === "faint"
        ? "bg-white/10"
        : "bg-white/25";
  return <span className={`block h-1.5 rounded-[1px] ${bg}`} style={{ width: w }} />;
}

function SectionLabel({ w }: { w: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-[1px] bg-emerald-400" />
      <span className="h-2 rounded-[1px] bg-emerald-400/80" style={{ width: w }} />
    </div>
  );
}

function Bullet({ w }: { w: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1 w-1 shrink-0 rounded-full bg-white/30" />
      <span className="h-1.5 rounded-[1px] bg-white/25" style={{ width: w }} />
    </div>
  );
}

function Experience({ title, date, bullets }: { title: string; date: string; bullets: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="h-2 rounded-[1px] bg-white/45" style={{ width: title }} />
        <span className="h-1.5 rounded-[1px] bg-white/15" style={{ width: date }} />
      </div>
      <span className="h-1.5 w-[45%] rounded-[1px] bg-white/20" />
      {bullets.map((w, i) => (
        <Bullet key={i} w={w} />
      ))}
    </div>
  );
}

const EXPERIENCE = [
  { title: "46%", date: "20%", bullets: ["96%", "88%"] },
  { title: "38%", date: "20%", bullets: ["92%", "78%"] },
];
const CONTACTS = ["16%", "20%", "14%", "18%"];
const SKILLS = ["14%", "20%", "11%", "17%", "13%", "22%", "12%", "16%"];

export default function ResumeCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex aspect-[8.5/11] flex-col gap-2 overflow-hidden rounded-md border border-white/10 bg-[#0d0f0e] p-3 shadow-2xl sm:gap-3 sm:p-5 ${className}`}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-col gap-1.5">
          <span className="h-2.5 w-24 rounded-[1px] bg-white/85" />
          <span className="mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-16 rounded-[1px] bg-emerald-400/80" />
            <span className="h-1.5 w-10 rounded-[1px] bg-white/25" />
          </span>
        </div>
        <span className="font-instrument text-xs font-medium leading-none text-white/70">
          Résumé
        </span>
      </div>

      {/* contact row */}
      <div className="flex flex-wrap gap-3">
        {CONTACTS.map((w, i) => (
          <Bar key={i} w={w} tone="faint" />
        ))}
      </div>

      {/* summary */}
      <div className="flex flex-col gap-2">
        <SectionLabel w="22%" />
        <Bar w="100%" />
        <Bar w="82%" />
      </div>

      {/* experience */}
      <div className="flex flex-col gap-2.5">
        <SectionLabel w="30%" />
        {EXPERIENCE.map((e, i) => (
          <Experience key={i} {...e} />
        ))}
      </div>

      {/* skills */}
      <div className="flex flex-col gap-2">
        <SectionLabel w="18%" />
        <div className="flex flex-wrap gap-1.5">
          {SKILLS.map((w, i) => (
            <span key={i} className="h-2.5 rounded-[2px] bg-white/10" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}
