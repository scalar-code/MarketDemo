"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { jarState } from "@/lib/sceneState";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    // wispy, curling distortion
    float t = uTime * 0.35 + uSeed * 10.0;
    uv.x += (fbm(uv * 2.5 + vec2(0.0, -t)) - 0.5) * 0.45;
    float n = fbm(uv * vec2(3.0, 2.0) + vec2(uSeed, -t * 1.4));
    float column = smoothstep(0.5, 0.0, abs(uv.x - 0.5));
    float fadeY = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
    float a = column * fadeY * smoothstep(0.3, 0.75, n) * uOpacity;
    vec3 col = mix(vec3(1.0, 0.86, 0.74), vec3(1.0), vUv.y);
    gl_FragColor = vec4(col, a * 0.8);
  }
`;

type Puff = { seed: number; life: number; speed: number; x: number; z: number; spin: number };

/** Billboarded noise-shaded wisps rising from the jar opening. */
export default function Steam({ count = 9 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const puffs = useMemo<Puff[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        seed: Math.random() * 10,
        life: i / count,
        speed: 0.12 + Math.random() * 0.1,
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        spin: (Math.random() - 0.5) * 0.4,
      })),
    [count],
  );

  const materials = useMemo(
    () =>
      puffs.map(
        (p) =>
          new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            transparent: true,
            depthWrite: false,
            uniforms: { uTime: { value: 0 }, uSeed: { value: p.seed }, uOpacity: { value: 0 } },
          }),
      ),
    [puffs],
  );

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const intensity = jarState.steam;
    g.children.forEach((child, i) => {
      const p = puffs[i];
      p.life += dt * p.speed * (0.7 + intensity * 0.8);
      if (p.life > 1) {
        p.life = 0;
        p.x = (Math.random() - 0.5) * 0.5;
        p.z = (Math.random() - 0.5) * 0.5;
      }
      const l = p.life;
      child.position.set(p.x + Math.sin(l * 4 + p.seed) * 0.15, 1.35 + l * 2.2, p.z);
      const s = 0.6 + l * 1.6;
      child.scale.set(s, s * 1.6, 1);
      child.quaternion.copy(state.camera.quaternion);
      child.rotateZ(p.spin * l);
      const m = materials[i];
      m.uniforms.uTime.value = state.clock.elapsedTime;
      m.uniforms.uOpacity.value = Math.sin(l * Math.PI) * intensity;
    });
  });

  return (
    <group ref={group}>
      {materials.map((m, i) => (
        <mesh key={i} material={m} renderOrder={10}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
