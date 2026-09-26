"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCart } from "./Cart";
import { useLoaded } from "@/lib/loader";

const links = [
  { href: "#story", label: "Story" },
  { href: "#shop", label: "Shop" },
  { href: "#flavors", label: "Flavors" },
  { href: "#ingredients", label: "Ingredients" },
];

export default function Nav() {
  const { count, setOpen } = useCart();
  const loaded = useLoaded();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !menu);
    setSolid(y > 40);
  });

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "bg-ink/70 backdrop-blur-md" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: !loaded || hidden ? -100 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 md:px-10">
          <a href="#top" className="group flex items-center gap-2" aria-label="Molten home">
            <span className="grid size-9 place-items-center rounded-full bg-ember font-display text-lg text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
              M
            </span>
            <span className="font-display text-2xl tracking-wide">MOLTEN</span>
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative text-sm font-medium uppercase tracking-[0.18em]">
                  <span className="relative block overflow-hidden">
                    <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                      {l.label}
                    </span>
                    <span className="absolute inset-0 block translate-y-full text-ember transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                      {l.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium uppercase tracking-[0.15em] transition hover:border-ember hover:text-ember"
            >
              Cart
              <motion.span
                key={count}
                initial={{ scale: 1.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="grid size-6 place-items-center rounded-full bg-ember text-xs font-bold text-ink"
              >
                {count}
              </motion.span>
            </button>
            <button
              className="grid size-10 place-items-center rounded-full border border-white/20 md:hidden"
              onClick={() => setMenu((m) => !m)}
              aria-label="Toggle menu"
              aria-expanded={menu}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-0.5 w-4 bg-cream transition ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-4 bg-cream transition ${menu ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ember px-6 text-ink md:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="font-display text-7xl uppercase"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
