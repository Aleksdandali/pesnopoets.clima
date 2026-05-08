/**
 * Lightweight CSS-only "AC blowing from a phone" strip.
 * Sits above the hero carousel as a playful brand metaphor:
 * the phone IS the AC — cool air streams loop forever.
 * No JS, no video — pure SVG + CSS keyframes.
 */
export default function AcBlowingHero() {
  return (
    <section
      aria-hidden="true"
      className="relative w-full bg-gradient-to-b from-sky-50 via-sky-100 to-white overflow-hidden h-28 sm:h-32"
    >
      {/* Phone at top center */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2 z-10">
        <svg
          width="38"
          height="58"
          viewBox="0 0 38 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="36"
            height="56"
            rx="6"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <rect x="4" y="6" width="30" height="42" rx="2" fill="#38bdf8" />
          <circle cx="19" cy="53" r="1.5" fill="#475569" />
          {/* "Vent" slits at bottom of screen */}
          <rect x="7" y="44" width="24" height="1" rx="0.5" fill="#0f172a" opacity="0.4" />
        </svg>
      </div>

      {/* Air streams — three wavy lines blowing downward, staggered */}
      <div className="absolute inset-x-0 top-[60px] flex justify-center gap-3 sm:gap-5 pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="ac-puff block h-12 w-1 rounded-full bg-gradient-to-b from-sky-300/80 to-transparent"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes ac-puff {
          0%   { transform: translateY(-8px) scaleY(0.6); opacity: 0; }
          20%  { opacity: 0.9; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(40px) scaleY(1.2); opacity: 0; }
        }
        .ac-puff {
          animation: ac-puff 1.6s ease-in infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
}
