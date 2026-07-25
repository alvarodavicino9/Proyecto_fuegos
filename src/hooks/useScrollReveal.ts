import { useEffect, useRef, useState, type RefObject } from 'react'

// Revela una sección (opacity/transform vía CSS) la primera vez que entra
// en el viewport. Se dispara una sola vez por sección.
export function useScrollReveal<T extends HTMLElement>(threshold = 0.15): {
  ref: RefObject<T>
  revealed: boolean
} {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
          }
        })
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, revealed }
}
