// Configuración de precios para la personalización de productos.
// ⚠️ Valores ficticios de referencia — el dueño los ajusta cuando confirme
// el menú definitivo (ver también src/data/menu.ts y src/data/extras.ts).

export const EXTRA_PATTY_PRICE = 1800

export const SIZE_OPTIONS = [
  { id: 'simple', label: 'Simple', code: 'S', extraPatties: 0 },
  { id: 'doble', label: 'Doble', code: 'D', extraPatties: 1 },
  { id: 'triple', label: 'Triple', code: 'T', extraPatties: 2 },
  { id: 'cuadruple', label: 'Cuádruple', code: 'C', extraPatties: 3 },
] as const

export type SizeOption = (typeof SIZE_OPTIONS)[number]
export type SizeId = SizeOption['id']

export function getSizeOption(sizeId: SizeId): SizeOption {
  return SIZE_OPTIONS.find((option) => option.id === sizeId) ?? SIZE_OPTIONS[0]
}

export function getSizeExtraCost(sizeId: SizeId): number {
  return getSizeOption(sizeId).extraPatties * EXTRA_PATTY_PRICE
}
