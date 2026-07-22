function Bar({ w, tone = "line" }: { w: string; tone?: "line" | "faint" | "accent" | "ink" }) {
  const bg =
    tone === "accent"
      ? "bg-emerald-600/80"
      : tone === "ink"
        ? "bg-neutral-700"
        : tone === "faint"
          ? "bg-neutral-300"
          : "bg-neutral-400";
  return <span className={`block h-[0.7vh] ${bg}`} style={{ width: w }} />;
}

function Entry({ title, dates, lines }: { title: string; dates: string; lines: string[] }) {
  return (
    <div className="flex flex-col gap-[0.9vh]">
      <div className="flex items-center justify-between">
        <span className="h-[0.9vh] bg-neutral-700" style={{ width: title }} />
        <span className="h-[0.6vh] bg-neutral-300" style={{ width: dates }} />
      </div>
      {lines.map((w, i) => (
        <Bar key={i} w={w} />
      ))}
    </div>
  );
}

type Variant = {
  paper: string;
  name: string;
  role: string;
  hasAvatar: boolean;
  contacts: string[];
  entries: { title: string; dates: string; lines: string[] }[];
  chips: string[];
};

const VARIANTS: Variant[] = [
  {
    paper: "#f2f2ef",
    name: "13vh",
    role: "9vh",
    hasAvatar: true,
    contacts: ["4vh", "5vh", "3vh"],
    entries: [
      { title: "10vh", dates: "4vh", lines: ["100%", "88%", "72%"] },
      { title: "8vh", dates: "4vh", lines: ["94%", "80%"] },
      { title: "11vh", dates: "4vh", lines: ["100%", "90%", "64%"] },
    ],
    chips: ["3vh", "4vh", "2.5vh", "3.5vh", "3vh", "2vh"],
  },
  {
    paper: "#eeefe9",
    name: "10vh",
    role: "12vh",
    hasAvatar: false,
    contacts: ["5vh", "4vh"],
    entries: [
      { title: "12vh", dates: "3.5vh", lines: ["96%", "70%"] },
      { title: "9vh", dates: "4vh", lines: ["100%", "84%", "58%", "76%"] },
    ],
    chips: ["4vh", "2.5vh", "3.5vh", "3vh"],
  },
  {
    paper: "#f4f1ec",
    name: "15vh",
    role: "7vh",
    hasAvatar: true,
    contacts: ["3vh", "4vh", "5vh", "3vh"],
    entries: [
      { title: "9vh", dates: "4vh", lines: ["88%", "100%"] },
      { title: "11vh", dates: "3.5vh", lines: ["92%", "76%", "60%"] },
      { title: "7vh", dates: "4vh", lines: ["100%", "68%"] },
    ],
    chips: ["2.5vh", "3.5vh", "3vh", "4vh", "2vh"],
  },
  {
    paper: "#f0f0ec",
    name: "11vh",
    role: "10vh",
    hasAvatar: false,
    contacts: ["4vh", "5vh", "4vh"],
    entries: [
      { title: "8vh", dates: "4vh", lines: ["100%", "82%", "90%"] },
      { title: "13vh", dates: "3.5vh", lines: ["74%", "96%"] },
    ],
    chips: ["3vh", "2vh", "4vh", "3.5vh", "2.5vh", "3vh"],
  },
];

export default function ResumeCard({
  className = "",
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const v = VARIANTS[variant % VARIANTS.length];

  return (
    <div
      className={`relative flex aspect-[17/22] flex-col gap-[3.5%] overflow-hidden rounded-md border border-neutral-300 p-[6%] shadow-lg ${className}`}
      style={{ backgroundColor: v.paper }}
    >
      {/* header */}
      <div className="flex items-start justify-between border-b border-neutral-200 pb-[3%]">
        <div className="flex flex-col gap-[0.9vh]">
          <span className="font-mono text-[clamp(0.5rem,1.5vh,1.1rem)] font-bold tracking-[0.35em] text-neutral-900 uppercase">
            Résumé
          </span>
          <span className="mt-[0.4vh] h-[1.4vh] bg-neutral-800" style={{ width: v.name }} />
          <span className="h-[0.7vh] bg-neutral-500" style={{ width: v.role }} />
          <div className="mt-[0.4vh] flex gap-[1vh]">
            {v.contacts.map((w, i) => (
              <Bar key={i} w={w} tone="faint" />
            ))}
          </div>
        </div>
        {v.hasAvatar && <div className="h-[7vh] w-[7vh] shrink-0 rounded-sm bg-neutral-300" />}
      </div>

      {/* body: two columns */}
      <div className="flex flex-1 gap-[6%]">
        <div className="flex w-[62%] flex-col gap-[2.4vh]">
          <Bar w="7vh" tone="accent" />
          {v.entries.map((e, i) => (
            <Entry key={i} {...e} />
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-[2.4vh] border-l border-neutral-200 pl-[6%]">
          <div className="flex flex-col gap-[1vh]">
            <Bar w="6vh" tone="accent" />
            <Bar w="100%" />
            <Bar w="70%" />
          </div>
          <div className="flex flex-col gap-[1vh]">
            <Bar w="5vh" tone="accent" />
            <div className="flex flex-wrap gap-[0.8vh]">
              {v.chips.map((w, i) => (
                <span key={i} className="h-[1.4vh] rounded-[1px] bg-neutral-300" style={{ width: w }} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[1vh]">
            <Bar w="6vh" tone="accent" />
            <Bar w="90%" />
            <Bar w="60%" />
          </div>
        </div>
      </div>
    </div>
  );
}
