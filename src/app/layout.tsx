import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "@/components/Navbar/NavBar";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Silk from "@/components/ui/Background";
import { Footer } from "@/components/blocks/Footer";
import { Analytics } from "@vercel/analytics/next";
import { getRedisClient } from "../redis";
import { SpotifyCard } from "@/components/spotify/SpotifyCard";
import { AnimatePresence } from "motion/react";
import { ogUrl } from "@/lib/og";
import Script from "next/script";

gsap.registerPlugin(useGSAP);
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const title = "Luqueee Portfolio";
  const subtitle = "Fullstack Developer";
  const site = "luqueee.dev";
  const description =
    "Luqueee's personal website showcasing projects, skills, and contact information.";
  const image = ogUrl(process.env.SITE_URL!, {
    title,
    subtitle,
    site,
  });

  // console.log("Generated OG image URL:", image);

  const metadata: Metadata = {
    title: {
      default: "Luqueee Portfolio",
      template: "%s | Luqueee Portfolio",
    },
    description:
      "Luqueee's personal website showcasing projects, skills, and contact information.",
    metadataBase: new URL("https://luqueee.dev"),
    authors: [{ name: "Luqueee", url: "https://luqueee.dev" }],
    openGraph: {
      title,
      description,
      url: image,
      siteName: title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },
  };

  return metadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Luqueee",
    url: "https://luqueee.dev",
    sameAs: [
      "https://github.com/luqueee",
      "https://www.linkedin.com/in/luqueee",
      // add more
    ],
    jobTitle: "Front-End Developer",
  };

  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Luqueee Portfolio",
    url: "https://luqueee.dev",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://luqueee.dev/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} ${inter.variable} antialiased max-w-screen overflow-x-hidden pb-25 px-4`}
      >
        {/* <Scene /> */}
        <div className="h-screen w-screen opacity-10 fixed top-0 left-0 -z-0">
          <Silk
            speed={8}
            scale={1.2}
            color="#ffffff"
            noiseIntensity={3}
            rotation={0}
          />
        </div>
        <div className="fixed right-4 bottom-4 z-[99999]">
          <AnimatePresence mode="wait">
            <SpotifyCard />
          </AnimatePresence>
        </div>
        <NavBar />
        <div className="max-w-[1920px] w-full pb-8 mx-auto px-4 h-fit flex flex-col items-center ">
          {children}
        </div>
        <Footer />
        <Analytics mode="production" />
        <Script
          id="ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
        />
      </body>
    </html>
  );
}
