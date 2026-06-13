import { useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { SectionHead } from './SectionHead';
import { Reveal } from './Reveal';
import { content, lang } from '../content';
import { features } from '../features';
import {
  sunSignForDate, moonPhase, moonLitPath, sunSign,
  CONSTELLATIONS, type SignKey,
} from '../lib/astro';
import { ZODIAC } from '../content/zodiac';

// --- Constellation: stylized gold line-art in a 100×100 box ----------------
function Constellation({ sign, draw }: { sign: SignKey; draw?: boolean }) {
  const c = CONSTELLATIONS[sign];
  const reduce = useReducedMotion();
  const animate = Boolean(draw) && !reduce && features.astroMotion;
  return (
    <svg
      className={`cst${animate ? ' draw' : ''}`}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      <g className="cst-lines">
        {c.lines.map(([a, b], i) => {
          const [x1, y1] = c.stars[a];
          const [x2, y2] = c.stars[b];
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              pathLength={1}
              style={animate ? { animationDelay: `${0.15 + i * 0.12}s` } : undefined}
            />
          );
        })}
      </g>
      <g className="cst-stars">
        {c.stars.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y}
            r={i === 0 ? 2.7 : 1.9}
            style={{ animationDelay: `${(i % 5) * 0.7}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

// --- Moon: an SVG disc with the correctly-shaped lit limb ------------------
function Moon({ phase, size = 72 }: { phase: number; size?: number }) {
  const c = size / 2;
  const R = c - 4;
  return (
    <svg className="moon" viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      <circle className="moon-shadow" cx={c} cy={c} r={R} />
      <path className="moon-lit" d={moonLitPath(R, phase)} transform={`translate(${c} ${c})`} />
      <circle className="moon-rim" cx={c} cy={c} r={R} />
    </svg>
  );
}

// --- A sign "plate": constellation + name + meta + trait -------------------
function SignPlate({ sign, draw, prefix }: { sign: SignKey; draw?: boolean; prefix: string }) {
  const z = ZODIAC[sign];
  return (
    <div className="astro-plate">
      <Constellation sign={sign} draw={draw} />
      <p className="astro-eyebrow">{prefix}</p>
      <h3 className="astro-sign">
        {/* U+FE0E forces text (monochrome) presentation so the glyph inherits
            the gold colour instead of rendering as a coloured emoji. */}
        <span className="astro-glyph" aria-hidden>{`${z.symbol}\uFE0E`}</span>
        {z.name}
      </h3>
      <p className="astro-meta">{z.element} · {z.range}</p>
      <p className="astro-trait">{z.trait}</p>
    </div>
  );
}

export function Astro() {
  const { astro } = content;
  const now = useMemo(() => new Date(), []);
  const sun = useMemo(() => sunSignForDate(now), [now]);
  const moon = useMemo(() => moonPhase(now), [now]);
  const moonName = astro.moonPhases[moon.name];
  const litPct = Math.round(moon.illumination * 100);

  // find-your-sign form
  const months = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-US', { month: 'long' });
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2025, i, 1)));
  }, []);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [found, setFound] = useState<SignKey | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = Number(month);
    const d = Number(day);
    if (!m || !d) return;
    setFound(sunSign(m, d));
  };
  const reset = () => { setFound(null); setMonth(''); setDay(''); };

  return (
    <section className="section astro" id="astro">
      <div className="astro-bg" aria-hidden />
      <div className="astro-veil top" aria-hidden />
      <div className="astro-veil bottom" aria-hidden />
      <div className="container">
        <SectionHead label={astro.label} title={astro.title} sub={astro.sub} />

        <div className="astro-now">
          <Reveal delay={0.05} className="astro-col">
            <SignPlate sign={sun} draw prefix={astro.sunLabel} />
          </Reveal>
          <Reveal delay={0.12} className="astro-col">
            <div className="astro-plate astro-moon">
              <Moon phase={moon.phase} />
              <p className="astro-eyebrow">{astro.moonLabel}</p>
              <h3 className="astro-sign">{moonName}</h3>
              <p className="astro-meta">{litPct}% {astro.litWord}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="astro-find-wrap">
          <div className="astro-find">
            {!found ? (
              <form className="astro-form" onSubmit={submit}>
                <p className="astro-find-title">{astro.findTitle}</p>
                <p className="astro-find-sub">{astro.findSub}</p>
                <div className="astro-fields">
                  <label className="astro-field">
                    <span className="astro-field-label">{astro.monthLabel}</span>
                    <select value={month} onChange={(e) => setMonth(e.target.value)} required>
                      <option value="" disabled>—</option>
                      {months.map((name, i) => (
                        <option key={i} value={i + 1}>{name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="astro-field">
                    <span className="astro-field-label">{astro.dayLabel}</span>
                    <select value={day} onChange={(e) => setDay(e.target.value)} required>
                      <option value="" disabled>—</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="astro-reveal">{astro.reveal}</button>
                </div>
              </form>
            ) : (
              <div className="astro-result">
                <SignPlate sign={found} draw prefix={astro.yourSign} />
                <button type="button" className="astro-again" onClick={reset}>{astro.again}</button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
