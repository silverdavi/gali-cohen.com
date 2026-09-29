import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getAllVideos, videosHeading } from '../cms/queries';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export function VideosList() {
  const items = getAllVideos();
  useDocumentMeta(`${videosHeading.title} · גלי גאולה כהן`, videosHeading.sub);

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'סרטונים' }]} />
      <SectionHead label={videosHeading.label} title={videosHeading.title} sub={videosHeading.sub} as="h1" />
      {items.length === 0 ? (
        <p className="section-sub">סרטונים חדשים בקרוב.</p>
      ) : (
        <div className="blog-grid">
          {items.map((v, i) => (
            <Reveal key={v.slug} delay={i * 0.06} className="col-third">
              <Link className="article" to={`/videos/${v.slug}`}>
                {v.thumbnail && <img className="article-thumb" src={v.thumbnail} alt="" loading="lazy" decoding="async" />}
                <h3 className="article-title">{v.title}</h3>
                <p className="article-excerpt">{v.desc}</p>
                <span className="article-more">{videosHeading.cta || 'לצפייה'}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
