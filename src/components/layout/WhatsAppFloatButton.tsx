import WhatsAppIcon from '../icons/WhatsAppIcon'
import { buildGenericGreeting, buildWhatsAppUrl } from '@/utils/whatsapp'
import styles from './WhatsAppFloatButton.module.css'

export default function WhatsAppFloatButton() {
  const href = buildWhatsAppUrl(buildGenericGreeting())

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatButton}
      aria-label="Pedir por WhatsApp"
    >
      <WhatsAppIcon size={28} />
    </a>
  )
}
