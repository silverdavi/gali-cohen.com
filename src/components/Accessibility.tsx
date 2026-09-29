import { useEffect, useRef, useState } from 'react';

// A floating accessibility toolbar, always present (site pages + legal pages).
// Lets a visitor adjust text size, contrast, grayscale, link underlining and
// motion — independent of the decorative `features` flags, which only cover
// whether an effect exists at all, not a visitor's own access needs.
//
// Note on "stop motion": it freezes CSS transitions/animations site-wide, but
// can't retroactively stop Framer Motion's scroll-linked parallax (e.g. the
// photo band) — that's driven by JS on every scroll frame, not CSS. Visitors
// who need that off too are already covered by the OS-level "reduce motion"
// setting, which those specific effects already honor on their own.
type A11ySettings = {
  fontScale: number; // percent; 100 = default site size
  contrast: boolean;
  grayscale: boolean;
  underline: boolean;
  stopMotion: boolean;
};

const DEFAULTS: A11ySettings = {
  fontScale: 100,
  contrast: false,
  grayscale: false,
  underline: false,
  stopMotion: false,
};

const STORAGE_KEY = 'galigeula-a11y-v1';
const MIN_SCALE = 85;
const MAX_SCALE = 150;
const STEP = 15;

function load(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function apply(settings: A11ySettings) {
  const root = document.documentElement;
  // Setting the root font-size does nothing here — every --fs-* token in
  // index.css is defined in absolute px/clamp(px), not rem/em, so nothing
  // actually inherits from it. The tokens instead multiply themselves by this
  // custom property (default 1 when unset), which is the real lever.
  if (settings.fontScale === 100) root.style.removeProperty('--a11y-font-scale');
  else root.style.setProperty('--a11y-font-scale', String(settings.fontScale / 100));
  root.classList.toggle('a11y-contrast', settings.contrast);
  root.classList.toggle('a11y-grayscale', settings.grayscale);
  root.classList.toggle('a11y-underline', settings.underline);
  root.classList.toggle('a11y-stop-motion', settings.stopMotion);
}

export function Accessibility() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Apply whatever was saved before paint-worthy content shows up.
  useEffect(() => {
    const initial = load();
    setSettings(initial);
    apply(initial);
  }, []);

  useEffect(() => {
    apply(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable (private mode, quota) — settings just won't persist */
    }
  }, [settings]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    panelRef.current?.querySelector<HTMLElement>('button, a')?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const update = (patch: Partial<A11ySettings>) => setSettings((s) => ({ ...s, ...patch }));
  const changeFont = (delta: number) =>
    update({ fontScale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, settings.fontScale + delta)) });

  return (
    <div className="a11y-widget">
      <button
        ref={btnRef}
        type="button"
        className="a11y-toggle"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="אפשרויות נגישות"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" aria-hidden focusable="false">
          <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="7.6" r="1.7" fill="currentColor" />
          <line x1="6.7" y1="10.6" x2="17.3" y2="10.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="10.6" x2="12" y2="15.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="15.4" x2="8.6" y2="19.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="15.4" x2="15.4" y2="19.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="a11y-panel" ref={panelRef} role="region" aria-label="אפשרויות נגישות">
          <div className="a11y-panel-head">
            <span>נגישות</span>
            <button
              type="button"
              className="a11y-close"
              aria-label="סגירה"
              onClick={() => {
                setOpen(false);
                btnRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="a11y-row">
            <span className="a11y-row-label">גודל טקסט</span>
            <div className="a11y-font-controls">
              <button type="button" onClick={() => changeFont(-STEP)} disabled={settings.fontScale <= MIN_SCALE} aria-label="הקטנת טקסט">
                א-
              </button>
              <button type="button" onClick={() => update({ fontScale: 100 })} aria-label="איפוס גודל טקסט">
                איפוס
              </button>
              <button type="button" onClick={() => changeFont(STEP)} disabled={settings.fontScale >= MAX_SCALE} aria-label="הגדלת טקסט">
                א+
              </button>
            </div>
          </div>

          <button
            type="button"
            className={`a11y-option${settings.contrast ? ' is-on' : ''}`}
            aria-pressed={settings.contrast}
            onClick={() => update({ contrast: !settings.contrast })}
          >
            ניגודיות גבוהה
          </button>
          <button
            type="button"
            className={`a11y-option${settings.grayscale ? ' is-on' : ''}`}
            aria-pressed={settings.grayscale}
            onClick={() => update({ grayscale: !settings.grayscale })}
          >
            גווני אפור
          </button>
          <button
            type="button"
            className={`a11y-option${settings.underline ? ' is-on' : ''}`}
            aria-pressed={settings.underline}
            onClick={() => update({ underline: !settings.underline })}
          >
            הדגשת קישורים
          </button>
          <button
            type="button"
            className={`a11y-option${settings.stopMotion ? ' is-on' : ''}`}
            aria-pressed={settings.stopMotion}
            onClick={() => update({ stopMotion: !settings.stopMotion })}
          >
            עצירת אנימציות
          </button>

          <button type="button" className="a11y-reset" onClick={() => setSettings(DEFAULTS)}>
            איפוס הגדרות
          </button>
          <a className="a11y-statement" href="/accessibility">
            הצהרת נגישות
          </a>
        </div>
      )}
    </div>
  );
}
