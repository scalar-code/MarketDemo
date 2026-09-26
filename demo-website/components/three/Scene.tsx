"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { jarState } from "@/lib/sceneState";
import SauceJar from "./SauceJar";
import Steam from "./Steam";
import Spices from "./Spices";
import { makeGlowTexture, makeShadowTexture } from "./textures";

const ORANGE = new THREE.Color("#ff5a1f");
const RED = new THREE.Color("#ff1f0a");

function Rig() {
  const stage = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const key = useRef<THREE.SpotLight>(null);
  const glow = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const wide = size.width >= 900;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { pointer } = state;

    if (stage.current) {
      // Desktop: jar travels left/right between story chapters. Mobile: stays centred, sits higher.
      const spread = wide ? Math.min(viewport.width * 0.22, 2.6) : 0;
      const tx = jarState.x * spread;
      const ty = jarState.y + (wide ? 0 : 0.95);
      const ts = jarState.scale * (wide ? 0.9 : 0.6);
      const s = stage.current;
      s.position.x = THREE.MathUtils.damp(s.position.x, tx, 4, dt);
      s.position.y = THREE.MathUtils.damp(s.position.y, ty, 4, dt);
      const sc = THREE.MathUtils.damp(s.scale.x, ts, 4, dt);
      s.scale.setScalar(sc);
    }

    if (spinner.current) {
      const target = jarState.rotY + t * 0.22 + pointer.x * 0.45;
      spinner.current.rotation.y = THREE.MathUtils.damp(spinner.current.rotation.y, target, 3, dt);
      spinner.current.rotation.x = THREE.MathUtils.damp(spinner.current.rotation.x, -pointer.y * 0.12, 3, dt);
    }

    tmpColor.copy(ORANGE).lerp(RED, jarState.hue);

    // Orbiting warm light sweeps highlights across the glass.
    if (orbit.current) {
      orbit.current.position.set(Math.cos(t * 0.6) * 4, 1.5 + Math.sin(t * 0.9) * 1.2, Math.sin(t * 0.6) * 4);
      orbit.current.intensity = 18 * jarState.glow;
      orbit.current.color.copy(tmpColor);
    }
    if (rim.current) {
      rim.current.intensity = (35 + Math.sin(t * 2.2) * 6) * jarState.glow;
      rim.current.color.copy(tmpColor);
    }
    // Key light follows the pointer.
    if (key.current) {
      key.current.position.x = THREE.MathUtils.damp(key.current.position.x, 3 + pointer.x * 4, 3, dt);
      key.current.position.y = THREE.MathUtils.damp(key.current.position.y, 5 + pointer.y * 2, 3, dt);
    }
    if (glow.current) {
      // Brighten the backdrop without shifting its (page-matching) edge colour much.
      const m = glow.current.material as THREE.MeshBasicMaterial;
      const k = 0.9 + (jarState.glow - 1) * 0.35 + Math.sin(t * 1.3) * 0.05;
      m.color.setRGB(k, k * (1 - jarState.hue * 0.15), k * (1 - jarState.hue * 0.25));
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight
        ref={key}
        position={[3, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={90}
        color="#fff1e6"
      />
      <pointLight ref={rim} position={[-2.5, 1.5, -2.5]} intensity={35} distance={12} />
      <pointLight ref={orbit} position={[4, 1, 0]} intensity={18} distance={10} />

      <group ref={stage}>
        {/* Backdrop glow — also what the glass refracts */}
        <mesh ref={glow} position={[0, 0.1, -4]} scale={34}>
          <planeGeometry />
          <meshBasicMaterial map={glowTex} toneMapped={false} />
        </mesh>

        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35} floatingRange={[-0.08, 0.08]}>
          <group ref={spinner}>
            <SauceJar />
          </group>
        </Float>

        <Steam />
        <Spices density={wide ? 1 : 0.6} />
        <Sparkles count={wide ? 60 : 30} scale={[5, 4, 3]} size={3.2} speed={0.35} color="#ff7a2e" opacity={0.8} />

        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[3.2, 2.2, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.9} />
        </mesh>
      </group>

      {/* Studio lightformers give the glass its reflections without any HDR download */}
      <Environment resolution={1024} frames={1}>
        <group rotation={[0, 0.4, 0]}>
          <Lightformer form="rect" intensity={4} position={[0, 4, -6]} scale={[10, 2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={6} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 1.2, 1]} color="#fff4ea" />
          <Lightformer form="rect" intensity={3} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 0.6, 1]} color="#ff7a3a" />
          <Lightformer form="rect" intensity={2.5} position={[2, 3, 6]} scale={[3, 1, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.5} position={[0, -3, 3]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#ff4d12" />
        </group>
      </Environment>
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 7.4], fov: 32 }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color("#0a0706");
      }}
    >
      <Rig />
    </Canvas>
  );
}
