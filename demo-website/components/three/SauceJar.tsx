"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { jarState } from "@/lib/sceneState";
import { drawLabel, makeKnurlTexture, makeLidTopTexture, makeSauceTexture } from "./textures";

const v = (x: number, y: number) => new THREE.Vector2(x, y);

// Outer glass silhouette (radius, height), bottom → lip.
const GLASS_PROFILE = [
  v(0, -1.1),
  v(0.68, -1.1),
  v(0.8, -1.085),
  v(0.87, -1.04),
  v(0.897, -0.97),
  v(0.9, -0.88),
  v(0.9, 0.58),
  v(0.892, 0.68),
  v(0.865, 0.77),
  v(0.815, 0.85),
  v(0.755, 0.91),
  v(0.725, 0.96),
  v(0.72, 1.0),
  v(0.72, 1.13),
];

// Sauce volume sits just inside the glass with a meniscus at the top.
const SAUCE_PROFILE = [
  v(0, -1.045),
  v(0.66, -1.045),
  v(0.79, -1.03),
  v(0.85, -0.98),
  v(0.868, -0.9),
  v(0.87, 0.6),
  v(0.858, 0.655),
  v(0.7, 0.668),
  v(0.35, 0.66),
  v(0, 0.658),
];

const LID_PROFILE = [
  v(0.0, 0.34),
  v(0.66, 0.34),
  v(0.74, 0.332),
  v(0.785, 0.305),
  v(0.8, 0.26),
  v(0.8, 0.03),
  v(0.79, 0.005),
  v(0.765, 0),
  v(0.74, 0.02),
];

const LABEL_ARC = Math.PI * 1.12;

export default function SauceJar() {
  const lid = useRef<THREE.Group>(null);
  const sauceMat = useRef<THREE.MeshPhysicalMaterial>(null);

  const geo = useMemo(
    () => ({
      glass: new THREE.LatheGeometry(GLASS_PROFILE, 128),
      sauce: new THREE.LatheGeometry(SAUCE_PROFILE, 96),
      lid: new THREE.LatheGeometry(LID_PROFILE, 128),
    }),
    [],
  );

  const tex = useMemo(() => {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 2560;
    labelCanvas.height = 768;
    drawLabel(labelCanvas);
    const label = new THREE.CanvasTexture(labelCanvas);
    label.colorSpace = THREE.SRGBColorSpace;
    label.anisotropy = 16;

    const knurl = makeKnurlTexture();
    return {
      labelCanvas,
      label,
      sauce: makeSauceTexture(),
      knurl,
      lidTop: makeLidTopTexture(),
    };
  }, []);

  // Web fonts load asynchronously: repaint canvas textures once they are ready.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      drawLabel(tex.labelCanvas);
      tex.label.needsUpdate = true;
      const top = makeLidTopTexture();
      tex.lidTop.image = top.image;
      tex.lidTop.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [tex]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (lid.current) {
      const k = jarState.lid;
      lid.current.position.y = THREE.MathUtils.damp(lid.current.position.y, 0.985 + k * 0.75, 6, dt);
      lid.current.rotation.y = THREE.MathUtils.damp(lid.current.rotation.y, k * Math.PI * 1.25, 5, dt);
      lid.current.rotation.z = THREE.MathUtils.damp(lid.current.rotation.z, k * 0.22, 5, dt);
      lid.current.position.x = THREE.MathUtils.damp(lid.current.position.x, k * 0.25, 5, dt);
    }
    if (sauceMat.current) {
      // Sauce "breathes" — a faint internal ember pulse.
      sauceMat.current.emissiveIntensity = 0.18 + Math.sin(t * 1.6) * 0.05 + jarState.lid * 0.15;
      if (tex.sauce) tex.sauce.offset.y = Math.sin(t * 0.2) * 0.01;
    }
  });

  return (
    <group>
      {/* Sauce */}
      <mesh geometry={geo.sauce} castShadow>
        <meshPhysicalMaterial
          ref={sauceMat}
          map={tex.sauce}
          color="#ffffff"
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.15}
          sheen={0.6}
          sheenColor="#ff9a4d"
          emissive="#ff2a00"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Glass */}
      <mesh geometry={geo.glass} renderOrder={2}>
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0.035}
          thickness={0.45}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0.02}
          specularIntensity={1}
          envMapIntensity={1.6}
          attenuationColor="#ffe6d2"
          attenuationDistance={4}
        />
      </mesh>

      {/* Glass lip bead */}
      <mesh position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.02, 16, 128]} />
        <meshPhysicalMaterial transmission={1} roughness={0.05} thickness={0.1} ior={1.5} />
      </mesh>

      {/* Neck threads */}
      {[1.03, 1.08].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0.05]}>
          <torusGeometry args={[0.725, 0.012, 12, 128]} />
          <meshPhysicalMaterial transmission={1} roughness={0.08} thickness={0.1} ior={1.5} />
        </mesh>
      ))}

      {/* Label */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.907, 0.907, 1.02, 160, 1, true, -LABEL_ARC / 2, LABEL_ARC]} />
        <meshPhysicalMaterial
          map={tex.label}
          roughness={0.55}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Lid */}
      <group ref={lid} position={[0, 0.985, 0]}>
        <mesh geometry={geo.lid} castShadow>
          <meshStandardMaterial
            color="#141110"
            metalness={0.85}
            roughness={0.32}
            bumpMap={tex.knurl}
            bumpScale={1.2}
            side={THREE.DoubleSide}
            envMapIntensity={1.2}
          />
        </mesh>
        <mesh position={[0, 0.341, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.66, 96]} />
          <meshStandardMaterial map={tex.lidTop} metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.803, 0.014, 12, 128]} />
          <meshStandardMaterial color="#ff5a1f" metalness={0.9} roughness={0.25} emissive="#ff3a00" emissiveIntensity={0.25} />
        </mesh>
      </group>
    </group>
  );
}
