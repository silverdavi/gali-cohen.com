// 70s arch window with stacked sun arcs over a sea horizon. Decorative;
// colors come from the illustration tones (ochre/sand/clay/slate) so the
// page accent stays single.
export function ArchSun() {
  return (
    <div className="arch" aria-hidden>
      <svg viewBox="0 0 340 430" fill="none">
        <g className="sun-group">
          {/* horizon stack of arcs, classic 70s sun */}
          <circle cx="170" cy="250" r="118" fill="var(--ochre)" opacity="0.92" />
          <circle cx="170" cy="250" r="92" fill="var(--sand)" />
          <circle cx="170" cy="250" r="66" fill="var(--accent)" opacity="0.9" />
          <circle cx="170" cy="250" r="40" fill="var(--paper)" />
        </g>
        {/* sea swell and foreground hill */}
        <path d="M-20 360 Q 90 300 200 356 T 380 350 V 440 H -20 Z" fill="var(--slate)" opacity="0.85" />
        <path d="M-20 392 Q 120 338 240 392 T 380 386 V 440 H -20 Z" fill="var(--ink)" opacity="0.88" />
        {/* thin flying birds, drifting slowly across the arch */}
        <g className="bird b1">
          <path d="M96 120 q 10 -9 20 0 q 10 -9 20 0" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
        </g>
        <g className="bird b2">
          <path d="M140 88 q 8 -7 16 0 q 8 -7 16 0" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" opacity="0.4" /></g>
      </svg>
    </div>
  );
}
