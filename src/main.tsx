import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { preloadCriticalImages } from './utils/preloadImages'

async function waitForFonts() {
  try {
    // Wait for all document fonts to be ready with shorter timeout
    // @ts-ignore
    if (document.fonts && document.fonts.ready) {
      // @ts-ignore
      await Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 500)) // Reduced to 500ms
      ])
    } else {
      await new Promise((r) => setTimeout(r, 50)) // Reduced to 50ms
    }
  } catch {
    // ignore
  }
}

async function bootstrap() {
  await waitForFonts()
  const rootEl = document.getElementById('root')!
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  // Reveal after mount
  requestAnimationFrame(() => {
    rootEl.style.opacity = '1'
    // Start preloading critical images after initial render
    preloadCriticalImages()
  })
}

bootstrap()