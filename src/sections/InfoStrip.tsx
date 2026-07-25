import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FlameIcon from '@/components/icons/FlameIcon'
import { business } from '@/data/business'
import { isOpenNow, statusLabel } from '@/utils/businessStatus'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './InfoStrip.module.css'

// Franja liviana de datos clave para el home. A propósito no repite la
// dirección completa ni los horarios detallados: esa info ya vive en su
// propia sección (Contacto), esto es solo un adelanto con estado en vivo.
export default function InfoStrip() {
  const { ref, revealed } = useScrollReveal<HTMLElement>()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <section ref={ref} className={`${styles.strip} ${revealed ? styles.revealed : ''}`}>
      <div className={`container ${styles.bar}`}>
        <span className={styles.item}>
          <span className={isOpenNow(now) ? styles.dotOpen : styles.dotClosed} />
          {statusLabel(now)}
        </span>

        <span className={styles.divider} aria-hidden="true" />

        <span className={styles.item}>
          <FlameIcon size={16} />
          Contamos con delivery propio a toda la ciudad de {business.address.city}
        </span>

        <span className={styles.divider} aria-hidden="true" />

        <Link to="/contacto" className={styles.link}>
          Ver ubicación y horarios completos →
        </Link>
      </div>
    </section>
  )
}
