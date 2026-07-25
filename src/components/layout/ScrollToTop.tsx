import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Al navegar entre páginas (Inicio/Menú/Nosotros/Contacto) siempre arrancamos
// arriba de todo, como se espera de páginas separadas.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
