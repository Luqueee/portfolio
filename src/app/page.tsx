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
        <h3 className="text-3xl font-[700]">Currently working on</h3>
        <Link href={"https://kenabot.xyz"} target="_blank">
          <Image
            src={"/images/kenaLogo.png"}
            alt="kena logo"
            width={80}
            height={80}
            className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </Link>
      </div>

      <div className="section" id="tech-stack">
        <TechStack />
      </div>
      <div className="section" id="projects">
        <ProjectsCard />
      </div>
    </>
  );
}
