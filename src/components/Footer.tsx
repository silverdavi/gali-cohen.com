import { content } from '../content';

export function Footer() {
  const { profile, footer } = content;
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span>{footer.place}</span>
      <span className="footer-credit">{footer.credit}</span>
      <span className="footer-build" title="build version">{__BUILD_ID__}</span>
    </footer>
  );
}
