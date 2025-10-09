import { ExperiencesCard } from "@/components/blocks/Experience";
import { ProjectsCard } from "@/components/blocks/Projects";
import { TechStack } from "@/components/blocks/TechStack";

import { Hero } from "@/components/hero/Hero";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="section flex justify-center items-center flex-col gap-8">
        <h3 className="text-3xl font-[700] relative">
          <span>Currently working on</span>
          <span className="absolute left-0 top-0 scale-101 -z-10 text-slate-200 blur-xs animate-pulse">
            Currently working on
          </span>
        </h3>
        <Link
          href={"https://kenabot.xyz"}
          target="_blank"
          className="relative hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <Image
            src={"/images/kenaLogo.png"}
            alt="kena logo"
            width={80}
            draggable={false}
            height={80}
            className="rounded-lg shadow-lg "
          />
          <Image
            src={"/images/kenaLogo.png"}
            alt="kena logo"
            width={80}
            draggable={false}
            height={80}
            className="rounded-lg shadow-lg absolute top-0 scale-110 -z-10 bg-amber-200 blur-sm animate-pulse"
          />
        </Link>
      </div>

      <div className="section" id="tech-stack">
        <TechStack />
      </div>
      <div className="section" id="experiences">
        <ExperiencesCard />
      </div>
      <div className="section" id="projects">
        <ProjectsCard />
      </div>
    </>
  );
}
