import { content } from '../content';

export function Band() {
  const { band } = content;
  return (
    <section className="band">
      <img src={band.photo} alt={band.alt} loading="lazy" />
      <p className="band-caption">{band.caption}</p>
    </section>
  );
}
