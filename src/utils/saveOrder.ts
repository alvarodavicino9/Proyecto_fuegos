// Guarda el pedido en Supabase (tabla `orders`) para que aparezca en el
// panel admin. Se llama al confirmar el checkout, además de abrir
// WhatsApp — WhatsApp sigue siendo el canal principal para coordinar con
// el cliente, esto solo deja un registro para el panel.
// Si Supabase no está configurado o falla el guardado, no interrumpe el
// flujo: el pedido igual se manda por WhatsApp con normalidad.

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { CartState } from '@/types/cart'
import type { DeliveryZoneRow, DeliverySlotRow, OrderItemSnapshot } from '@/types/db'

interface SaveOrderArgs {
  state: CartState
  subtotal: number
  deliveryCost: number
  zone?: DeliveryZoneRow
  slot?: DeliverySlotRow
}

export async function saveOrderToSupabase({ state, subtotal, deliveryCost, zone, slot }: SaveOrderArgs): Promise<void> {
  if (!isSupabaseConfigured) return

  const items: OrderItemSnapshot[] = state.lines.map((line) => ({
    name: line.item.name,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    size: line.size,
    extras: line.extras.length > 0 ? line.extras.map((e) => e.name) : undefined,
    removedIngredients: line.removedIngredients.length > 0 ? line.removedIngredients : undefined,
    itemNotes: line.itemNotes || undefined,
  }))

  const { error } = await supabase.from('orders').insert({
    customer_name: state.customerName,
    customer_phone: state.customerPhone || null,
    delivery_method: state.deliveryMethod,
    address: state.deliveryMethod === 'envio' ? state.address : null,
    delivery_zone_id: zone?.id ?? null,
    delivery_zone_name: zone?.name ?? null,
    delivery_cost: deliveryCost,
    delivery_slot_id: slot?.id ?? null,
    delivery_slot_label: slot?.label ?? null,
    payment_method: state.paymentMethod,
    notes: state.notes,
    items,
    subtotal,
    total: subtotal + deliveryCost,
  })

  if (error) {
    console.error('No se pudo guardar el pedido en Supabase (el pedido igual se envió por WhatsApp):', error.message)
  }
}
