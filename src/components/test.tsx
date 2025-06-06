"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AnimatedBox() {
  const boxRef = useRef(null);

  // Using useGSAP to run animation on mount
  useGSAP(() => {
    gsap.to(boxRef.current, { x: 200, duration: 1 });
  }, []);

  return (
    <div ref={boxRef} className="box">
      I'm animated!
    </div>
  );
}
