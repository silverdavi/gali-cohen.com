import type { LegalPage as LegalPageContent } from '../content';
import { Breadcrumbs } from './Breadcrumbs';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// The three static legal documents (accessibility statement, privacy policy,
// terms of use) — rendered inside SiteLayout like every other page now.
export function LegalPage({ page }: { page: LegalPageContent }) {
  useDocumentMeta(`${page.title} · גלי גאולה כהן`);
  return (
    <div className="container legal-container">
      <Breadcrumbs items={[{ label: page.title }]} />
      <h1 className="legal-title">{page.title}</h1>
      <p className="legal-updated">עודכן לאחרונה: {page.updated}</p>
      <div className="legal-body">
        {page.body.split(/\n{2,}/).map((para, n) => (
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
