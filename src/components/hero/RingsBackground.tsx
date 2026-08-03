import { useEffect, useRef } from 'react'

interface Props {
  className?: string
}

// Programa `fn` para cuando el navegador esté libre (después de pintar lo
// importante), en vez de competir por ancho de banda/CPU con la carga
// inicial. Safari no tiene requestIdleCallback, así que cae a un
// setTimeout corto como respaldo.
function scheduleWhenIdle(fn: () => void): () => void {
  type WithIdle = Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    cancelIdleCallback?: (id: number) => void
  }
  const w = window as WithIdle

  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout: 1500 })
    return () => w.cancelIdleCallback?.(id)
  }

  const id = window.setTimeout(fn, 300)
  return () => window.clearTimeout(id)
}

// Fondo animado de anillos de fuego (WebGL/three.js) para el Hero. Es el
// chunk más pesado del sitio (three.js), así que:
// - se carga recién cuando el navegador está idle, para no competir con el
//   contenido principal por ancho de banda en la primera carga (clave en
//   conexiones móviles lentas);
// - se saltea directamente si la persona tiene activado "reducir
//   movimiento" en su sistema, tanto por accesibilidad como para ahorrarle
//   los ~500KB del chunk.
export default function RingsBackground({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    const cancelIdle = scheduleWhenIdle(() => {
      if (cancelled) return
      import('@/utils/magicRings')
        .then((mod) => {
          if (cancelled || !containerRef.current) return
          cleanup = mod.mountMagicRings(containerRef.current, {
            color: '#ffc55c',
            colorTwo: '#e8402c',
            ringCount: 7,
            speed: 0.5,
            attenuation: 6,
            lineThickness: 2.2,
            baseRadius: 0.06,
            radiusStep: 0.05,
            scaleRate: 0.06,
            opacity: 0.85,
            noiseAmount: 0.03,
          })
        })
        .catch(() => {})
    })

    return () => {
      cancelled = true
      cancelIdle()
      cleanup?.()
    }
  }, [])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
