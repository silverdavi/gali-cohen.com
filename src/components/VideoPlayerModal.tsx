import { useEffect } from 'react';

// The shared lightbox video player — used by the podcast show page (whole
// playlist), podcast episode pages, and the videos section. Same
// reader-scrim/reader pattern as the blog reader, just holding a 16:9 embed.
export function VideoPlayerModal({ title, embedUrl, onClose }: { title: string; embedUrl: string; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="reader-scrim" onClick={onClose}>
      <div className="reader player-reader" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="reader-close" aria-label="סגירה" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 className="reader-title">{title}</h2>
        <div className="player-frame">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
