"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, type Product } from "@/lib/products";
import JarIllustration from "./JarIllustration";

type Line = { id: string; qty: number };

type CartCtx = {
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  update: (id: string, qty: number) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

const byId = (id: string) => products.find((p) => p.id === id) as Product;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((id: string, qty = 1) => {
    setLines((ls) => {
      const found = ls.find((l) => l.id === id);
      if (found) return ls.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...ls, { id, qty }];
    });
    setOpen(true);
  }, []);

  const update = useCallback((id: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
    return { lines, count, subtotal, open, setOpen, add, update };
  }, [lines, open, add, update]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

const FREE_SHIPPING = 50;

function CartDrawer() {
  const { lines, open, setOpen, subtotal, update } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label="Your cart"
            className="fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-md flex-col border-l border-white/10 bg-coal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-3xl uppercase tracking-wide">Your Stash</h2>
              <button
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full border border-white/15 transition hover:border-ember hover:text-ember"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            <div className="px-6 pt-5">
              <p className="text-sm text-cream/70">
                {remaining > 0 ? (
                  <>
                    You&apos;re <span className="text-ember">${remaining.toFixed(2)}</span> away from free shipping.
                  </>
                ) : (
                  <span className="text-ember">Free shipping unlocked. 🔥</span>
                )}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-ember"
                  animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              <AnimatePresence initial={false}>
                {lines.length === 0 && (
                  <motion.li
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-16 text-center text-cream/50"
                  >
                    Nothing here yet. Things are getting cold.
                  </motion.li>
                )}
                {lines.map((l) => {
                  const p = byId(l.id);
                  return (
                    <motion.li
                      key={l.id}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink/60 p-3"
                    >
                      <div className="h-20 w-16 shrink-0">
                        <JarIllustration product={p} />
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-xl uppercase leading-none">{p.name}</p>
                        <p className="mt-1 text-xs text-cream/60">{p.tagline}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            aria-label="Decrease"
                            className="size-7 rounded-full border border-white/20 hover:border-ember"
                            onClick={() => update(l.id, l.qty - 1)}
                          >
                            −
                          </button>
                          <motion.span key={l.qty} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-4 text-center tabular-nums">
                            {l.qty}
                          </motion.span>
                          <button
                            aria-label="Increase"
                            className="size-7 rounded-full border border-white/20 hover:border-ember"
                            onClick={() => update(l.id, l.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="font-display text-2xl">${(p.price * l.qty).toFixed(0)}</p>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <div className="border-t border-white/10 px-6 py-6">
              <div className="flex items-end justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-cream/60">Subtotal</span>
                <span className="font-display text-4xl">${subtotal.toFixed(2)}</span>
              </div>
              <button
                disabled={lines.length === 0}
                className="mt-5 w-full rounded-full bg-ember py-4 font-display text-xl uppercase tracking-wider text-ink transition hover:bg-flame disabled:opacity-40"
              >
                Checkout — demo
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
