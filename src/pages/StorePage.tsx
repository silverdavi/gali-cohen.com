import { Store } from '../components/Store';
import { storeHeading } from '../cms/queries';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// Thin wrapper: Store.tsx itself is title-neutral so it's safe to embed as a
// home teaser too — only the standalone /store route sets the page title.
export function StorePage() {
  useDocumentMeta(`${storeHeading.title} · גלי גאולה כהן`, storeHeading.sub);
  return <Store titleAs="h1" />;
}
