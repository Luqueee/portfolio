"use client";
import { Socials } from "./Socials";
import { motion } from "motion/react";

export function Hero() {
  return (
    <>
      <div id="top" className=" mt-40 flex flex-col items-center gap-4">
        <h2 className="text-xl font-[600] text-gray-200 ">
          Adrià Cabrera Luque.
        </h2>
        <h1 className="md:lg:text-8xl text-6xl font-[600] w-full flex flex-col items-center">
          <motion.p
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{ display: "inline-block" }}
            id="fullstack"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
            >
              FULLSTACK
            </motion.span>
          </motion.p>

          <motion.p
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{ display: "inline-block" }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
            >
              DEVELOPER
            </motion.span>
          </motion.p>
        </h1>
      </div>
      <div className="mt-10 flex md:lg:gap-8 gap-2">
        <Socials />
      </div>
    </>
  );
}
