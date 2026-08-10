"use client";

import { projects, archiveProjects, onTheDesk, type Project } from "@/lib/data";
import { ProjectVisual } from "@/components/sections/ProjectVisual";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { GithubMark } from "@/components/ui/SocialIcon";
import { pad2 } from "@/lib/utils";

function Feature({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;

  return (
    <article className="border-t border-rule py-12 lg:py-16">
      {/* Kicker line */}
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] tabular-nums tracking-[0.16em] text-accent">
            {pad2(index + 1)}
          </span>
          <span className="label label-ink">{project.category}</span>
        </div>
        <div className="flex items-baseline gap-4">
          <span className="label">{project.year}</span>
          <span className="label flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  project.status === "Live"
                    ? "var(--color-live)"
                    : project.status === "In development"
                      ? "var(--color-accent)"
                      : "var(--color-ink-mute)",
              }}
            />
            {project.status}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Copy */}
        <div className={flip ? "lg:order-2" : undefined}>
          <h3 className="font-display text-[clamp(1.75rem,4vw,2.9rem)] font-bold leading-[1.04] tracking-[-0.03em]">
            {project.title}
          </h3>
          <p className="mt-3 font-serif text-[1.15rem] italic leading-snug text-accent">
            {project.oneLiner}
          </p>

          <p className="mt-5 max-w-xl font-serif text-[1rem] leading-relaxed text-ink-dim">
            {project.description}
          </p>

          {/* Metrics — structural facts, not benchmarks */}
          <dl className="mt-8 grid grid-cols-3 gap-px border border-rule bg-rule">
            {project.metrics.map((m) => (
              // column-reverse so the value reads first visually while the
              // markup keeps the required <dt> before <dd> order.
              <div
                key={m.label}
                className="flex flex-col-reverse gap-2 bg-paper px-3 py-4 text-center"
              >
                <dt className="font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-ink-mute">
                  {m.label}
                </dt>
                <dd className="hyphens-auto break-words font-display text-[clamp(0.875rem,2.4vw,1.4rem)] font-bold leading-none text-ink-hi">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 space-y-3">
            {project.points.map((p) => (
              <li key={p} className="flex gap-3 font-serif text-[0.9375rem] leading-relaxed text-ink-dim">
                <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {project.stack.map((s, si) => (
              <span key={s} className="font-mono text-[11px] text-ink-dim">
                {s}
                {si < project.stack.length - 1 ? (
                  <span className="px-1.5 text-ink-mute">/</span>
                ) : null}
              </span>
            ))}
          </div>

          {(project.repo || project.demo) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.demo ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-sm btn-solid"
                  data-cursor="open"
                >
                  Live site
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

        {/* Plate */}
        <div className={flip ? "lg:order-1" : undefined}>
          <ProjectVisual id={project.id} title={project.title} />
          <p className="label mt-3">
            Fig. {pad2(index + 1)} — {project.title}
          </p>
        </div>
      </div>
    </article>
  );
}

export function FeatureWell() {
  return (
    <section id="work" className="section-pad relative">
      <div className="shell">
        <SectionHead
          num="03"
          department="The Feature"
          label="Selected Work"
          headline="Five systems, taken end to end."
          lede="Backends don't photograph well, so each of these leads with what was actually built. The diagrams are drawn from the architecture, not from a screenshot."
        />

        <div className="mt-12">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.03}>
              <Feature project={project} index={i} />
            </Reveal>
          ))}
        </div>

        {/* On the desk */}
        <div className="mt-6 border-t border-rule pt-10">
          <p className="label label-accent">On the desk</p>
          <ul className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-3">
            {onTheDesk.map((item) => (
              <li key={item.title} className="bg-paper p-5">
                <span className="label">{item.label}</span>
                <p className="mt-2.5 font-display text-base font-bold text-ink-hi">
                  {item.title}
                </p>
                <p className="mt-1.5 font-serif text-sm leading-relaxed text-ink-dim">
                  {item.note}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Archive */}
        <div className="mt-10 border-t border-rule pt-10">
          <p className="label">Also built</p>
          <ul className="mt-5">
            {archiveProjects.map((p) => (
              <li key={p.id} className="grid gap-2 border-b border-rule py-5 lg:grid-cols-[15rem_1fr] lg:gap-12">
                <div>
                  <p className="font-display text-base font-bold text-ink-hi">{p.title}</p>
                  <p className="label mt-1.5">{p.year}</p>
                </div>
                <div>
                  <p className="font-serif text-[0.9375rem] leading-relaxed text-ink-dim">
                    {p.blurb}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-ink-mute">
                    {p.stack.join(" / ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
