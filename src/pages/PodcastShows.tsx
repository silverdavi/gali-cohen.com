import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { getAllShows, podcastHeading } from '../cms/queries';
import { content } from '../content';
import { toEmbedUrl } from '../lib/youtube';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// A show with no episodes yet (both shows today) opens the in-page player
// modal directly on click — no need to leave this page to press play
// (matches the Home teaser's PodcastTeaser). A show with real episodes still
// goes to its own page, since there's a real choice to make there.
export function PodcastShows() {
  const shows = getAllShows();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<string | null>(null);
  useDocumentMeta(`${podcastHeading.title} · גלי גאולה כהן`, podcastHeading.sub);

  const playingShow = shows.find((s) => s.slug === playing);
  const playingEmbed = playingShow ? toEmbedUrl(playingShow.embedHref) : null;

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.podcast }]} />
      <SectionHead label={podcastHeading.label} title={podcastHeading.title} sub={podcastHeading.sub} as="h1" />
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
