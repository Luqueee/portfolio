"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import {
  IconAwardFilled,
  IconBriefcaseFilled,
  IconHomeFilled,
} from "@tabler/icons-react";

const Links = [
  {
    href: "/#top",
    label: "Home",
    icon: IconHomeFilled,
  },
  {
    href: "/#contests",
    label: "Contests",
    icon: IconAwardFilled,
  },
  {
    href: "/#projects",
    label: "Projects",
    icon: IconBriefcaseFilled,
  },
];

export const NavBar = () => {
  const container = useRef<HTMLHeadingElement>(null);

  return (
    <header ref={container} className="fixed top-0 left-0 w-full z-50">
      <div className=" flex justify-between relative bg-zinc-900/50 backdrop-blur-sm mt-4 items-center md:lg:max-w-[1000px] max-w-[95vw] h-15 rounded-full px-4  mx-auto w-full">
        <Link
          href={"/"}
          onMouseOver={() => gsap.to(".menu", { y: -3 })}
          onMouseLeave={() => gsap.to(".menu", { y: 0 })}
          className="menu w-6 h-6 bg-white rounded-full z-50"
        ></Link>
        <div className=" rounded-full absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
          {Links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-2 py-1 text-white"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>
        <div></div>
      </div>
    </header>
  );
};
