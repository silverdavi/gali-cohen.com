import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getAllArticles, blogHeading, isExternal } from '../cms/queries';
import { content } from '../content';
import { formatDateHe } from '../lib/formatDate';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export function BlogList() {
  const items = getAllArticles();
  useDocumentMeta(`${blogHeading.title} · גלי גאולה כהן`, blogHeading.sub);

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: content.nav.blog }]} />
      <SectionHead label={blogHeading.label} title={blogHeading.title} sub={blogHeading.sub} as="h1" />
      {items.length === 0 ? (
        <p className="section-sub">מאמרים חדשים בקרוב.</p>
      ) : (
        <div className="blog-grid">
          {items.map((a, i) => {
            const inner = (
              <>
                {a.dateISO && <span className="article-date">{formatDateHe(a.dateISO)}</span>}
                <h3 className="article-title">{a.title}</h3>
                <p className="article-excerpt">{a.excerpt}</p>
                <span className="article-more">{blogHeading.cta || 'לקריאה'}</span>
              </>
            );
            return (
              <Reveal key={a.slug} delay={i * 0.06} className="col-third">
                {a.body ? (
                  <Link className="article" to={`/blog/${a.slug}`}>{inner}</Link>
                ) : (
                  <a className="article" href={a.href || undefined} {...(a.href && isExternal(a.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {inner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
