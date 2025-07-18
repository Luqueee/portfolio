import { ProjectsCard } from "@/components/blocks/Projects";
import { TechStack } from "@/components/blocks/TechStack";

import { Hero } from "@/components/hero/Hero";
import { Contests } from "@/components/blocks/Contests";
import { Studies } from "@/components/blocks/Studies";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-[1920px] w-full pb-8 mx-auto px-4 h-fit flex flex-col items-center  ">
      <Hero />
      <div className="mt-20 max-w-default w-full scroll-mt-32" id="studies">
        <Studies />
      </div>
      <div className="mt-20 max-w-default w-full scroll-mt-32" id="contests">
        <Contests />
      </div>
      <div className="mt-20 max-w-default w-full scroll-mt-32 flex justify-center items-center flex-col gap-8">
        <h3 className="text-3xl font-[700]">Currently working on</h3>
        <Link href={"https://kenabot.xyz"} target="_blank">
          <Image
            src={"/images/kenaLogo.png"}
            alt="kena logo"
            width={80}
            height={80}
            className="rounded-lg shadow-lg"
          />
        </Link>
      </div>

      <div className="mt-20 max-w-default w-full" id="tech-stack">
        <TechStack />
      </div>
      <div className="mt-20 max-w-default w-full scroll-mt-32" id="projects">
        <ProjectsCard />
      </div>
    </div>
  );
}
