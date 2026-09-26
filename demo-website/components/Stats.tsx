"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

const stats = [
  { v: 14, suffix: "h", label: "Slow-simmered per batch" },
  { v: 312, suffix: "", label: "Jars sealed by hand, per batch" },
  { v: 6, suffix: "", label: "Ingredients. That's the list." },
  { v: 0, suffix: "", label: "Preservatives. Ever." },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="tex-orange px-4 py-24 text-ink md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-t-2 border-ink pt-5">
            <p className="font-display text-[22vw] leading-[0.85] md:text-[10vw] lg:text-[8vw]">
              <Counter to={s.v} suffix={s.suffix} />
            </p>
            <p className="mt-3 max-w-[16rem] text-sm font-semibold uppercase tracking-[0.18em]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
