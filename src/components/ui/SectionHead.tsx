"use client";

import type { ReactNode } from "react";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The masthead line every section opens with:
 *
 *   ───────────────────────────────────────────────────
 *   01            OPENING ESSAY                  ABOUT
 */
export function SectionHead({
  num,
  department,
  label,
  headline,
  lede,
  aside,
  className,
}: {
  num: string;
  department: string;
  label: string;
  headline?: string;
  lede?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-rule pt-4", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] tabular-nums tracking-[0.16em] text-accent">
          {num}
        </span>
        <span className="label label-ink flex-1 text-center">{department}</span>
        <span className="label">{label}</span>
      </div>

      {headline ? (
        <h2 className="mt-10 max-w-3xl font-display text-[clamp(1.9rem,4.6vw,3.3rem)] font-bold leading-[1.06] tracking-[-0.03em]">
          <SplitText text={headline} />
        </h2>
      ) : null}

      {lede ? (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl font-serif text-[1.0625rem] leading-relaxed text-ink-dim">
            {lede}
          </p>
        </Reveal>
      ) : null}

      {aside}
    </div>
  );
}
