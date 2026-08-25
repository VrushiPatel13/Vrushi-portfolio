import type { Metadata, Viewport } from "next";
import { Orbitron, Press_Start_2P, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { BootProvider } from "@/components/providers/BootProvider";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Hud } from "@/components/layout/Hud";
import { Colophon } from "@/components/layout/Colophon";
import { SceneBackdrop } from "@/components/three/SceneBackdrop";
import { profile, socials } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
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
  themeColor: "#05030f",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.legalName,
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
      className={`${orbitron.variable} ${pressStart.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-void text-ink antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled payload — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <a
          href="#main"
          className="sr-only z-[9999] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-cyan focus:px-5 focus:py-3 focus:font-display focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-void"
        >
          Skip to content
        </a>

        <BootProvider>
          <Preloader />
          <SmoothScroll />
          <SceneBackdrop />
          <Cursor />
          <Hud />

          <main id="main" className="relative z-0">
            {children}
          </main>

          <Colophon />
        </BootProvider>
      </body>
    </html>
  );
}
