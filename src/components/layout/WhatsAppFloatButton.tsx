import { useEffect, useRef, useState } from 'react'
import WhatsAppIcon from '../icons/WhatsAppIcon'
import CloseIcon from '../icons/CloseIcon'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { isOpenNow } from '@/utils/businessStatus'
import { buildGenericGreeting, buildWhatsAppUrl, getQuickChatOptions } from '@/utils/whatsapp'
import styles from './WhatsAppFloatButton.module.css'

// Botón flotante de WhatsApp: en vez de ir directo al chat, abre un mini
// panel con opciones rápidas (pedido, consulta, envíos) para que el
// cliente elija el motivo antes de escribir, similar a los widgets de
// chat comerciales.
export default function WhatsAppFloatButton() {
  const { business } = useSiteSettings()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function openWhatsApp(message: string) {
    window.open(buildWhatsAppUrl(message, business.whatsappNumber), '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className={styles.wrap}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label={`Chat de WhatsApp con ${business.name}`}>
          <header className={styles.panelHeader}>
            <span className={styles.avatar}>
              <WhatsAppIcon size={20} />
            </span>
            <div className={styles.headerText}>
              <strong>{business.name}</strong>
              <span className={styles.status}>
                <span className={styles.statusDot} />
                {isOpenNow(business) ? 'Disponible ahora' : 'Te respondemos apenas abramos'}
              </span>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar chat">
              <CloseIcon size={15} />
            </button>
          </header>

          <div className={styles.panelBody}>
            <p className={styles.bubble}>¡Hola! 👋 ¿En qué podemos ayudarte? Elegí una opción o escribinos directo.</p>

            {getQuickChatOptions(business).map((option) => (
              <button
                key={option.label}
                className={styles.optionButton}
                onClick={() => openWhatsApp(option.message)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button className={styles.openBar} onClick={() => openWhatsApp(buildGenericGreeting(business))}>
            <WhatsAppIcon size={18} />
            Abrir WhatsApp
          </button>
        </div>
      )}

      <button
        className={styles.floatButton}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat de WhatsApp' : 'Pedir por WhatsApp'}
      >
        {open ? <CloseIcon size={24} /> : <WhatsAppIcon size={28} />}
      </button>
    </div>
  )
}
