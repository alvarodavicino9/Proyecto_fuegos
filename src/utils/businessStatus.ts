import type { BusinessData } from '@/data/business'

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function isOpenNow(business: BusinessData, now: Date = new Date()): boolean {
  const { openDays, opens, closes } = business.schedule
  if (!openDays.includes(now.getDay())) return false
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return nowMinutes >= toMinutes(opens) && nowMinutes < toMinutes(closes)
}

export function statusLabel(business: BusinessData, now: Date = new Date()): string {
  if (isOpenNow(business, now)) return 'Abierto ahora'
  const { days, time } = business.hours[0]
  return `Cerrado · abre ${days} de ${time}`
}
