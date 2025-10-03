"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls, Environment, Stats } from "@react-three/drei";
import * as THREE from "three";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
  SSAO,
} from "@react-three/postprocessing";
import { KernelSize, BlendFunction } from "postprocessing";

// --- Función que deforma con ruido procedural ---
function deformVertices(geo: THREE.BufferGeometry, time: number) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;

  for (let i = 0; i < arr.length; i += 3) {
    const x = arr[i];
    const y = arr[i + 1];
    const z = arr[i + 2];

    // usamos Perlin/Simplex noise "fake" con sin/cos
    const noise =
      Math.sin(x * 1.5 + time * 0.7) +
      Math.cos(y * 1.5 + time * 0.5) +
      Math.sin(z * 1.5 + time * 0.9);

    const scale = 0.2 * noise; // fuerza deformación

    arr[i] = x + x * scale * 0.01;
    arr[i + 1] = y + y * scale * 0.01;
    arr[i + 2] = z + z * scale * 0.01;
  }

  pos.needsUpdate = true;
}

export function CanvasScene() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  // geometría base (mismo nº de vértices siempre)
  const [geometry] = useState(
    () => new THREE.IcosahedronGeometry(1, 6) // subdivisiones altas para deformar
  );

  // target de movimiento
  const targetRef = useRef(new THREE.Vector3(0, 0, -5));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      // rotación continua
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;

      // movimiento hacia target
      meshRef.current.position.lerp(targetRef.current, delta * 0.2);

      // deformación orgánica de vértices
      deformVertices(meshRef.current.geometry as THREE.BufferGeometry, t);

      // animar color
      if (materialRef.current) {
        const hue = (Math.sin(t * 0.2) + 1) / 2;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
        materialRef.current.color.copy(color);
      }
    }

    // cada cierto tiempo se elige un nuevo "rumbo fijo"
    if (Math.floor(t) % 6 === 0) {
      targetRef.current.set(
        THREE.MathUtils.randFloatSpread(6),
        THREE.MathUtils.randFloatSpread(6),
        THREE.MathUtils.randFloat(-8, -4)
      );
    }
  });

  return (
    <>
      {/* luces */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="orange" />
      <pointLight position={[-5, -3, -5]} intensity={1.5} color="cyan" />

      {/* entorno HDRI */}
      <Environment preset="sunset" />

      {/* postprocesado */}
      <EffectComposer enableNormalPass>
        <DepthOfField focusDistance={0} focalLength={0.03} bokehScale={3} />
        <Bloom
          intensity={1.6}
          kernelSize={KernelSize.HUGE}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.3}
        />
        <SSAO intensity={25} radius={0.05} bias={0.02} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.001]}
        />
        <Noise opacity={0.07} />
        <Vignette eskil={false} offset={0.1} darkness={1.3} />
      </EffectComposer>

      {/* mesh mutante */}
      <mesh ref={meshRef} geometry={geometry} scale={1.4}>
        <meshStandardMaterial
          ref={materialRef}
          wireframe
          roughness={0.3}
          metalness={1}
        />
      </mesh>

      <OrbitControls enableZoom={false} />
      <Stats />
    </>
  );
}
