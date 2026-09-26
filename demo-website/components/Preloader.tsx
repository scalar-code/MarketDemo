"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { markLoaded } from "@/lib/loader";

export default function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const ctl = animate(0, 100, {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        setDone(true);
        document.documentElement.style.overflow = "";
        markLoaded();
      },
    });
    return () => {
      ctl.stop();
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-ember p-6 text-ink md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.3em]">
            <span>Molten Sauce Co.</span>
            <span>Heating up</span>
          </div>
          <div className="overflow-hidden">
            <motion.p
              className="font-display text-[34vw] leading-[0.8] tabular-nums md:text-[24vw]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {n}°
            </motion.p>
          </div>
          <div className="h-1 w-full bg-ink/20">
            <div className="h-full bg-ink" style={{ width: `${n}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
