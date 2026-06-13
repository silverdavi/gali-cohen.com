import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { execSync } from 'node:child_process'

// Build stamp so a deploy is verifiable from the live footer: short git hash +
// UTC build date. Falls back gracefully if git isn't available (e.g. CI shallow
// clone without history).
function buildId() {
  let hash = 'nogit'
  try {
    hash = execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    /* no git context */
  }
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ')
  return `${date}Z · ${hash}`
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(buildId()),
  },
  plugins: [react(), yaml()],
})
