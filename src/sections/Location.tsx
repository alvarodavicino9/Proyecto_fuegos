import ClockIcon from '@/components/icons/ClockIcon'
import LocationIcon from '@/components/icons/LocationIcon'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { buildGenericGreeting, buildWhatsAppUrl } from '@/utils/whatsapp'
import styles from './Location.module.css'

export default function Location() {
  const { business } = useSiteSettings()
  const mapQuery = encodeURIComponent(business.address.full)

  return (
    <section id="ubicacion" className="section">
      <div className="container">
        <span className="section-eyebrow">Ubicación y horarios</span>
        <h2 className="section-title">Encontranos en {business.address.city}</h2>

        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.item}>
              <LocationIcon />
              <div>
                <p className={styles.label}>Dirección</p>
                <p>{business.address.full}</p>
              </div>
            </div>

            <div className={styles.item}>
              <ClockIcon />
              <div>
                <p className={styles.label}>Horarios</p>
                {business.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
                <p className={styles.muted}>{business.closedNote}</p>
              </div>
            </div>

            <div className={styles.item}>
              <WhatsAppIcon />
              <div>
                <p className={styles.label}>Contacto</p>
                <a
                  href={buildWhatsAppUrl(buildGenericGreeting(business), business.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.phoneLink}
                >
                  {business.phoneDisplay}
                </a>
              </div>
            </div>

            <div className={styles.item}>
              <InstagramIcon />
              <div>
                <p className={styles.label}>Instagram</p>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.phoneLink}
                >
                  {business.instagramHandle}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.mapWrapper} id="contacto">
            <iframe
              title={`Mapa de ${business.name}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
