import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { lang, dir } from './content'
import { features } from './features'

document.documentElement.lang = lang
document.documentElement.dir = dir
// title/description are no longer set here — every routed page sets its own
// via useDocumentMeta(), matching what the static-generation script already
// baked into that route's raw HTML for crawlers/link-unfurlers.

// CSS-only feature gate: photographs warm and lift on hover.
document.documentElement.classList.toggle('ff-photo', features.photoHover)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
