"use client";

import { essay, traits } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal, StaggerList, StaggerItem } from "@/components/ui/Reveal";
import { pad2 } from "@/lib/utils";

export function Essay() {
  return (
    <section id="essay" className="section-pad relative">
      <div className="shell">
        <SectionHead
          num="01"
          department="Opening Essay"
          label="About"
          headline={essay.headline}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* Body copy */}
          <div>
            {essay.paragraphs.map((para, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <p
                  className={
                    i === 0
                      ? "dropcap font-serif text-[1.0625rem] leading-[1.75] text-ink-dim"
                      : "mt-6 font-serif text-[1.0625rem] leading-[1.75] text-ink-dim"
                  }
                >
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.14}>
              <blockquote className="mt-10 border-l border-accent pl-6">
                <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold italic leading-snug text-ink-hi">
                  {essay.pullQuote}
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Sidebar — how I work */}
          <aside className="lg:border-l lg:border-rule lg:pl-10">
            <p className="label label-accent border-t border-rule pt-4">How I work</p>

            <StaggerList className="mt-6 space-y-0">
              {traits.map((trait, i) => (
                <StaggerItem key={trait.title}>
                  <div className="group border-b border-rule py-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] tabular-nums text-ink-mute">
                        {pad2(i + 1)}
                      </span>
                      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-hi transition-colors duration-300 group-hover:text-accent">
                        {trait.title}
                      </h3>
                    </div>
                    <p className="mt-2 pl-7 font-serif text-[0.9375rem] leading-relaxed text-ink-dim">
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
