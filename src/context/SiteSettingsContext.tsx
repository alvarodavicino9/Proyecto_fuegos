// Contexto global con los datos "vivos" del negocio (horarios, dirección,
// redes, textos). Se carga una vez al montar la app desde la tabla
// `site_settings` de Supabase; si no hay conexión o no está configurado,
// usa los valores estáticos de src/data/business.ts como respaldo, así el
// sitio nunca queda roto.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { business as staticBusiness, type BusinessData } from '@/data/business'
import type { SiteSettingsRow } from '@/types/db'

function rowToBusiness(row: SiteSettingsRow): BusinessData {
  return {
    name: row.name,
    tagline: row.tagline,
    shortDescription: row.short_description,
    instagramHandle: row.instagram_handle,
    instagramUrl: row.instagram_url,
    whatsappNumber: row.whatsapp_number,
    phoneDisplay: row.phone_display,
    address: {
      street: row.address_street,
      city: row.address_city,
      province: row.address_province,
      postalCode: row.address_postal_code,
      country: row.address_country,
      full: `${row.address_street}, ${row.address_postal_code} ${row.address_city}, ${row.address_province}`,
    },
    hours: [{ days: row.hours_days, time: row.hours_time }],
    closedNote: row.closed_note,
    schedule: {
      openDays: row.schedule_open_days,
      opens: row.schedule_opens,
      closes: row.schedule_closes,
    },
  }
}

interface SiteSettingsValue {
  business: BusinessData
  loading: boolean
  /** true si `business` viene de Supabase; false si se está usando el respaldo estático. */
  isLive: boolean
  refresh: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsValue | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<BusinessData>(staticBusiness)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [isLive, setIsLive] = useState(false)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    if (error || !data) {
      setLoading(false)
      return
    }
    setBusiness(rowToBusiness(data))
    setIsLive(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <SiteSettingsContext.Provider value={{ business, loading, isLive, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings(): SiteSettingsValue {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) throw new Error('useSiteSettings debe usarse dentro de <SiteSettingsProvider>')
  return ctx
}
