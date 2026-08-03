// Google Analytics 4 + Meta Pixel, cargados solo si hay IDs configurados
// en las variables de entorno (VITE_GA_MEASUREMENT_ID / VITE_META_PIXEL_ID).
// Mismo patrón que Supabase: si no están configurados, todas las funciones
// de acá son no-ops — el sitio funciona igual, simplemente no trackea nada.
//
// Para activarlo: crear una cuenta de GA4 en https://analytics.google.com
// (te da un ID tipo "G-XXXXXXXXXX") y/o un Pixel en Meta Events Manager
// (un número largo), y cargarlos en .env.local (ver .env.example).

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

export const isGaConfigured = Boolean(GA_ID)
export const isMetaPixelConfigured = Boolean(META_PIXEL_ID)

type GtagFn = (...args: unknown[]) => void
type FbqFn = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFn
    fbq?: FbqFn
  }
}

let initialized = false

function loadScript(src: string): void {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

/** Inyecta los scripts de GA4 y/o Meta Pixel. Llamar una sola vez al arrancar la app. */
export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  if (isGaConfigured && GA_ID) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`)
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
    window.gtag('js', new Date())
    // send_page_view en false porque las vistas de página las mandamos
    // nosotros manualmente en cada cambio de ruta (ver trackPageView).
    window.gtag('config', GA_ID, { send_page_view: false })
  }

  if (isMetaPixelConfigured && META_PIXEL_ID) {
    // Cola simple: hasta que cargue fbevents.js, los llamados a fbq() solo
    // se acumulan acá; cuando el script real termina de cargar, los reenvía.
    const queue: unknown[][] = []
    window.fbq = (...args: unknown[]) => queue.push(args)

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    script.onload = () => {
      // fbevents.js define su propio `window.fbq` real al cargar; le
      // pasamos todo lo que se haya encolado mientras tanto.
      for (const args of queue) window.fbq?.(...args)
    }
    document.head.appendChild(script)

    window.fbq('init', META_PIXEL_ID)
  }
}

/** Registra una vista de página (llamar en cada cambio de ruta). */
export function trackPageView(path: string): void {
  if (isGaConfigured && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path })
  }
  if (isMetaPixelConfigured && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

/** Evento genérico de GA4 (nombre + parámetros libres). */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (isGaConfigured && window.gtag) {
    window.gtag('event', name, params)
  }
}

/** Evento estándar de Meta Pixel (AddToCart, InitiateCheckout, Lead, etc.). */
export function trackMetaEvent(name: string, params?: Record<string, unknown>): void {
  if (isMetaPixelConfigured && window.fbq) {
    window.fbq('track', name, params)
  }
}
