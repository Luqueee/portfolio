"use client";
import { languages } from "@/shared/tech-stack";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
export const TechStack = () => {
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
          start: "top 80%",
          end: "bottom 100%",
          toggleActions: "play none none none",
          markers: false,
        },
      }
    );
  }, []);
  return (
    <div className=" w-full">
      <h3 className="text-4xl font-[700]">Tech Stack</h3>
      <div id="ref" className="grid md:lg:grid-cols-8 grid-cols-4 gap-4 mt-4">
        {languages.map((lang) => (
          <div
            key={lang.name}
            className={`lang border border-zinc-800 hover:bg-zinc-800/30 bg-zinc-900/10 backdrop-blur-md focus:bg-zinc-800 rounded-lg p-2 gap-2 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}
          >
            <Image
              src={lang.icon}
              alt={lang.name}
              draggable={false}
              loading="lazy"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              unoptimized
            />
            <p className="text-sm text-zinc-400 select-none">{lang.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
