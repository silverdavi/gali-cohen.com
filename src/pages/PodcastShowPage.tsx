import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getShowBySlug, podcastHeading } from '../cms/queries';
import { content } from '../content';
import { toEmbedUrl } from '../lib/youtube';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { NotFoundPage } from './NotFoundPage';

export function PodcastShowPage() {
  const { showSlug } = useParams<{ showSlug: string }>();
  const show = showSlug ? getShowBySlug(showSlug) : undefined;
  const [playingWhole, setPlayingWhole] = useState(false);

  useDocumentMeta(show ? `${show.name} · פודקאסט · גלי גאולה כהן` : 'הדף לא נמצא', show?.desc);

  if (!show) return <NotFoundPage />;

  const wholeEmbed = show.embedHref ? toEmbedUrl(show.embedHref) : null;

  return (
    <div className="container legal-container">
      <Breadcrumbs items={[{ label: content.nav.podcast, path: '/podcast' }, { label: show.name }]} />
      {show.coverImage && (
        <div className="workshop-page-media">
          <img src={show.coverImage} alt="" loading="lazy" decoding="async" />
        </div>
      )}
      <h1 className="legal-title">{show.name}</h1>
      <div className="legal-body"><p>{show.desc}</p></div>

      {show.status ? (
        <span className="show-soon">{show.status}</span>
      ) : show.episodes.length > 0 ? (
        <div className="event-list">
          {show.episodes.map((ep) => (
            <article className="event" key={ep.slug}>
              <div className="event-main">
                <h3 className="event-title">{ep.title}</h3>
                {ep.publishedDate && <p className="event-meta">{ep.publishedDate}</p>}
                <p className="event-desc">{ep.desc}</p>
              </div>
              <Link className="event-cta" to={`/podcast/${show.slug}/${ep.slug}`}>{podcastHeading.cta}</Link>
            </article>
          ))}
        </div>
      ) : wholeEmbed ? (
        <button type="button" className="btn btn-primary" onClick={() => setPlayingWhole(true)}>
          {podcastHeading.cta}
        </button>
      ) : (
        <a className="btn btn-primary" href={show.embedHref} target="_blank" rel="noopener noreferrer">
          {podcastHeading.cta}
        </a>
      )}

      {show.platformLinks.length > 0 && (
        <div className="show-platform-links">
          {show.platformLinks.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
          ))}
        </div>
      )}

      {playingWhole && wholeEmbed && (
        <VideoPlayerModal title={show.name} embedUrl={wholeEmbed} onClose={() => setPlayingWhole(false)} />
      )}
    </div>
  );
}
