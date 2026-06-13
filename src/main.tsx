import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { lang, dir, content } from './content'
import { features } from './features'

document.documentElement.lang = lang
document.documentElement.dir = dir
document.title = content.meta.title
document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description)

// Time-of-day: the hero sky warms with the visitor's local clock. Disabled by
// the timeOfDaySun flag (falls back to the neutral 'day' palette).
function daypartFor(hour: number) {
  if (hour >= 5 && hour < 9) return 'dawn'
  if (hour >= 9 && hour < 17) return 'day'
  if (hour >= 17 && hour < 21) return 'dusk'
  return 'night'
}
document.documentElement.dataset.daypart = features.timeOfDaySun
  ? daypartFor(new Date().getHours())
  : 'day'

// CSS-only feature gate: photographs warm and lift on hover.
document.documentElement.classList.toggle('ff-photo', features.photoHover)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
