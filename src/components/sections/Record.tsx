"use client";

import { record } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

const KIND_LABEL: Record<string, string> = {
  award: "Award",
  education: "Education",
  certificate: "Certificate",
};

export function Record() {
  return (
    <section id="record" className="section-pad relative">
      <div className="shell">
        <SectionHead
          num="06"
          department="On Record"
          label="Credentials"
          headline="Degrees, certificates and one challenge."
          lede="A short list, honestly kept — a handful I can actually talk about rather than twenty I collected."
        />

        <div className="mt-12">
          {record.map((entry, i) => (
            <Reveal key={entry.id} delay={0.03 * i}>
              <article className="grid gap-3 border-t border-rule py-7 lg:grid-cols-[13rem_1fr] lg:gap-12">
                <div className="flex items-baseline justify-between gap-3 lg:block">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-accent">
                    {entry.rail}
                  </p>
                  <p className="label mt-0 lg:mt-2">{KIND_LABEL[entry.kind]}</p>
                </div>

                <div>
                  <h3 className="font-display text-[clamp(1.15rem,2.2vw,1.55rem)] font-bold leading-snug tracking-tight">
                    {entry.title}
                  </h3>
                  <p className="mt-1 font-serif text-[0.9375rem] italic text-ink-dim">
                    {entry.org}
                  </p>
                  <p className="mt-3 max-w-2xl font-serif text-[0.9375rem] leading-relaxed text-ink-dim">
                    {entry.note}
                  </p>

                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="verify"
                      className="label mt-3 inline-block transition-colors duration-300 hover:text-accent"
                    >
                      Verify credential →
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
          <div className="border-t border-rule" />
        </div>
      </div>
    </section>
  );
}
