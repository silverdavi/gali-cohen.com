import { useEffect, useRef } from 'react';
import { features } from '../features';

// A "living still": shows the ordinary photo (the poster) at rest, and plays a
// short, muted, seamless loop on top only while hovered — a subtle swish that
// rewards intent rather than animating the whole page at once. On touch devices
// (no hover) it falls back to playing while in view, so it isn't dead there.
// Degrades to a plain <img> when:
//   • no clip was generated for this photo (`clip` undefined),
//   • the photoMotion feature flag is off, or
//   • the visitor prefers reduced motion.
// The still is ALWAYS the poster, so there is never a blank frame or layout
// shift, and a missing/failed clip simply leaves the photo standing still.

type Props = {
  /** The still image — used as the poster and as the no-motion fallback. */
  src: string;
  /** Base path of the loop without extension, e.g. "/clips/portrait"
   *  (resolves to .webm then .mp4). Omit to stay a plain photo. */
  clip?: string;
  alt?: string;
  className?: string;
  ariaHidden?: boolean;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
};

const prefersReduced =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Devices with a real pointer get hover-to-play; touch screens (which can't
// hover) fall back to play-while-in-view so the motion still happens there.
const canHover =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover)').matches;

export function Cinemagraph({
  src,
  clip,
  alt = '',
  className,
  ariaHidden,
  loading = 'lazy',
  fetchPriority,
}: Props) {
  const motion = !!clip && features.photoMotion && !prefersReduced;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!motion) return;
    const v = ref.current;
    if (!v) return;

    const play = () => {
      if (v.preload === 'none') v.preload = 'auto';
      v.play().catch(() => {});
    };
    // Pause and rewind to the rest frame so it always settles back to the still.
    const rest = () => {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* not seekable yet — harmless */
      }
    };

    if (canHover) {
      // Hover the whole photo frame (the parent), not just the <video>, so
      // decorative overlays (e.g. the hero arch ring) don't swallow the event.
      const target = v.parentElement ?? v;
      target.addEventListener('pointerenter', play);
      target.addEventListener('pointerleave', rest);
      return () => {
        target.removeEventListener('pointerenter', play);
        target.removeEventListener('pointerleave', rest);
        v.pause();
      };
    }

    // No hover (touch): play while on screen, pause when it leaves — keeps it
    // battery-friendly on long scrolls.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) play();
          else v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [motion]);

  if (!motion) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        aria-hidden={ariaHidden || undefined}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    );
  }

  return (
    <video
      ref={ref}
      className={className}
      poster={src}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      aria-hidden={ariaHidden || undefined}
      aria-label={!ariaHidden && alt ? alt : undefined}
      role={!ariaHidden && alt ? 'img' : undefined}
    >
      <source src={`${clip}.webm`} type="video/webm" />
      <source src={`${clip}.mp4`} type="video/mp4" />
    </video>
  );
}
