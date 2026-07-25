import type { MenuItem } from '@/types/menu'

// Por ahora solo las hamburguesas ofrecen selector de tamaño (simple/doble/
// triple/cuádruple, ver src/data/pricing.ts). Sandwiches y para picar
// permiten extras, quitar ingredientes y notas, pero no cambian de tamaño.
export function itemHasSizes(item: MenuItem): boolean {
  return item.categoryId === 'hamburguesas'
}
