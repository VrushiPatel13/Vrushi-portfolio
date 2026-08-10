"use client";

import { indexGroups, indexCount } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { pad2 } from "@/lib/utils";

export function TheIndex() {
  return (
    <section id="index" className="section-pad relative">
      <div className="shell">
        <SectionHead
          num="05"
          department="The Index"
          label={`${indexCount} entries`}
          headline="The working vocabulary."
          lede="Grouped by where each one sits in a system — from the language up to the platform it deploys on. No proficiency bars; I'd rather you ask."
        />

        <div className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {indexGroups.map((group, gi) => (
            <Reveal key={group.title} delay={0.04 * gi}>
              <div className="h-full bg-paper p-6">
                <div className="flex items-baseline justify-between border-b border-rule pb-3">
                  <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
                    {group.title}
                  </h3>
                  <span className="font-mono text-[10px] tabular-nums text-ink-mute">
                    {pad2(group.items.length)}
                  </span>
                </div>

                <ul className="mt-4 space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-serif text-[0.9375rem] text-ink-dim transition-colors duration-300 hover:text-ink-hi"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
