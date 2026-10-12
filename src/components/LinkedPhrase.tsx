import { Link } from 'react-router-dom';

/** Renders `text`, with `phrase` as a link when that exact phrase appears in it. */
export function LinkedPhrase({ text, phrase, href }: { text: string; phrase?: string; href?: string }) {
  if (!phrase || !href) return <>{text}</>;
  const at = text.indexOf(phrase);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <Link className="inline-link" to={href}>{phrase}</Link>
      {text.slice(at + phrase.length)}
    </>
  );
}
