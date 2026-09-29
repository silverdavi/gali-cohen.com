import { Link } from 'react-router-dom';
import { content, legal, site } from '../content';
import { siteNav } from '../lib/siteNav';
import { BrandIcon } from './BrandIcon';
import { hasBrandIcon } from '../lib/brandIcon';

export function Footer() {
  const { profile, footer } = content;
  // A missing URL, or a label BrandIcon can't draw a glyph for, is skipped —
  // never a broken/blank icon.
  const socials = (site.socials ?? []).filter((s) => s.url && s.url.trim() && hasBrandIcon(s.label, s.url));

  return (
    <footer className="footer">
      {socials.length > 0 && (
        <div className="footer-socials" aria-label="רשתות חברתיות">
          {socials.map((s) => (
            <a
              key={s.label}
              className="social-icon"
              href={s.url}
              aria-label={s.label}
              title={s.label}
              {...(s.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <BrandIcon name={s.label} url={s.url} />
            </a>
          ))}
        </div>
      )}
      {/* Same list as the header nav (siteNav) — a real site map, not a
          hand-maintained second copy that can drift out of sync. */}
      <nav className="footer-sitemap" aria-label="מפת האתר">
        {siteNav.map((item) => (
          <Link key={item.path} to={item.path}>{item.label}</Link>
        ))}
      </nav>
      <nav className="footer-links" aria-label="מסמכים משפטיים">
        <Link to="/accessibility">{legal.accessibility.title}</Link>
        <Link to="/privacy">{legal.privacy.title}</Link>
        <Link to="/terms">{legal.terms.title}</Link>
      </nav>
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span>{footer.place}</span>
      <span className="footer-credit">{footer.credit}</span>
      <span className="footer-build" title="build version">{__BUILD_ID__}</span>
    </footer>
  );
}
