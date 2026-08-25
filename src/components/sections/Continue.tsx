"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { profile, socials } from "@/lib/data";
import { LevelHead } from "@/components/ui/LevelHead";
import { Reveal } from "@/components/ui/Reveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

const FIELD =
  "w-full border border-violet/30 bg-violet/8 px-3.5 py-2.5 text-[0.925rem] text-ink placeholder:text-ink-faint transition-colors duration-300 focus:border-cyan focus:outline-none";

/** A 10-second arcade continue countdown — decorative, never blocks anything. */
function ContinueCounter() {
  const [n, setN] = useState(9);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setN((v) => (v === 0 ? 9 : v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <span className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none text-magenta tabular-nums">
      {n}
    </span>
  );
}

export function Continue() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked — the mailto link beside it still works. */
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        configured?: boolean;
        error?: string;
      };

      if (json.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      // No mail provider configured — hand off to the visitor's own mail client
      // with everything pre-filled, so the message still gets through.
      if (json.configured === false) {
        const body = `${data.message}\n\n—\n${data.name} · ${data.email}`;
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
          data.subject || "Portfolio enquiry",
        )}&body=${encodeURIComponent(body)}`;
        setStatus("mailto");
        return;
      }

      setError(json.error ?? "Something went wrong.");
      setStatus("error");
    } catch {
      setError("Network error — email me directly instead.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-pad relative">
      <div className="shell">
        <LevelHead num="07" tag="Continue?" label="Contact" />

        {/* Continue screen */}
        <Reveal>
          <div className="panel brackets relative mt-9 flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <p className="pixel pixel-cyan animate-blink">Continue?</p>
            <ContinueCounter />
            <h2 className="font-display text-[clamp(1.5rem,4.5vw,2.8rem)] font-black uppercase leading-tight tracking-tight">
              Let&rsquo;s build something that ships.
            </h2>
            <p className="max-w-lg text-[0.975rem] leading-relaxed text-ink-dim">
              Open to internships, freelance work and research collaborations. Email is
              the fastest way to reach me.
            </p>

            <a
              href={`mailto:${profile.email}`}
              data-cursor="write"
              className="neon-cyan mt-2 font-display text-[clamp(1rem,3.6vw,2rem)] font-black tracking-tight transition-opacity duration-300 hover:opacity-80"
            >
              {profile.email}
            </a>

            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <button onClick={copyEmail} className="btn btn-sm">
                {copied ? "Copied" : "Copy address"}
              </button>
              <a href={`mailto:${profile.email}`} className="btn btn-sm btn-primary">
                Open mail
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Form */}
          <Reveal>
            <form onSubmit={onSubmit}>
              <p className="pixel pixel-lime">Or write from here</p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="hud mb-2 block">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="hud mb-2 block">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="subject" className="hud mb-2 block">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  maxLength={200}
                  placeholder="Internship · Freelance · Collaboration"
                  className={FIELD}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="hud mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={4}
                  placeholder="What are you building, and where do I fit?"
                  className={cn(FIELD, "resize-none")}
                />
              </div>

              {/* Honeypot — hidden from humans and screen readers alike. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                  data-cursor="send"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>

                <AnimatePresence mode="wait">
                  {status === "sent" && (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-live"
                    >
                      Sent — I&rsquo;ll be in touch.
                    </motion.span>
                  )}
                  {status === "mailto" && (
                    <motion.span
                      key="mailto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-cyan"
                    >
                      Opening your mail app…
                    </motion.span>
                  )}
                  {status === "error" && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-danger"
                    >
                      {error}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>

          {/* Elsewhere */}
          <Reveal delay={0.08}>
            <div>
              <p className="pixel pixel-magenta">Elsewhere</p>

              <ul className="mt-5 grid gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      data-cursor="open"
                      className="group flex items-center justify-between gap-4 border border-violet/30 bg-violet/6 px-4 py-3.5 transition-colors duration-300 hover:border-cyan/70"
                    >
                      <span className="flex items-center gap-3">
                        <SocialIcon
                          name={s.icon}
                          className="h-4 w-4 text-ink-faint transition-colors duration-300 group-hover:text-cyan"
                        />
                        <span className="font-display text-sm font-black uppercase tracking-tight text-ink-hi transition-colors duration-300 group-hover:text-cyan">
                          {s.label}
                        </span>
                      </span>
                      <span className="text-[0.8rem] text-ink-faint">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-7 space-y-2">
                <p className="pixel pixel-lime flex items-center gap-2">
                  <span className="h-2 w-2 bg-live" />
                  {profile.availability}
                </p>
                <p className="pixel">{profile.location}</p>
                <p className="pixel">{profile.timezone}</p>
              </div>

              <a href={profile.resume} download className="btn btn-sm mt-7 w-full">
                Download résumé
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
