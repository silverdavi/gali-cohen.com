import { useParams } from 'react-router-dom';
import { getEpisode, podcastHeading } from '../cms/queries';
import { videoIdToEmbedUrl } from '../lib/youtube';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { NotFoundPage } from './NotFoundPage';

export function PodcastEpisodePage() {
  const { showSlug, episodeSlug } = useParams<{ showSlug: string; episodeSlug: string }>();
  const found = showSlug && episodeSlug ? getEpisode(showSlug, episodeSlug) : undefined;

  useDocumentMeta(
    found ? `${found.episode.title} · ${found.show.name} · גלי גאולה כהן` : 'הדף לא נמצא',
    found?.episode.desc,
  );

  if (!found) return <NotFoundPage />;
  const { show, episode } = found;

  return (
    <div className="container legal-container">
      <Breadcrumbs
        items={[
          { label: podcastHeading.title, path: '/podcast' },
          { label: show.name, path: `/podcast/${show.slug}` },
          { label: episode.title },
        ]}
      />
      <p className="practice-meta">{show.name}</p>
      <h1 className="legal-title">{episode.title}</h1>
      {episode.publishedDate && <p className="legal-updated">{episode.publishedDate}</p>}
      {episode.youtubeVideoId && (
        <div className="workshop-page-media player-frame">
          <iframe
            src={videoIdToEmbedUrl(episode.youtubeVideoId)}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="legal-body">
        <p>{episode.desc}</p>
      </div>
    </div>
  );
}
