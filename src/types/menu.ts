// Antes era una unión fija de 3 categorías; ahora las categorías se
// gestionan desde el panel admin (tabla `categories` en Supabase), así que
// el id puede ser cualquier string (el slug que le pongas en el panel).
export type MenuCategoryId = string

export interface MenuCategory {
  id: MenuCategoryId
  label: string
}

export interface MenuItem {
  id: string
  categoryId: MenuCategoryId
  name: string
  description: string
  price: number
  image?: string
  tags?: string[]
  /** Ingredientes que se pueden quitar al personalizar el pedido (checkbox "Quitar ingredientes"). */
  ingredients?: string[]
}
