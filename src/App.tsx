import { Progress } from './components/Progress';
import { CursorRipple } from './components/CursorRipple';
import { Ambient } from './components/Ambient';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Breath } from './components/Breath';
import { Practices } from './components/Practices';
import { Circle } from './components/Circle';
import { Band } from './components/Band';
import { About } from './components/About';
import { Words } from './components/Words';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <>
      <Ambient />
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
        <Words />
        <Contact />
      </main>
    </>
  );
}
