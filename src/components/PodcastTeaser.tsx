import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal } from './Reveal';
import { getAllShows, podcastHeading } from '../cms/queries';
import { toEmbedUrl } from '../lib/youtube';
import { VideoPlayerModal } from './VideoPlayerModal';

// Home teaser — part of the combined "content" group (with BlogTeaser and
// VideosTeaser), so it does NOT self-wrap in its own <section>/<container>,
// matching those. A card per show: for a show with no episodes yet (both
// shows today), listening opens the same in-page player modal used on
// /podcast/<slug> — no need to leave the home page just to press play. A
// show with real episodes still goes to its page instead, since there's a
// real choice to make there (which episode), not just one thing to play.
export function PodcastTeaser() {
  const shows = getAllShows();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<string | null>(null);
  if (shows.length === 0) return null;

  const playingShow = shows.find((s) => s.slug === playing);
  const playingEmbed = playingShow ? toEmbedUrl(playingShow.embedHref) : null;

  return (
    <div className="content-teaser-group">
      <h3 className="content-teaser-heading">{podcastHeading.title}</h3>
      <div className="shows-grid">
        {shows.map((s, i) => {
          const embed = toEmbedUrl(s.embedHref);
          const listenable = !s.status;
          return (
            <Reveal key={s.slug} delay={i * 0.08}>
              <button
                type="button"
                className={`show${s.status ? ' is-soon' : ''}`}
                disabled={!listenable}
                onClick={() => {
                  if (!listenable) return;
                  if (s.episodes.length > 0) navigate(`/podcast/${s.slug}`);
                  else if (embed) setPlaying(s.slug);
                  else window.open(s.embedHref, '_blank', 'noopener,noreferrer');
                }}
              >
                {s.coverImage && (
                  <span className="show-media">
                    <img src={s.coverImage} alt="" loading="lazy" decoding="async" />
                    {listenable && (
                      <span className="show-play" aria-hidden>
                        <svg viewBox="0 0 24 24" focusable="false"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    )}
                  </span>
                )}
                <div className="show-body">
                  <h3 className="show-name">{s.name}</h3>
                  <p className="show-desc">{s.desc}</p>
                  {s.status ? <span className="show-soon">{s.status}</span> : <span className="show-cta">{podcastHeading.cta}</span>}
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {playingShow && playingEmbed && (
        <VideoPlayerModal title={playingShow.name} embedUrl={playingEmbed} onClose={() => setPlaying(null)} />
      )}
    </div>
  );
}
