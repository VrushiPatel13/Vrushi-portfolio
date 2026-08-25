"use client";

import { about, traits } from "@/lib/data";
import { LevelHead } from "@/components/ui/LevelHead";
import { Reveal, StaggerList, StaggerItem } from "@/components/ui/Reveal";
import { pad2 } from "@/lib/utils";

export function About() {
  return (
    <section id="about" className="section-pad relative">
      <div className="shell">
        <LevelHead num="01" tag="Origin" label="About" headline={about.headline} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div>
            {about.paragraphs.map((para, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <p
                  className={
                    i === 0
                      ? "text-[1.05rem] leading-[1.8] text-ink-dim"
                      : "mt-6 text-[1.05rem] leading-[1.8] text-ink-dim"
                  }
                >
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.14}>
              <blockquote className="panel panel-glow brackets relative mt-10 p-6">
                <p className="pixel pixel-magenta mb-3">Player note</p>
                <p className="font-display text-[clamp(1.1rem,2.4vw,1.6rem)] font-bold uppercase leading-snug text-ink-hi">
                  {about.pullQuote}
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Stat block — arcade attribute panel */}
          <aside>
            <p className="pixel pixel-cyan border-t border-violet/30 pt-4">Attributes</p>

            <StaggerList className="mt-5 space-y-0">
              {traits.map((trait, i) => (
                <StaggerItem key={trait.title}>
                  <div className="group border-b border-violet/20 py-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[10px] font-bold tabular-nums text-ink-faint">
                        {pad2(i + 1)}
                      </span>
                      <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-lime transition-colors duration-300 group-hover:text-cyan">
                        {trait.title}
                      </h3>
                    </div>
                    <p className="mt-2 pl-7 text-[0.925rem] leading-relaxed text-ink-dim">
                      {trait.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </aside>
        </div>
      </div>
    </section>
  );
}
