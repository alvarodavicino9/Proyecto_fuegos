import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'
import InstagramIcon from '../icons/InstagramIcon'
import WhatsAppIcon from '../icons/WhatsAppIcon'
import LocationIcon from '../icons/LocationIcon'
import { business } from '@/data/business'
import { buildGenericGreeting, buildWhatsAppUrl } from '@/utils/whatsapp'
import styles from './Footer.module.css'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Logo />
          <p className={styles.tagline}>
            Hamburguesas artesanales en {business.address.city}, {business.address.province}. Pedidos por WhatsApp,{' '}
            {business.hours[0].days.toLowerCase()} de {business.hours[0].time}.
          </p>
          <div className={styles.social}>
            <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Fuegos">
              <InstagramIcon />
            </a>
            <a
              href={buildWhatsAppUrl(buildGenericGreeting())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de Fuegos"
            >
              <WhatsAppIcon />
            </a>
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(business.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ubicación de Fuegos"
            >
              <LocationIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className={styles.colTitle}>Navegación</h3>
          <ul className={styles.linkList}>
            <li>
              <Link to="/" onClick={scrollToTop}>→ Inicio</Link>
            </li>
            <li>
              <Link to="/menu" onClick={scrollToTop}>→ Menú</Link>
            </li>
            <li>
              <Link to="/nosotros" onClick={scrollToTop}>→ Nosotros</Link>
            </li>
            <li>
              <Link to="/contacto" onClick={scrollToTop}>→ Contacto</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={styles.colTitle}>Contacto</h3>
          <ul className={styles.linkList}>
            <li>{business.phoneDisplay}</li>
            <li>{business.instagramHandle}</li>
            <li>{business.address.full}</li>
          </ul>
        </div>
      </div>

      <p className={styles.copy}>
        © {new Date().getFullYear()} {business.name} — Todos los derechos reservados
      </p>
    </footer>
  )
}
