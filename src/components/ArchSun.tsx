// 70s arch window with stacked sun arcs. Decorative; colors come from the
// illustration tones (ochre/sand/terracotta) so the page accent stays single.
export function ArchSun() {
  return (
    <div className="arch" aria-hidden>
      <svg viewBox="0 0 340 430" fill="none">
        <g className="sun-group">
          {/* horizon stack of arcs, classic 70s sun */}
          <circle cx="170" cy="250" r="118" fill="#D9A441" opacity="0.92" />
          <circle cx="170" cy="250" r="92" fill="#E5C98F" />
          <circle cx="170" cy="250" r="66" fill="#C05A2E" opacity="0.9" />
          <circle cx="170" cy="250" r="40" fill="#FAF5EC" />
        </g>
        {/* layered hills */}
        <path d="M-20 360 Q 90 300 200 356 T 380 350 V 440 H -20 Z" fill="#9C4523" opacity="0.85" />
        <path d="M-20 392 Q 120 338 240 392 T 380 386 V 440 H -20 Z" fill="#2A1F14" opacity="0.85" />
        {/* a thin flying bird */}
        <path d="M96 120 q 10 -9 20 0 q 10 -9 20 0" stroke="#2A1F14" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
        <path d="M140 88 q 8 -7 16 0 q 8 -7 16 0" stroke="#2A1F14" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
}
