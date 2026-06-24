import { Progress } from './components/Progress';
import { CursorRipple } from './components/CursorRipple';
import { Ambient } from './components/Ambient';
import { NatureScene } from './components/NatureScene';
import { features } from './features';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Breath } from './components/Breath';
import { About } from './components/About';
import { Story } from './components/Story';
import { Practices } from './components/Practices';
import { FreeCall } from './components/FreeCall';
import { Band } from './components/Band';
import { Events } from './components/Events';
import { Words } from './components/Words';
import { Podcast } from './components/Podcast';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Store } from './components/Store';
import { Footer } from './components/Footer';
import { content } from './content';

// Page order follows Gali's menu: about → services → calendar → testimonials →
// podcast → blog → contact → store. The breathing hero, personal story, free
// intro-call CTA and one calm photo band are the kept "signature" moments.
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
        {features.showStory && <Story />}
        <Practices />
        <FreeCall />
        <Band />
        <Events />
        <Words />
        <Podcast />
        <Blog />
        <Contact />
        <Store />
      </main>
      <Footer />
    </>
  );
}
