import type { CartLine, DeliveryMethod, PaymentMethod } from '@/types/cart'
import { formatCurrency } from './formatCurrency'
import { business } from '@/data/business'
import { getSizeOption } from '@/data/pricing'

export function buildWhatsAppUrl(message: string, phone: string = business.whatsappNumber): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

const deliveryLabel: Record<DeliveryMethod, string> = {
  retiro: 'Retiro en el local',
  envio: 'Envío a domicilio',
}

const paymentLabel: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
}

export interface OrderDetails {
  lines: CartLine[]
  deliveryMethod: DeliveryMethod
  paymentMethod: PaymentMethod
  address: string
  notes: string
  customerName: string
  customerPhone?: string
}

function describeLine(line: CartLine): string {
  const details: string[] = []

  if (line.size) {
    details.push(getSizeOption(line.size).label)
  }
  if (line.extras.length > 0) {
    details.push(`+ ${line.extras.map((extra) => extra.name).join(', ')}`)
  }
  if (line.removedIngredients.length > 0) {
    details.push(`sin ${line.removedIngredients.join(', ')}`)
  }
  if (line.itemNotes) {
    details.push(`nota: ${line.itemNotes}`)
  }

  const detailText = details.length > 0 ? ` (${details.join(' · ')})` : ''
  return `• ${line.quantity}x ${line.item.name}${detailText} — ${formatCurrency(line.unitPrice * line.quantity)}`
}

export function buildOrderMessage(order: OrderDetails): string {
  const { lines, deliveryMethod, paymentMethod, address, notes, customerName, customerPhone } = order

  const itemsText = lines.map(describeLine).join('\n')
  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)

  const parts = [
    `¡Hola ${business.name}! 🔥 Quiero hacer un pedido.`,
    '',
    itemsText,
    '',
    `Total: ${formatCurrency(total)}`,
    '',
    `Entrega: ${deliveryLabel[deliveryMethod]}`,
  ]

  if (deliveryMethod === 'envio') {
    parts.push(`Dirección de envío: ${address || '(a confirmar)'}`)
  }

  parts.push(`Pago: ${paymentLabel[paymentMethod]}`)

  if (customerName) {
    parts.push(`Nombre: ${customerName}`)
  }

  if (customerPhone) {
    parts.push(`Teléfono: ${customerPhone}`)
  }

  if (notes) {
    parts.push(`Notas del pedido: ${notes}`)
  }

  parts.push('', '¡Gracias!')

  return parts.join('\n')
}

export function buildGenericGreeting(): string {
  return `¡Hola ${business.name}! 🔥 Quisiera hacer un pedido.`
}

export interface QuickChatOption {
  label: string
  message: string
}

// Opciones rápidas del widget de WhatsApp flotante (ver WhatsAppFloatButton).
export const QUICK_CHAT_OPTIONS: QuickChatOption[] = [
  { label: 'Quiero hacer un pedido', message: `¡Hola ${business.name}! 🔥 Quiero hacer un pedido.` },
  { label: 'Tengo una consulta sobre el menú', message: `¡Hola ${business.name}! 🔥 Tengo una consulta sobre el menú.` },
  {
    label: 'Quiero saber si hacen envíos a mi zona',
    message: `¡Hola ${business.name}! 🔥 Quiero saber si hacen envíos a mi zona.`,
  },
]
