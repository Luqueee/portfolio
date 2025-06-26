import Link from "next/link";
import { GitHub, Instagram } from "../ui/Icons";
import { motion } from "motion/react";
import { IconSend } from "@tabler/icons-react";
const socials = [
  {
    icon: GitHub,
    href: "https://github.com/luqueee",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/adria.cabreraa",
  },
];

export const Socials = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Link
          href={"mailto:luqueee_@outlook.es"}
          className="inline-flex items-center gap-2 justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-10 px-4 py-2 relative group overflow-hidden bg-transparent text-gray-50 rounded-full hover:bg-transparent hover:text-gray-50 transition-transform duration-500 hover:scale-105"
        >
          <IconSend stroke={2} />
          <span>Contact me</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -translate-x-full group-hover:translate-x-full transition duration-700" />
        </Link>
      </motion.div>
      <div className="flex ">
        {socials.map((social, index) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              key={index}
            >
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 justify-center whitespace-nowrap text-sm font-medium  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  px-2 py-2 h-10 relative group  text-gray-50 rounded-full hover:bg-transparent hover:text-gray-50 transition-transform duration-500 hover:scale-105"
              >
                <social.icon className="w-8 h-8" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
