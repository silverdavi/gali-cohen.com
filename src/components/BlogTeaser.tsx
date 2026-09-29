import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { getAllArticles, blogHeading } from '../cms/queries';
import { formatDateHe } from '../lib/formatDate';

// Home teaser: a compact article list (part of the combined "content" teaser
// alongside podcast/videos) — full grid lives on /blog.
export function BlogTeaser({ limit }: { limit?: number }) {
  const items = getAllArticles().slice(0, limit ?? 3);
  if (items.length === 0) return null;
  return (
    <div className="content-teaser-group">
      <h3 className="content-teaser-heading">{blogHeading.title}</h3>
      <div className="blog-grid">
        {items.map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.06} className="col-third">
            <Link className="article" to={`/blog/${a.slug}`}>
              {a.dateISO && <span className="article-date">{formatDateHe(a.dateISO)}</span>}
              <h3 className="article-title">{a.title}</h3>
              <p className="article-excerpt">{a.excerpt}</p>
              <span className="article-more">{blogHeading.cta || 'לקריאה'}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
