"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { products } from "@/lib/products";
import JarIllustration from "./JarIllustration";

const panels = [
  {
    id: "original",
    word: "Garlic",
    bg: "tex-orange",
    fg: "text-ink",
    muted: "text-ink/70",
    bar: "bg-ink",
    story: "Our first recipe and still the one we reach for daily. Charred habanero, sweet roasted garlic, a squeeze of key lime.",
    pairs: ["Tacos al pastor", "Fried eggs", "Pizza crust"],
  },
  {
    id: "smoked-ember",
    word: "Smoke",
    bg: "bg-coal",
    fg: "text-cream",
    muted: "text-cream/70",
    bar: "bg-ember",
    story: "Chipotle smoked over pecan wood, folded with fermented black garlic. Deep, savory and dangerously drinkable.",
    pairs: ["Brisket", "Mac & cheese", "Bloody Mary"],
  },
  {
    id: "citrus-flare",
    word: "Citrus",
    bg: "bg-[#ff9a1a]",
    fg: "text-ink",
    muted: "text-ink/70",
    bar: "bg-ink",
    story: "Scotch bonnet and Alphonso mango, lifted with yuzu and lime zest. Sunshine first, then the fire walks in.",
    pairs: ["Fish tacos", "Grilled shrimp", "Mango salsa"],
  },
  {
    id: "black-label",
    word: "Inferno",
    bg: "bg-black",
    fg: "text-cream",
    muted: "text-cream/70",
    bar: "bg-[#ff3b1f]",
    story: "Ghost pepper aged twelve months with blackstrap molasses. Released twice a year, numbered by hand. Proceed with respect.",
    pairs: ["Wings", "Ramen", "Brave friends"],
  },
];

const MAX_SHU = 1_000_000;

export default function Flavors() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;

      const scroll = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".flavor-panel").forEach((panel) => {
        const word = panel.querySelector(".flavor-word");
        const jar = panel.querySelector(".flavor-jar");
        const bar = panel.querySelector<HTMLElement>(".flavor-bar");
        if (word)
          gsap.fromTo(word, { xPercent: 20 }, {
            xPercent: -20,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
          });
        if (jar)
          gsap.fromTo(jar, { rotate: -14, y: 60 }, {
            rotate: 10,
            y: -30,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
          });
        if (bar)
          gsap.fromTo(bar, { scaleX: 0 }, {
            scaleX: Number(bar.dataset.v),
            ease: "power3.out",
            duration: 1.4,
            scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left 60%", toggleActions: "play none none reverse" },
          });
      });

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section id="flavors" ref={root} className="relative h-dvh overflow-hidden bg-ink">
      <div ref={track} className="flex h-full w-max">
        {/* intro panel */}
        <div className="flex h-full w-screen shrink-0 flex-col justify-center px-4 md:px-10">
          <p className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            <span className="h-px w-10 bg-ember" /> Flavor profiles
          </p>
          <h2 className="font-display text-[20vw] uppercase leading-[0.82] md:text-[12vw]">
            Four
            <br />
            flavors<span className="text-ember">.</span>
          </h2>
          <p className="mt-8 max-w-md text-cream/70 md:text-lg">
            One obsession. Each recipe is built on a different chili, a different fire, a different mood. Keep
            scrolling <span className="text-ember">→</span>
          </p>
        </div>

        {panels.map((panel) => {
          const p = products.find((x) => x.id === panel.id)!;
          return (
            <article
              key={panel.id}
              className={`flavor-panel relative flex h-full w-screen shrink-0 items-center overflow-hidden ${panel.bg} ${panel.fg}`}
            >
              <span
                aria-hidden
                className="flavor-word text-stroke pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[42vw] uppercase leading-none opacity-20 md:text-[30vw]"
              >
                {panel.word}
              </span>

              <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-6 px-4 pt-16 md:grid-cols-2 md:gap-10 md:px-10 md:pt-0">
                <div className="order-2 md:order-1">
                  <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${panel.muted}`}>No. {p.no}</p>
                  <h3 className="mt-3 font-display text-6xl uppercase leading-[0.85] md:text-[5.5vw]">{p.name}</h3>
                  <p className={`mt-5 max-w-md md:text-lg ${panel.muted}`}>{panel.story}</p>

                  <div className="mt-8 max-w-md">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.25em]">
                      <span>Scoville</span>
                      <span className="tabular-nums">{p.scoville.toLocaleString()} SHU</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-current/15">
                      <div
                        className={`flavor-bar h-full origin-left rounded-full ${panel.bar}`}
                        data-v={Math.max(0.06, Math.log10(p.scoville) / Math.log10(MAX_SHU))}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${panel.muted}`}>Pairs with</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {panel.pairs.map((x) => (
                        <li key={x} className="rounded-full border border-current/30 px-4 py-1.5 text-sm">
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="order-1 flex justify-center md:order-2">
                  <div className="flavor-jar w-[46vw] max-w-[420px] md:w-[26vw]">
                    <JarIllustration product={p} className="drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]" />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
