const cols = [
  { h: "Shop", l: ["All sauces", "Gift boxes", "Heat Club", "Wholesale"] },
  { h: "About", l: ["Our story", "Ingredients", "Journal", "Careers"] },
  { h: "Help", l: ["Shipping", "Returns", "FAQ", "Contact"] },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-4 pt-24 md:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="max-w-sm font-serif text-3xl leading-tight md:text-4xl">
            Heat worth <em className="text-ember">savoring</em>. Made in small batches, sealed by hand.
          </p>
          <p className="mt-6 text-sm text-cream/50">Molten Sauce Co. is a fictional brand created for this demo.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{c.h}</p>
            <ul className="mt-5 space-y-3">
              {c.l.map((x) => (
                <li key={x}>
                  <a href="#top" className="group relative inline-block text-cream/80 transition hover:text-cream">
                    {x}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ember transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-20 flex max-w-[1600px] flex-wrap justify-between gap-4 border-t border-white/10 py-6 text-xs uppercase tracking-[0.2em] text-cream/40">
        <span>© {new Date().getFullYear()} Molten Sauce Co.</span>
        <span>Instagram · TikTok · YouTube</span>
      </div>
      <p aria-hidden className="pointer-events-none -mb-[4vw] mt-6 select-none text-center font-display text-[31vw] leading-[0.8] text-ember">
        MOLTEN
      </p>
    </footer>
  );
}
