"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type Particle = {
  r: number;
  a: number;
  y: number;
  speed: number;
  drift: number;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  s: number;
};

function makeParticles(n: number, scale: [number, number]): Particle[] {
  return Array.from({ length: n }, () => ({
    r: 1.35 + Math.random() * 2.4,
    a: Math.random() * Math.PI * 2,
    y: (Math.random() - 0.5) * 4.2,
    speed: (0.04 + Math.random() * 0.12) * (Math.random() > 0.5 ? 1 : -1),
    drift: 0.05 + Math.random() * 0.15,
    rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(2),
    s: scale[0] + Math.random() * (scale[1] - scale[0]),
  }));
}

function SpiceLayer({
  geometry,
  material,
  count,
  scale,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  count: number;
  scale: [number, number];
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const parts = useMemo(() => makeParticles(count, scale), [count, scale]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    const px = state.pointer.x * 2.2;
    const py = state.pointer.y * 1.4;
    parts.forEach((p, i) => {
      p.a += p.speed * dt;
      p.y -= p.drift * dt;
      if (p.y < -2.4) p.y = 2.4;
      p.rot.x += p.spin.x * dt;
      p.rot.y += p.spin.y * dt;
      p.rot.z += p.spin.z * dt;
      let x = Math.cos(p.a) * p.r;
      const z = Math.sin(p.a) * p.r * 0.8;
      let y = p.y;
      // gentle pointer repulsion
      const dx = x - px;
      const dy = y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < 1.2) {
        const f = (1.2 - d2) * 0.35;
        x += dx * f;
        y += dy * f;
      }
      dummy.position.set(x, y, z);
      dummy.rotation.copy(p.rot);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />;
}

/** Chili flakes, peppercorns and seeds orbiting the jar. */
export default function Spices({ density = 1 }: { density?: number }) {
  const assets = useMemo(() => {
    const flake = new THREE.TetrahedronGeometry(1, 0);
    flake.scale(1, 0.25, 0.7);
    const corn = new THREE.IcosahedronGeometry(1, 1);
    const seed = new THREE.SphereGeometry(1, 10, 8);
    seed.scale(1, 0.35, 0.75);
    return {
      flake,
      corn,
      seed,
      flakeMat: new THREE.MeshStandardMaterial({ color: "#d9310b", roughness: 0.55, emissive: "#5a0c00", emissiveIntensity: 0.4 }),
      cornMat: new THREE.MeshStandardMaterial({ color: "#1c1210", roughness: 0.8, flatShading: true }),
      seedMat: new THREE.MeshStandardMaterial({ color: "#f3d59a", roughness: 0.45 }),
    };
  }, []);

  return (
    <group>
      <SpiceLayer geometry={assets.flake} material={assets.flakeMat} count={Math.round(90 * density)} scale={[0.03, 0.07]} />
      <SpiceLayer geometry={assets.corn} material={assets.cornMat} count={Math.round(40 * density)} scale={[0.025, 0.04]} />
      <SpiceLayer geometry={assets.seed} material={assets.seedMat} count={Math.round(60 * density)} scale={[0.02, 0.035]} />
    </group>
  );
}
