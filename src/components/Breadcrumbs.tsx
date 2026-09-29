import { Link } from 'react-router-dom';

export type Crumb = { label: string; path?: string };

// A quiet trail above every page's title — "בית / <hub> / <entity>" — using
// real routes for the middle links, never inventing a path that doesn't
// exist. Home is never passed in explicitly; every caller's `items` start
// after it. Rendered per-page (like useDocumentMeta) rather than centrally
// in SiteLayout, since only the page itself knows its own trail (a category
// title, a workshop title, an episode's show, etc.).
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <ol>
        <li>
          <Link to="/">בית</Link>
        </li>
        {items.map((item, i) => (
          <li key={i}>
            {item.path ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
