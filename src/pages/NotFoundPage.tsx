import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// Rendered for any unmatched route, AND reused by entity pages (workshop,
// article, show, episode, product) when a URL matches the pattern but no
// entity with that slug exists — never a silent fall-through to Home.
export function NotFoundPage() {
  useDocumentMeta('הדף לא נמצא · גלי גאולה כהן');
  return (
    <div className="container legal-container not-found">
      <h1 className="legal-title">הדף שחיפשתם לא נמצא</h1>
      <p className="legal-updated">
        ייתכן שהקישור שגוי או שהתוכן כבר לא זמין. אפשר לחזור לעמוד הבית ולנסות משם.
      </p>
      <Link className="drawer-cta" to="/">חזרה לעמוד הבית</Link>
    </div>
  );
}
