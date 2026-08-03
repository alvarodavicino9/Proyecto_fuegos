import { useEffect, useState } from 'react'
import type { MenuCategory, MenuItem } from '@/types/menu'
import { SIZE_OPTIONS, getSizeExtraCost, type SizeId } from '@/data/pricing'
import { EXTRA_OPTIONS } from '@/data/extras'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { trackEvent, trackMetaEvent } from '@/lib/analytics'
import { itemHasSizes } from '@/utils/menuHelpers'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/context/CartContext'
import CloseIcon from '../icons/CloseIcon'
import ShareIcon from '../icons/ShareIcon'
import { PlusIcon, MinusIcon } from '../icons/PlusMinusIcons'
import styles from './ProductModal.module.css'

interface Props {
  item: MenuItem
  category?: MenuCategory
  onClose: () => void
}

export default function ProductModal({ item, category, onClose }: Props) {
  const { addLine, openCart } = useCart()
  const { business } = useSiteSettings()
  const hasSizes = itemHasSizes(item)

  const [size, setSize] = useState<SizeId>('simple')
  const [extraIds, setExtraIds] = useState<string[]>([])
  const [removed, setRemoved] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [entered, setEntered] = useState(false)
  const [closing, setClosing] = useState(false)

  // Anima la entrada (scale+translateY) recién en el segundo frame, para que
  // el estado inicial "cerrado" alcance a pintarse antes de animar. Al
  // cerrar, espera la transición de salida antes de desmontar de verdad.
  useEffect(() => {
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 300)
  }

  const selectedExtras = EXTRA_OPTIONS.filter((extra) => extraIds.includes(extra.id))
  const sizeCost = hasSizes ? getSizeExtraCost(size) : 0
  const extrasCost = selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
  const unitPrice = item.price + sizeCost + extrasCost
  const totalPrice = unitPrice * quantity

  function toggleExtra(id: string) {
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleRemoved(name: string) {
    setRemoved((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]))
  }

  function handleShare() {
    const shareUrl = window.location.href
    const nav = navigator as Navigator & { share?: (data: { title: string; url: string }) => Promise<void> }
    if (nav.share) {
      nav.share({ title: `${item.name} — ${business.name}`, url: shareUrl }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {})
    }
  }

  function handleAdd() {
    addLine({
      item,
      quantity,
      size: hasSizes ? size : undefined,
      extras: selectedExtras,
      removedIngredients: removed,
      itemNotes: notes.trim(),
      unitPrice,
    })
    trackEvent('add_to_cart', {
      currency: 'ARS',
      value: totalPrice,
      items: [{ item_id: item.id, item_name: item.name, quantity, price: unitPrice }],
    })
    trackMetaEvent('AddToCart', { content_name: item.name, currency: 'ARS', value: totalPrice })
    openCart()
    handleClose()
  }

  const open = entered && !closing

  return (
    <div className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} onClick={handleClose}>
      <div
        className={`${styles.modal} ${open ? styles.modalOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <div className={styles.media} style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}>
          {!item.image && <span className={styles.mediaPlaceholder}>Fuegos</span>}
          {category && <span className={styles.categoryBadge}>{category.label}</span>}
          <div className={styles.mediaActions}>
            <button onClick={handleShare} aria-label="Compartir producto">
              <ShareIcon size={16} />
            </button>
            <button onClick={handleClose} aria-label="Cerrar">
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <h2 className={styles.name}>{item.name}</h2>
          <p className={styles.description}>{item.description}</p>

          {hasSizes && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Tamaño</p>
              <div className={styles.sizeGrid}>
                {SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={size === option.id ? styles.sizeActive : styles.sizeOption}
                    onClick={() => setSize(option.id)}
                  >
                    <span className={styles.sizeCode}>{option.code}</span>
                    <span className={styles.sizeLabel}>{option.label}</span>
                    {option.extraPatties > 0 && (
                      <span className={styles.sizeExtra}>+{formatCurrency(getSizeExtraCost(option.id))}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Extras (opcional)</p>
            <div className={styles.optionList}>
              {EXTRA_OPTIONS.map((extra) => (
                <label key={extra.id} className={styles.checkRow}>
                  <span className={styles.checkLeft}>
                    <input type="checkbox" checked={extraIds.includes(extra.id)} onChange={() => toggleExtra(extra.id)} />
                    {extra.name}
                  </span>
                  <span className={styles.checkPrice}>+{formatCurrency(extra.price)}</span>
                </label>
              ))}
            </div>
          </div>

          {item.ingredients && item.ingredients.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Quitar ingredientes</p>
              <div className={styles.optionList}>
                {item.ingredients.map((ingredient) => (
                  <label key={ingredient} className={styles.checkRow}>
                    <span className={styles.checkLeft}>
                      <input
                        type="checkbox"
                        checked={removed.includes(ingredient)}
                        onChange={() => toggleRemoved(ingredient)}
                      />
                      Sin {ingredient}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Notas del ítem</p>
            <textarea
              className={styles.notes}
              placeholder="Ej: bien cocida, sin sal..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.quantity}>
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Restar cantidad">
              <MinusIcon size={16} />
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} aria-label="Sumar cantidad">
              <PlusIcon size={16} />
            </button>
          </div>

          <button className={styles.addButton} onClick={handleAdd}>
            Agregar al pedido · {formatCurrency(totalPrice)}
          </button>
        </footer>
      </div>
    </div>
  )
}
