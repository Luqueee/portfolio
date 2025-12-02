"use client";

import useWindow from "@/hooks/useWindow";
import {
  IconAwardFilled,
  IconBriefcaseFilled,
  IconClipboardFilled,
  IconHomeFilled,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect } from "react";

const Links = [
  {
    href: "/#top",
    label: "Home",
    icon: IconHomeFilled,
  },
  {
    href: "/about/#studies",
    label: "Studies",
    icon: IconClipboardFilled,
  },
  {
    href: "/about/#competitions",
    label: "Competitions",
    icon: IconAwardFilled,
  },
  {
    href: "/#experiences",
    label: "Experience",
    icon: IconBriefcaseFilled,
  },
  {
    href: "/#projects",
    label: "Projects",
    icon: IconBriefcaseFilled,
  },
];

export const NavButtonsMobile = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpenMenu((prev) => !prev)}
        type="button"
        className="ml-auto mr-6"
      >
        {openMenu ? <IconX /> : <IconMenu2 />}
      </button>

      <AnimatePresence mode="wait">
        {openMenu && (
          <motion.div
            ref={menuRef}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="w-full left-0 grid grid-cols-1 gap-2 rounded-lg p-3 absolute bg-zinc-900 backdrop-blur-md top-18"
          >
            {Links.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenMenu(false)}
                className=""
              >
                {/* <link.icon size={16} /> */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: idx * 0.1 } }}
                  exit={{ opacity: 0 }}
                  // transition={{
                  //   delay: 0.5 + idx * 0.1,
                  // }}
                  className="flex items-top gap-2 px-2 py-1 text-white bg-linear-to-br from-zinc-900 pt-4 pl-4 to-zinc-700 min-h-25 rounded-lg"
                >
                  <p className="text-xl">{link.label}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const NavButtons = () => {
  // Desktop code remains unchanged
  const [right, setRight] = useState<number | null>(-1);

  return (
    <>
      {Links.map((link, idx) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-2 px-2 py-1 text-white group bg-transparent transition-all duration-300 hover:bg-zinc-900/50 rounded-lg"
          onMouseEnter={() => setRight(idx)}
        >
          <link.icon size={16} />
          <span className="">{link.label}</span>
        </Link>
      ))}
      {/* {right !== null && (
        <motion.div
          className="bg-black/50 w-20 h-5 absolute"
          style={{ left: `${right * 100}px` }}
        />
      )} */}
    </>
  );
};
