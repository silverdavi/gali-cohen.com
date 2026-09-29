import { useEffect } from 'react';

// Each routed page now owns its own <title>/description — main.tsx used to set
// these once, globally, which was fine on the old single-page site but would
// silently overwrite the correct per-route static tags the moment React
// hydrates on every other page now that real routes exist.
export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
