"use client";

import { Canvas } from "@react-three/fiber";
import { CanvasScene } from "./Canvas";

export const Scene = () => {
  return (
    <>
      <div className="h-screen w-screen fixed top-0 left-0 -z-10">
        <Canvas
          //   flat
          //   gl={{ antialias: false }}
          //   dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 20, near: 0.01, far: 80 + 15 }}
        >
          <CanvasScene />
        </Canvas>
      </div>
    </>
  );
};
