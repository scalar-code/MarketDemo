"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const quotes = [
  { q: "It tastes like the fire was lit by someone who actually cooks.", who: "Dana R.", role: "Line cook, Chicago" },
  { q: "I put Smoked Ember on everything. Everything. My partner is concerned.", who: "Marcus T.", role: "Verified buyer" },
  { q: "Black Label is the first superhot sauce I've had that has more flavor than ego.", who: "Priya S.", role: "Home chef, Austin" },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % quotes.length), 5500);
    return () => clearInterval(t);
  }, []);
  const q = quotes[i];

  return (
    <section className="relative overflow-hidden bg-ink px-4 py-28 md:px-10 md:py-40">
      <span aria-hidden className="pointer-events-none absolute -left-4 -top-10 select-none font-serif text-[40vw] leading-none text-ember/10 md:text-[26vw]">
        &ldquo;
      </span>
      <div className="relative mx-auto max-w-[1300px]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            <span className="h-px w-10 bg-ember" /> Word of mouth
          </p>
          <div className="flex gap-2">
            {quotes.map((_, k) => (
              <button
                key={k}
                aria-label={`Show review ${k + 1}`}
                onClick={() => setI(k)}
                className="relative h-1 w-10 overflow-hidden rounded-full bg-white/15"
              >
                {k === i && (
                  <motion.span
                    key={i}
                    className="absolute inset-0 origin-left bg-ember"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5.5, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 min-h-[16rem] md:min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote key={i} initial="hidden" animate="show" exit="exit">
              <p className="font-serif text-4xl leading-[1.05] md:text-7xl">
                {q.q.split(" ").map((w, k) => (
                  <span key={k} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      className="inline-block pr-[0.25em]"
                      variants={{
                        hidden: { y: "100%" },
                        show: { y: 0, transition: { duration: 0.7, delay: k * 0.03, ease: [0.16, 1, 0.3, 1] } },
                        exit: { y: "-100%", transition: { duration: 0.4, delay: k * 0.01, ease: [0.7, 0, 0.84, 0] } },
                      }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </p>
              <motion.footer
                className="mt-10 flex items-center gap-4"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.5 } }, exit: { opacity: 0 } }}
              >
                <span className="grid size-12 place-items-center rounded-full bg-ember font-display text-xl text-ink">{q.who[0]}</span>
                <span>
                  <span className="block font-semibold">{q.who}</span>
                  <span className="text-sm text-cream/60">{q.role}</span>
                </span>
                <span className="ml-auto text-ember">★★★★★</span>
              </motion.footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
