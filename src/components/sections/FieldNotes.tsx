"use client";

import { fieldNotes } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { pad2 } from "@/lib/utils";

export function FieldNotes() {
  return (
    <section id="field-notes" className="section-pad relative">
      <div className="shell">
        <SectionHead
          num="02"
          department="Field Notes"
          label="Experience"
          headline="Where the practice has been so far."
          lede="I'm early in my career. What follows is self-directed and academic work taken to the point where it actually runs — not job titles I haven't held yet."
        />

        <div className="mt-14">
          {fieldNotes.map((note, i) => (
            <Reveal key={note.id} delay={0.05 * i}>
              <article className="grid gap-6 border-t border-rule py-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
                {/* Rail */}
                <div className="lg:pt-1">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-accent">
                    {note.period}
                  </p>
                  <p className="mt-2 font-serif text-base text-ink-hi">{note.org}</p>
                  {note.current ? (
                    <p className="label mt-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-live" />
                      Current
                    </p>
                  ) : null}
                </div>

                {/* Body */}
                <div>
                  <h3 className="font-display text-[clamp(1.4rem,2.8vw,2rem)] font-bold tracking-tight">
                    {note.title}
                  </h3>
                  <p className="mt-3 max-w-2xl font-serif text-[1rem] leading-relaxed text-ink-dim">
                    {note.summary}
                  </p>

                  <ol className="mt-7 space-y-4">
                    {note.points.map((point, pi) => (
                      <li key={point} className="grid grid-cols-[2.5rem_1fr] gap-2">
                        <span className="font-mono text-[10px] tabular-nums text-ink-mute">
                          {pad2(pi + 1)}
                        </span>
                        <span className="font-serif text-[0.9375rem] leading-relaxed text-ink-dim">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-7 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="label mr-1">Stack —</span>
                    {note.stack.map((s, si) => (
                      <span
                        key={s}
                        className="font-mono text-[11px] text-ink-dim"
                      >
                        {s}
                        {si < note.stack.length - 1 ? (
                          <span className="px-1.5 text-ink-mute">/</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
