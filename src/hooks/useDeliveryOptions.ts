// Zonas de envío y horarios de entrega activos (controlados desde el panel
// admin → pestaña Delivery). Si Supabase no está configurado, devuelve
// listas vacías: el carrito sigue funcionando igual que antes, solo pide
// la dirección de envío sin zona ni horario.

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { DeliveryZoneRow, DeliverySlotRow } from '@/types/db'

interface DeliveryOptionsState {
  zones: DeliveryZoneRow[]
  slots: DeliverySlotRow[]
  loading: boolean
}

export function useDeliveryOptions(): DeliveryOptionsState {
  const [state, setState] = useState<DeliveryOptionsState>({
    zones: [],
    slots: [],
    loading: isSupabaseConfigured,
  })

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    async function load() {
      const [zonesRes, slotsRes] = await Promise.all([
        supabase.from('delivery_zones').select('*').eq('active', true).order('sort_order', { ascending: true }),
        supabase.from('delivery_slots').select('*').eq('active', true).order('sort_order', { ascending: true }),
      ])
      if (cancelled) return
      setState({ zones: zonesRes.data ?? [], slots: slotsRes.data ?? [], loading: false })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
