// Datos generales del negocio (valores por defecto / respaldo).
//
// Este archivo se usa como fallback cuando Supabase no está configurado o
// falla la conexión. Cuando el panel admin está en marcha, la fuente real
// de estos datos es la tabla `site_settings` de Supabase — ver
// src/hooks/useSiteSettings.ts y src/context/SiteSettingsContext.tsx. El
// resto de los componentes ya no importan `business` directamente: usan
// `useSiteSettings()` para poder reflejar los cambios que hace el dueño
// desde /admin sin tener que tocar código ni redeployar.

export interface BusinessHours {
  days: string
  time: string
}

export interface BusinessAddress {
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  full: string
}

export interface BusinessSchedule {
  /** Días con getDay(): 0=domingo, 1=lunes, 2=martes, 3=miércoles, 4=jueves, 5=viernes, 6=sábado. */
  openDays: number[]
  opens: string
  closes: string
}

export interface BusinessData {
  name: string
  tagline: string
  shortDescription: string
  instagramHandle: string
  instagramUrl: string
  /** Número en formato internacional para wa.me (sin espacios ni signos). */
  whatsappNumber: string
  phoneDisplay: string
  address: BusinessAddress
  hours: BusinessHours[]
  closedNote: string
  /** Usado para calcular en vivo si el local está abierto (ver utils/businessStatus.ts). */
  schedule: BusinessSchedule
}

export const business: BusinessData = {
  name: 'Fuegos',
  tagline: 'Tu nuevo vicio',
  shortDescription: 'Burger, lomos y milas',
  instagramHandle: '@fuegos.ceres',
  instagramUrl: 'https://www.instagram.com/fuegos.ceres',
  whatsappNumber: '5493491587727',
  phoneDisplay: '+54 9 3491 58-7727',
  address: {
    street: 'Bv. España 482',
    city: 'Ceres',
    province: 'Santa Fe',
    postalCode: 'S2340',
    country: 'Argentina',
    full: 'Bv. España 482, S2340 Ceres, Santa Fe',
  },
  hours: [{ days: 'Miércoles a Domingo', time: '19:30 a 23:30' }],
  closedNote: 'Lunes y martes cerrado',
  schedule: {
    openDays: [3, 4, 5, 6, 0],
    opens: '19:30',
    closes: '23:30',
  },
}

/** @deprecated usar BusinessData */
export type Business = BusinessData
