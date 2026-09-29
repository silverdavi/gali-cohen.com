import { useParams } from 'react-router-dom';
import { getVideoBySlug } from '../cms/queries';
import { videoIdToEmbedUrl } from '../lib/youtube';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { NotFoundPage } from './NotFoundPage';

function embedFor(v: NonNullable<ReturnType<typeof getVideoBySlug>>): string | null {
  if (v.provider === 'youtube' && v.videoId) return videoIdToEmbedUrl(v.videoId);
  if (v.provider === 'vimeo' && v.videoId) return `https://player.vimeo.com/video/${v.videoId}`;
  return null;
}

export function VideoPage() {
  const { slug } = useParams<{ slug: string }>();
  const video = slug ? getVideoBySlug(slug) : undefined;

  useDocumentMeta(video ? `${video.title} · גלי גאולה כהן` : 'הדף לא נמצא', video?.metaDescription || video?.desc);

  if (!video) return <NotFoundPage />;
  const embed = embedFor(video);

  return (
    <div className="container legal-container">
      <Breadcrumbs items={[{ label: 'סרטונים', path: '/videos' }, { label: video.title }]} />
      <h1 className="legal-title">{video.title}</h1>
      {embed ? (
        <div className="workshop-page-media player-frame">
          <iframe
            src={embed}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : video.videoUrl ? (
        <a className="btn btn-primary" href={video.videoUrl} target="_blank" rel="noopener noreferrer">לצפייה בסרטון</a>
      ) : null}
      <div className="legal-body">
        <p>{video.desc}</p>
      </div>
    </div>
  );
}
