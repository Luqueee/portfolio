import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Silk from "@/components/ui/Background";

gsap.registerPlugin(useGSAP);
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luqueee",
  description: "Luqueee's personal website and portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} antialiased max-w-screen overflow-x-hidden grid grid-rows-[60px_1fr]`}
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
        <div>{children}</div>
      </body>
    </html>
  );
}
