export type MenuCategoryId = 'hamburguesas' | 'sandwiches' | 'para-picar'

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
