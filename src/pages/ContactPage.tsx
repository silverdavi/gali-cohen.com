import { Contact } from '../components/Contact';
import { content } from '../content';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// Contact.tsx already carries its own vertical rhythm (padding: var(--section-y)
// 0) since it was built to sit inside a plain <section>, so this wrapper only
// needs .container for the horizontal max-width/gutters — no .page, which
// would double the top padding.
export function ContactPage() {
  useDocumentMeta(`${content.nav.contact} · גלי גאולה כהן`, content.contact.sub);
  return (
    <div className="container">
      <Contact titleAs="h1" />
    </div>
  );
}
