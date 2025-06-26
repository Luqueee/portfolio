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
import { useState } from "react";

const Links = [
  {
    href: "/#top",
    label: "Home",
    icon: IconHomeFilled,
  },
  {
    href: "/#studies",
    label: "Studies",
    icon: IconClipboardFilled,
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
export const NavButtons = () => {
  const { isDesktop, loading } = useWindow();
  const [openMenu, setOpenMenu] = useState(false);
  if (loading) return null;

  if (!isDesktop)
    return (
      <>
        <button
          onClick={() => setOpenMenu((prev) => !prev)}
          type="button"
          className="ml-auto mr-6"
        >
          {openMenu ? <IconX /> : <IconMenu2 />}
        </button>

        <AnimatePresence mode="wait">
          {openMenu && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="  w-full left-0 rounded-lg px-2 py-1 absolute bg-zinc-800/70 backdrop-blur-md translate-y-28"
            >
              {Links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-2 px-2 py-1 text-white"
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );

  return (
    <>
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
    </>
  );
};
