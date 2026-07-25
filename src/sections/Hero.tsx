import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import MagnetWrap from '@/components/ui/MagnetWrap'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import FlameIcon from '@/components/icons/FlameIcon'
import RingsBackground from '@/components/hero/RingsBackground'
import Embers from '@/components/effects/Embers'
import { business } from '@/data/business'
import { buildGenericGreeting, buildWhatsAppUrl } from '@/utils/whatsapp'
import styles from './Hero.module.css'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className={styles.hero}>
      <RingsBackground className={styles.rings} />
      <div className={styles.glow} aria-hidden="true" />
      <Embers count={14} bottom="6%" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.logoWrap}>
          <div className={styles.logoGlow} aria-hidden="true" />
          <FlameIcon size={96} className={styles.flame} />
        </div>
        <div className={styles.wordmark}>{business.name}</div>

        <span className={styles.eyebrow}>
          <FlameIcon size={18} /> {business.shortDescription} en {business.address.city}
        </span>

        <p className={styles.tagline}>{business.tagline}, hecho en el momento.</p>

        <p className={styles.description}>
          Recetas propias de la casa, ingredientes de calidad y ese toque crocante que solo da la plancha bien
          caliente.
        </p>

        <div className={styles.actions}>
          <MagnetWrap>
            <Button onClick={() => navigate('/menu')}>Ver el menú</Button>
          </MagnetWrap>
          <MagnetWrap>
            <Button
              variant="outline"
              icon={<WhatsAppIcon size={18} />}
              onClick={() => window.open(buildWhatsAppUrl(buildGenericGreeting()), '_blank')}
            >
              Pedir por WhatsApp
            </Button>
          </MagnetWrap>
        </div>
      </div>
    </section>
  )
}
