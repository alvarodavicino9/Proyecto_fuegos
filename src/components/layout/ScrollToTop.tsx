import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '@/lib/analytics'

// Al navegar entre páginas (Inicio/Menú/Nosotros/Contacto) siempre arrancamos
// arriba de todo, como se espera de páginas separadas. Aprovechamos el mismo
// listener de ruta para mandar la vista de página a analítica (si está
// configurada) — no tiene sentido trackear rutas de /admin.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    if (!pathname.startsWith('/admin')) trackPageView(pathname)
  }, [pathname])

  return null
}
