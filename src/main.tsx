import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register service worker (vite-plugin-pwa auto registration)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      console.log('Service Worker ready:', registration.scope)
    } catch (e) {
      console.log('Service Worker not available', e)
    }
  })
}



