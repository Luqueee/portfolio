import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/Navbar/NavBar";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Silk from "@/components/ui/Background";
import { Footer } from "@/components/blocks/Footer";

gsap.registerPlugin(useGSAP);
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Luqueee Portfolio",
    template: "%s | Luqueee Portfolio",
  },
  description:
    "Luqueee's personal website showcasing projects, skills, and contact information.",
  metadataBase: new URL("https://luqueee.dev"),
  keywords: [
    "Luqueee",
    "Portfolio",
    "Web Developer",
    "Frontend",
    "React",
    "TypeScript",
    "Projects",
    "Software Engineer",
    "Personal Website",
  ],
  authors: [{ name: "Luqueee", url: "https://luqueee.dev" }],
  openGraph: {
    title: "Luqueee Portfolio",
    description:
      "Explore Luqueee's personal website, projects, and contact details.",
    url: "https://luqueee.dev",
    siteName: "Luqueee Portfolio",
    images: [
      {
        url: "https://luqueee.dev/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luqueee Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luqueee Portfolio",
    description: "Luqueee's personal website and portfolio.",
    images: ["https://luqueee.dev/images/og-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} antialiased max-w-screen overflow-x-hidden pb-4 px-4`}
      >
        <div className="h-screen w-screen opacity-10 fixed top-0 left-0 -z-50">
          <Silk
            speed={5}
            scale={1}
            color="#7B7481"
            noiseIntensity={3}
            rotation={0}
          />
        </div>
        <NavBar />
        <div className="max-w-[1920px] w-full pb-8 mx-auto px-4 h-fit flex flex-col items-center ">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
