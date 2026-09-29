import { Link } from 'react-router-dom';
import { getAllVideos, videosHeading } from '../cms/queries';

// Part of the home "content" teaser group (articles + podcasts + videos).
export function VideosTeaser({ limit }: { limit?: number }) {
  const items = getAllVideos().slice(0, limit ?? 3);
  if (items.length === 0) return null;
  return (
    <div className="content-teaser-group">
      <h3 className="content-teaser-heading">{videosHeading.title}</h3>
      <div className="blog-grid">
        {items.map((v) => (
          <Link key={v.slug} className="article" to={`/videos/${v.slug}`}>
            {v.thumbnail && <img className="article-thumb" src={v.thumbnail} alt="" loading="lazy" decoding="async" />}
            <h3 className="article-title">{v.title}</h3>
            <span className="article-more">{videosHeading.cta || 'לצפייה'}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
