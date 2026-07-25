import { NavLink } from 'react-router-dom'
import CloseIcon from '../icons/CloseIcon'
import InstagramIcon from '../icons/InstagramIcon'
import LocationIcon from '../icons/LocationIcon'
import WhatsAppIcon from '../icons/WhatsAppIcon'
import Logo from '../brand/Logo'
import { business } from '@/data/business'
import { buildGenericGreeting, buildWhatsAppUrl } from '@/utils/whatsapp'
import styles from './MobileNav.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Menú de navegación para mobile: se abre desde el botón hamburguesa del
// header (oculto en desktop, donde el nav ya se ve completo).
export default function MobileNav({ open, onClose }: Props) {
  if (!open) return null

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(business.address.full)}`

  function handleNavClick() {
    onClose()
    scrollToTop()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()} aria-label="Menú de navegación">
        <div className={styles.header}>
          <Logo variant="compact" />
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar menú">
            <CloseIcon size={18} />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Navegación principal">
          <NavLink to="/" end onClick={handleNavClick} className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            Inicio
          </NavLink>
          <NavLink to="/menu" onClick={handleNavClick} className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            Menú
          </NavLink>
          <NavLink to="/nosotros" onClick={handleNavClick} className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            Nosotros
          </NavLink>
          <NavLink to="/contacto" onClick={handleNavClick} className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            Contacto
          </NavLink>
        </nav>

        <div className={styles.quick}>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.quickLink}>
            <LocationIcon size={18} />
            {business.address.full}
          </a>
          <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.quickLink}>
            <InstagramIcon size={18} />
            {business.instagramHandle}
          </a>
        </div>

        <a
          href={buildWhatsAppUrl(buildGenericGreeting())}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappButton}
        >
          <WhatsAppIcon size={18} />
          Pedir por WhatsApp
        </a>
      </aside>
    </div>
  )
}
