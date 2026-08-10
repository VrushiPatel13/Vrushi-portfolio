# Vrushi Patel — Portfolio

A developer portfolio built as a printed magazine: warm-black stock, cream ink, one
marigold spot colour, seven numbered departments, and hairline rules doing the
structural work. Nothing glows.

**Stack** — Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion ·
Three.js / react-three-fiber · Lenis

---

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Dev server with hot reload           |
| `npm run build`     | Production build                     |
| `npm start`         | Serve the production build           |
| `npm run lint`      | ESLint (`next/core-web-vitals` + TS) |
| `npm run typecheck` | `tsc --noEmit`                       |

> Don't run `npm run build` while `npm run dev` is running — both write to `.next`
> and the dev server will start serving broken assets. Stop one first.

---

## Editing your content

**Every word on the site lives in [`src/lib/data.ts`](src/lib/data.ts)** — profile,
essay, traits, field notes, projects, index, record, socials and the contents list.
All typed, all in one file. No component edits needed for a content change.

House style, if you're adding to it: short, plain, first person, no hype. If a
sentence can be cut, cut it.

Search the file for `TODO(vrushi)` to find what still needs your confirmation:

| What                      | Where          | Why                                                                            |
| ------------------------- | -------------- | ------------------------------------------------------------------------------ |
| `profile.siteUrl`         | top of file    | Drives canonical URL, sitemap and OG tags. Set your real domain.                |
| `repo` / `demo`           | `projects`     | Empty strings hide the buttons. Fill them to show Source / Live site.           |
| Certificate wording + URLs| `record`       | Titles came from your certificate PDFs — confirm the exact issuer wording.      |

### Swapping the résumé

`public/vrushi-patel-resume.pdf` is what every Résumé link downloads. Replace the
file in place.

---

## Environment variables

All optional — the site builds and runs with none of them. Copy `.env.example` to
`.env.local` to use them.

| Variable         | Effect if unset                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`   | Data Desk uses anonymous GitHub API access (60 req/hr per IP). A no-scope token raises this to 5,000.   |
| `RESEND_API_KEY` | The contact form falls back to opening the visitor's own mail client with the message pre-filled.       |
| `CONTACT_FROM`   | Defaults to Resend's test sender. Must be a domain verified in Resend.                                  |
| `CONTACT_TO`     | Defaults to the email in `data.ts`.                                                                     |

---

## Deploying

### Fastest — Vercel CLI, no GitHub needed

```bash
npx vercel --prod
```

Run it from the project root. It'll ask you to sign in, then a few setup questions —
accept the defaults, but **name the project `vrushi-portfolio`** so the URL reads
`vrushi-portfolio.vercel.app`. Subsequent deploys are the same one command.

### Alternative — GitHub, with auto-deploy on push

Push the repo to GitHub, then import it at [vercel.com/new](https://vercel.com/new).
The framework is auto-detected. Every push to `main` redeploys.

### After the first deploy

The canonical URL, sitemap and OG tags configure themselves from Vercel's
`VERCEL_PROJECT_PRODUCTION_URL` — there is nothing to edit. If you attach a custom
domain later, set `NEXT_PUBLIC_SITE_URL` to it and redeploy.

**Add a `GITHUB_TOKEN`.** Without one, the Data Desk section calls the GitHub API
anonymously from Vercel's shared IP pool, where the 60 requests/hour limit is often
already spent by other projects — your live stats would intermittently fall back to
the "unavailable" state. A fine-grained token with **no scopes** fixes it (it only
reads public data). Create one at
[github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens),
then add it under **Settings → Environment Variables** in Vercel.

---

## The design system

Tokens live in the `@theme` block at the top of
[`src/app/globals.css`](src/app/globals.css).

| Role       | Value     | Used for                                          |
| ---------- | --------- | ------------------------------------------------- |
| Stock      | `#0c0b0a` | Page background — warm black, not neutral         |
| Ink        | `#e9e2d7` | Body text, cream rather than white                |
| Ink (high) | `#fbf7f0` | Headlines                                         |
| Rule       | `#2a2521` | Every hairline on the page                        |
| Spot       | `#e9a63c` | Marigold. Section numbers, links, one word per headline |
| Live       | `#6aab8d` | Availability dots only                            |

Type is **Fraunces** for display, **Newsreader** for body, **IBM Plex Mono** for
labels. Every small label on the site is one class — `.label` — at 11px with
0.22em tracking. Change it once, it changes everywhere.

Contrast is AA throughout: the dimmest text (`--color-ink-mute`) is 5.4:1 on stock,
the spot colour 9.4:1.

---

## Structure

```
src/
├── app/
│   ├── layout.tsx            metadata, fonts, JSON-LD, chrome
│   ├── page.tsx              section composition
│   ├── globals.css           tokens + component primitives
│   ├── icon.tsx              generated favicon
│   ├── opengraph-image.tsx   generated 1200×630 social card
│   ├── robots.ts / sitemap.ts
│   └── api/contact/route.ts  validated, rate-limited contact endpoint
├── components/
│   ├── layout/               Preloader · Contents · Cursor · SmoothScroll · Colophon
│   ├── sections/             one file per department
│   ├── three/                MastheadCanvas — the armillary ornament
│   ├── ui/                   Reveal, SectionHead, SocialIcon
│   └── providers/            boot state
└── lib/                      data.ts, scroll.ts, utils.ts
```

### The seven departments

| No. | Department    | Section        |
| --- | ------------- | -------------- |
| 01  | Opening Essay | About          |
| 02  | Field Notes   | Experience     |
| 03  | The Feature   | Selected Work  |
| 04  | Data Desk     | By the Numbers |
| 05  | The Index     | Capabilities   |
| 06  | On Record     | Credentials    |
| 07  | The Back Page | Contact        |

---

## Notable implementation details

- **The preloader can't trap you.** Browsers pause `requestAnimationFrame` in
  background tabs and suspend timers entirely in frozen ones — either would leave a
  visitor staring at a stuck loading screen with scrolling locked. There's a
  `setTimeout` watchdog *and* a `visibilitychange` handler that checks the wall
  clock, so the gate always opens.
- **Data Desk is live.** A server component reading the GitHub API with a one-hour
  `revalidate`. If the API is rate-limited it renders an honest "unavailable" state
  rather than stale or invented numbers.
- **No proficiency bars.** The Index lists what's in the working vocabulary, grouped
  and counted. Percentage skill bars are made-up numbers and read as such.
- **Project metrics are structural facts**, not benchmarks — `4-stage lifecycle`,
  `SKU-level detection` — because unmeasured performance claims don't belong on a CV.
- **The diagrams are drawn from the architecture.** Five hand-built SVGs in the same
  two inks as the page: a shelf detection pass, a retrieval graph with citations, a
  consignment lifecycle, a marketplace model, an agent loop.
- **The ornament** is an armillary sphere in thin lines — dynamically imported,
  mounted only after boot, DPR-capped, and degraded automatically by drei's
  `PerformanceMonitor`. Reduced-motion visitors get a static ring.
- **No GSAP.** It was here to drive Lenis off a shared ticker while ScrollTrigger
  pinned a horizontal showcase. The editorial layout scrolls vertically, so
  ScrollTrigger went, and with it the reason for GSAP — Lenis now runs on a plain
  rAF loop and every reveal is Framer Motion's `whileInView`.

### Accessibility

Single `<h1>`, logical heading order, skip link, labelled landmarks and form fields,
a real `<table>` with scoped headers for the language mix, `<dl>` for project
metrics (column-reversed so the value reads first without breaking `dt`/`dd` order),
`rel="noopener"` on every external link, and a global `prefers-reduced-motion` block
— with the heavier effects (cursor, WebGL, smooth scroll, diagram animation) opting
out at the source rather than just running faster.
