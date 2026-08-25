"use client";

import { Reveal, SplitText } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Every section opens with the same cabinet header:
 *
 *   ▌ LEVEL 03 ───────────────────  BOSS FIGHTS  ────────  WORK
 */
export function LevelHead({
  num,
  tag,
  label,
  headline,
  lede,
  className,
}: {
  num: string;
  tag: string;
  label: string;
  headline?: string;
  lede?: string;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <Reveal direction="up">
        <div className="flex items-center gap-3 border-t border-violet/30 pt-4">
          <span className="flex h-8 items-center gap-2 border border-cyan/60 bg-cyan/10 px-2.5">
            <span className="pixel pixel-cyan">Lv</span>
            <span className="font-display text-xs font-black tabular-nums text-cyan">
              {num}
            </span>
          </span>

          <span className="hud text-magenta">{tag}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-violet/40 to-transparent" />
          <span className="hud hidden sm:block">{label}</span>
        </div>
      </Reveal>

      {headline ? (
        <h2 className="mt-9 max-w-3xl font-display text-[clamp(1.6rem,4.4vw,3rem)] font-black uppercase leading-[1.08] tracking-tight">
          <SplitText text={headline} />
        </h2>
      ) : null}

      {lede ? (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-dim">
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
