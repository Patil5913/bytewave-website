import type { Metadata } from "next";

import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Reveal from "@components/Reveal";
import { getLegalPageContent, getSiteSettingsContent } from "@/lib/content";
import { metadataFromSettings } from "@/lib/seo";
import type { LegalDocument } from "@/lib/siteContent";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, legal] = await Promise.all([
    getSiteSettingsContent(),
    getLegalPageContent(),
  ]);
  return metadataFromSettings(settings.seo, {
    title: "Legal · find & hire",
    description: `Privacy policy, terms of service and refund policy for find & hire, the trading name of ${legal.entity}. Effective ${legal.effective}.`,
    path: "/legal",
  });
}


export default async function Legal() {
  const [settings, legal] = await Promise.all([
    getSiteSettingsContent(),
    getLegalPageContent(),
  ]);
  const documents: LegalDocument[] = legal.documents;

  return (
    <>
      <Navbar ctaLabel={settings.navCtaLabel} />

      {/* Document header — reads as a filing cover sheet. */}
      <section className="relative w-full overflow-hidden bg-canvas px-6 pt-36 pb-14 md:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal className="flex flex-col gap-6">
            <span className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
              Legal
            </span>
            <h1 className="max-w-3xl font-instrument text-5xl leading-[1.05] font-medium text-balance text-ink lg:text-7xl">
              Terms, privacy and refunds.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-ink/50">
              The three documents that govern your relationship with find &amp;
              hire, in full and in plain English.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-12 grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 font-mono text-xs md:grid-cols-4"
          >
            {[
              { label: "Entity", value: legal.entity },
              { label: "Version", value: legal.version },
              { label: "Effective", value: legal.effective },
              { label: "Governing law", value: legal.governingLaw },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1.5 bg-canvas px-5 py-4"
              >
                <span className="text-[10px] tracking-[0.2em] text-ink/35 uppercase">
                  {row.label}
                </span>
                <span className="text-ink/70">{row.value}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-canvas px-6 pb-24 md:px-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Contents */}
          <Reveal className="flex flex-col gap-5 lg:sticky lg:top-32 lg:col-span-3">
            <span className="text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
              Contents
            </span>
            <nav className="flex flex-col border-t border-ink/10">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={`#${doc.id}`}
                  className="group flex items-baseline gap-3 border-b border-ink/10 py-3 text-sm text-ink/55 transition-colors hover:text-ink"
                >
                  <span className="font-mono text-[10px] tracking-widest text-ink/30 transition-colors group-hover:text-brand">
                    {doc.ref}
                  </span>
                  {doc.eyebrow}
                </a>
              ))}
            </nav>
            <p className="text-xs leading-relaxed text-ink/40">
              Questions about any clause? Raise them before signing — we
              answer them directly rather than pointing at the document.
            </p>
          </Reveal>

          {/* Documents */}
          <div className="flex flex-col lg:col-span-9">
            {documents.map((doc) => (
              <section
                key={doc.id}
                id={doc.id}
                className="scroll-mt-28 border-t border-ink/10 py-14 first:border-t-0 first:pt-0"
              >
                <Reveal className="mb-10 flex flex-col gap-3">
                  <span className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] text-ink/40 uppercase">
                    {doc.ref}
                    <span className="text-ink/20">/</span>
                    <span className="text-brand">v{legal.version}</span>
                  </span>
                  <h2 className="font-instrument text-3xl leading-tight font-medium text-ink lg:text-4xl">
                    {doc.title}
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-ink/50">
                    {doc.summary}
                  </p>
                </Reveal>

                <Reveal stagger={0.06} className="flex flex-col">
                  {doc.clauses.map((clause) => (
                    <div
                      key={clause.n}
                      className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-ink/10 py-7 md:grid-cols-12"
                    >
                      <div className="flex items-baseline gap-3 md:col-span-4">
                        <span className="font-mono text-xs text-ink/30 tabular-nums">
                          {clause.n}
                        </span>
                        <h3 className="text-base leading-snug font-medium text-ink/85">
                          {clause.heading}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3 md:col-span-8">
                        {clause.paragraphs.map((para, i) => (
                          <p
                            key={i}
                            className="text-sm leading-relaxed text-ink/55"
                          >
                            {para.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </Reveal>
              </section>
            ))}

            <Reveal className="border-t border-ink/10 pt-8">
              <p className="font-mono text-[11px] leading-relaxed text-ink/35">
                End of document set · {legal.version} · Effective{" "}
                {legal.effective} ·{" "}
                {settings.legalLine}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
