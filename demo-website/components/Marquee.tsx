const words = ["Fire-roasted", "Slow-simmered", "Hand-sealed", "Small batch", "No preservatives", "Real heat"];

export default function Marquee({ reverse = false, tone = "orange" }: { reverse?: boolean; tone?: "orange" | "dark" }) {
  const row = [...words, ...words];
  return (
    <div
      className={`relative overflow-hidden border-y py-5 ${
        tone === "orange" ? "tex-orange border-ink/20 text-ink" : "border-white/10 bg-coal text-cream"
      } ${reverse ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"} scale-[1.03]`}
    >
      <div
        className="animate-marquee flex w-max whitespace-nowrap"
        style={{ animationDirection: reverse ? "reverse" : "normal", ["--marquee-duration" as string]: "38s" }}
      >
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center font-display text-5xl uppercase md:text-7xl">
                <span className="px-6">{w}</span>
                <span className={tone === "orange" ? "text-ink" : "text-ember"}>✺</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
