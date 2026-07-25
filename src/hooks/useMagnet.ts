import { useCallback, useState, type CSSProperties, type MouseEvent } from 'react'

// Efecto "magnet": el elemento se traslada levemente hacia el cursor
// mientras el mouse se mueve dentro de él, y vuelve a su lugar al salir.
export function useMagnet() {
  const [style, setStyle] = useState<CSSProperties>({ transform: 'translate(0px, 0px)' })

  const onMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / 5
    const dy = (e.clientY - cy) / 5
    setStyle({ transform: `translate(${dx}px, ${dy}px)` })
  }, [])

  const onMouseLeave = useCallback(() => {
    setStyle({ transform: 'translate(0px, 0px)' })
  }, [])

  return { style, onMouseMove, onMouseLeave }
}
