"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span";
};

/** Masked slide-up reveal triggered when the element enters the viewport. */
export default function Reveal({ children, className = "", delay = 0, as = "div" }: Props) {
  const Outer = as === "span" ? motion.span : motion.div;
  const Inner = as === "span" ? motion.span : motion.div;
  return (
    <Outer className={`overflow-hidden ${as === "span" ? "block" : ""} ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }}>
      <Inner
        className="block"
        variants={{
          hidden: { y: "105%" },
          show: { y: 0, transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {children}
      </Inner>
    </Outer>
  );
}
