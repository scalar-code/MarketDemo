"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { jarState } from "@/lib/sceneState";
import { useLoaded } from "@/lib/loader";
import Magnetic from "./Magnetic";
import Chili from "./Chili";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

const line: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: (i: number) => ({
    y: 0,
    rotate: 0,
    transition: { duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
};

const chapters = [
  {
    n: "01",
    kicker: "Open flame",
    title: ["Fire-roasted", "over oak."],
    body: "Sun-ripened habaneros are blistered over open oak embers until their skins char and their sugars turn to caramel.",
    stat: ["620°F", "Char temperature"],
    side: "right",
  },
  {
    n: "02",
    kicker: "Low & slow",
    title: ["Fourteen hours", "in copper."],
    body: "Roasted chilies, heirloom garlic and raw wildflower honey simmer in hammered copper kettles until the heat turns velvet.",
    stat: ["14 hrs", "Simmer time"],
    side: "left",
  },
  {
    n: "03",
    kicker: "Hand sealed",
    title: ["Sealed at the", "peak of heat."],
    body: "Every jar is hand-filled and sealed while still steaming — locking in aroma the way a mass-market bottle never could.",
    stat: ["312", "Jars per batch"],
    side: "center",
  },
] as const;

function RotatingBadge() {
  const text = "48,000 SCOVILLE · SMALL BATCH · HAND SEALED · ";
  return (
    <div className="relative size-28 md:size-36">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="7.4" letterSpacing="1.6" fill="currentColor" className="font-sans font-semibold">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-12 place-items-center rounded-full bg-ember text-ink md:size-14">
          <Chili className="size-7 -rotate-12" />
        </span>
      </div>
    </div>
  );
}

export default function HeroStory() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const loaded = useLoaded();

  useGSAP(
    () => {
      Object.assign(jarState, { x: 1, y: 0, scale: 1, rotY: 0, lid: 0, steam: 0.55, glow: 1, hue: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (progress.current) progress.current.style.transform = `scaleY(${self.progress})`;
          },
        },
      });

      const ch = gsap.utils.toArray<HTMLElement>(".chapter");
      const inFrom = { autoAlpha: 0, y: 80 };
      const outTo = { autoAlpha: 0, y: -80, duration: 0.3 };

      tl.to(".hero-copy", { yPercent: -25, autoAlpha: 0, duration: 0.6 }, 0)
        // chapter 1 — jar slides left
        .to(jarState, { x: -1, rotY: Math.PI, scale: 1.05, duration: 1 }, 0)
        .fromTo(ch[0], inFrom, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.7)
        .to(ch[0], outTo, 1.9)
        // chapter 2 — jar slides right, deeper glow
        .to(jarState, { x: 1, rotY: Math.PI * 2.2, glow: 1.35, duration: 1 }, 1.9)
        .fromTo(ch[1], inFrom, { autoAlpha: 1, y: 0, duration: 0.35 }, 2.6)
        .to(ch[1], outTo, 3.8)
        // chapter 3 — centre stage, lid lifts, steam surges
        .to(jarState, { x: 0, y: 0.55, scale: 0.8, rotY: Math.PI * 4, duration: 1 }, 3.8)
        .to(jarState, { lid: 1, steam: 1.6, hue: 1, glow: 1.6, duration: 0.8 }, 4.2)
        .fromTo(ch[2], inFrom, { autoAlpha: 1, y: 0, duration: 0.35 }, 4.6)
        .to({}, { duration: 0.8 });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" className="relative h-[620vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          <Scene />
        </div>

        {/* vignette + bottom fade so the canvas melts into the page */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,7,6,0.85)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        {/* ── Hero copy ─────────────────────────────── */}
        <div id="top" className="hero-copy pointer-events-none absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-4 pb-10 pt-24 md:justify-center md:px-10 md:pb-0">
          <motion.p
            variants={fade}
            custom={0}
            initial="hidden"
            animate={loaded ? "show" : "hidden"}
            className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-ember"
          >
            <span className="h-px w-10 bg-ember" /> Small-batch gourmet heat
          </motion.p>

          <h1 className="font-display uppercase leading-[0.82] tracking-tight">
            {["Liquid", "Fire."].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  variants={line}
                  custom={i}
                  initial="hidden"
                  animate={loaded ? "show" : "hidden"}
                  className={`block origin-bottom-left text-[27vw] md:text-[15.5vw] ${i === 1 ? "text-stroke-ember" : ""}`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-6 flex flex-col gap-6 md:mt-10 md:max-w-md">
            <motion.p
              variants={fade}
              custom={1}
              initial="hidden"
              animate={loaded ? "show" : "hidden"}
              className="text-base text-cream/75 md:text-lg"
            >
              Fire-roasted habanero, heirloom garlic and wildflower honey — slow-simmered for fourteen hours and sealed
              by hand. Heat worth <em className="font-serif text-xl text-cream md:text-2xl">savoring</em>.
            </motion.p>
            <motion.div
              variants={fade}
              custom={2}
              initial="hidden"
              animate={loaded ? "show" : "hidden"}
              className="pointer-events-auto flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <a
                  href="#shop"
                  data-cursor="Shop"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ember px-7 py-4 font-display text-lg uppercase tracking-wider text-ink"
                >
                  <span className="relative z-10">Shop the heat</span>
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45">→</span>
                  <span className="absolute inset-0 translate-y-full rounded-full bg-cream transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                </a>
              </Magnetic>
              <a href="#flavors" className="border-b border-cream/40 pb-1 text-sm uppercase tracking-[0.2em] transition hover:border-ember hover:text-ember">
                Explore flavors
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={fade}
            custom={3}
            initial="hidden"
            animate={loaded ? "show" : "hidden"}
            className="absolute right-4 top-24 text-cream md:bottom-12 md:right-10 md:top-auto"
          >
            <RotatingBadge />
          </motion.div>

          <motion.div
            variants={fade}
            custom={4}
            initial="hidden"
            animate={loaded ? "show" : "hidden"}
            className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-cream/60 md:flex"
          >
            Scroll
            <span className="relative block h-12 w-px overflow-hidden bg-cream/20">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-ember"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </div>

        {/* ── Story chapters ───────────────────────── */}
        {chapters.map((c) => (
          <div
            key={c.n}
            className={`chapter pointer-events-none invisible absolute inset-0 mx-auto flex max-w-[1600px] px-4 pb-12 md:px-10 ${
              c.side === "right"
                ? "items-end md:items-center md:justify-end"
                : c.side === "left"
                  ? "items-end md:items-center md:justify-start"
                  : "items-end justify-center text-center"
            }`}
          >
            <div className={`max-w-xl rounded-3xl bg-ink/40 p-5 backdrop-blur-[2px] md:bg-transparent md:p-0 md:backdrop-blur-none ${c.side === "center" ? "md:max-w-3xl" : ""}`}>
              <div className={`flex items-center gap-4 ${c.side === "center" ? "justify-center" : ""}`}>
                <span className="text-stroke-ember font-display text-6xl md:text-8xl">{c.n}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-ember">{c.kicker}</span>
              </div>
              <h2 className="mt-2 font-display text-5xl uppercase leading-[0.9] md:text-8xl">
                {c.title[0]}
                <br />
                <span className="text-ember">{c.title[1]}</span>
              </h2>
              <p className="mt-4 text-cream/75 md:text-lg">{c.body}</p>
              <div className={`mt-6 flex items-baseline gap-3 ${c.side === "center" ? "justify-center" : ""}`}>
                <span className="font-display text-4xl text-cream md:text-5xl">{c.stat[0]}</span>
                <span className="text-xs uppercase tracking-[0.3em] text-cream/50">{c.stat[1]}</span>
              </div>
            </div>
          </div>
        ))}

        {/* progress rail */}
        <div className="absolute right-6 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-cream/15 md:block">
          <div ref={progress} className="h-full w-full origin-top scale-y-0 bg-ember" />
        </div>
      </div>
    </section>
  );
}
