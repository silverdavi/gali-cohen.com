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
import { Pricing } from './components/Pricing';
import { Events } from './components/Events';
import { Store } from './components/Store';
import { Astro } from './components/Astro';
import { Words } from './components/Words';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <>
      <Ambient />
      {features.natureLife && <NatureScene />}
      <Progress />
      <CursorRipple />
      <Nav />
      <main>
        <Hero />
        <Breath />
        <Practices />
        <Circle />
        <Band />
        <About />
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
