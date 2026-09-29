// Single source of truth for the top nav's real routes (replaces the old
// in-page-anchor sectionNav.ts — every entry here is a real page now, not a
// scroll target on one long page). A section only appears if it has content.
import { content } from '../content';
import { getAllWorkshops, getAllArticles, getAllShows, getAllVideos, getAllProducts } from '../cms/queries';
import { features } from '../features';

type NavItem = { path: string; label: string; visible: boolean };

const ITEMS: NavItem[] = [
  { path: '/', label: content.nav.home, visible: true },
  { path: '/about', label: content.nav.about, visible: true },
  { path: '/services', label: content.nav.services, visible: true },
  { path: '/workshops', label: content.nav.events, visible: getAllWorkshops().length > 0 },
  { path: '/blog', label: content.nav.blog, visible: getAllArticles().length > 0 },
  { path: '/podcast', label: content.nav.podcast, visible: getAllShows().length > 0 },
  { path: '/videos', label: 'סרטונים', visible: getAllVideos().length > 0 },
  { path: '/store', label: content.nav.shop, visible: features.showStore && getAllProducts().length > 0 },
  { path: '/contact', label: content.nav.contact, visible: true },
];

export const siteNav = ITEMS.filter((s) => s.visible).map(({ path, label }) => ({ path, label }));
