import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Accessibility } from '../components/Accessibility';
import { content } from '../content';

// The one shell every route renders inside — Nav, page content, Footer,
// Accessibility, skip-link. Replaces LegalPage.tsx's old bespoke minimal
// header: that existed only because Nav's scroll-spy assumed the home page's
// sections were in the DOM, which is no longer true now that Nav highlights
// by route instead of by scroll position — so every page can safely carry
// the full Nav now.
export function SiteLayout() {
  const location = useLocation();

  // react-router doesn't scroll for you: without this, following an
  // <a href="#services"> (the hero's scroll cue) from another page would land
  // on the right route but wherever the scroll position happened to be, and a
  // plain route change (no hash) would leave you scrolled halfway down the
  // previous page.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="skip-link" href="#main">{content.nav.skip}</a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <Accessibility />
    </>
  );
}
