import type { MenuItem } from './menu'
import type { SizeId } from '@/data/pricing'
import type { ExtraOption } from '@/data/extras'

export interface CartLine {
  /** Identificador único de esta línea (cada configuración distinta del mismo producto es una línea aparte). */
  lineId: string
  item: MenuItem
  quantity: number
  size?: SizeId
  extras: ExtraOption[]
  removedIngredients: string[]
  /** Notas específicas de este ítem (ej. "bien cocida", "sin sal"). */
  itemNotes: string
  /** Precio unitario ya calculado (base + tamaño + extras) al momento de agregarlo. */
  unitPrice: number
}

export type NewCartLine = Omit<CartLine, 'lineId'>

export type DeliveryMethod = 'retiro' | 'envio'
export type PaymentMethod = 'efectivo' | 'transferencia'

export interface CartState {
  lines: CartLine[]
  isOpen: boolean
  deliveryMethod: DeliveryMethod
  paymentMethod: PaymentMethod
  address: string
  /** Notas generales del pedido (distintas de las notas por ítem). */
  notes: string
  customerName: string
  customerPhone: string
  /** Zona de envío elegida (id de delivery_zones en Supabase, vacío si no aplica). */
  deliveryZoneId: string
  /** Horario de entrega elegido (id de delivery_slots en Supabase, vacío si no aplica). */
  deliverySlotId: string
}
