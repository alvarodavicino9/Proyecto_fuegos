import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import MagnetWrap from '@/components/ui/MagnetWrap'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import FlameIcon from '@/components/icons/FlameIcon'
import Embers from '@/components/effects/Embers'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { buildGenericGreeting, buildWhatsAppUrl } from '@/utils/whatsapp'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './FinalCta.module.css'

export default function FinalCta() {
  const navigate = useNavigate()
  const { ref, revealed } = useScrollReveal<HTMLElement>()
  const { business } = useSiteSettings()

  return (
    <section ref={ref} className={`${styles.cta} ${revealed ? styles.revealed : ''}`}>
      <div className={styles.radialGlow} aria-hidden="true" />
      <Embers count={10} bottom="0%" />

      <div className={`container ${styles.inner}`}>
        <span className={styles.eyebrow}>
          <FlameIcon size={16} /> {business.hours[0].days}, {business.hours[0].time}
        </span>
        <h2 className={styles.title}>
          ¿Ya se te antojó <span className="highlight">algo</span>?
        </h2>
        <p className={styles.subtitle}>Armá tu pedido online o mandalo directo por WhatsApp.</p>

        <div className={styles.actions}>
          <MagnetWrap>
            <Button onClick={() => navigate('/menu')}>Ver el menú</Button>
          </MagnetWrap>
          <MagnetWrap>
            <Button
              variant="outline"
              icon={<WhatsAppIcon size={18} />}
              onClick={() => window.open(buildWhatsAppUrl(buildGenericGreeting(business), business.whatsappNumber), '_blank')}
            >
              Pedir por WhatsApp
            </Button>
          </MagnetWrap>
        </div>
      </div>
    </section>
  )
}
