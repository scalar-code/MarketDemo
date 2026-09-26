"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const I = {
  chili: (
    <path d="M30 14c14 2 20 20 8 42-3 6-8 6-8 0-4-12-10-26-4-38M26 18c-2-6 0-10 6-12" />
  ),
  garlic: (
    <path d="M32 10c-4 8-18 16-18 30 0 10 8 16 18 16s18-6 18-16c0-14-14-22-18-30zM32 22v34M22 32c2 8 4 16 10 24M42 32c-2 8-4 16-10 24" />
  ),
  honey: (
    <path d="M20 22h24l-2 30a6 6 0 0 1-6 6h-8a6 6 0 0 1-6-6zM18 22h28M26 14h12v8H26zM26 34c4 3 8 3 12 0" />
  ),
  lime: (
    <>
      <circle cx="32" cy="34" r="20" />
      <circle cx="32" cy="34" r="14" />
      <path d="M32 20v28M18 34h28M22 24l20 20M42 24L22 44" />
    </>
  ),
  vinegar: <path d="M28 8h8v10l6 8v28a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V26l6-8zM22 36h20" />,
  salt: (
    <>
      <path d="M14 44l18-26 18 26z" />
      <path d="M22 50h20M26 56h12" />
      <circle cx="28" cy="36" r="1.5" />
      <circle cx="36" cy="38" r="1.5" />
      <circle cx="32" cy="30" r="1.5" />
    </>
  ),
};

const items: { icon: keyof typeof I; name: string; origin: string; note: string }[] = [
  { icon: "chili", name: "Habanero", origin: "Yucatán, MX", note: "Hand-picked at full orange ripeness for fruit, not just fire." },
  { icon: "garlic", name: "Heirloom garlic", origin: "Gilroy, CA", note: "Roasted whole in the skin until jammy and sweet." },
  { icon: "honey", name: "Wildflower honey", origin: "Hudson Valley, NY", note: "Raw and unfiltered — rounds the heat into a glow." },
  { icon: "lime", name: "Key lime", origin: "Florida Keys", note: "Juiced to order so the acid stays electric." },
  { icon: "vinegar", name: "Cider vinegar", origin: "Vermont", note: "Barrel-aged, unpasteurised, with the mother." },
  { icon: "salt", name: "Smoked salt", origin: "Maldon, UK", note: "Cold-smoked over oak for a whisper of campfire." },
];

const never = ["Preservatives", "Xanthan gum", "Artificial color", "Chili extract", "Shortcuts"];

export default function Ingredients() {
  return (
    <section id="ingredients" className="tex-dark relative px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-end">
          <div>
            <Reveal>
              <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-ember">
                <span className="h-px w-10 bg-ember" /> What goes in
              </p>
            </Reveal>
            <h2 className="font-display text-[17vw] uppercase leading-[0.82] md:text-[7.5vw]">
              <Reveal as="span">Six things.</Reveal>
              <Reveal as="span" className="text-ember" delay={0.1}>
                Zero secrets.
              </Reveal>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-cream/70 md:text-lg">
              Every jar is built from six ingredients we can trace back to a farm, a grower and a handshake. And a short
              list of things that will never get anywhere near it:
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {never.map((n, i) => (
                <li key={n} className="relative font-display text-2xl uppercase text-cream/50 md:text-3xl">
                  {n}
                  <motion.span
                    className="absolute left-0 top-1/2 h-[3px] w-full origin-left bg-ember"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.65, 0, 0.35, 1] }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-h-[300px] overflow-hidden bg-ink p-8"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />
              <div className="relative flex h-full flex-col transition-colors duration-500 group-hover:text-ink">
                <div className="flex items-start justify-between">
                  <svg
                    viewBox="0 0 64 64"
                    className="size-16 fill-none stroke-ember stroke-[2.2] transition-all duration-700 ease-out-expo [stroke-linecap:round] [stroke-linejoin:round] group-hover:rotate-[-12deg] group-hover:scale-110 group-hover:stroke-ink"
                  >
                    {I[it.icon]}
                  </svg>
                  <span className="font-display text-xl text-cream/30 group-hover:text-ink/50">0{i + 1}</span>
                </div>
                <h3 className="mt-auto pt-10 font-display text-4xl uppercase">{it.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-ember group-hover:text-ink/70">{it.origin}</p>
                <p className="mt-4 max-h-0 overflow-hidden text-sm opacity-0 transition-all duration-700 ease-out-expo group-hover:max-h-24 group-hover:opacity-100 max-md:max-h-24 max-md:opacity-70">
                  {it.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
