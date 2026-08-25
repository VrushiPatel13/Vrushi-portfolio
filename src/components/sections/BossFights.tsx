"use client";

import { motion, useReducedMotion } from "framer-motion";
import { projects, archiveProjects, inProgress, type Project } from "@/lib/data";
import { ProjectVisual } from "@/components/sections/ProjectVisual";
import { LevelHead } from "@/components/ui/LevelHead";
import { Reveal } from "@/components/ui/Reveal";
import { GithubMark } from "@/components/ui/SocialIcon";
import { cn, pad2 } from "@/lib/utils";

const STATUS_COLOR: Record<Project["status"], string> = {
  Live: "var(--color-live)",
  Shipped: "var(--color-cyan)",
  "In development": "var(--color-gold)",
};

function Boss({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const reduced = useReducedMotion();

  return (
    <article className="panel brackets relative mb-5 overflow-hidden p-5 sm:p-7">
      {/* Boss header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet/30 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 items-center border border-magenta/60 bg-magenta/12 px-2 font-display text-[10px] font-black tabular-nums text-magenta">
            {pad2(index + 1)}
          </span>
          <span className="hud text-ink-dim">{project.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="pixel">{project.year}</span>
          <span className="hud flex items-center gap-2">
            <span
              className="h-2 w-2"
              style={{ background: STATUS_COLOR[project.status] }}
            />
            {project.status}
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <div className={flip ? "lg:order-2" : undefined}>
          <h3
            className="glitch font-display text-[clamp(1.35rem,3.4vw,2.35rem)] font-black uppercase leading-[1.06] tracking-tight text-ink-hi"
            data-text={project.title}
          >
            {project.title}
          </h3>
          <p className="neon-lime mt-3 text-[1.02rem] leading-snug">
            {project.oneLiner}
          </p>

          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ink-dim">
            {project.description}
          </p>

          {/* Stat readout — structural facts, not benchmark claims */}
          <dl className="mt-7 grid grid-cols-3 gap-2">
            {project.metrics.map((m) => (
              // column-reverse puts the value on top visually while the markup
              // keeps the required <dt> before <dd> order.
              <div
                key={m.label}
                className="flex flex-col-reverse gap-1.5 border border-violet/30 bg-violet/8 px-2.5 py-3 text-center"
              >
                <dt className="font-display text-[8px] uppercase leading-tight tracking-[0.14em] text-ink-faint">
                  {m.label}
                </dt>
                <dd className="hyphens-auto break-words font-display text-[clamp(0.8rem,2vw,1.15rem)] font-black leading-none text-cyan">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-7 space-y-3">
            {project.points.map((p) => (
              <li key={p} className="flex gap-3 text-[0.9rem] leading-relaxed text-ink-dim">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-magenta" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="token">
                {s}
              </span>
            ))}
          </div>

          {(project.repo || project.demo) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.demo ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-sm btn-primary"
                  data-cursor="open"
                >
                  Live
                </a>
              ) : null}
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-sm"
                  data-cursor="code"
                >
                  <GithubMark className="h-3 w-3" />
                  Source
                </a>
              ) : null}
            </div>
          )}
        </div>

        {/* Diagram */}
        <div className={cn("flex flex-col justify-center", flip && "lg:order-1")}>
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectVisual id={project.id} title={project.title} />
          </motion.div>
          <p className="pixel mt-3">
            Fig {pad2(index + 1)} — {project.title}
          </p>
        </div>
      </div>
    </article>
  );
}

export function BossFights() {
  return (
    <section id="work" className="section-pad relative">
      <div className="shell">
        <LevelHead
          num="03"
          tag="Boss Fights"
          label="Work"
          headline="Five systems, taken end to end."
          lede="Backends don't photograph well, so each of these leads with what was actually built. The diagrams are drawn from the architecture, not from a screenshot."
        />

        <div className="mt-12">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.02}>
              <Boss project={project} index={i} />
            </Reveal>
          ))}
        </div>

        {/* In progress */}
        <div className="mt-10">
          <p className="pixel pixel-cyan border-t border-violet/30 pt-4">
            Currently building
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {inProgress.map((item) => (
              <Reveal key={item.title}>
                <li className="panel brackets relative h-full p-5">
                  <span className="hud text-gold">{item.label}</span>
                  <p className="mt-2.5 font-display text-base font-black uppercase tracking-tight text-ink-hi">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                    {item.note}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Archive */}
        <div className="mt-10">
          <p className="pixel border-t border-violet/30 pt-4">Also built</p>
          <ul className="mt-5">
            {archiveProjects.map((p) => (
              <li
                key={p.id}
                className="grid gap-2 border-b border-violet/20 py-5 lg:grid-cols-[16rem_1fr] lg:gap-10"
              >
                <div>
                  <p className="font-display text-sm font-black uppercase tracking-tight text-ink-hi">
                    {p.title}
                  </p>
                  <p className="pixel mt-1.5">{p.year}</p>
                </div>
                <div>
                  <p className="text-[0.9rem] leading-relaxed text-ink-dim">{p.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="token">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
