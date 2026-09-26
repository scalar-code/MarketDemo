"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { heatLabel, heatLevel, products, type Heat, type Product } from "@/lib/products";
import { useCart } from "./Cart";
import JarIllustration from "./JarIllustration";
import Reveal from "./Reveal";

const filters: { id: "all" | Heat; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mild", label: "Warm" },
  { id: "hot", label: "Hot" },
  { id: "insane", label: "Molten" },
];

function HeatMeter({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-label={`Heat ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`h-2 w-5 rounded-full ${i < level ? "bg-ember" : "bg-white/15"}`} />
      ))}
    </div>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  const { add } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });
  const jx = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 150, damping: 18 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, ${p.accent}40, transparent 60%)`,
  );
  const [added, setAdded] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        data-cursor="Taste"
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-coal p-6"
      >
        {/* pointer spotlight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <div className="relative flex items-start justify-between">
          <span className="font-display text-5xl text-white/10 transition-colors duration-500 group-hover:text-ember/70">{p.no}</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em]">
            {heatLabel[p.heat]}
          </span>
        </div>

        <motion.div className="relative mx-auto my-6 aspect-[200/260] w-[62%]" style={{ x: jx, translateZ: 60 }}>
          <div
            className="absolute inset-x-0 bottom-0 mx-auto h-1/2 w-3/4 rounded-full blur-3xl transition-opacity duration-700 group-hover:opacity-90"
            style={{ background: p.sauce, opacity: 0.35 }}
          />
          <JarIllustration
            product={p}
            className="relative drop-shadow-2xl transition-transform duration-700 ease-out-expo group-hover:-translate-y-4 group-hover:-rotate-6"
          />
        </motion.div>

        <div className="relative mt-auto">
          <h3 className="font-display text-3xl uppercase leading-none md:text-4xl">{p.name}</h3>
          <p className="mt-2 text-sm text-cream/60">{p.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.notes.map((n) => (
              <span key={n} className="rounded-full bg-white/5 px-3 py-1 text-xs text-cream/80">
                {n}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <HeatMeter level={heatLevel[p.heat]} />
            <span className="text-xs tabular-nums text-cream/50">{p.scoville.toLocaleString()} SHU</span>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="font-display text-4xl">${p.price}</span>
            <button
              onClick={() => {
                add(p.id);
                setAdded(true);
                setTimeout(() => setAdded(false), 1400);
              }}
              data-cursor="Add"
              className="relative overflow-hidden rounded-full bg-cream px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ember"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? "y" : "n"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="block"
                >
                  {added ? "Added ✓" : "Add to cart"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function Products() {
  const [filter, setFilter] = useState<"all" | Heat>("all");
  const shown = products.filter((p) => filter === "all" || p.heat === filter);

  return (
    <section id="shop" className="tex-dark relative px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-ember">
                <span className="h-px w-10 bg-ember" /> The collection
              </p>
            </Reveal>
            <h2 className="font-display text-[18vw] uppercase leading-[0.82] md:text-[9vw]">
              <Reveal as="span" className="block">
                Pick your
              </Reveal>
              <Reveal as="span" className="block text-ember" delay={0.1}>
                poison.
              </Reveal>
            </h2>
          </div>

          <div className="flex w-fit gap-1 rounded-full border border-white/10 bg-coal p-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors md:px-5 ${
                  filter === f.id ? "text-ink" : "text-cream/70 hover:text-cream"
                }`}
              >
                {filter === f.id && (
                  <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ember" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
