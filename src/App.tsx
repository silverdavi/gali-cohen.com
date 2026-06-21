import { Progress } from './components/Progress';
import { CursorRipple } from './components/CursorRipple';
import { Ambient } from './components/Ambient';
import { NatureScene } from './components/NatureScene';
import { features } from './features';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Breath } from './components/Breath';
import { About } from './components/About';
import { Practices } from './components/Practices';
import { Pricing } from './components/Pricing';
import { FreeCall } from './components/FreeCall';
import { Band } from './components/Band';
import { Story } from './components/Story';
import { Faq } from './components/Faq';
import { Blog } from './components/Blog';
import { Podcast } from './components/Podcast';
import { Social } from './components/Social';
import { Store } from './components/Store';
import { Words } from './components/Words';
import { Contact } from './components/Contact';
import { content } from './content';

// Page order follows Gali's outline: about + services, the offer (pricing) and a
// free intro call, then the talk, FAQ, journal, podcast, socials, products,
// words, and a WhatsApp-first contact. The breathing hero and one calm photo
// band are the kept "signature" moments.
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">{content.nav.skip}</a>
      <Ambient />
      {features.natureLife && <NatureScene />}
      <Progress />
      <CursorRipple />
      <Nav />
      <main id="main">
        <Hero />
        <Breath />
        <About />
        <Practices />
        <Pricing />
        <FreeCall />
        <Band />
        {features.showStory && <Story />}
        <Faq />
        <Blog />
        <Podcast />
        <Social />
        <Store />
        <Words />
        <Contact />
      </main>
    </>
  );
}
