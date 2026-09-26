import { useId } from "react";
import type { Product } from "@/lib/products";

/** Lightweight vector jar used in cards, cart and flavor panels. */
export default function JarIllustration({ product, className = "" }: { product: Product; className?: string }) {
  const id = useId().replace(/:/g, "");
  const specks = Array.from({ length: 26 }, (_, i) => {
    // deterministic pseudo-random so server and client markup match
    const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
    return { x: 36 + r(1) * 128, y: 96 + r(2) * 140, w: 2 + r(3) * 5, rot: r(4) * 180, seed: r(5) };
  });

  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={`${product.name} jar`}>
      <defs>
        <linearGradient id={`sauce-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={product.accent} />
          <stop offset="1" stopColor={product.sauce} />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="0.95" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`lid-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#2a2421" />
          <stop offset="0.3" stopColor="#4a403b" />
          <stop offset="0.55" stopColor="#141110" />
          <stop offset="1" stopColor="#060504" />
        </linearGradient>
        <clipPath id={`body-${id}`}>
          <rect x="26" y="58" width="148" height="192" rx="30" />
        </clipPath>
      </defs>

      {/* shadow */}
      <ellipse cx="100" cy="252" rx="78" ry="6" fill="#000" opacity="0.45" />

      {/* sauce + specks */}
      <g clipPath={`url(#body-${id})`}>
        <rect x="26" y="88" width="148" height="170" fill={`url(#sauce-${id})`} />
        <ellipse cx="100" cy="88" rx="74" ry="6" fill={product.accent} opacity="0.9" />
        {specks.map((s, i) => (
          <rect
            key={i}
            x={s.x}
            y={s.y}
            width={s.w}
            height={1.6}
            rx={0.8}
            fill={s.seed > 0.6 ? "#ffd89a" : "#3a0a04"}
            opacity={0.7}
            transform={`rotate(${s.rot} ${s.x} ${s.y})`}
          />
        ))}
      </g>

      {/* glass */}
      <rect x="26" y="58" width="148" height="192" rx="30" fill={`url(#glass-${id})`} stroke="#fff" strokeOpacity="0.28" />
      <rect x="44" y="44" width="112" height="18" rx="4" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.2" />

      {/* label */}
      <rect x="26" y="126" width="148" height="92" fill={product.label} />
      <rect x="32" y="132" width="136" height="80" fill="none" stroke={product.accent} strokeWidth="1.5" />
      <text x="100" y="170" textAnchor="middle" fontFamily="var(--font-display)" fontSize="30" fill={product.accent} letterSpacing="1">
        MOLTEN
      </text>
      <text x="100" y="188" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="7.5" fill="#f6e9d8" letterSpacing="1.5">
        {product.tagline.toUpperCase()}
      </text>
      <text x="100" y="204" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="7" fill="#f6e9d8" opacity="0.6" letterSpacing="2">
        NO. {product.no}
      </text>

      {/* highlight streak */}
      <rect x="36" y="70" width="8" height="160" rx="4" fill="#fff" opacity="0.22" />

      {/* lid */}
      <rect x="40" y="12" width="120" height="38" rx="7" fill={`url(#lid-${id})`} />
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={46 + i * 5} x2={46 + i * 5} y1="16" y2="46" stroke="#000" strokeOpacity="0.45" strokeWidth="1.2" />
      ))}
      <rect x="40" y="40" width="120" height="3" fill={product.accent} />
    </svg>
  );
}
