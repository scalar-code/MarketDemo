"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Chili from "./Chili";

const text =
  "We don't make hot sauce to hurt you. We make it to wake up everything on your plate — charred chilies, sweet garlic, bright acid and a slow ember that lingers long after the last bite.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".mw",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".mtext", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.to(".m-chili", {
        rotate: 25,
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="tex-dark relative overflow-hidden px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1600px]">
        <p className="mb-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-ember">
          <span className="h-px w-10 bg-ember" /> Manifesto
        </p>
        <p className="mtext max-w-6xl font-display text-[11vw] uppercase leading-[0.95] md:text-[5.6vw]">
          {text.split(" ").map((w, i) => (
            <span key={i} className={`mw inline-block pr-[0.25em] ${/chilies|ember|garlic/.test(w) ? "text-ember" : ""}`}>
              {w}
            </span>
          ))}
        </p>
      </div>
      <div className="m-chili pointer-events-none absolute -right-[6vw] bottom-0 w-[40vw] text-ember opacity-25 md:w-[24vw]">
        <Chili className="w-full" />
      </div>
    </section>
  );
}
