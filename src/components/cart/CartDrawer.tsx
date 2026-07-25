import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { buildOrderMessage, buildWhatsAppUrl } from '@/utils/whatsapp'
import { business } from '@/data/business'
import { getSizeOption } from '@/data/pricing'
import CloseIcon from '../icons/CloseIcon'
import TrashIcon from '../icons/TrashIcon'
import ArrowLeftIcon from '../icons/ArrowLeftIcon'
import WhatsAppIcon from '../icons/WhatsAppIcon'
import Button from '../ui/Button'
import Field from '../ui/Field'
import CartLineItem from './CartLineItem'
import styles from './CartDrawer.module.css'

const deliveryLabel = { retiro: '🏠 Retiro en local', envio: '🛵 Delivery' } as const
const paymentLabel = { efectivo: 'Efectivo', transferencia: 'Transferencia' } as const

export default function CartDrawer() {
  const {
    state,
    totalPrice,
    closeCart,
    setDeliveryMethod,
    setPaymentMethod,
    setAddress,
    setNotes,
    setCustomerName,
    setCustomerPhone,
    clearCart,
  } = useCart()

  const [step, setStep] = useState<'cart' | 'review'>('cart')

  useEffect(() => {
    if (state.isOpen) setStep('cart')
  }, [state.isOpen])

  if (!state.isOpen) return null

  const canReview =
    state.lines.length > 0 &&
    state.customerName.trim().length > 0 &&
    (state.deliveryMethod === 'retiro' || state.address.trim().length > 0)

  function handleConfirm() {
    const message = buildOrderMessage({
      lines: state.lines,
      deliveryMethod: state.deliveryMethod,
      paymentMethod: state.paymentMethod,
      address: state.address,
      notes: state.notes,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
    })
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
    clearCart()
    closeCart()
  }

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()} aria-label="Carrito de pedido">
        {step === 'cart' ? (
          <>
            <header className={styles.header}>
              <div>
                <h2>Mi pedido</h2>
                <p className={styles.count}>{state.lines.length} producto{state.lines.length !== 1 ? 's' : ''}</p>
              </div>
              <div className={styles.headerActions}>
                {state.lines.length > 0 && (
                  <button onClick={clearCart} aria-label="Vaciar carrito">
                    <TrashIcon size={16} />
                  </button>
                )}
                <button onClick={closeCart} aria-label="Cerrar carrito">
                  <CloseIcon />
                </button>
              </div>
            </header>

            {state.lines.length === 0 ? (
              <p className={styles.emptyState}>Todavía no agregaste productos. ¡Recorré el menú y sumá tus favoritos!</p>
            ) : (
              <>
                <div className={styles.lines}>
                  {state.lines.map((line) => (
                    <CartLineItem key={line.lineId} line={line} />
                  ))}
                </div>

                <div className={styles.form}>
                  <Field label="Tipo de pedido">
                    <div className={styles.optionRow}>
                      <button
                        className={state.deliveryMethod === 'retiro' ? styles.optionActive : styles.option}
                        onClick={() => setDeliveryMethod('retiro')}
                      >
                        🏠 Retiro en local
                      </button>
                      <button
                        className={state.deliveryMethod === 'envio' ? styles.optionActive : styles.option}
                        onClick={() => setDeliveryMethod('envio')}
                      >
                        🛵 Delivery
                      </button>
                    </div>
                  </Field>

                  {state.deliveryMethod === 'envio' && (
                    <Field label="Dirección de envío *" htmlFor="address">
                      <input
                        id="address"
                        className={styles.input}
                        placeholder="Calle, número y referencias"
                        value={state.address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Field>
                  )}

                  <Field label="Tu nombre *" htmlFor="name">
                    <input
                      id="name"
                      className={styles.input}
                      placeholder="¿Cómo te llamás?"
                      value={state.customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </Field>

                  <Field label="Teléfono (opcional)" htmlFor="phone">
                    <input
                      id="phone"
                      className={styles.input}
                      placeholder="Tu número de WhatsApp"
                      value={state.customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </Field>

                  <Field label="Método de pago *">
                    <div className={styles.optionRow}>
                      <button
                        className={state.paymentMethod === 'efectivo' ? styles.optionActive : styles.option}
                        onClick={() => setPaymentMethod('efectivo')}
                      >
                        Efectivo
                      </button>
                      <button
                        className={state.paymentMethod === 'transferencia' ? styles.optionActive : styles.option}
                        onClick={() => setPaymentMethod('transferencia')}
                      >
                        Transferencia
                      </button>
                    </div>
                  </Field>

                  <Field label="Notas (opcional)" htmlFor="notes">
                    <textarea
                      id="notes"
                      className={styles.textarea}
                      placeholder="Sin cebolla, punto de la carne, etc."
                      value={state.notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </Field>
                </div>

                <footer className={styles.footer}>
                  <div className={styles.total}>
                    <span>Total</span>
                    <strong>{formatCurrency(totalPrice)}</strong>
                  </div>
                  <Button onClick={() => setStep('review')} disabled={!canReview} className={styles.reviewButton}>
                    Revisar y enviar pedido
                  </Button>
                  {!canReview && <p className={styles.hint}>Completá nombre {state.deliveryMethod === 'envio' ? 'y dirección ' : ''}para continuar.</p>}
                </footer>
              </>
            )}
          </>
        ) : (
          <>
            <header className={styles.header}>
              <button className={styles.backButton} onClick={() => setStep('cart')} aria-label="Volver al carrito">
                <ArrowLeftIcon />
              </button>
              <div>
                <h2>Revisá tu pedido</h2>
                <p className={styles.count}>Confirmá antes de enviar</p>
              </div>
              <button onClick={closeCart} aria-label="Cerrar carrito">
                <CloseIcon />
              </button>
            </header>

            <div className={styles.reviewBody}>
              <p className={styles.reviewLabel}>Productos</p>
              <div className={styles.reviewProducts}>
                {state.lines.map((line) => {
                  const details: string[] = []
                  if (line.size) details.push(getSizeOption(line.size).label)
                  if (line.extras.length > 0) details.push(`+ ${line.extras.map((e) => e.name).join(', ')}`)
                  if (line.removedIngredients.length > 0) details.push(`sin ${line.removedIngredients.join(', ')}`)
                  if (line.itemNotes) details.push(`"${line.itemNotes}"`)

                  return (
                    <div key={line.lineId} className={styles.reviewProduct}>
                      <div>
                        <span>
                          {line.item.name} ×{line.quantity}
                        </span>
                        {details.length > 0 && <p className={styles.reviewProductDetails}>{details.join(' · ')}</p>}
                      </div>
                      <span>{formatCurrency(line.unitPrice * line.quantity)}</span>
                    </div>
                  )
                })}
              </div>

              <p className={styles.reviewLabel}>Datos de entrega</p>
              <div className={styles.reviewDetails}>
                <div className={styles.reviewRow}>
                  <span>Modalidad</span>
                  <strong>{deliveryLabel[state.deliveryMethod]}</strong>
                </div>
                {state.deliveryMethod === 'envio' && (
                  <div className={styles.reviewRow}>
                    <span>Dirección</span>
                    <strong>{state.address}</strong>
                  </div>
                )}
                <div className={styles.reviewRow}>
                  <span>Nombre</span>
                  <strong>{state.customerName}</strong>
                </div>
                {state.customerPhone && (
                  <div className={styles.reviewRow}>
                    <span>Teléfono</span>
                    <strong>{state.customerPhone}</strong>
                  </div>
                )}
                <div className={styles.reviewRow}>
                  <span>Pago</span>
                  <strong>{paymentLabel[state.paymentMethod]}</strong>
                </div>
                {state.notes && (
                  <div className={styles.reviewRow}>
                    <span>Notas</span>
                    <strong>{state.notes}</strong>
                  </div>
                )}
              </div>
            </div>

            <footer className={styles.footer}>
              <div className={styles.total}>
                <span>Total</span>
                <strong>{formatCurrency(totalPrice)}</strong>
              </div>
              <Button icon={<WhatsAppIcon size={18} />} onClick={handleConfirm} className={styles.confirmButton}>
                Confirmar y enviar
              </Button>
              <p className={styles.hint}>
                Se abre WhatsApp con el pedido listo para enviar a {business.name} ({business.phoneDisplay}).
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
