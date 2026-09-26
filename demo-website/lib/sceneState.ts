/**
 * Mutable state shared between GSAP ScrollTrigger (writer) and the
 * React Three Fiber render loop (reader). Kept outside React so scroll
 * scrubbing never triggers re-renders.
 */
export const jarState = {
  x: 1, // horizontal offset, multiplied by the responsive layout factor
  y: 0,
  scale: 1,
  rotY: 0,
  lid: 0, // 0 = sealed, 1 = lifted
  steam: 0.55,
  glow: 1,
  hue: 0, // 0 = ember orange, 1 = deep red
};

export type JarState = typeof jarState;
