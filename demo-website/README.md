# Molten — gourmet sauce landing page

A premium, scroll-driven ecommerce landing page for **Molten**, a fictional small-batch hot sauce brand.

**Stack:** Next.js (App Router) · Tailwind CSS v4 · React Three Fiber + drei · GSAP ScrollTrigger · Framer Motion

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What's inside

| Area | Where | Notes |
| --- | --- | --- |
| 3D hero jar | `components/three/` | Lathe-modelled glass (physical transmission), speckled sauce, knurled metal lid, canvas-drawn wrap label. Reflections come from drei `Lightformer`s, so no HDR download is needed. |
| Steam | `components/three/Steam.tsx` | Billboarded planes with an fbm-noise shader; intensity follows scroll. |
| Spice particles | `components/three/Spices.tsx` | Instanced chili flakes, peppercorns and seeds orbiting the jar, pushed away by the pointer. |
| Dynamic lighting | `components/three/Scene.tsx` | Pointer-following key light, orbiting ember light, pulsing rim light, glow backdrop the glass refracts. |
| Scroll story | `components/HeroStory.tsx` | A 620vh sticky section. A scrubbed GSAP timeline writes to `lib/sceneState.ts`, and the R3F loop reads it: the jar travels across three chapters, then the lid lifts and steam surges. |
| Shop | `components/Products.tsx`, `components/Cart.tsx` | Filterable product grid with 3D tilt cards and a spring cart drawer with a free-shipping meter. |
| Flavors | `components/Flavors.tsx` | Pinned horizontal scroll with parallax words and Scoville meters (`containerAnimation`). |
| Micro-interactions | `Cursor`, `Magnetic`, `Reveal`, `Preloader`, `Nav` | Blend-mode cursor with labels, magnetic buttons, masked reveals, preloader, hide-on-scroll nav. |

Textures (grain, turbulence) are inline SVG, and fonts load via `next/font` (Anton, Space Grotesk, Instrument Serif).
