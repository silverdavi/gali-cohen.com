import { Reveal } from './Reveal';
import { content, site } from '../content';
import { useMagnetic } from '../useMagnetic';

// A warm, highlighted banner offering the free 30-minute intro call. Not part of
// the numbered section index — it's a CTA moment, leading straight to WhatsApp.
export function FreeCall() {
  const { freeCall } = content;
  const magnetic = useMagnetic();
  return (
    <section className="section freecall-section" id="free-call">
      <div className="container">
        <Reveal>
          <div className="freecall">
            <div className="freecall-body">
              <p className="freecall-label">{freeCall.label}</p>
              <h2 className="freecall-title">{freeCall.title}</h2>
              <p className="freecall-text">{freeCall.body}</p>
              <p className="freecall-note">{freeCall.note}</p>
            </div>
            <a
              className="btn btn-primary btn-whatsapp freecall-cta"
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              {...magnetic}
            >
              {freeCall.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
