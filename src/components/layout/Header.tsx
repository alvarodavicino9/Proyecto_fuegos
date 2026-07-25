import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../brand/Logo'
import CartIcon from '../icons/CartIcon'
import InstagramIcon from '../icons/InstagramIcon'
import LocationIcon from '../icons/LocationIcon'
import { useCart } from '@/context/CartContext'
import { business } from '@/data/business'
import { isOpenNow, statusLabel } from '@/utils/businessStatus'
import styles from './Header.module.css'

export default function Header() {
  const { totalItems, openCart } = useCart()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(business.address.full)}`

  // Si ya estás en esa página (y scrolleado), el cambio de ruta no dispara
  // el ScrollToTop global porque el pathname no cambia. Esto asegura que
  // tocar cualquier link de navegación siempre te lleve al principio.
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.statusBar}`}>
        <span className={styles.statusLabel}>
          <span className={isOpenNow(now) ? styles.dotOpen : styles.dotClosed} />
          {statusLabel(now)}
        </span>

        <div className={styles.quickLinks}>
          <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Fuegos">
            <InstagramIcon size={16} />
          </a>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Ubicación de Fuegos en el mapa">
            <LocationIcon size={16} />
          </a>
        </div>
      </div>

      <div className={`container ${styles.inner}`}>
        <NavLink to="/" aria-label="Ir al inicio" className={styles.brand} end onClick={scrollToTop}>
          <Logo />
          <span className={styles.subtitle}>Hamburguesas · {business.address.city}, Santa Fe</span>
        </NavLink>

        <nav className={styles.nav} aria-label="Navegación principal">
          <NavLink to="/" end onClick={scrollToTop} className={({ isActive }) => (isActive ? styles.navActive : undefined)}>
            Inicio
          </NavLink>
          <NavLink to="/menu" onClick={scrollToTop} className={({ isActive }) => (isActive ? styles.navActive : undefined)}>
            Menú
          </NavLink>
          <NavLink to="/nosotros" onClick={scrollToTop} className={({ isActive }) => (isActive ? styles.navActive : undefined)}>
            Nosotros
          </NavLink>
          <NavLink to="/contacto" onClick={scrollToTop} className={({ isActive }) => (isActive ? styles.navActive : undefined)}>
            Contacto
          </NavLink>
        </nav>

        <button className={styles.cartButton} onClick={openCart} aria-label="Abrir carrito de pedido">
          <CartIcon size={18} />
          <span className={styles.cartLabel}>Pedido</span>
          {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
        </button>
      </div>
    </header>
  )
}
