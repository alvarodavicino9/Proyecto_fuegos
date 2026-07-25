import { useEffect, useRef } from 'react'

interface Props {
  className?: string
}

// Fondo animado de anillos de fuego (WebGL/three.js) para el Hero.
// Carga el shader de forma diferida y limpia el renderer al desmontar.
export default function RingsBackground({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | undefined

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

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
