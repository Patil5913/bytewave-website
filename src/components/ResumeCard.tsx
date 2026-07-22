// Single-column, modern software-engineer résumé. All internal sizing is in
// cqw (% of the card's own width) so it looks identical at any rendered size.

function Bar({ w, tone = "line" }: { w: string; tone?: "line" | "faint" | "accent" }) {
  const bg =
    tone === "accent"
      ? "bg-emerald-400"
      : tone === "faint"
        ? "bg-white/10"
        : "bg-white/25";
  return <span className={`block h-[1.5cqw] rounded-[1px] ${bg}`} style={{ width: w }} />;
}

function SectionLabel({ w }: { w: string }) {
  return (
    <div className="flex items-center gap-[2cqw]">
      <span className="h-[2cqw] w-[2cqw] shrink-0 rounded-[1px] bg-emerald-400" />
      <span className="h-[2cqw] rounded-[1px] bg-emerald-400/80" style={{ width: w }} />
    </div>
  );
}

function Bullet({ w }: { w: string }) {
  return (
    <div className="flex items-center gap-[2cqw]">
      <span className="h-[1.2cqw] w-[1.2cqw] shrink-0 rounded-full bg-white/30" />
      <span className="h-[1.4cqw] rounded-[1px] bg-white/25" style={{ width: w }} />
    </div>
  );
}

function Experience({ title, date, bullets }: { title: string; date: string; bullets: string[] }) {
  return (
    <div className="flex flex-col gap-[2cqw]">
      <div className="flex items-center justify-between">
        <span className="h-[2cqw] rounded-[1px] bg-white/45" style={{ width: title }} />
        <span className="h-[1.4cqw] rounded-[1px] bg-white/15" style={{ width: date }} />
      </div>
      <span className="h-[1.4cqw] w-[45%] rounded-[1px] bg-white/20" />
      {bullets.map((w, i) => (
        <Bullet key={i} w={w} />
      ))}
    </div>
  );
}

const EXPERIENCE = [
  { title: "46%", date: "20%", bullets: ["96%", "88%", "92%", "85%"] },
  { title: "38%", date: "20%", bullets: ["92%", "78%", "84%"] },
  { title: "42%", date: "20%", bullets: ["88%", "80%",] },
];
const CONTACTS = ["16%", "20%", "14%", "18%"];
const SKILLS = ["14%", "20%", "11%", "17%", "13%", "22%", "12%", "16%", "18%", "15%"];

export default function ResumeCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`@container relative flex aspect-[17/22] flex-col gap-[5cqw] overflow-hidden rounded-md border border-white/10 bg-[#0d0f0e] p-[7cqw] shadow-2xl ${className}`}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-[4cqw] border-b border-white/10 pb-[5cqw]">
        <div className="flex flex-col gap-[2cqw]">
          <span className="h-[3.4cqw] w-[52%] rounded-[1px] bg-white/85" />
          <span className="mt-[1cqw] flex items-center gap-[2cqw]">
            <span className="h-[1.6cqw] w-[26%] rounded-[1px] bg-emerald-400/80" />
            <span className="h-[1.6cqw] w-[16%] rounded-[1px] bg-white/25" />
          </span>
        </div>
        <span className="font-instrument text-[5cqw] leading-none font-medium tracking-[0.28em] text-white/70 uppercase">
          CV
        </span>
      </div>

      {/* contact row */}
      <div className="flex flex-wrap gap-[3cqw]">
        {CONTACTS.map((w, i) => (
          <Bar key={i} w={w} tone="faint" />
        ))}
      </div>

      {/* summary */}
      <div className="flex flex-col gap-[2.5cqw]">
        <SectionLabel w="22%" />
        <Bar w="100%" />
        <Bar w="82%" />
      </div>

      {/* experience */}
      <div className="flex flex-col gap-[3.5cqw]">
        <SectionLabel w="30%" />
        {EXPERIENCE.map((e, i) => (
          <Experience key={i} {...e} />
        ))}
      </div>

      {/* skills */}
      <div className="flex flex-col gap-[2.5cqw]">
        <SectionLabel w="18%" />
        <div className="flex flex-wrap gap-[2cqw]">
          {SKILLS.map((w, i) => (
            <span key={i} className="h-[3.4cqw] rounded-[2px] bg-white/10" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}
