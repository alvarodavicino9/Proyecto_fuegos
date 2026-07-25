// Extras disponibles para agregar a cualquier producto del menú.
// ⚠️ Precios ficticios de referencia, a confirmar con el dueño.

export interface ExtraOption {
  id: string
  name: string
  price: number
}

export const EXTRA_OPTIONS: ExtraOption[] = [
  { id: 'huevo-frito', name: 'Huevo frito', price: 500 },
  { id: 'panceta', name: 'Panceta', price: 700 },
  { id: 'cheddar-extra', name: 'Cheddar extra', price: 500 },
  { id: 'pepinillos', name: 'Pepinillos caseros', price: 500 },
  { id: 'aderezo-extra', name: 'Aderezo de la casa extra', price: 300 },
  { id: 'bebida', name: 'Gaseosa 350ml', price: 1500 },
  { id: 'papas-chicas', name: 'Papas chicas de acompañamiento', price: 1800 },
]
