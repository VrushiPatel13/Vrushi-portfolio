"use client";

import { runHistory } from "@/lib/data";
import { LevelHead } from "@/components/ui/LevelHead";
import { Reveal } from "@/components/ui/Reveal";
import { pad2 } from "@/lib/utils";

export function RunHistory() {
  return (
    <section id="run" className="section-pad relative">
      <div className="shell">
        <LevelHead
          num="02"
          tag="Run History"
          label="Experience"
          headline="Where the practice has been so far."
          lede="I'm early in my career. What follows is self-directed and academic work taken to the point where it actually runs — not job titles I haven't held yet."
        />

        <div className="mt-12">
          {runHistory.map((run, i) => (
            <Reveal key={run.id} delay={0.04 * i}>
              <article className="panel brackets relative mb-4 p-5 sm:p-7">
                <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-10">
                  {/* Rail */}
                  <div>
                    <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">
                      {run.period}
                    </p>
                    <p className="mt-2 text-[0.95rem] text-ink">{run.org}</p>
                    {run.current ? (
                      <p className="pixel pixel-lime mt-3 flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse bg-live" />
                        Active
                      </p>
                    ) : null}
                  </div>

                  {/* Body */}
                  <div>
                    <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.8rem)] font-black uppercase tracking-tight">
                      {run.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[0.975rem] leading-relaxed text-ink-dim">
                      {run.summary}
                    </p>

                    <ol className="mt-6 space-y-3">
                      {run.points.map((point, pi) => (
                        <li key={point} className="grid grid-cols-[2.25rem_1fr] gap-2">
                          <span className="font-display text-[10px] font-bold tabular-nums text-magenta">
                            {pad2(pi + 1)}
                          </span>
                          <span className="text-[0.925rem] leading-relaxed text-ink-dim">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {run.stack.map((s) => (
                        <span key={s} className="token">
                          {s}
                        </span>
                      ))}
                    </div>
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
