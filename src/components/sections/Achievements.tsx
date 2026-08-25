"use client";

import { achievements } from "@/lib/data";
import { LevelHead } from "@/components/ui/LevelHead";
import { Reveal } from "@/components/ui/Reveal";

const KIND: Record<string, { label: string; color: string }> = {
  certificate: { label: "Certificate", color: "text-gold" },
  award: { label: "Challenge", color: "text-magenta" },
  education: { label: "Education", color: "text-cyan" },
};

export function Achievements() {
  return (
    <section id="achievements" className="section-pad relative">
      <div className="shell">
        <LevelHead
          num="06"
          tag="Achievements"
          label="Awards"
          headline="Unlocked, and independently verifiable."
          lede="Every certificate below links to its live Coursera verification page — titles and credential codes are transcribed from the certificates themselves, not paraphrased."
        />

        <div className="mt-12 grid gap-4">
          {achievements.map((entry, i) => {
            const kind = KIND[entry.kind];
            return (
              <Reveal key={entry.id} delay={0.03 * i}>
                <article className="panel brackets relative p-5 sm:p-7">
                  <div className="grid gap-5 lg:grid-cols-[12rem_1fr] lg:gap-10">
                    {/* Rail */}
                    <div className="flex items-baseline justify-between gap-3 lg:block">
                      <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
                        {entry.rail}
                      </p>
                      <p className={`pixel mt-0 lg:mt-3 ${kind.color}`}>{kind.label}</p>
                    </div>

                    {/* Body */}
                    <div>
                      <h3 className="font-display text-[clamp(1.05rem,2.3vw,1.5rem)] font-black uppercase leading-snug tracking-tight text-ink-hi">
                        {entry.title}
                      </h3>
                      <p className="mt-1.5 text-[0.9rem] text-ink-dim">{entry.org}</p>
                      <p className="mt-3 max-w-2xl text-[0.925rem] leading-relaxed text-ink-dim">
                        {entry.note}
                      </p>

                      {/* Courses inside a specialization */}
                      {entry.parts ? (
                        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                          {entry.parts.map((part, pi) => (
                            <li key={part.url}>
                              <a
                                href={part.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                data-cursor="verify"
                                className="group flex items-start gap-2.5 border border-violet/25 bg-violet/6 px-3 py-2.5 transition-colors duration-300 hover:border-cyan/60"
                              >
                                <span className="font-display text-[10px] font-bold tabular-nums text-magenta">
                                  {String(pi + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[0.85rem] leading-snug text-ink-dim transition-colors duration-300 group-hover:text-cyan">
                                  {part.title}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {entry.url ? (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-cursor="verify"
                          className="btn btn-sm mt-5"
                        >
                          Verify credential
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
