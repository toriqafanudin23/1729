import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './pwa/registerSW'
import { initInstallPrompt } from './pwa/installPrompt'

// Harus dipasang sebelum render: event install bisa muncul sebelum navbar tampil.
initInstallPrompt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerServiceWorker()
