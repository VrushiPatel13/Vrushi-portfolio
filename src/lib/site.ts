/**
 * The canonical origin, resolved at build time.
 *
 * Vercel injects VERCEL_PROJECT_PRODUCTION_URL (the stable production domain)
 * automatically, so a fresh deploy gets correct canonical URLs, sitemap entries
 * and OG tags with no configuration. Set NEXT_PUBLIC_SITE_URL to override —
 * you'll want that once a custom domain is attached.
 *
 * Server-only: keep this out of client components so the env lookups aren't
 * inlined as `undefined` in the browser bundle.
 */

const fromExplicit = process.env.NEXT_PUBLIC_SITE_URL;
const fromVercel =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const siteUrl = (
  fromExplicit ??
  (fromVercel ? `https://${fromVercel}` : "http://localhost:3000")
).replace(/\/+$/, "");
