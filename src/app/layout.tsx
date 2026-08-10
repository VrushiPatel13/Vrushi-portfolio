import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { BootProvider } from "@/components/providers/BootProvider";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Contents } from "@/components/layout/Contents";
import { Colophon } from "@/components/layout/Colophon";
import { profile, socials } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const title = `${profile.name} — AI Engineer`;
const description =
  "Vrushi Patel — AI Engineer in Ahmedabad. Computer vision, retrieval-augmented LLM systems, and the backends that carry them.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description,
  applicationName: `${profile.name} — Portfolio`,
  keywords: [
    "Vrushi Patel",
    "AI Engineer",
    "Full Stack Developer",
    "Software Engineer",
    "Computer Vision",
    "Machine Learning",
    "RAG",
    "LangChain",
    "Python",
    "Next.js",
    "Django",
    "Java",
    "Ahmedabad",
    "portfolio",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: "/" },
  category: "technology",
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: siteUrl,
    siteName: `${profile.name} — Portfolio`,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "AI Engineer",
  description,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "L.J. University, Ahmedabad",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Computer Vision",
    "Machine Learning",
    "Retrieval-Augmented Generation",
    "Full Stack Development",
    "Software Engineering",
  ],
  sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="grain relative bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled payload — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <a
          href="#main"
          className="sr-only z-[9999] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-accent focus:px-5 focus:py-3 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-paper"
        >
          Skip to content
        </a>

        <BootProvider>
          <Preloader />
          <SmoothScroll />
          <Cursor />
          <Contents />

          <main id="main" className="relative z-0">
            {children}
          </main>

          <Colophon />
        </BootProvider>
      </body>
    </html>
  );
}
