// Datos generales del negocio.
// Este archivo concentra toda la info de contacto/ubicación para poder
// actualizarla en un solo lugar sin tocar componentes.

export interface BusinessHours {
  days: string
  time: string
}

export const business = {
  name: 'Fuegos',
  tagline: 'Tu nuevo vicio',
  shortDescription: 'Burger, lomos y milas',
  instagramHandle: '@fuegos.ceres',
  instagramUrl: 'https://www.instagram.com/fuegos.ceres',
  // Número en formato internacional para wa.me (sin espacios ni signos).
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
  hours: [{ days: 'Miércoles a Domingo', time: '19:30 a 23:30' }] as BusinessHours[],
  closedNote: 'Lunes y martes cerrado',
  // Usado para calcular en vivo si el local está abierto (ver utils/businessStatus.ts).
  // Días con getDay(): 0=domingo, 1=lunes, 2=martes, 3=miércoles, 4=jueves, 5=viernes, 6=sábado.
  schedule: {
    openDays: [3, 4, 5, 6, 0],
    opens: '19:30',
    closes: '23:30',
  },
} as const

export type Business = typeof business
