import { NextResponse } from "next/server";
import { profile } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------ rate limiting ----------------------------- */

/**
 * Best-effort, per-instance sliding window. Serverless instances don't share
 * this map, so it slows abuse rather than stopping it — swap in Upstash or a
 * KV store if this ever needs to be authoritative.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

/* -------------------------------- validation ------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* --------------------------------- handler -------------------------------- */

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Bots fill hidden fields; humans never see this one.
  if (str(body.website, 100)) {
    return NextResponse.json({ ok: true, configured: true });
  }

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const subject = str(body.subject, 200) || "New message from your portfolio";
  const message = str(body.message, 5000);

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Tell me a little more — 10 characters minimum." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  // No provider wired up yet — tell the client so it can fall back to mailto.
  if (!apiKey) {
    return NextResponse.json({ ok: false, configured: false }, { status: 200 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? profile.email],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family:system-ui,sans-serif;line-height:1.6">
            <h2 style="margin:0 0 16px">New portfolio message</h2>
            <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "The mail service rejected the message." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, configured: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Couldn't reach the mail service." },
      { status: 502 },
    );
  }
}
