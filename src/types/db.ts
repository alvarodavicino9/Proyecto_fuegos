// Tipos que reflejan el schema de Supabase (ver supabase/schema.sql).
// Se mantienen a mano (no generados) porque el schema es chico y estable;
// si se agregan columnas nuevas, actualizar acá también.

export type OrderStatus = 'nuevo' | 'preparando' | 'en_camino' | 'entregado' | 'cancelado'
export type DbDeliveryMethod = 'retiro' | 'envio'
export type DbPaymentMethod = 'efectivo' | 'transferencia'

export interface CategoryRow {
  id: string
  label: string
  sort_order: number
}

export interface ProductRow {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string | null
  tags: string[]
  ingredients: string[]
  active: boolean
  sort_order: number
  created_at: string
}

export interface SiteSettingsRow {
  id: number
  name: string
  tagline: string
  short_description: string
  instagram_handle: string
  instagram_url: string
  whatsapp_number: string
  phone_display: string
  address_street: string
  address_city: string
  address_province: string
  address_postal_code: string
  address_country: string
  hours_days: string
  hours_time: string
  closed_note: string
  schedule_open_days: number[]
  schedule_opens: string
  schedule_closes: string
  updated_at: string
}

export interface DeliveryZoneRow {
  id: string
  name: string
  cost: number
  active: boolean
  sort_order: number
}

export interface DeliverySlotRow {
  id: string
  label: string
  active: boolean
  sort_order: number
}

export interface OrderItemSnapshot {
  name: string
  quantity: number
  unitPrice: number
  size?: string
  extras?: string[]
  removedIngredients?: string[]
  itemNotes?: string
}

export interface OrderRow {
  id: string
  created_at: string
  status: OrderStatus
  customer_name: string
  customer_phone: string | null
  delivery_method: DbDeliveryMethod
  address: string | null
  delivery_zone_id: string | null
  delivery_zone_name: string | null
  delivery_cost: number
  delivery_slot_id: string | null
  delivery_slot_label: string | null
  payment_method: DbPaymentMethod
  notes: string
  items: OrderItemSnapshot[]
  subtotal: number
  total: number
}

export interface Database {
  public: {
    Tables: {
      categories: { Row: CategoryRow; Insert: Partial<CategoryRow>; Update: Partial<CategoryRow> }
      products: { Row: ProductRow; Insert: Partial<ProductRow>; Update: Partial<ProductRow> }
      site_settings: { Row: SiteSettingsRow; Insert: Partial<SiteSettingsRow>; Update: Partial<SiteSettingsRow> }
      delivery_zones: { Row: DeliveryZoneRow; Insert: Partial<DeliveryZoneRow>; Update: Partial<DeliveryZoneRow> }
      delivery_slots: { Row: DeliverySlotRow; Insert: Partial<DeliverySlotRow>; Update: Partial<DeliverySlotRow> }
      orders: { Row: OrderRow; Insert: Partial<OrderRow>; Update: Partial<OrderRow> }
    }
  }
}
