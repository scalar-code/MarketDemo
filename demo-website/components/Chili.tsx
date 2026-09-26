export default function Chili({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M22 20c6-3 14-2 18 4 6 9 3 22-6 31-4 4-9 6-12 4-2-2 0-5 2-8 5-8 4-17-2-22-3-3-4-7 0-9z"
        fill="currentColor"
      />
      <path d="M26 20c-1-5 1-9 6-11 3-1 5 1 4 3-1 3-5 3-6 8" fill="none" stroke="#2f6b1f" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 27c2 6 2 12-1 18" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
