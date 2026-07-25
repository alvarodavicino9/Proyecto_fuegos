import ClockIcon from '@/components/icons/ClockIcon'
import LocationIcon from '@/components/icons/LocationIcon'
import FlameIcon from '@/components/icons/FlameIcon'
import { business } from '@/data/business'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './InfoStrip.module.css'

export default function InfoStrip() {
  const { ref, revealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className={`${styles.strip} ${revealed ? styles.revealed : ''}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.card}>
          <span className={styles.iconWrap}>
            <ClockIcon />
          </span>
          <div>
            <h3 className={styles.title}>Horario</h3>
            <p>
              {business.hours[0].days}: {business.hours[0].time}
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.iconWrap}>
            <LocationIcon />
          </span>
          <div>
            <h3 className={styles.title}>Ubicación</h3>
            <p>{business.address.street}</p>
            <p>
              {business.address.city}, {business.address.province}
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.iconWrap}>
            <FlameIcon size={20} />
          </span>
          <div>
            <h3 className={styles.title}>Delivery</h3>
            <p>Envíos a toda la ciudad de {business.address.city}.</p>
            <p>Cargá tu dirección al confirmar el pedido y queda en el mensaje de WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
