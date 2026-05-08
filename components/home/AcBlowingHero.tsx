/**
 * Cinematic AC-blowing video shown above the hero carousel.
 * Auto-plays muted, loops, plays inline on mobile.
 * Lightweight — single <video> tag, no JS.
 */
export default function AcBlowingHero() {
  return (
    <section className="relative w-full bg-black overflow-hidden">
      <video
        className="block w-full h-auto max-h-[60vh] object-cover"
        src="/videos/ac-blowing-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* Fade into the hero carousel below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/30"
        aria-hidden="true"
      />
    </section>
  );
}
