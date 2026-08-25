"use client";

import { inventory, inventoryCount } from "@/lib/data";
import { LevelHead } from "@/components/ui/LevelHead";
import { Reveal } from "@/components/ui/Reveal";
import { pad2 } from "@/lib/utils";

export function Inventory() {
  return (
    <section id="inventory" className="section-pad relative">
      <div className="shell">
        <LevelHead
          num="05"
          tag="Inventory"
          label="Skills"
          headline="Everything currently equipped."
          lede={`${inventoryCount} entries, grouped by where each one sits in a system. No proficiency bars — those are invented numbers, and I'd rather you just ask.`}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.map((group, gi) => (
            <Reveal key={group.title} delay={0.04 * gi}>
              <div className="panel brackets relative h-full p-5">
                <div className="flex items-baseline justify-between border-b border-violet/30 pb-3">
                  <h3 className="hud text-cyan">{group.title}</h3>
                  <span className="font-display text-[11px] font-black tabular-nums text-magenta">
                    {pad2(group.items.length)}
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="token">{item}</span>
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
