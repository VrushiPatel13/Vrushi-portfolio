# Vrushi Patel — Portfolio

A developer portfolio built as an arcade cabinet: deep-space indigo, neon spot
colours, CRT scanlines, and a scroll-driven 3D corridor running behind the whole
page. Seven numbered levels instead of sections.

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

## Real data only

Everything on this site is verifiable:

- **Certificates** were read directly out of the certificate PDFs. Titles, issuers,
  dates and credential codes are transcribed, not paraphrased, and every one links
  to its live Coursera verification page. All six URLs were checked and return 200.
- **GitHub figures** are fetched from the API at build time with hourly
  revalidation. Nothing is typed in by hand. If the API is unreachable the section
  renders an honest "connection lost" state rather than stale or invented numbers.
- **Project metrics** are structural facts about each build (`4-stage lifecycle`,
  `SKU-level detection`), never unmeasured performance claims.
- **The Inventory** lists what's in the toolkit, grouped and counted. There are no
  proficiency percentages, because those would be numbers I made up.

**Everything you'd want to change lives in [`src/lib/data.ts`](src/lib/data.ts)** —
profile, about, traits, run history, projects, inventory, achievements, socials and
the level list. All typed, all in one file.

The only empty fields are the `repo` and `demo` URLs on each project. Empty strings
hide the buttons; fill them in and the Source / Live buttons appear.

---

## Environment variables

All optional — the site builds and runs with none of them. Copy `.env.example` to
`.env.local` to use them.

| Variable         | Effect if unset                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`   | Stats uses anonymous GitHub API access (60 req/hr per IP). A no-scope token raises this to 5,000.     |
| `RESEND_API_KEY` | The contact form falls back to opening the visitor's own mail client with the message pre-filled.     |
| `CONTACT_FROM`   | Defaults to Resend's test sender. Must be a domain verified in Resend.                                |
| `CONTACT_TO`     | Defaults to the email in `data.ts`.                                                                   |

---

## Deploying

### Fastest — Vercel CLI

```bash
npx vercel --prod
```

Name the project `vrushi-portfolio` when prompted so the URL reads
`vrushi-portfolio.vercel.app`.

### Or via GitHub

The repo is at
[github.com/VrushiPatel13/Vrushi-portfolio](https://github.com/VrushiPatel13/Vrushi-portfolio).
Import it at [vercel.com/new](https://vercel.com/new) and every push redeploys.

Canonical URL, sitemap and OG tags configure themselves from Vercel's
`VERCEL_PROJECT_PRODUCTION_URL` — nothing to edit. For a custom domain, set
`NEXT_PUBLIC_SITE_URL` and redeploy.

**Add a `GITHUB_TOKEN`.** Without one the Stats section calls GitHub anonymously
from Vercel's shared IP pool, where the hourly limit is often already spent — live
figures would intermittently fall back to the error state. A fine-grained token
with **no scopes** is enough; it only reads public data.

---

## The design system

Tokens live in the `@theme` block at the top of
[`src/app/globals.css`](src/app/globals.css).

| Role     | Value     | Used for                                     |
| -------- | --------- | -------------------------------------------- |
| Cabinet  | `#05030f` | Page background — indigo-black, not neutral  |
| Panel    | `#100a26` | Card and panel fills                         |
| Grid     | `#2a1f5c` | Corridor lines, borders                      |
| Cyan     | `#22e8ff` | Primary signal — level numbers, links, stats |
| Magenta  | `#ff3d9a` | Secondary — surnames, faults, boss numbers   |
| Lime     | `#a8ff3e` | Highlights and one-liners                    |
| Gold     | `#ffc93c` | In-development status                        |
| Live     | `#3ef29a` | Availability indicators                      |

Three typefaces, each with one job:

- **Orbitron** — display. Headlines, level numbers, buttons, HUD labels.
- **Press Start 2P** — true 8-bit pixel type, used *only* at 8px for cabinet
  labels. It's unreadable at any larger size, which is exactly why it stays small.
- **Space Grotesk** — body copy. Everything you actually have to read.

---

## The scroll-driven 3D scene

[`src/components/three/ArcadeScene.tsx`](src/components/three/ArcadeScene.tsx) is a
single fixed canvas behind the entire page. Scrolling flies the camera down a neon
corridor:

- **Infinite grid floor and ceiling** — two `gridHelper`s snapped to the nearest
  cell boundary ahead of the camera each frame, so the lines land in identical
  world positions and the corridor reads as genuinely endless rather than sliding.
- **A sliced synthwave sun** parked 150 units ahead, permanently out of reach.
- **Seven wireframe obstacles** at fixed points along the track — you fly past them
  as you scroll, which is what makes the scroll feel like travel.
- **A player-side core** riding just ahead of the camera. It takes its X/Y from the
  pointer, and flinches on scroll velocity so the scene feels connected to input.
  Its hue walks cyan → violet → magenta → lime across the run.
- **A starfield** and distance fog to close the horizon.

Scroll position lives in [`src/lib/scrollState.ts`](src/lib/scrollState.ts) — a
plain mutable object updated by a scroll listener, read inside `useFrame`.
Deliberately *not* React state: a 60fps scene driven through `useState` would
re-render the entire component tree every frame.

WebGL only starts after the boot sequence finishes and only when the visitor hasn't
asked for reduced motion. Otherwise a static CSS horizon and grid stand in, so the
page still reads as a cabinet without a single animated frame.

---

## Structure

```
src/
├── app/
│   ├── layout.tsx            metadata, fonts, JSON-LD, chrome
│   ├── page.tsx              level composition
│   ├── globals.css           tokens + arcade primitives
│   ├── icon.tsx              generated favicon
│   ├── opengraph-image.tsx   generated 1200×630 social card
│   ├── robots.ts / sitemap.ts
│   └── api/contact/route.ts  validated, rate-limited contact endpoint
├── components/
│   ├── layout/               Preloader · Hud · Cursor · SmoothScroll · Colophon
│   ├── sections/             one file per level
│   ├── three/                ArcadeScene + SceneBackdrop
│   ├── ui/                   Reveal, LevelHead, SocialIcon
│   └── providers/            boot state
└── lib/                      data.ts, scrollState.ts, scroll.ts, site.ts, utils.ts
```

### The seven levels

| Lv  | Tag          | Section    |
| --- | ------------ | ---------- |
| 01  | Origin       | About      |
| 02  | Run History  | Experience |
| 03  | Boss Fights  | Work       |
| 04  | Stats        | GitHub     |
| 05  | Inventory    | Skills     |
| 06  | Achievements | Awards     |
| 07  | Continue?    | Contact    |

---

## Notable implementation details

- **The preloader can't trap you.** Browsers pause `requestAnimationFrame` in
  background tabs and suspend timers entirely in frozen ones — either would leave a
  visitor staring at a stuck loading screen with scrolling locked. There's a
  `setTimeout` watchdog *and* a `visibilitychange` handler that checks the wall
  clock, so the gate always opens.
- **Project diagrams are hand-built SVGs** drawn from each system's architecture —
  a shelf detection pass, a retrieval graph with citations, a consignment lifecycle,
  a marketplace model, an agent loop — in the cabinet's own inks.
- **No GSAP.** Lenis runs on a plain rAF loop and every reveal is Framer Motion's
  `whileInView`, so there's no second animation library to keep in sync.

### Accessibility

Single `<h1>`, logical heading order, skip link, labelled landmarks and form fields,
scoped table headers, `<dl>` for project metrics (column-reversed so the value reads
first without breaking `dt`/`dd` order), `rel="noopener"` on every external link.

`prefers-reduced-motion` is honoured at the source, not just by shortening
durations: WebGL never starts, the custom cursor never mounts, Lenis stays off, the
diagram animations freeze, and the **CRT scanline overlay is removed entirely** —
a fine repeating line pattern is a migraine and photosensitivity trigger, so it
can't just be slowed down.
