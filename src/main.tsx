import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { lang, dir, content } from './content'

document.documentElement.lang = lang
document.documentElement.dir = dir
document.title = content.meta.title
document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
