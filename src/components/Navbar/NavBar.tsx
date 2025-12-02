"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { NavButtons, NavButtonsMobile } from "./NavButtons";
import { motion } from "motion/react";
import useWindow from "@/hooks/useWindow";

export const NavBar = () => {
  const container = useRef<HTMLHeadingElement>(null);
  const { isDesktop, loading } = useWindow();

  return (
    <header ref={container} className="fixed top-0 left-0 w-screen z-50">
      <div className=" flex justify-between relative bg-zinc-900/50 backdrop-blur-sm mt-4 items-center md:lg:max-w-[1000px] max-w-[95vw] h-15 rounded-full px-4  mx-auto w-full">
        <Link
          href={"/"}
          onMouseOver={() => gsap.to(".menu", { y: -3 })}
          onMouseLeave={() => gsap.to(".menu", { y: 0 })}
          className="menu relative z-50"
        >
          <div className="w-6 h-6 bg-white rounded-full" />
          <div className="absolute inset-0 m-auto scale-105 z-40 blur-xs animate-pulse w-6 h-6 bg-white rounded-full" />
        </Link>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className=" rounded-full absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center gap-1"
        >
          {loading ? null : isDesktop ? <NavButtons /> : <NavButtonsMobile />}
        </motion.div>
      </div>
    </header>
  );
};
