"use client";
import { useState } from "react";
import { Socials } from "./Socials";
import { motion } from "motion/react";

export function Hero() {
  const [transitionDone, setTransitionDone] = useState(false);

  return (
    <>
      <div id="top" className=" mt-40 flex flex-col items-center gap-4">
        <motion.h2
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(181, 179, 179, 1) 50%, rgba(255, 255, 255, 1) 100%)",
          }}
          className="text-2xl font-[800] text-transparent bg-clip-text bg-[length:200%_100%]"
          animate={{ backgroundPositionX: ["0%", "200%"] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        >
          Adrià Cabrera Luque
        </motion.h2>
        <motion.h1
          style={{}}
          initial={{
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "#ffffff",
            backgroundImage:
              "linear-gradient(180deg,rgba(207, 202, 202, 1) 0%, rgba(207, 202, 202, 1) 50%, rgba(207, 202, 202, 1) 100%)",
          }}
          animate={{
            backgroundImage:
              "linear-gradient(180deg,rgba(207, 202, 202, 1) 0%, rgba(191, 189, 189, 1) 50%, rgba(48, 47, 47, 1) 100%)",
          }}
          transition={{
            duration: 1,
            delay: 0.2,
            ease: "easeInOut",
          }}
          className="md:lg:text-9xl text-6xl font-[600] w-full flex flex-col items-center "
        >
          <span
            // initial={{ x: -50 }}
            // animate={{
            //   x: 0,
            // }}
            // transition={{
            //   delay: 0.2,
            //   duration: 0.8,
            //   ease: "easeInOut",
            // }}
            // onAnimationComplete={() => {
            //   setTransitionDone(true);
            // }}
            style={{ display: "inline-block" }}
            id="fullstack"
          >
            <span
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{
            //   delay: 0.4,
            //   duration: 0.6,
            // }}
            >
              FULLSTACK
            </span>
          </span>

          <span
            // initial={{ x: 50 }}
            // animate={{ x: 0 }}
            // transition={{
            //   delay: 0.2,
            //   duration: 0.8,
            //   ease: "easeInOut",
            // }}
            style={{ display: "inline-block" }}
          >
            <span
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{
            //   delay: 0.4,
            //   duration: 0.6,
            // }}
            >
              DEVELOPER
            </span>
          </span>
        </motion.h1>
      </div>
      <div className="mt-10 flex md:lg:gap-8 gap-2">
        <Socials />
      </div>
    </>
  );
}
