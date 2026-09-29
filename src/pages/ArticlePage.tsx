import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getArticleBySlug } from '../cms/queries';
import { content } from '../content';
import { formatDateHe } from '../lib/formatDate';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { NotFoundPage } from './NotFoundPage';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  useDocumentMeta(article ? `${article.title} · גלי גאולה כהן` : 'הדף לא נמצא', article?.excerpt);

  if (!article) return <NotFoundPage />;

  return (
    <div className="container legal-container">
      <Breadcrumbs items={[{ label: content.nav.blog, path: '/blog' }, { label: article.title }]} />
      {article.image && (
        <div className="workshop-page-media">
          <img src={article.image} alt="" loading="lazy" decoding="async" />
        </div>
      )}
      {article.dateISO && <p className="article-date">{formatDateHe(article.dateISO)}</p>}
      <h1 className="legal-title">{article.title}</h1>
      <div className="legal-body">
        {article.body.split(/\n{2,}/).map((para, n) => (
          <p key={n}>
            {para.split('\n').map((line, m, arr) => (
              <span key={m}>
                {line}
                {m < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
