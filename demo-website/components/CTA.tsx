"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Magnetic from "./Magnetic";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="tex-orange relative overflow-hidden px-4 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em]">The Heat Club</p>
        <h2 className="mt-6 font-display text-[21vw] uppercase leading-[0.8] md:text-[13vw]">
          Stay
          <br />
          <span className="text-stroke">dangerous.</span>
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-end">
          <p className="max-w-md text-lg font-medium">
            First dibs on limited Black Label drops, secret recipes from our kitchen and 10% off your first order.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSent(true);
            }}
            className="relative"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-4xl uppercase md:text-5xl"
                >
                  You&apos;re in. Check your inbox 🔥
                </motion.p>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, y: -20 }} className="flex items-center gap-3 border-b-2 border-ink pb-3">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="min-w-0 flex-1 bg-transparent font-display text-3xl uppercase placeholder:text-ink/40 focus:outline-none md:text-5xl"
                  />
                  <Magnetic>
                    <button
                      type="submit"
                      data-cursor="Join"
                      className="grid size-16 shrink-0 place-items-center rounded-full bg-ink text-2xl text-ember transition-transform hover:scale-110 md:size-20"
                      aria-label="Subscribe"
                    >
                      →
                    </button>
                  </Magnetic>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
}
