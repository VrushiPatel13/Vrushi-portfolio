"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, socials } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

const FIELD =
  "w-full border-b border-rule bg-transparent py-2.5 font-serif text-[0.9375rem] text-ink placeholder:text-ink-mute transition-colors duration-300 focus:border-accent focus:outline-none";

export function BackPage() {
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
        <SectionHead
          num="07"
          department="The Back Page"
          label="Contact"
          headline="Let's build something that ships."
          lede="Open to internships, freelance work and research collaborations. Email is the fastest way to reach me."
        />

        {/* Email, set large */}
        <Reveal>
          <div className="mt-12 border-y border-rule py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="write"
                className="group font-display text-[clamp(1.5rem,5.5vw,3.25rem)] font-bold tracking-[-0.03em] text-ink-hi transition-colors duration-300 hover:text-accent"
              >
                {profile.email}
              </a>

              <div className="flex shrink-0 gap-3">
                <button onClick={copyEmail} className="btn btn-sm">
                  {copied ? "Copied" : "Copy address"}
                </button>
                <a href={`mailto:${profile.email}`} className="btn btn-sm btn-solid">
                  Open mail
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          {/* Form */}
          <Reveal>
            <form onSubmit={onSubmit}>
              <p className="label label-accent">Or write from here</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label block">
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
                  <label htmlFor="email" className="label block">
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

              <div className="mt-6">
                <label htmlFor="subject" className="label block">
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

              <div className="mt-6">
                <label htmlFor="message" className="label block">
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

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="font-serif text-sm text-live"
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
                      className="font-serif text-sm text-accent"
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
                      className="font-serif text-sm text-flag"
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
            <div className="lg:border-l lg:border-rule lg:pl-14">
              <p className="label label-accent">Elsewhere</p>

              <ul className="mt-6">
                {socials.map((s) => (
                  <li key={s.label} className="border-b border-rule">
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      data-cursor="open"
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="flex items-center gap-3">
                        <SocialIcon
                          name={s.icon}
                          className="h-3.5 w-3.5 text-ink-mute transition-colors duration-300 group-hover:text-accent"
                        />
                        <span className="font-display text-base font-bold text-ink-hi transition-colors duration-300 group-hover:text-accent">
                          {s.label}
                        </span>
                      </span>
                      <span className="font-mono text-[11px] text-ink-mute">
                        {s.handle}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-2">
                <p className="label flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-live" />
                  {profile.availability}
                </p>
                <p className="label">{profile.location}</p>
                <p className="label">{profile.timezone}</p>
              </div>

              <a href={profile.resume} download className="btn btn-sm mt-8 w-full">
                Download résumé
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
