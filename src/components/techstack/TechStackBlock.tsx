"use client";
import { languages } from "@/shared/tech-stack";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { TechStack } from "./TechStack";
import { isDev } from "@/lib/utils";
export const TechStackBlock = () => {
  useGSAP(() => {
    // Register ScrollTrigger plugin
    // Dynamically import ScrollTrigger to avoid SSR issues
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      ".lang",
      {
        opacity: 0,
        x: -10,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1, // Add stagger for delay between each lang
        scrollTrigger: {
          trigger: "#ref",
          once: true,
          start: "top 85%",
          end: "bottom 100%",
          toggleActions: "play none none none",
          markers: isDev(),
        },
      }
    );
  }, []);
  return (
    <div className=" w-full">
      <h3 className="text-4xl font-[700]">Tech Stack</h3>
      <div
        id="ref"
        className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-3 gap-4 mt-4"
      >
        {languages.map((lang) => (
          <TechStack lang={lang} key={lang.name} />
        ))}
      </div>
    </div>
  );
};
