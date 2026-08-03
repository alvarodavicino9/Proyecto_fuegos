// Trae el menú (categorías + productos) desde Supabase. Si Supabase no
// está configurado (falta .env) o la consulta falla, cae en los datos
// estáticos de /src/data/menu.ts para que el sitio nunca se rompa.

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { categories as staticCategories, menuItems as staticMenuItems } from '@/data/menu'
import type { MenuCategory, MenuItem } from '@/types/menu'

interface MenuState {
  categories: MenuCategory[]
  menuItems: MenuItem[]
  loading: boolean
  /** true si los datos vienen de Supabase; false si se está usando el respaldo estático. */
  isLive: boolean
}

export function useMenu(): MenuState {
  const [state, setState] = useState<MenuState>({
    categories: staticCategories,
    menuItems: staticMenuItems,
    loading: isSupabaseConfigured,
    isLive: false,
  })

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true }),
      ])

      if (cancelled) return

      if (categoriesRes.error || productsRes.error || !categoriesRes.data || !productsRes.data) {
        // Falla la consulta (proyecto mal configurado, sin internet, etc.) → seguimos con el fallback estático.
        setState((prev) => ({ ...prev, loading: false, isLive: false }))
        return
      }

      const categories: MenuCategory[] = categoriesRes.data.map((c) => ({ id: c.id, label: c.label }))
      const menuItems: MenuItem[] = productsRes.data.map((p) => ({
        id: p.id,
        categoryId: p.category_id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image_url ?? undefined,
        tags: p.tags.length > 0 ? p.tags : undefined,
        ingredients: p.ingredients.length > 0 ? p.ingredients : undefined,
      }))

      setState({ categories, menuItems, loading: false, isLive: true })
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
