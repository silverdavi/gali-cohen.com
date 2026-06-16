import { Progress } from './components/Progress';
import { CursorRipple } from './components/CursorRipple';
import { Ambient } from './components/Ambient';
import { NatureScene } from './components/NatureScene';
import { features } from './features';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Breath } from './components/Breath';
import { Practices } from './components/Practices';
import { Circle } from './components/Circle';
import { Band } from './components/Band';
import { About } from './components/About';
import { Story } from './components/Story';
import { Pricing } from './components/Pricing';
import { Events } from './components/Events';
import { Store } from './components/Store';
import { Astro } from './components/Astro';
import { Words } from './components/Words';
import { Contact } from './components/Contact';
import { content } from './content';

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
        <Practices />
        <Circle />
        <Band />
        <About />
        {features.showStory && <Story />}
        <Pricing />
        <Events />
        <Store />
        <Words />
        {features.astrology && <Astro />}
        <Contact />
      </main>
    </>
  );
}
